import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Header = () => {
    return (
        <Head>
            <title>Stellar Trading Client</title>
            <meta name="description" content="An app to trade cryptocurrency real-time on the Stellar network." />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

const Footer = () => {
    return (
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
    )
}

export { Header, Footer }