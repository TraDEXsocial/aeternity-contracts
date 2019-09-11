const express = require('express');
const router = new express.Router();
const ContractInstance = require('../tradexExchangeContract');

const contract = new ContractInstance();
contract.init();

const errorHandler = (f) => {
    return async (req, res, next) => {
        try {
            await f(req, res, next);
        }
        catch (err) {
            console.log(err)
            res.sendStatus(400);
            throw new Error(err.decodedError);
        };
    };
};

router.get('/balance/:address', errorHandler(async (req, res) => {
    if(!req.params.address) {
        return res.sendStatus(400);
    }

    const addr = req.params.address;

    const balance = await contract.getBalance(addr);

    res.json(balance);
}));

router.get('/balance-of-ae/:address', errorHandler(async (req, res) => {
    if(!req.params.address) {
        return res.sendStatus(400);
    }

    const addr = req.params.address;

    const balance = await contract.getBalanceOfAe(addr);

    res.json(balance);
}));

router.get('/exchange-rate-for-ae', errorHandler(async (req, res) => {
    const exchangeRateForAe = await contract.getExchangeRateForAe();

    res.json(exchangeRateForAe);
}));

router.get('/exchange-rate-for-token', errorHandler(async (req, res) => {
    const exchangeRateForToken = await contract.getExchangeRateForToken();

    res.json(exchangeRateForToken);
}));

module.exports = router;