import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import Header from '../components/common/header'
import Footer from '../components/common/footer'
import SignClient, { SIGN_CLIENT_EVENTS } from "@walletconnect/sign-client";
import QRCodeModal from '@walletconnect/qrcode-modal'

const STELLAR_NETWORK_MAINNET = 'stellar:pubnet'
const STELLAR_NETWORK_TESTNET = 'stellar:testnet'
const STELLAR_METHOD_SIGNONLY = 'stellar_signXDR'
const STELLAR_METHOD_SIGNSUBMIT = 'stellar_signAndSubmitXDR'

const Home: NextPage = () => {
  const [wcSignClient, setWcSignClient] = useState<SignClient>()

  useEffect(() => {
    if (!wcSignClient) {
      SignClient.init({
        projectId: "c32cda7d88a4b9baf51b9c51708931fe",
        relayUrl: 'wss://relay.walletconnect.com',
        metadata: {
          name: "Stellar Trading Client",
          description: "An app to trade cryptocurrency real-time on the Stellar network.",
          url: "#",
          icons: ["https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/png/square/walletconnect-square-white.png"]
        }
      }).then((wcSignClient) => {
        setWcSignClient(wcSignClient)
      }).catch((e) => {
        console.log('wc init failed:', e)
      })
    } else {
      console.log('wc sign client:', wcSignClient)

      // wcSignClient.on("session_event", (args) => {
      //   // Handle session events, such as "chainChanged", "accountsChanged", etc.
      //   console.log('wc sign client session event:', args)
      // });

      // wcSignClient.on("session_update", (args) => {
      //   const { namespaces } = args.params;
      //   const _session = wcSignClient.session.get(args.topic);
      //   // Overwrite the `namespaces` of the existing session with the incoming one.
      //   const updatedSession = { ..._session, namespaces };
      //   // Integrate the updated session state into your dapp state.
      //   console.log('wc sign client session update:', args)
      // });

      // wcSignClient.on("session_delete", (args) => {
      //   // Session was deleted -> reset the dapp state, clean up from user session, etc.
      //   console.log('wc sign client session delete:', args)
      // });

      Object.entries(SIGN_CLIENT_EVENTS).forEach(([key, value]) => {
        for (let key in SIGN_CLIENT_EVENTS) {
          let value = SIGN_CLIENT_EVENTS[key]

          wcSignClient.on(value, (args) => {
            console.log('wc sign client', value, ':', args)
          })

          console.log('registered wc sign client event:', value)
        }
      })



      try {
        wcSignClient.connect({
          requiredNamespaces: {
            eip155: {
              methods: [
                'eth_sendTransaction',
                'eth_signTransaction',
                'eth_sign',
                'personal_sign',
                'eth_signTypedData'
              ],
              chains: ['eip155:1'],
              events: [
                'chainsChanged',
                'accountsChanged'
              ]
            }
          }
        }).then(({ uri, approval }) => {
          console.log('wc sign client connect uri:', uri)

          if (uri) {
            QRCodeModal.open(encodeURI(uri), () => {
              console.log("EVENT", "QR Code Modal closed")
            })
          }

          approval().then((value) => {
            console.log('wc sign client connect approval:', value)
          }).catch((e) => {
            console.log('wc sign client connect error:', e)
          })
        }, (reason) => {
          console.log('wc sign client connect rejected:', reason)
        }).catch((e) => {
          console.log('wc sign client connect post error:', e)
        })
      } catch (e) {
        console.log('wc sign client connect error:', e)
      } finally {

      }
    }
  }, [wcSignClient])

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
