import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client"
import { PairingTypes } from '@walletconnect/types'
import QRCode from 'qrcode'
import { Header, Footer } from './common'

const Home: NextPage = () => {
  const [wcClientQrCodeUri, setWcClientQrCodeUri] = useState<string>('')
  const [wcClient, setWcClient] = useState<WalletConnectClient>()

  useEffect(() => {
    if (!wcClient) {
      WalletConnectClient.init({
        projectId: "589e95a254af8b2877fc64b308bddaa5",
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "Stellar Trading Client",
          description: "An app to trade cryptocurrency real-time on the Stellar network.",
          url: "#",
          icons: ["https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/png/square/walletconnect-square-white.png"]
        },
      }).then((wcClient) => {
        setWcClient(wcClient)
      }).catch((e) => {
        console.log('wc init failed:', e)
      })
    } else {
      console.log('wc client:', wcClient)

      wcClient.on(CLIENT_EVENTS.pairing.proposal,
        async (proposal: PairingTypes.Proposal) => {
          const { uri } = proposal.signal.params
          console.log('pairing proposal:', proposal)

          const qrCodeUri = await QRCode.toDataURL(uri)
          setWcClientQrCodeUri(qrCodeUri)
        })

      console.log('wc connect')
      // wcClient.connect({
      //   permissions: {
      //     blockchain: {
      //       chains: ["stellar:pubnet"],
      //     },
      //     jsonrpc: {
      //       methods: ["stellar_signXDR"],
      //     }
      //   }
      // }).then((settled) => {
      //   console.log('wc connected settled', settled)
      // }).catch((e) => {
      //   // TO-DO: DO NOT IGNORE
      // })
    }
  }, [wcClient])

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <WalletConnectQrCodeComponent wcClientUri={wcClientQrCodeUri}></WalletConnectQrCodeComponent>
      </main>

      <Footer />
    </div>
  )
}

const WalletConnectQrCodeComponent = ({ wcClientUri }: { wcClientUri: string }) => {
  if (wcClientUri === '') {
    return (
      <div>
        <p>WalletConnect loading...</p>
      </div>
    )
  } else {
    return (
      <div>
        <Image
          src={wcClientUri}
          width={300}
          height={300}
          alt='A quick response (QR) code to connect your WalletConnect-compatible wallet to this app.'>
        </Image>
      </div>
    )
  }
}

export default Home
