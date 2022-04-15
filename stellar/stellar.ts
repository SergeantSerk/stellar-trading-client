import { AccountResponse, Asset, Keypair, Memo, MemoType, Server } from "stellar-sdk";

export abstract class Stellar {
    protected _server: Server

    constructor(serverURL: string) {
        this._server = new Server(serverURL)
    }

    abstract getAccount(keypair: Keypair): Promise<AccountResponse>
    abstract sendPayment(source: Keypair, asset: Asset, target: Keypair, amount: number, memo: Memo<MemoType>, timeout: number): Promise<void>
}
