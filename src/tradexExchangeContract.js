const fs = require('fs')
const { Universal } = require('@aeternity/aepp-sdk')
const config = require('./environment.js')
const path = require('path')

const host = "http://localhost:3001"
const internalHost = "http://localhost:3001/internal"
const compilerUrl = 'http://localhost:3080'
const networkId = 'ae_devnet'

let keypair = {
    secretKey: "bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca",
    publicKey: "ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU"
}

class ContractInstance {
    constructor() {
        this.tradexExchangeContractSource = fs.readFileSync(path.join(__dirname, '..', 'contracts') + `\\${config.CONTRACT_SETTINGS.SOURCE}`,  'utf-8')
    }

    // initialize aeternity and contract instance
    async init() {
        this.client = await Universal({
            url: host,
            internalUrl: internalHost,
            keypair: {
                publicKey: keypair.publicKey,
                secretKey: keypair.secretKey
            },
            nativeMode: false,
            networkId: networkId,
            compilerUrl: compilerUrl
        })

        this.contractInstance = await this.client.getContractInstance(this.tradexExchangeContractSource, 
            { contractAddress: config.CONTRACT_SETTINGS.ADDRESS, callStatic: true })
    }

    // CONTRACT METHODS
    async getBalance(address) {
        await this.init()
        
        const balance = await this.contractInstance.methods.balance_of(address)
    
        return balance.decodedResult
    }

    async getBalanceOfAe(address) {
        await this.init()

        const balanceOfAe = await this.contractInstance.methods.get_balance(address)
    
        return balanceOfAe.decodedResult
    }

    async getExchangeRateForAe() {
        await this.init()

        const exchangeRateForAe = await this.contractInstance.methods.get_exchange_rate_for_ae()
    
        return exchangeRateForAe.decodedResult
    };

    async getExchangeRateForToken(addressOfToken) {
        await this.init()

        const exchangeRateForToken = await this.contractInstance.methods.get_exchange_rate_for_token(addressOfToken)
    
        return exchangeRateForToken.decodedResult
    };

    async addLiquidity(amount) {
        await this.init()

        await this.contractInstance.methods.add_liquidity({ amount: amount })
    };

    async getLiquidity() {
        await this.init()

        await this.contractInstance.methods.get_liquidity()
    }

    async swapForAe(tokensInAmount, poolWalletAddress, tokenInAddress) {
        await this.init()

        await this.contractInstance.methods.swap_for_ae(tokensInAmount, poolWalletAddress, tokenInAddress)
    }

    async swapForTokens(tokensInAmount, poolWallet, tokenInAddress, tokenOutAddress) {
        await this.init()

        await this.contractInstance.methods.swap_for_tokens(tokensInAmount, poolWallet, tokenInAddress, tokenOutAddress)
    }
}

module.exports = ContractInstance