import '../styles/globals.css'
import { providers, utils } from 'ethers'
import { WebBundlr } from '@bundlr-network/client'
import { useState, useRef } from 'react'
import { MainContext } from '../context'

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [balance, setBalance] = useState()
  const bundlrRef = useRef()

  // initialise bundlr
  async function initialise() {
    await window.ethereum.enable()
    const provider = new providers.Web3Provider(window.ethereum)
    await provider._ready()

    // interact with bundlr in the client
    // allowing for signing by the user
    const bundlr = new WebBundlr('https://node1.bundlr.network', 'matic', provider)
    await bundlr.ready()
    setBundlrInstance(bundlr)
    bundlrRef.current = bundlr
    fetchBalance()
  }

  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance()
    console.log('🚀 ~ fetchBalance ~ bal', utils.formatEther(bal.toString()))
    setBalance(utils.formatEther(bal.toString()))
  }

  return (
    <div style={containerStyle}>
      <MainContext.Provider
        value={{
          initialise,
          fetchBalance,
          balance,
          bundlrInstance,
        }}
      >
        <Component {...pageProps} />
      </MainContext.Provider>
    </div>
  )
}

const containerStyle = {
  width: '600px',
  margin: '0 auto',
  padding: '40px',
}

export default MyApp
