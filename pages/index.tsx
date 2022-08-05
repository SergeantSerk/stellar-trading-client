import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import Header from '../components/common/header'
import Footer from '../components/common/footer'
import WalletConnect from '../wallets/walletconnect'

const walletConnect: WalletConnect = new WalletConnect()

const Home: NextPage = () => {
  console.log('home page load')

  const [isSessionEstablished, setSessionEstablished] = useState<boolean>(false)

  const wcDisconnectButtonHandler = async () => {
    await walletConnect.disconnect()
    setSessionEstablished(false)
  }

  useEffect(() => {
    walletConnect
      .init()
      .then(() => {
        walletConnect
        .connect()
        .then((b) => {
          setSessionEstablished(b)
        })
      })
  }, [isSessionEstablished])

  if (isSessionEstablished) {
    console.log(walletConnect.session)
    return (
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          <p>{walletConnect.session?.namespaces.stellar.accounts[0].split(':')[2]}</p>
          <button onClick={wcDisconnectButtonHandler}>Disconnect</button>
        </main>

        <Footer />
      </div>
    )
  } else {
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
}

export default Home
