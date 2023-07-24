'use client'
import { MaxButton } from '@/components/MaxButton'
import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { CancelButton } from '@/components/buttons/CancelButton'
import { Input } from '@/components/inputs/Input'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { poolState } from '@/features/pool/pool.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { setStakingPool } from '@/features/staking/actions/setStaking/setStakingPool.action'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { TOKENS } from '@/features/tokens/tokens.state'
import { loadingState } from '@/features/ui/loading.state'
import {
  toggleSetStakingPoolModalVisibility,
  uiState
} from '@/features/ui/ui.state'
import { faCoins, faPercent } from '@fortawesome/free-solid-svg-icons'
import { yupResolver } from '@hookform/resolvers/yup'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import * as yup from 'yup'

type Inputs = {
  initialDeposit: number
  minReserve: number | undefined
  interestRate: number
  minStakeAmount: number | undefined
}

const schema = yup
  .object({
    initialDeposit: yup.number().positive().required().label('Initial deposit'),
    minReserve: yup
      .number()
      .transform((value: number) => (isNaN(value) ? 0 : value))
      .label('Min Reserve'),
    interestRate: yup.number().min(2).max(10).required().label('Interest Rate'),
    minStakeAmount: yup
      .number()
      .transform((value: number) => (isNaN(value) ? 0 : value))
      .label('Min Stake Amount')
  })
  .required()

export const SetStakingPoolModal = dynamic(
  () =>
    Promise.resolve(() => {
      const { setStakingPoolModalVisibility } = useRecoilValue(uiState)
      const { tokenA, tokenB } = useRecoilValue(poolState)
      const isLoading = useRecoilValue(loadingState)
      const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
      } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: {
          initialDeposit: 0,
          interestRate: 2,
          minReserve: 0,
          minStakeAmount: 0
        }
      })

      useEffect(() => {
        reset()
      }, [reset, tokenA, tokenB])

      // const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

      const onSubmit = useRecoilCallback(
        ({ refresh, snapshot }) =>
          async ({
            initialDeposit,
            minStakeAmount,
            interestRate,
            minReserve
          }: Inputs) => {
            try {
              const poolAddress = await snapshot.getPromise(
                getPoolAddressSelector({ tokenA, tokenB })
              )

              await setStakingPool({
                initialDeposit,
                minStakeAmount: Number(minStakeAmount),
                interestRate,
                minReserve: Number(minReserve),
                poolAddress
              })
              toggleSetStakingPoolModalVisibility()
            } finally {
              refresh(
                getPoolDetailsSelector({
                  tokenA,
                  tokenB
                })
              )
            }
          }
      )

      const handleMaxInitialDeposit = useRecoilCallback(
        ({ snapshot }) =>
          async () => {
            const balance = await snapshot.getPromise(
              getBalanceSelector(TOKENS[7])
            )
            setValue('initialDeposit', formatQuantity(balance))
          }
      )

      return (
        <Modal
          isLoading={isLoading}
          open={setStakingPoolModalVisibility}
          title={`Set Stakeable ${tokenA.symbol} / ${tokenB.symbol} Pool`}
          toggle={toggleSetStakingPoolModalVisibility}
        >
          <form
            className="flex flex-col gap-2 pt-3 pb-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              Right={<MaxButton handleClick={handleMaxInitialDeposit} />}
              errorText={errors.initialDeposit?.message}
              icon={faPercent}
              labelText="Initial Deposit"
              placeholder="Initial Deposit"
              register={register('initialDeposit')}
              step={0.01}
              type="number"
            />

            <Input
              errorText={errors.minReserve?.message}
              icon={faPercent}
              labelText="Min Reserve"
              placeholder="Min Reserve"
              register={register('minReserve')}
              type="number"
            />

            <Input
              errorText={errors.interestRate?.message}
              icon={faPercent}
              labelText="Interest Rate"
              placeholder="Interest Rate"
              register={register('interestRate')}
              step={0.01}
              type="number"
            />

            <Input
              errorText={errors.minStakeAmount?.message}
              icon={faPercent}
              labelText="Min Stake Amount"
              placeholder="Min Stake Amount"
              register={register('minStakeAmount')}
            />

            <div className="flex flex-row items-center justify-center gap-5 mt-5">
              <CancelButton
                className="w-1/2"
                title="Cancel"
                toggle={toggleSetStakingPoolModalVisibility}
              />
              <ActionButton
                className="w-1/2"
                icon={faCoins}
                title="Set Stakeble"
                type="submit"
              />
            </div>
          </form>
        </Modal>
      )
    }),
  { ssr: false }
)
