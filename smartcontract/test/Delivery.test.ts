import { expect } from "chai";
import { ethers } from "hardhat";
import {
  DeliveryService,
  DriverRegistry,
  Faucet,
  MockStablecoin,
} from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Modular Delivery Platform", function () {
  let mockStablecoin: MockStablecoin;
  let driverRegistry: DriverRegistry;
  let faucet: Faucet;
  let deliveryService: DeliveryService;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let driver: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const BASE_FEE = 10;
  const FAUCET_AMOUNT = ethers.parseEther("100");
  const FAUCET_TOTAL_CAP = ethers.parseEther("1000000");

  beforeEach(async () => {
    [owner, user, driver, user2] = await ethers.getSigners();

    const MockStablecoinFactory = await ethers.getContractFactory(
      "MockStablecoin"
    );
    mockStablecoin = (await MockStablecoinFactory.deploy()) as MockStablecoin;

    const DriverRegistryFactory = await ethers.getContractFactory(
      "DriverRegistry"
    );
    driverRegistry = (await DriverRegistryFactory.deploy()) as DriverRegistry;

    const FaucetFactory = await ethers.getContractFactory("Faucet");
    faucet = (await FaucetFactory.deploy(
      await mockStablecoin.getAddress()
    )) as Faucet;

    const DeliveryServiceFactory = await ethers.getContractFactory(
      "DeliveryService"
    );
    deliveryService = (await DeliveryServiceFactory.deploy(
      await mockStablecoin.getAddress(),
      await driverRegistry.getAddress()
    )) as DeliveryService;

    await mockStablecoin.mint(await faucet.getAddress(), FAUCET_TOTAL_CAP);
    await mockStablecoin.mint(user.address, ethers.parseEther("1000"));
    await mockStablecoin.mint(user2.address, ethers.parseEther("1000"));
  });

  describe("DriverRegistry", function () {
    it("Should allow driver registration", async function () {
      await expect(driverRegistry.connect(driver).registerDriver())
        .to.emit(driverRegistry, "DriverRegistered")
        .withArgs(driver.address);

      expect(await driverRegistry.isDriverRegistered(driver.address)).to.be
        .true;
      expect(await driverRegistry.getDriverCount()).to.equal(1);
    });

    it("Should prevent duplicate registration", async function () {
      await driverRegistry.connect(driver).registerDriver();
      await expect(driverRegistry.connect(driver).registerDriver()).to.be
        .reverted;
    });

    it("Should allow availability toggle", async function () {
      await driverRegistry.connect(driver).registerDriver();

      await expect(driverRegistry.connect(driver).setDriverAvailability(true))
        .to.emit(driverRegistry, "DriverStatusChanged")
        .withArgs(driver.address, true);

      expect(await driverRegistry.isDriverAvailable(driver.address)).to.be.true;
    });

    it("Should return available drivers list", async function () {
      await driverRegistry.connect(driver).registerDriver();
      await driverRegistry.connect(user2).registerDriver();

      await driverRegistry.connect(driver).setDriverAvailability(true);

      const availableDrivers = await driverRegistry.getAvailableDrivers();
      expect(availableDrivers.length).to.equal(1);
      expect(availableDrivers[0]).to.equal(driver.address);
    });
  });

  describe("Faucet", function () {
    it("Should allow token claims", async function () {
      const balanceBefore = await mockStablecoin.balanceOf(user.address);

      await expect(faucet.connect(user).claimFaucet())
        .to.emit(faucet, "FaucetClaimed")
        .withArgs(user.address, FAUCET_AMOUNT);

      const balanceAfter = await mockStablecoin.balanceOf(user.address);
      expect(balanceAfter - balanceBefore).to.equal(FAUCET_AMOUNT);
    });

    it("Should enforce cooldown period", async function () {
      await faucet.connect(user).claimFaucet();
      await expect(faucet.connect(user).claimFaucet()).to.be.reverted;
    });

    it("Should provide correct faucet info", async function () {
      const [lastClaim, canClaim, nextClaimTime] = await faucet.getFaucetInfo(
        user.address
      );
      expect(lastClaim).to.equal(0);
      expect(canClaim).to.be.true;
    });
  });

  describe("DeliveryService", function () {
    beforeEach(async function () {
      await mockStablecoin
        .connect(user)
        .approve(await deliveryService.getAddress(), ethers.parseEther("1000"));
      await driverRegistry.connect(driver).registerDriver();
      await driverRegistry.connect(driver).setDriverAvailability(true);
    });

    it("Should create delivery requests", async function () {
      const amount = ethers.parseEther("50");

      await expect(
        deliveryService
          .connect(user)
          .createDeliveryRequest(
            "Test delivery",
            "Location A",
            "Location B",
            amount
          )
      ).to.emit(deliveryService, "RequestCreated");

      const request = await deliveryService.getRequest(1);
      expect(request.user).to.equal(user.address);
      expect(request.amount).to.equal(amount);
      expect(request.description).to.equal("Test delivery");
    });

    it("Should allow drivers to accept requests", async function () {
      const amount = ethers.parseEther("50");
      await deliveryService
        .connect(user)
        .createDeliveryRequest(
          "Test delivery",
          "Location A",
          "Location B",
          amount
        );

      await expect(deliveryService.connect(driver).acceptRequest(1))
        .to.emit(deliveryService, "RequestAccepted")
        .withArgs(1, driver.address);

      expect(await deliveryService.getAssignedDriver(1)).to.equal(
        driver.address
      );
    });

    it("Should prevent unregistered drivers from accepting", async function () {
      const amount = ethers.parseEther("50");
      await deliveryService
        .connect(user)
        .createDeliveryRequest(
          "Test delivery",
          "Location A",
          "Location B",
          amount
        );

      await expect(deliveryService.connect(user2).acceptRequest(1)).to.be
        .reverted;
    });

    it("Should complete delivery with dual confirmation", async function () {
      const amount = ethers.parseEther("50");
      await deliveryService
        .connect(user)
        .createDeliveryRequest(
          "Test delivery",
          "Location A",
          "Location B",
          amount
        );
      await deliveryService.connect(driver).acceptRequest(1);

      const driverBalanceBefore = await mockStablecoin.balanceOf(
        driver.address
      );

      await expect(deliveryService.connect(user).confirmDeliveryAsUser(1))
        .to.emit(deliveryService, "DeliveryConfirmed")
        .withArgs(1, user.address, true);

      await expect(deliveryService.connect(driver).confirmDeliveryAsDriver(1))
        .to.emit(deliveryService, "DeliveryCompleted")
        .withArgs(1, driver.address, amount);

      const driverBalanceAfter = await mockStablecoin.balanceOf(driver.address);
      expect(driverBalanceAfter - driverBalanceBefore).to.equal(amount);

      const request = await deliveryService.getRequest(1);
      expect(request.completed).to.be.true;
    });

    it("Should allow request updates before acceptance", async function () {
      const amount = ethers.parseEther("50");
      await deliveryService
        .connect(user)
        .createDeliveryRequest(
          "Test delivery",
          "Location A",
          "Location B",
          amount
        );

      const newAmount = ethers.parseEther("75");
      await deliveryService
        .connect(user)
        .updateDeliveryRequest(
          1,
          "Updated delivery",
          "New Location A",
          "New Location B",
          newAmount
        );

      const request = await deliveryService.getRequest(1);
      expect(request.description).to.equal("Updated delivery");
      expect(request.amount).to.equal(newAmount);
    });

    it("Should allow request cancellation before acceptance", async function () {
      const amount = ethers.parseEther("50");
      await deliveryService
        .connect(user)
        .createDeliveryRequest(
          "Test delivery",
          "Location A",
          "Location B",
          amount
        );

      await expect(deliveryService.connect(user).cancelRequest(1)).to.emit(
        deliveryService,
        "RequestCancelled"
      );

      const request = await deliveryService.getRequest(1);
      expect(request.cancelled).to.be.true;
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete delivery workflow", async function () {
      await faucet.connect(user).claimFaucet();

      await driverRegistry.connect(driver).registerDriver();
      await driverRegistry.connect(driver).setDriverAvailability(true);

      await mockStablecoin
        .connect(user)
        .approve(await deliveryService.getAddress(), ethers.parseEther("1000"));
      const amount = ethers.parseEther("50");
      await deliveryService
        .connect(user)
        .createDeliveryRequest("Integration test", "A", "B", amount);

      await deliveryService.connect(driver).acceptRequest(1);
      await deliveryService.connect(user).confirmDeliveryAsUser(1);
      await deliveryService.connect(driver).confirmDeliveryAsDriver(1);

      const request = await deliveryService.getRequest(1);
      expect(request.completed).to.be.true;

      const driverBalance = await mockStablecoin.balanceOf(driver.address);
      expect(driverBalance).to.equal(amount);
    });

    it("Should maintain driver statistics", async function () {
      await driverRegistry.connect(driver).registerDriver();

      const [deliveries, rating] = await driverRegistry.getDriverStats(
        driver.address
      );
      expect(deliveries).to.equal(0);
      expect(rating).to.equal(100);
    });
  });
});
