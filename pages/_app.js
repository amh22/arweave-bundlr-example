import '../styles/globals.css'
import { providers, utils } from 'ethers'
import { WebBundlr } from '@bundlr-network/client'

function MyApp({ Component, pageProps }) {
  async function initialise() {
    await window.ethereum.enable()
    const provider = new providers.Web3Provider(window.ethereum)
    await provider._ready()

    // interact with bundlr in the client
    // allowing for signing by the user
    const bundlr = new WebBundlr('https://node1.bundlr.network', 'matic', provider)
    await bundlr.ready()
  }
  return (
    <div>
      <button onClick={initialise}>Initialise</button>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
