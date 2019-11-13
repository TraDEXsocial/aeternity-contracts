const tradexController = require('../controllers/tradexController')

module.exports = (app) => {
	app.use('', tradexController);
}

