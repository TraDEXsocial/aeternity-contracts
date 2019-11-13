const express = require('express')
const router = new express.Router()
const ContractInstance = require('../tradexExchangeContract')

const contract = new ContractInstance()
contract.init()

const errorHandler = (f) => {
    return async (req, res, next) => {
        try {
            await f(req, res, next)
        }
        catch (err) {
            console.log(err)
            res.sendStatus(400)
            throw new Error(err.decodedError)
        }
    }
}

router.get('/balance/:address', errorHandler(async (req, res) => {
    if(!req.params.address) {
        return res.sendStatus(400)
    }

    const addr = req.params.address

    const balance = await contract.getBalance(addr)

    res.json(balance)
}))

router.get('/balance-of-ae/:address', errorHandler(async (req, res) => {
    if(!req.params.address) {
        return res.sendStatus(400)
    }

    const addr = req.params.address

    const balance = await contract.getBalanceOfAe(addr)

    res.json(balance)
}))

router.get('/exchange-rate-for-ae', errorHandler(async (req, res) => {
    const exchangeRateForAe = await contract.getExchangeRateForAe()

    res.json(exchangeRateForAe)
}))

router.get('/exchange-rate-for-token', errorHandler(async (req, res) => {
    const exchangeRateForToken = await contract.getExchangeRateForToken()

    res.json(exchangeRateForToken)
}))

router.get('/add-liquidity/:amount', errorHandler(async (req, res) => {
    if(!req.params.amount) {
        return res.sendStatus(400)
    }

    const amount = req.params.amount

    await contract.addLiquidity(amount)

    res.json(true)
}))

router.get('/get-liquidity', errorHandler(async (req, res) => {
    await contract.getLiquidity()

    res.json(true)
}))

router.get('/swap_for_ae/:tokensInAmount/:poolWalletAddress/:tokenInAddress', errorHandler(async (req, res) => {
    if(!req.params.tokensInAmount) {
        return res.sendStatus(400)
    }

    if(!req.params.poolWalletAddress) {
        return res.sendStatus(400)
    }

    if(!req.params.tokenInAddress) {
        return res.sendStatus(400)
    }

    const tokensInAmount = req.params.tokensInAmount
    const poolWalletAddress = req.params.poolWalletAddress
    const tokenInAddress = req.params.tokenInAddress

    await contract.swapForAe(tokensInAmount, poolWalletAddress, tokenInAddress)

    res.json(true)
}))

router.get('/swap_for_tokens/:tokensInAmount/:poolWallet/:tokenInAddress/:tokenOutAddress', errorHandler(async (req, res) => {
    if(!req.params.tokensInAmount) {
        return res.sendStatus(400)
    }

    if(!req.params.poolWallet) {
        return res.sendStatus(400)
    }

    if(!req.params.tokenInAddress) {
        return res.sendStatus(400)
    }

    if(!req.params.tokenOutAddress) {
        return res.sendStatus(400)
    }

    const tokensInAmount = req.params.tokensInAmount
    const poolWallet = req.params.poolWallet
    const tokenInAddress = req.params.tokenInAddress
    const tokenOutAddress = req.params.tokenOutAddress

    await contract.swapForTokens(tokensInAmount, poolWallet, tokenInAddress, tokenOutAddress)
    res.json(true)
}))

module.exports = router