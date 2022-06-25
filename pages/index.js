import { useContext, useState } from 'react'
import { MainContext } from '../context'
import BigNumber from 'bignumber.js'

export default function Home() {
  const [file, setFile] = useState()
  const [image, setImage] = useState()
  const [URI, setURI] = useState()
  const [amount, setAmount] = useState()

  const { initialise, fetchBalance, balance, bundlrInstance } = useContext(MainContext)

  // initialise bundlr
  async function initialiseBundlr() {
    initialise()
  }

  // display user's balance
  // allow user to fund their wallet
  async function fundWallet() {
    if (!amount) return
    const amountParsed = parseInput(amount)
    let response = await bundlrInstance.fund(amountParsed)
    console.log('🚀 ~ Wallet funded', response)
    fetchBalance()
  }

  function parseInput(input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
    if (conv.isLessThan(1)) {
      console.log('Error: value is too small')
      return
    } else {
      return conv
    }
  }

  // allow user to upload a file

  async function uploadFile() {
    let tx = await bundlrInstance.uploader.upload(file, [{ name: 'Content-Type', value: 'image/png' }])
    console.log('🚀 ~ uploadFile ~ tx', tx)
    setURI(`http://arweave.net/${tx.data.id}`)
  }

  function onFileChange(e) {
    const file = e.target.files(0)
    if (file) {
      const image = URL.createObjectURL(file)
      setImage(image) // save the image locally
      let reader = new FileReader()
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result)) // save the file locally
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }
  // show user a link to that file on the network

  return (
    <div style={containerStyle}>
      {!balance && <button onClick={initialiseBundlr}>Initialise Bundlr</button>}

      {balance && (
        <div>
          <h3>Balance: {balance}</h3>
          <div style={{ padding: '30px 0' }}>
            <input
              // type='text'
              placeholder='Amount to fund wallwet'
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={fundWallet}>Fund Wallet</button>
          </div>
          <input type='file' onChange={onFileChange} />
          <button onClick={uploadFile}>Upload File</button>

          {image && <image src={image} style={{ width: '500px' }}></image>}
          {URI && <a href={URI}>{URI}</a>}
        </div>
      )}
    </div>
  )
}

const containerStyle = {
  padding: '60px 20px',
  border: '1px solid red',
}
