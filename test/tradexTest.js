/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

const Deployer = require('aeproject-lib').Deployer
const TRADEX_EXCHANGE_CONTRACT_PATH = "./contracts/TradexExchange.aes"
const TOKEN_CONTRACT_PATH = "./contracts/VirtualTradexToken.aes"
const EXCHANGE_RATE_FOR_AE = 20
const EXCHANGE_RATE_FOR_TOKEN = 52
const LIQUIDITY_AMOUNT = 100
const TOKENS_TO_MINT = 2300
const TOKENS_IN_AMOUNT = 40
const DEPLOYED_TOKEN_ADDRESS = 'ct_ALhiEyS8uyk9umJp1U7mTzoTUse7saaYZYdntDhQjcbHVWnBZ'

describe('TradexExchange Contract', () => {

    let deployer
    let ownerKeyPair = wallets[0]
    let notOwnerKeyPair = wallets[1]
    let tradexExchangeContractDeployed
    let tokenContractDeployed
    
    before(async () => {
        deployer = new Deployer('local', ownerKeyPair.secretKey)

        tradexExchangeContractDeployed = deployer.deploy(TRADEX_EXCHANGE_CONTRACT_PATH, [EXCHANGE_RATE_FOR_AE])
    })

    it('Deploying TradexExchange Contract', async () => {
        await assert.isFulfilled(tradexExchangeContractDeployed, 'Could not deploy the TradexExchange Smart Contract');
    })

    it('Swap for AE', async () => {
        tokenContractDeployed = await deployer.deploy(TOKEN_CONTRACT_PATH)
        const deployedTokenContract = await tokenContractDeployed      
        await deployedTokenContract.mint(ownerKeyPair.publicKey, TOKENS_TO_MINT)
        let balanceOfOwner = await deployedTokenContract.balance_of(ownerKeyPair.publicKey)
        assert.equal(balanceOfOwner.decodedResult, TOKENS_TO_MINT)

        const deployedExchangeContract = await tradexExchangeContractDeployed
        await deployedExchangeContract.add_liquidity({amount: LIQUIDITY_AMOUNT})
        let balance = await deployedExchangeContract.balance_of(ownerKeyPair.publicKey)
        assert.equal(balance.decodedResult, LIQUIDITY_AMOUNT);

        let balanceOfNotOwner = await deployedTokenContract.balance_of(notOwnerKeyPair.publicKey)
        assert.equal(balanceOfNotOwner.decodedResult, 0)

        await deployedExchangeContract.swap_for_ae(TOKENS_IN_AMOUNT, notOwnerKeyPair.publicKey, deployedTokenContract.address)
        let newBalanceOfNotOwner = await deployedTokenContract.balance_of(notOwnerKeyPair.publicKey)
        assert.equal(newBalanceOfNotOwner.decodedResult, TOKENS_IN_AMOUNT)
        let newBalanceOfOwner = await deployedTokenContract.balance_of(ownerKeyPair.publicKey)
        assert.equal(newBalanceOfOwner.decodedResult, TOKENS_TO_MINT-TOKENS_IN_AMOUNT)
    })

    it('Check the exchange rate of Ae', async () => {
        const deployedContract = await tradexExchangeContractDeployed

        let result = await deployedContract.get_exchange_rate_for_ae();
        
        assert.equal(result.decodedResult, EXCHANGE_RATE_FOR_AE);
    })
    
    it('Owner should update the exchange rate for Token', async () => {
        tradexExchangeContractDeployed = deployer.deploy(TRADEX_EXCHANGE_CONTRACT_PATH, [EXCHANGE_RATE_FOR_AE])

        const deployedContract = await tradexExchangeContractDeployed

        await deployedContract.update_exchange_rate_for_token(DEPLOYED_TOKEN_ADDRESS, EXCHANGE_RATE_FOR_TOKEN);

        let exchangeRateForToken = await deployedContract.get_exchange_rate_for_token(DEPLOYED_TOKEN_ADDRESS)

        assert.equal(exchangeRateForToken.decodedResult, EXCHANGE_RATE_FOR_TOKEN)
    })

    it('Not owner should not update the exchange rate for Token', async () => {
        const deployedContract = await tradexExchangeContractDeployed

        const fromInstance = await deployedContract.from(notOwnerKeyPair.secretKey);

        assert.isRejected(fromInstance.update_exchange_rate_for_token(DEPLOYED_TOKEN_ADDRESS, EXCHANGE_RATE_FOR_TOKEN), "Only the owner is allowed!");
    })

    it('Add 100000 amount of liquidity', async () => {
        const deployedContract = await tradexExchangeContractDeployed

        await deployedContract.add_liquidity({amount: LIQUIDITY_AMOUNT})

        let balance = await deployedContract.balance_of(ownerKeyPair.publicKey)
        assert.equal(balance.decodedResult, LIQUIDITY_AMOUNT);
    }) 

    it('No amount to add liquidity', async () => {
        const deployedContract = await tradexExchangeContractDeployed

        assert.isRejected(deployedContract.add_liquidity({amount: 0}), "INVALID_POOL_WALLET_AMOUNT");
    })
})