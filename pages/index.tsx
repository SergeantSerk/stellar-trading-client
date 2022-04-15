import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Keypair } from 'stellar-sdk'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSessionFromCookie, setSessionCookie } from '../session/cookie'
import { SessionInterface } from '../session/session.interface'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    const session = getSessionFromCookie()
    if (session) {
      router.push('/app')
    }
  }, [router])

  const [key, setKey] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    let keypair: Keypair | undefined = undefined
    try {
      keypair = Keypair.fromSecret(key)
    } catch (e) {
      try {
        keypair = Keypair.fromPublicKey(key)
      } catch (e) {
        console.log(e)
      }
    }

    if (keypair) {
      const session: SessionInterface = { keypair: keypair }
      setSessionCookie(session)

      router.push('/app')
    } else {
      console.log('Invalid key (cannot derive as secret nor public key)')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Stellar Trading Client</title>
        <meta name="description" content="An app to trade cryptocurrency real-time on the Stellar network." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <label>Key:
            <input type='text' value={key} onChange={(e) => setKey(e.target.value)} />
          </label>
          <input type='submit' />
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
