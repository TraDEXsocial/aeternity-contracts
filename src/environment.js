const dotenv = require('dotenv')
dotenv.config()

module.exports = {
	PORT: process.env.PORT,
	UNIVERSAL_SETTINGS: {
		URL: process.env.URL,
		INTERNAL_URL: process.env.INTERNAL_URL,
		KEYPAIR: {
			PUBLIC_KEY: process.env.PUBLIC_KEY,
			SECRET_KEY: process.env.SECRET_KEY
		},
		COMPILER_URL: process.env.COMPILER_URL,
	},
	CONTRACT_SETTINGS: {
		SOURCE: process.env.CONTRACT_SOURCE,
		ADDRESS: process.env.CONTRACT_ADDRESS
	}
}