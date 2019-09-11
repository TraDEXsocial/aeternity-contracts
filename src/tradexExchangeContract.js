const fs = require('fs');
const { Universal } = require('@aeternity/aepp-sdk');
const config = require('./environment.js');
const path = require('path');


class ContractInstance {
    constructor() {
        // read contract file in order to remotely compile it and create the instance later
        this.tradexExchangeContractSource = fs.readFileSync(path.join(__dirname, '..', 'contracts') + `\\${config.CONTRACT_SETTINGS.SOURCE}`,  'utf-8');
    }

    // initialize aeternity and contract instance
    async init() {
        this.client = await Universal({
            url: config.UNIVERSAL_SETTINGS.URL,
            internalUrl: config.UNIVERSAL_SETTINGS.INTERNAL_URL,
            keypair: {
                publicKey: config.UNIVERSAL_SETTINGS.KEYPAIR.PUBLIC_KEY,
                secretKey: config.UNIVERSAL_SETTINGS.KEYPAIR.SECRET_KEY
            },
            compilerUrl: config.UNIVERSAL_SETTINGS.COMPILER_URL
        });

        this.contractInstance = await this.client.getContractInstance(this.tradexExchangeContractSource, 
            {contractAddress: config.CONTRACT_SETTINGS.ADDRESS, callStatic: true});
    }

    // CONTRACT METHODS
    async getBalance(address) {
        const balance = await this.contractInstance.methods.balance_of(address);
    
        return balance.decodedResult;
    }

    async getBalanceOfAe(address) {
        const balanceOfAe = await this.contractInstance.methods.get_balance(address);
    
        return balanceOfAe.decodedResult;
    }

    async getExchangeRateForAe() {
        const exchangeRateForAe = await this.contractInstance.methods.get_exchange_rate_for_ae();
    
        return exchangeRateForAe.decodedResult;
    };

    async getExchangeRateForToken(addressOfToken) {
        const exchangeRateForToken = await this.contractInstance.methods.get_exchange_rate_for_token(addressOfToken);
    
        return exchangeRateForToken.decodedResult;
    };

    async getLiquidity(publicKey, privateKey) {
        let client = await this.createClient(publicKey, privateKey);

        let contractInstance = await this.createContactInstance(client);

        const liquidity = await contractInstance.methods.get_liquidity();
    
        return liquidity.decodedResult;
    };
}

module.exports = ContractInstance;