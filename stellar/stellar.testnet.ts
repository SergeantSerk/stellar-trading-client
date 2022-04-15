import { Stellar } from "./stellar"
import { AccountResponse, Asset, Horizon, Keypair, Memo, MemoType, Networks, Operation, TransactionBuilder } from "stellar-sdk"

export class StellarTestnet extends Stellar {
    constructor() {
        super('https://horizon-testnet.stellar.org')
    }

    async getAccount(keypair: Keypair): Promise<AccountResponse> {
        const account = await this._server.loadAccount(keypair.publicKey())
        return account
    }

    async sendPayment(source: Keypair, asset: Asset, target: Keypair, amount: number, memo: Memo<MemoType> = Memo.none(), timeout: number = 10): Promise<void> {
        const startTime = performance.now()
        const sourceAccount = await this._server.loadAccount(source.publicKey())
        const fee = await this._server.fetchBaseFee()

        const transactionOptions = {
            fee: String(fee),
            networkPassphrase: Networks.TESTNET
        }
        const transaction = new TransactionBuilder(sourceAccount, transactionOptions)
            .addOperation(Operation.payment({
                destination: target.publicKey(),
                asset: asset,
                amount: amount.toString()
            }))
            .setTimeout(timeout)
            .addMemo(memo)
            .build()
        transaction.sign(source)

        let endTime
        try {
            // TO-DO: this is not the full interface e.g. ServerApi.TransactionRecord resembles the result
            const transactionResult = await this._server.submitTransaction(transaction) as Horizon.TransactionResponse
            endTime = performance.now()
            console.log('Success!', JSON.stringify(transactionResult, null, 2))
        } catch (e) {
            endTime = performance.now()
            console.log('An error has occured', e)
        }
        console.log(`Transaction execution took ${Math.round(endTime - startTime) / 1000.0} seconds.`)
    }
}
