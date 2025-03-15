const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Splitwise Contract', function () {
  let Splitwise, splitwise, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    Splitwise = await ethers.getContractFactory('Splitwise');
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    splitwise = await Splitwise.deploy();
    await splitwise.deployed();
  });

  it('should add a debt successfully', async function () {
    const amount = 100;
    await splitwise.add_IOU(addr1.address, amount, []);
    const debt = await splitwise.lookup(owner.address, addr1.address);
    expect(debt).to.equal(amount);
  });

  it('should not allow adding non-positive amount', async function () {
    await expect(splitwise.add_IOU(owner.address, 0, []))
        .to.be.revertedWith("Amount must be positive!");
  });

  it('should not allow adding debt to oneself', async function () {
    await expect(splitwise.add_IOU(owner.address, 100, []))
    .to.be.revertedWith('Can not owe yourself!');
  });

  it('should return zero for initial debts', async function () {
    
    const debtOwnerToAddr1 = await splitwise.lookup(owner.address, addr1.address);
    const debtAddr1ToAddr2 = await splitwise.lookup(addr1.address, addr2.address);
    const debtAddr2ToOwner = await splitwise.lookup(addr2.address, owner.address);

    expect(debtOwnerToAddr1).to.equal(0);
    expect(debtAddr1ToAddr2).to.equal(0);
    expect(debtAddr2ToOwner).to.equal(0);
  });

  it('should correctly reflect debts after adding IOUs', async function () {
    await splitwise.add_IOU(addr1.address, 100, []); 
    await splitwise.connect(addr1).add_IOU(addr2.address, 200, []); 

    // Lookup the debts after adding IOUs
    const debtOwnerToAddr1 = await splitwise.lookup(owner.address, addr1.address);
    const debtAddr1ToAddr2 = await splitwise.lookup(addr1.address, addr2.address);

    expect(debtOwnerToAddr1).to.equal(100); 
    expect(debtAddr1ToAddr2).to.equal(200); 
  });
  
  it('should resolve loop containing 2 equal debts', async function () {
    await splitwise.add_IOU(addr1.address, 100, []); 
    await splitwise.connect(addr1).add_IOU(owner.address, 100, [owner.address, addr1.address]); 

    // Lookup the debts after adding IOUs
    const debtOwnerToAddr1 = await splitwise.lookup(owner.address, addr1.address);
    const debtAddr1ToOwner = await splitwise.lookup(addr1.address, owner.address);

    expect(debtOwnerToAddr1).to.equal(0); 
    expect(debtAddr1ToOwner).to.equal(0); 
  });

  it('should resolve loop containing 3 unequal debts', async function () {
    await splitwise.add_IOU(addr1.address, 15, []); 
    await splitwise.connect(addr1).add_IOU(addr2.address, 11, []); 
    await splitwise.connect(addr2).add_IOU(owner.address, 16, [owner.address, addr1.address, addr2.address]); 

    // Lookup the debts after adding IOUs
    const debtOwnerToAddr1 = await splitwise.lookup(owner.address, addr1.address);
    const debtAddr1ToAddr2 = await splitwise.lookup(addr1.address, addr2.address);
    const debtAddr2ToOwner = await splitwise.lookup(addr2.address, owner.address);

    expect(debtOwnerToAddr1).to.equal(4); 
    expect(debtAddr1ToAddr2).to.equal(0); 
    expect(debtAddr2ToOwner).to.equal(5); 
  });
  
});