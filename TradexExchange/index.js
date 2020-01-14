module.exports = async function (context, req) {
    const tokenContractSource = './contracts/VirtualTradexToken.aes'
    const exchangeContractSource = './contracts/TradexExchange.aes'
    const AeprojectDeploy = require('./deployer')
    const fs = require('fs')
    const { getDeployedInstance } = require('./client');
    const keypair = {
        secretKey: "bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca",
        publicKey: "ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU"
    }

    let tokenInstance
    let exchangeInstance

    if ((req.query.deployToken || (req.body && req.body.deployToken))) {
        tokenInstance = await AeprojectDeploy(keypair.secretKey, tokenContractSource, [])

        context.res = {
            body: tokenInstance.decodedResult
        }
    }
    else if ((req.query.deployExchange || (req.body && req.body.deployExchange))) {
        let exchangeRateForAe = req.query.deployExchange

        exchangeInstance = await AeprojectDeploy(keypair.secretKey, exchangeContractSource, [exchangeRateForAe])

        context.res = {
            body: exchangeInstance.decodedResult
        }
    }
    else if ((req.query.balance || (req.body && req.body.balance))) {            
        const address = req.query.balance
    
        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const balance = await exchangeInstance.methods.balance_of(address)
    
        context.res = {
           body: balance.decodedResult
        }
    }
    else if ((req.query.balanceOfAe || (req.body && req.body.balanceOfAe))) {    
        const addr = req.query.balanceOfAe
    
        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const balance = await exchangeInstance.methods.get_balance(addr)

        context.res = {
           body: balance.decodedResult
        }
    }
    else if ((req.query.getExchangeRateForAe || (req.body && req.body.getExchangeRateForAe))) {    
        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const exchangeRateForAe = await exchangeInstance.methods.get_exchange_rate_for_ae()

        context.res = {
           body: exchangeRateForAe.decodedResult
        }
    }
    else if ((req.query.getExchangeRateForToken || (req.body && req.body.getExchangeRateForToken))) {
        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const tokenAddress = req.query.getExchangeRateForToken

        const rateForAe = await exchangeInstance.methods.get_exchange_rate_for_token(tokenAddress)

        context.res = {
            body: rateForAe.decodedResult
        }
    }
    else if  ((req.query.addressOfToken || (req.body && req.body.addressOfToken))) {
        const addressOfToken = req.query.addressOfToken
        const exchangeRateForToken = await contract.getExchangeRateForToken(addressOfToken)

        context.res = {
           body: exchangeRateForToken
        }
    }
    else if  ((req.query.addLiquidity || (req.body && req.body.addLiquidity))) {
        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const amount = req.query.addLiquidity

        await exchangeInstance.methods.add_liquidity({ amount: amount })

        context.res = {
           body: true
        }
    }
    else if  ((req.query.getLiquidity || (req.body && req.body.getLiquidity))) {
        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        await exchangeInstance.methods.get_liquidity()

        context.res = {
           body: true
        }
    }
    else if  ((req.query.tokensInAmount || (req.body && req.body.tokensInAmount)) 
            && (req.query.poolWalletAddress || (req.body && req.body.poolWalletAddress))
            && (req.query.tokenInAddress || (req.body && req.body.tokenInAddress))) {

        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const tokensInAmount = req.query.tokensInAmount
        const poolWalletAddress = req.query.poolWalletAddress
        const tokenInAddress = req.query.tokenInAddress

        await exchangeInstance.methods.swap_for_ae(tokensInAmount, poolWalletAddress, tokenInAddress)

        context.res = {
           body: true
        }
    }
    else if  ((req.query.tokensInAmount || (req.body && req.body.tokensInAmount)) 
            && (req.query.poolWallet || (req.body && req.body.poolWallet))
            && (req.query.tokenInAddress || (req.body && req.body.tokenInAddress))
            &&(req.query.tokenOutAddress || (req.body && req.body.tokenOutAddress))) {

        exchangeInstance = await getDeployedInstance(fs.readFileSync(exchangeContractSource, 'utf-8'))

        const tokensInAmount = req.query.tokensInAmount
        const poolWallet = req.query.poolWallet
        const tokenInAddress = req.query.tokenInAddress
        const tokenOutAddress = req.query.tokenOutAddress

        await exchangeInstance.methods.swap_for_tokens(tokensInAmount, poolWallet, tokenInAddress, tokenOutAddress)

        context.res = {
           body: true
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request"
        }
    }
}