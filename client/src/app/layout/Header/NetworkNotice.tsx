'use client'
import React, { useEffect, useState } from 'react'
import { faClose, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getProvider } from '@/features/auth/utils/getProvider'
import {
  NetworkNames,
  NetworkNamesBeauty
} from '@/features/auth/enums/network-names.enum'

export const NetworkNotice = () => {
  const [showNotice, setShowNotice] = useState(false)
  const [network, setNetwork] = useState('')

  const checkNetworkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum?.isMetaMask)
      return setShowNotice(true)

    const network = await getProvider()?.getNetwork()

    setNetwork(network?.name ?? '')
    if (network?.name !== NetworkNames.ARBITRUM) {
      return setShowNotice(true)
    }

    return setShowNotice(false)
  }

  useEffect(() => {
    checkNetworkConnection()
  }, [])

  const closeNotice = () => {
    setShowNotice(false)
  }

  if (showNotice) {
    return (
      <div className="bg-[var(--dark-green)]">
        <div className="flex items-center justify-between w-screen h-auto lg:py-3 lg:px-5 py-2 px-5 rounded-b-sm gap-2 max-w-[1024px] m-auto">
          <FontAwesomeIcon
            className="text-[var(--light-yellow)]"
            icon={faCircleExclamation}
          />
          <span className="opacity-80 max-w-[280px] lg:max-w-none text-center">
            Connection to the <span>Arbitrum</span> Network is{' '}
            <strong className="text-[var(--light-blue)]">REQUIRED</strong> to
            use Inject Finance. Currently you are connected to{' '}
            {NetworkNamesBeauty[network]}
          </span>
          <button
            className="group flex items-center justify-center h-[26px] w-[26px] p-1 text-lg rounded-full transition duration-120 ease-out opacity-60 hover:ease-in hover:opacity-90 hover:bg-[var(--bg-black)] tooltip tooltip-bottom"
            data-tip="Dismiss"
            onClick={() => closeNotice()}
          >
            <FontAwesomeIcon
              className="max-h-[18px] max-w-[18px]"
              icon={faClose}
            />
          </button>
        </div>
      </div>
    )
  }

  return null
}
