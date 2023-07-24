// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITokenPool.sol";

contract StakePoolToken is Pausable, Ownable, ReentrancyGuard {
    uint public constant factor = 10000;
    uint public constant DAY = 24 * 60 * 60;
    uint public constant MONTH = 30 * DAY;
    uint public constant YEAR = 12 * MONTH;
    uint public maxDuration = 3 * MONTH;
    uint public penalty = 500; // 5% initial value
    address public injectToken;

    mapping(address => mapping(address => StakeInfo)) public stakeInfo;
    mapping(address => PoolInfo) public poolInfo;
    mapping(address => bool) public addressStaked;
    mapping(address => bool) public stakingPoolExists;
        
    struct PoolInfo{
        uint interestRate;
        uint monthlyIncrease;
        uint totalStakers;
        bool isActive;
        uint poolReserves;
        uint minReserve;
        uint minStakeAmount;
    }

    struct StakeInfo {        
        uint start;
        uint end;
        uint stakeAmount;
        uint totalSupply;
        uint totalClaimed;       
    }
    
    event LogStakeToken(address indexed _from, uint256 _amountStaked, address _poolAddress);
    event LogClaimRewards(address indexed _from, uint256 _tokensClaimed, address _poolAddress);

    constructor(address _injectToken) {
        injectToken = _injectToken;
    }

    function setMaxDuration(uint _newMaxDuration) external onlyOwner 
    {
        require(_newMaxDuration <= YEAR, "duration should be less than a year");
        maxDuration = _newMaxDuration;
    }

    function setPenalizationFee(uint _penalty) external onlyOwner()
    {
        penalty = _penalty;
    }

    function setMonthlyIncrease(uint _increase, address _poolAddress) external onlyOwner() {
        poolInfo[_poolAddress].monthlyIncrease = _increase;
    }

    function addStakingPoolReserves(uint _amount, address _stakingPoolAddress)
        onlyOwner()
        external
    {
        require(_amount > 0, "amount should be greater than zero");
        require(stakingPoolExists[_stakingPoolAddress], "pool does not exist!");

        bool status = IERC20(injectToken).transferFrom(msg.sender, address(this), _amount);
        require(status, "staking transfer Failed!");

        poolInfo[_stakingPoolAddress].poolReserves += _amount;
    }

    function removeStakingPoolReserves(uint _amount, address _stakingPoolAddress)
        onlyOwner()
        external
    {
        require(_amount > 0, "amount should be greater than zero");
        require(stakingPoolExists[_stakingPoolAddress], "pool does not exist!");

        bool status = IERC20(injectToken).transfer(msg.sender, _amount);
        require(status, "staking transfer Failed!");

        poolInfo[_stakingPoolAddress].poolReserves -= _amount;
    }

    function setStakingPool(
            address _poolAddress, 
            uint _interesRate, 
            uint _initialDeposit, 
            uint _minReserve, 
            uint _minStakeAmount
    )
        onlyOwner
        external
    {
        require(_initialDeposit >= _minReserve, "initial deposit not enough!");
        require(!stakingPoolExists[_poolAddress], "pool exists!");

        poolInfo[_poolAddress] = PoolInfo(
                _interesRate, 1000, 0, true, _initialDeposit, _minReserve, _minStakeAmount
        );
        stakingPoolExists[_poolAddress] = true;

        bool status = IERC20(injectToken).transferFrom(msg.sender, address(this), _initialDeposit);
        require(status, "staking transfer Failed!");
    }

    function turnOnOffPool(address _poolAddress, bool _status) 
        external 
        onlyOwner
    {
        poolInfo[_poolAddress].isActive = _status;
    }

    // 1. Verify what happen if user wants to stake again before the previous staking period ends. 
    
    function stakeToken(uint256 _stakeAmount, ITokenPool _poolAddress, uint _duration)
        external 
        whenNotPaused 
    {
        PoolInfo memory _poolInfo = poolInfo[address(_poolAddress)];
        require(_poolInfo.isActive, "pool is not active!");
        require(!addressStaked[msg.sender], "address is staking!");
        require(_stakeAmount >= _poolInfo.minStakeAmount, "stake amount not enough!");
        require(_duration > 0 && _duration <= maxDuration, "duration not allowed!");
        require(_poolInfo.poolReserves >= _poolInfo.minReserve, "not enough pool reserve");
        require(_poolAddress.balanceOf(msg.sender) >= _stakeAmount, "insufficient shares!");

        addressStaked[msg.sender] = true;
        poolInfo[address(_poolAddress)].totalStakers++;
        stakeInfo[address(_poolAddress)][msg.sender] = StakeInfo({                
            start: block.timestamp,
            end: block.timestamp + _duration,
            stakeAmount: _stakeAmount,
            totalSupply: _poolAddress.totalSupply(),
            totalClaimed: 0
        });
        
        emit LogStakeToken(msg.sender, _stakeAmount, address(_poolAddress));

        bool status = _poolAddress.transferFrom(msg.sender, address(this), _stakeAmount);
        require(status, "staking transfer Failed!");
    }

    // 1. Make sure to claim all rewards.
    // 2. Prevent claiming more than once
    // 3. Prevent claim rewards before end of period. 
    // 4. Validate claim fees before ending. 
    function claimRewards(address _poolAddress) 
        external
    {
        uint stakeAmount = stakeInfo[_poolAddress][msg.sender].stakeAmount;
        require(stakeAmount > 0, "nothing to claim!");
        require(addressStaked[msg.sender], "user is not staking!");

        uint totalRewards = getTotalRewards(_poolAddress, msg.sender);

        if(block.timestamp < stakeInfo[_poolAddress][msg.sender].end)
                totalRewards -= (totalRewards * penalty) / factor;

        require(poolInfo[_poolAddress].poolReserves >= totalRewards, "not enough tokens in pool!");

        addressStaked[msg.sender] = false;
        stakeInfo[_poolAddress][msg.sender].stakeAmount = 0;
        stakeInfo[_poolAddress][msg.sender].totalClaimed += totalRewards;
        poolInfo[_poolAddress].poolReserves -= totalRewards;
        poolInfo[_poolAddress].totalStakers--;
        
        require(ITokenPool(_poolAddress).transfer(msg.sender, stakeAmount), "transfer failed!");
        require(IERC20(injectToken).transfer(msg.sender, totalRewards), "INJ3 transfer failed!");
        
        emit LogClaimRewards(msg.sender, totalRewards, _poolAddress);
    }

    function getTotalRewards(address _poolAddress, address _account)
        public 
        view 
        returns (uint totalRewards)
    {
        StakeInfo memory userStakeInfo = stakeInfo[_poolAddress][_account];

        uint _stakeAmount = userStakeInfo.stakeAmount;
        uint _poolTotalSupply = userStakeInfo.totalSupply;
        uint _start = userStakeInfo.start;
        uint _end = userStakeInfo.end;
        uint period = _end - _start;
        uint claimTime = block.timestamp - _start;
        uint currentTime = ( claimTime > period) ? period : claimTime;

        uint _interestRate = 
            getTotalInterestRate(poolInfo[_poolAddress].interestRate, _poolAddress, currentTime);

        period = period < MONTH ? MONTH : period;

        totalRewards = (period > 0) ?
            (((_stakeAmount * currentTime * _interestRate) * (1e18)) / (period * _poolTotalSupply))
            : 0;
    }

    function getTotalInterestRate(uint _interestRate, address _poolAddress, uint _currentTime) 
        internal 
        view 
        returns (uint totalInterest) {
        uint monthlyIncrease = poolInfo[_poolAddress].monthlyIncrease;
        uint time = _currentTime / MONTH;
        totalInterest = _interestRate + ((_interestRate * monthlyIncrease * time) / factor);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}