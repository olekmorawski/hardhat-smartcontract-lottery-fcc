const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Unit Tests", async function () {
          let raffle, VRFCoordinatorV2Mock
          const chainId = network.config.chainId

          beforeEach(async function () {
              const { deployer } = await getNamedAccounts()
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", async function () {
              it("initializes the raffle correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  const interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })
      })
