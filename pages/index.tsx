import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import Header from '../components/common/header'
import Footer from '../components/common/footer'
import SignClient, { SIGN_CLIENT_EVENTS } from "@walletconnect/sign-client"
import QRCodeModal from '@walletconnect/qrcode-modal'
import { SessionTypes } from '@walletconnect/types'

const STELLAR_NETWORK_PUBNET = 'stellar:pubnet'
const STELLAR_NETWORK_TESTNET = 'stellar:testnet'

const STELLAR_METHOD_SIGNONLY = 'stellar_signXDR'
const STELLAR_METHOD_SIGNSUBMIT = 'stellar_signAndSubmitXDR'

const Home: NextPage = () => {
  console.log('home page load')
  const [wcSignClient, setWcSignClient] = useState<SignClient>()
  const [currentSession, setCurrentSession] = useState<SessionTypes.Struct | SessionTypes.Namespaces>()

  useEffect(() => {
    SignClient.init({
      projectId: "c32cda7d88a4b9baf51b9c51708931fe",
      metadata: {
        name: "Stellar Trading Client",
        description: "An app to trade cryptocurrency real-time on the Stellar network.",
        url: "https://stellar-trading-client.vercel.app",
        icons: ["https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/png/square/walletconnect-square-white.png"]
      }
    }).then((wcSignClient) => {
      console.log('wc sign client:', wcSignClient)
      
      setWcSignClient(wcSignClient)

      wcSignClient.on("session_event", event => {
        console.log('wc sign client session event:', event)
        // Handle session events, such as "chainChanged", "accountsChanged", etc.
      })

      wcSignClient.on("session_update", ({ topic, params }) => {
        const { namespaces } = params
        const _session = wcSignClient.session.get(topic)
        // Overwrite the `namespaces` of the existing session with the incoming one.
        const updatedSession = { ..._session, namespaces }
        // Integrate the updated session state into your dapp state.
        setCurrentSession(updatedSession)
        console.log('wc sign client session update:', updatedSession)
      })

      wcSignClient.on("session_delete", event => {
        // Session was deleted -> reset the dapp state, clean up from user session, etc.
        console.log('wc sign client session deleted:', event)
      })

      try {
        wcSignClient.connect({
          // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
          requiredNamespaces: {
            stellar: {
              methods: [STELLAR_METHOD_SIGNSUBMIT],
              chains: [STELLAR_NETWORK_PUBNET],
              events: [],
            },
          },
        }).then(({ uri, approval }) => {
          // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
          if (uri) {
            QRCodeModal.open(uri, () => {
              console.log("EVENT", "QR Code Modal closed")
            })
          }

          // Await session approval from the wallet.
          approval().then(session => {
            console.log('wc sign client connect approval session:', session)
            // Handle the returned session (e.g. update UI to "connected" state).
            setCurrentSession(session)
          })
        })
      } catch (e) {
        console.error(e)
      } finally {
        // Close the QRCode modal in case it was open.
        QRCodeModal.close()
      }
    }).catch((e) => {
      console.log('wc init failed:', e)
    })
  }, [])

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <p>Loading WalletConnect...</p>
      </main>

      <Footer />
    </div>
  )
}

export default Home
