const Deployer = require('aeproject-lib').Deployer

let deployer

async function AeprojectDeploy(secretKey, contractPath, args = []) {
    deployer = new Deployer('ae_devnet', secretKey)
    let deployedInstance = await deployer.deploy(contractPath, args)
    return deployedInstance
}

module.exports = AeprojectDeploy