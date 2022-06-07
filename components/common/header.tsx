import Head from "next/head"

const Header = () => {
    return (
        <Head>
            <title>Stellar Trading Client</title>
            <meta name="description" content="An app to trade cryptocurrency real-time on the Stellar network." />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

export default Header