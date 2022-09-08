const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Unit Tests", async function () {
        let raffle, vrfCoordinatorV2Mock

        beforeEach(async function () {
            const { deployer } = await getNamedAccounts()
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("Lottery", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        })

        describe("constructor", async function () {
            
        } )
    })