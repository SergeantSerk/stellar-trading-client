import SignClient from "@walletconnect/sign-client"
import { SessionTypes } from "@walletconnect/types"
import QRCodeModal from '@walletconnect/qrcode-modal'

const PROJECT_ID = 'c32cda7d88a4b9baf51b9c51708931fe'

const METADATA = {
    name: "Stellar Trading Client",
    description: "An app to trade cryptocurrency real-time on the Stellar network.",
    url: "https://stellar-trading-client.vercel.app",
    icons: ["https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/png/square/walletconnect-square-white.png"]
}

const STELLAR_NETWORK_PUBNET = 'stellar:pubnet'
const STELLAR_NETWORK_TESTNET = 'stellar:testnet'

const STELLAR_METHOD_SIGNONLY = 'stellar_signXDR'
const STELLAR_METHOD_SIGNSUBMIT = 'stellar_signAndSubmitXDR'

class WalletConnect {
    private client: SignClient | undefined
    session: SessionTypes.Struct | undefined

    async init() {
        if (this.client) {
            return
        }

        this.client = await SignClient.init({
            projectId: PROJECT_ID,
            metadata: METADATA
        })

        if (this.client.session.map.size > 0) {
            this.session = this.client.session.map.entries().next().value[1]
        }
    }

    async connect(): Promise<boolean> {
        if (!this.client) {
            return false
        } else if (this.session) {
            return true
        }

        try {
            const { uri, approval } = await this.client.connect({
                // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
                requiredNamespaces: {
                    stellar: {
                        methods: [STELLAR_METHOD_SIGNSUBMIT],
                        chains: [STELLAR_NETWORK_PUBNET],
                        events: [],
                    },
                },
            })

            // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
            if (uri) {
                QRCodeModal.open(uri, () => { })
            }

            // Await session approval from the wallet.
            const session = await approval()

            // Handle the returned session (e.g. update UI to "connected" state).
            this.session = session
        } finally {
            // Close the QRCode modal in case it was open.
            QRCodeModal.close()
        }

        return this.session ? true : false
    }

    async disconnect(): Promise<boolean> {
        if (!this.client) {
            return false
        } else if (!this.session) {
            return true
        }

        this.client.disconnect({
            topic: this.session.topic,
            reason: {
                code: 1,
                message: "Session logged out by dapp"
            }
        })

        this.session = undefined
        return true
    }
}

export default WalletConnect