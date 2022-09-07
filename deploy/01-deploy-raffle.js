const { network, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains, networkConfig, verify } = require("../helper-hardhat-config")

const VRF_SUB_AMOUNT = ethers.utils.parseEther("2")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const txResponse = await vrfCoordinatorV2Mock.createSubscription()
        const txReciept = await txResponse.wait(1)
        subscriptionId = txReciept.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId][vrfCoordinatorV2]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGaslimit = networkConfig[chainId]["callbackGaslimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        gasLane,
        interval,
        entranceFee,
        callbackGaslimit,
    ]
    const raffle = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmarions || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
    log("==================================================")
}

module.exports.tags = ["all", "raffle"]
