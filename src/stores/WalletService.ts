import {
    action,
    makeAutoObservable,
    reaction,
    runInAction,
} from 'mobx'
import {
    Contract,
    ContractState,
    FullContractState,
    hasEverscaleProvider,
    Permissions,
    Subscription,
    Transaction,
} from 'everscale-inpage-provider'

import { useRpcClient } from '@/hooks/useRpcClient'
import { connectToWallet } from '@/misc/helpers'
import { debug, error } from '@/utils'
import { DexAbi, DexConstants } from '@/misc'


export type Account = Permissions['accountInteraction']

export type WalletData = {
    account?: Account;
    balance: string;
    contract?: ContractState | FullContractState;
    transaction?: Transaction;
    version?: string;
}

export type WalletState = {
    hasProvider: boolean;
    isConnecting: boolean;
    isInitialized: boolean;
    isInitializing: boolean;
}

const DEFAULT_WALLET_DATA: WalletData = {
    account: undefined,
    balance: '0',
    contract: undefined,
    transaction: undefined,
}

const DEFAULT_WALLET_STATE: WalletState = {
    hasProvider: false,
    isConnecting: false,
    isInitialized: false,
    isInitializing: false,
}

const rpc = useRpcClient()


export class WalletService {

    /**
     * Current data of the wallet
     * @type {WalletData}
     * @protected
     */
    protected data: WalletData = DEFAULT_WALLET_DATA

    /**
     * Current state of the wallet connection
     * @type {WalletState}
     * @protected
     */
    protected state: WalletState = DEFAULT_WALLET_STATE

    constructor() {
        this.#contractSubscriber = undefined

        makeAutoObservable(this, {
            connect: action.bound,
            disconnect: action.bound,
        })

        reaction(
            () => this.data.contract,
            contract => {
                this.data.balance = contract?.balance || '0'
            },
        )

        reaction(
            () => this.data.account,
            (account, prevAccount) => {
                if (prevAccount?.address?.toString() === account?.address?.toString()) {
                    this.state.isConnecting = false
                    return
                }

                this.handleAccountChange(account).then(() => {
                    runInAction(() => {
                        this.state.isConnecting = false
                    })
                })
            },
        )

        this.init().catch(reason => {
            error('Wallet init error', reason)
            runInAction(() => {
                this.state.isConnecting = false
            })
        })
    }

    /**
     * Wallet initializing. It runs
     * @returns {Promise<void>}
     * @protected
     */
    protected async init(): Promise<void> {
        runInAction(() => {
            this.state.isInitializing = true
        })

        const hasProvider = await hasEverscaleProvider()

        if (!hasProvider) {
            runInAction(() => {
                this.state.isInitializing = false
                this.state.hasProvider = false
            })
            return
        }

        runInAction(() => {
            this.state.hasProvider = hasProvider
        })

        await rpc.ensureInitialized()

        runInAction(() => {
            this.state.isInitializing = false
            this.state.isInitialized = true
            this.state.isConnecting = true
        })

        const permissionsSubscriber = await rpc.subscribe('permissionsChanged')
        permissionsSubscriber.on('data', event => {
            runInAction(() => {
                this.data.account = event.permissions.accountInteraction
            })
        })

        const currentProviderState = await rpc.getProviderState()

        if (currentProviderState.permissions.accountInteraction === undefined) {
            runInAction(() => {
                this.state.isConnecting = false
            })
            return
        }

        runInAction(() => {
            this.data.version = currentProviderState.version
            this.state.isConnecting = true
        })

        await connectToWallet()

        runInAction(() => {
            this.state.isConnecting = false
        })
    }

    /**
     * Manually connect to the wallet
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        if (this.isConnecting) {
            return
        }

        const hasProvider = await hasEverscaleProvider()

        runInAction(() => {
            this.state.hasProvider = hasProvider
            this.state.isConnecting = true
        })

        if (!hasProvider) {
            return
        }

        try {
            await connectToWallet()
            runInAction(() => {
                this.state.isConnecting = false
            })
        }
        catch (e) {
            error('Wallet connect error', e)
            runInAction(() => {
                this.state.isConnecting = false
            })
        }
    }

    /**
     * Manually disconnect from the wallet
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        if (this.isConnecting) {
            return
        }

        this.state.isConnecting = true

        try {
            await rpc.disconnect()
            this.reset()
        }
        catch (e) {
            error('Wallet disconnect error', e)
            runInAction(() => {
                this.state.isConnecting = false
            })
        }
    }

    /**
     * Cancel connecting state
     */
    public cancelConnecting(): void {
        this.state.isConnecting = false
    }

    /**
     * Reset wallet data to defaults
     * @protected
     */
    protected reset(): void {
        this.data = DEFAULT_WALLET_DATA
        this.state.isConnecting = false
    }

    /**
     * Internal callback to subscribe for contract and transactions updates.
     *
     * Run it when account was changed or disconnected.
     * @param {Account} [account]
     * @returns {Promise<void>}
     * @protected
     */
    protected async handleAccountChange(account?: Account): Promise<void> {
        if (this.#contractSubscriber !== undefined) {
            if (account !== undefined) {
                try {
                    await this.#contractSubscriber.unsubscribe()
                }
                catch (e) {
                    error(e)
                }
            }
            this.#contractSubscriber = undefined
        }

        if (account === undefined) {
            return
        }

        try {
            const { state } = await rpc.getFullContractState({
                address: account.address,
            })

            runInAction(() => {
                this.data.contract = state
            })
        }
        catch (e) {
            error(e)
        }

        try {
            this.#contractSubscriber = await rpc.subscribe(
                'contractStateChanged',
                { address: account.address },
            )

            this.#contractSubscriber.on('data', event => {
                debug(
                    '%cTON Provider%c The wallet\'s `contractStateChanged` event was captured',
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    event,
                )

                runInAction(() => {
                    this.data.contract = event.state
                })
            })
        }
        catch (e) {
            error(e)
            this.#contractSubscriber = undefined
        }
    }

    /**
     * Returns computed account
     * @returns {WalletData['account']}
     */
    public get account(): WalletData['account'] {
        return this.data.account
    }

    /**
     * Returns computed wallet address value
     * @returns {string | undefined}
     */
    public get address(): string | undefined {
        return this.data.account?.address.toString()
    }

    /**
     * Returns computed wallet balance value
     * @returns {WalletData['balance']}
     */
    public get balance(): WalletData['balance'] {
        return this.data.balance
    }

    /**
     * Returns computed wallet contract state
     * @returns {WalletData['contract']}
     */
    public get contract(): WalletData['contract'] {
        return this.data.contract
    }

    /**
     * Returns computed DEX Callbacks ABI Contract for current by current wallet address.
     * @returns {Contract<typeof DexAbi.Callbacks> | undefined}
     */
    public get walletContractCallbacks(): Contract<typeof DexAbi.Callbacks> | undefined {
        return this.account?.address !== undefined
            ? rpc.createContract(DexAbi.Callbacks, this.account?.address)
            : undefined
    }

    /**
     * Returns computed last successful transaction data
     * @returns {WalletData['transaction']}
     */
    public get transaction(): WalletData['transaction'] {
        return this.data.transaction
    }

    /**
     * Returns `true` if provider is available.
     * That means extension is installed in activated, else `false`
     * @returns {WalletState['hasProvider']}
     */
    public get hasProvider(): WalletState['hasProvider'] {
        return this.state.hasProvider
    }

    /**
     * Returns computed connecting state value
     * @returns {WalletState['isConnecting']}
     */
    public get isConnecting(): WalletState['isConnecting'] {
        return this.state.isConnecting
    }

    /**
     * Returns computed initialized state value
     * @returns {WalletState['isInitialized']}
     */
    public get isInitialized(): WalletState['isInitialized'] {
        return this.state.isInitialized
    }

    public get isInitializing(): WalletState['isInitializing'] {
        return this.state.isInitializing
    }

    public get isConnected(): boolean {
        return Boolean(this.address)
    }

    /**
     * Returns `true` if installed wallet has outdated version
     */
    public get isOutdated(): boolean {
        if (this.data.version === undefined) {
            return false
        }

        const [
            currentMajorVersion = '0',
            currentMinorVersion = '0',
            currentPatchVersion = '0',
        ] = this.data.version.split('.')
        const [minMajorVersion, minMinorVersion, minPatchVersion] = DexConstants.MinWalletVersion.split('.')
        return (
            currentMajorVersion < minMajorVersion
            || (currentMajorVersion <= minMajorVersion && currentMinorVersion < minMinorVersion)
            || (
                currentMajorVersion <= minMajorVersion
                && currentMinorVersion <= minMinorVersion
                && currentPatchVersion < minPatchVersion
            )
        )
    }

    /**
     * Internal instance of the Ton Subscription for Contract updates
     * @type {Subscription<'contractStateChanged'> | undefined}
     * @protected
     */
    #contractSubscriber: Subscription<'contractStateChanged'> | undefined

}


const WalletServiceStore = new WalletService()

export function useWallet(): WalletService {
    return WalletServiceStore
}
