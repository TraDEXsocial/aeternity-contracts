module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.')
    const ContractInstance = require('../src/tradexExchangeContract')

    const contract = new ContractInstance()
    contract.init()

    if ((req.query.address || (req.body && req.body.address))) {            
        const addr = req.query.address
    
        const balance = await contract.getBalance(addr)

        context.res = {
           body: balance
        }
    }
    else if ((req.query.balanceOfAe || (req.body && req.body.balanceOfAe))) {    
        const addr = req.query.balanceOfAe
    
        const balance = await contract.getBalanceOfAe(addr)

        context.res = {
           body: balance
        }
    }
    else if ((req.query.getExchangeRateForAe || (req.body && req.body.getExchangeRateForAe))) {    
        const exchangeRateForAe = await contract.getExchangeRateForAe()

        context.res = {
           body: exchangeRateForAe
        }
    }
    else if ((req.query.check || (req.body && req.body.check))) {
        const check = req.query.check

        if(check == 'exchangeRateForAe') {
            const rateForAe = await contract.getExchangeRateForAe()

            context.res = {
                body: rateForAe
             }
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
        const amount = req.query.addLiquidity

        await contract.addLiquidity(amount)

        context.res = {
           body: true
        }
    }
    else if  ((req.query.getLiquidity || (req.body && req.body.getLiquidity))) {
        const amount = req.query.getLiquidity

        await contract.getLiquidity()

        context.res = {
           body: true
        }
    }
    else if  ((req.query.tokensInAmount || (req.body && req.body.tokensInAmount)) 
            && (req.query.poolWalletAddress || (req.body && req.body.poolWalletAddress))
            && (req.query.tokenInAddress || (req.body && req.body.tokenInAddress))) {

        const tokensInAmount = req.query.tokensInAmount
        const poolWalletAddress = req.query.poolWalletAddress
        const tokenInAddress = req.query.tokenInAddress

        await contract.swapForAe(tokensInAmount, poolWalletAddress, tokenInAddress)

        context.res = {
           body: true
        }
    }
    else if  ((req.query.tokensInAmount || (req.body && req.body.tokensInAmount)) 
            && (req.query.poolWallet || (req.body && req.body.poolWallet))
            && (req.query.tokenInAddress || (req.body && req.body.tokenInAddress))
            &&(req.query.tokenOutAddress || (req.body && req.body.tokenOutAddress))) {

        const tokensInAmount = req.query.tokensInAmount
        const poolWallet = req.query.poolWallet
        const tokenInAddress = req.query.tokenInAddress
        const tokenOutAddress = req.query.tokenOutAddress

        await contract.swapForTokens(tokensInAmount, poolWallet, tokenInAddress, tokenOutAddress)

        context.res = {
           body: true
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        }
    }
}