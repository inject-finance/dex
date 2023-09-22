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
import { getTokenBySymbol } from '@/features/tokens/selectors/getTokenBySymbol.selector'
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
  minStakeAmount?: number
  minReserve?: number
  initialDeposit: number
  interestRate: number
}

const schema = yup
  .object()
  .shape({
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

export const SetStakeableModal = dynamic(
  () =>
    Promise.resolve(() => {
      const { setStakingPoolModalVisibility } = useRecoilValue(uiState)
      const { tokenA, tokenB, poolAddress } = useRecoilValue(poolState)
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

      const onSubmit = useRecoilCallback(
        ({ refresh }) =>
          async ({
            initialDeposit,
            minStakeAmount,
            interestRate,
            minReserve
          }: Inputs) => {
            try {
              await setStakingPool({
                initialDeposit: Number(initialDeposit),
                minStakeAmount: Number(minStakeAmount),
                interestRate: Number(interestRate),
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
            const injectToken = await snapshot.getPromise(
              getTokenBySymbol('INJ3')
            )

            const balance = await snapshot.getPromise(
              getBalanceSelector(injectToken)
            )
            setValue('initialDeposit', formatQuantity(balance))
          }
      )

      if (!setStakingPoolModalVisibility) {
        return null
      }

      return (
        <Modal
          open={setStakingPoolModalVisibility}
          title={`Set ${tokenA.symbol} / ${tokenB.symbol} Pool as Stakeable`}
          toggle={toggleSetStakingPoolModalVisibility}
        >
          <form
            className="flex flex-col gap-2 pt-3 pb-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              Right={<MaxButton handleClick={handleMaxInitialDeposit} />}
              errorText={errors.initialDeposit?.message}
              icon={faCoins}
              labelText="Initial Deposit"
              placeholder="Initial Deposit"
              register={register('initialDeposit')}
              step={0.01}
              type="number"
            />

            <Input
              errorText={errors.minReserve?.message}
              icon={faCoins}
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
              icon={faCoins}
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
                title="Confirm"
                type="submit"
              />
            </div>
          </form>
        </Modal>
      )
    }),
  { ssr: false }
)
