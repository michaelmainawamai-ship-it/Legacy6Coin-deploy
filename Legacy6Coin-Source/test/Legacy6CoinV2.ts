import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEventLogs } from "viem";

import { network } from "hardhat";

const UNIT = 10n ** 18n;
const INITIAL_SUPPLY = 666_000n * UNIT;
const MAX_SUPPLY = 1_000_000n * UNIT;
const FOUNDER_ALLOCATION = 660_000n * UNIT;
const WITNESS_ALLOCATION = 1_000n * UNIT;

const WITNESS_ADDRESSES = [
  "0xA9f38f1F7537bfA77e6A10e5C3203a441211E548",
  "0x00839730DB60Ff3769208808A82134c3974a90F5",
  "0xF87767e56650d66E254551dc09391f0F83bc51c0",
  "0xBa1856c474998DbaC4936AD43633f9846368b9B6",
  "0xC445dCe81f57e2E5eBf3e78aDf71F884bb2533A2",
  "0x21EC335039Bca45896f75741433FF869d8a1cB8c",
] as const;

function assertAddressEqual(actual: string, expected: string) {
  assert.equal(actual.toLowerCase(), expected.toLowerCase());
}

describe("Legacy6CoinV2", async function () {
  const { viem, networkHelpers } = await network.create();

  async function deployFixture() {
    const [founder, alice, bob, carol] = await viem.getWalletClients();
    const token = await viem.deployContract("Legacy6CoinV2");

    return { token, founder, alice, bob, carol };
  }

  it("allocates 660,000 L6C to the deployer as founder", async function () {
    const { token, founder } = await networkHelpers.loadFixture(deployFixture);

    assert.equal(await token.read.balanceOf([founder.account.address]), FOUNDER_ALLOCATION);
    assertAddressEqual(await token.read.owner(), founder.account.address);
  });

  it("allocates 1,000 L6C to each original V1 witness address", async function () {
    const { token } = await networkHelpers.loadFixture(deployFixture);

    for (const [index, witness] of WITNESS_ADDRESSES.entries()) {
      assert.equal(await token.read.balanceOf([witness]), WITNESS_ALLOCATION);
      assertAddressEqual(await token.read.witnesses([BigInt(index)]), witness);
      assert.equal(await token.read.isWitness([witness]), true);
    }
  });

  it("starts with exactly 666,000 L6C in total supply and lifetime issuance", async function () {
    const { token } = await networkHelpers.loadFixture(deployFixture);

    assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY);
    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY);
    assert.equal(await token.read.MAX_SUPPLY(), MAX_SUPPLY);
  });

  it("rejects onboarding an address that is already a witness", async function () {
    const { token } = await networkHelpers.loadFixture(deployFixture);
    const witness = WITNESS_ADDRESSES[0];

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.addWitness([witness]),
      token,
      "DuplicateWitness",
      [witness],
    );
    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY);
  });

  it("rejects the zero address as a witness", async function () {
    const { token } = await networkHelpers.loadFixture(deployFixture);

    await viem.assertions.revertWithCustomError(
      token.write.addWitness(["0x0000000000000000000000000000000000000000"]),
      token,
      "ZeroWitnessAddress",
    );
    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY);
  });

  it("allows the owner to mint while lifetime issuance remains below the cap", async function () {
    const { token, founder, alice } = await networkHelpers.loadFixture(deployFixture);
    const amount = 25n * UNIT;

    await token.write.mint([alice.account.address, amount], {
      account: founder.account,
    });

    assert.equal(await token.read.balanceOf([alice.account.address]), amount);
    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY + amount);
  });

  it("rejects a mint that would exceed the lifetime cap", async function () {
    const { token, founder, alice } = await networkHelpers.loadFixture(deployFixture);
    const remaining = MAX_SUPPLY - INITIAL_SUPPLY;

    await token.write.mint([alice.account.address, remaining], {
      account: founder.account,
    });
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.mint([alice.account.address, 1n], {
        account: founder.account,
      }),
      token,
      "MaxSupplyExceeded",
      [MAX_SUPPLY, 1n, MAX_SUPPLY],
    );
    assert.equal(await token.read.totalMinted(), MAX_SUPPLY);
  });

  it("onboards a new witness and allocates 1,000 L6C under the cap", async function () {
    const { token, founder, alice } = await networkHelpers.loadFixture(deployFixture);

    await viem.assertions.emitWithArgs(
      token.write.addWitness([alice.account.address], {
        account: founder.account,
      }),
      token,
      "WitnessAllocated",
      [alice.account.address, WITNESS_ALLOCATION],
    );

    assert.equal(await token.read.balanceOf([alice.account.address]), WITNESS_ALLOCATION);
    assert.equal(await token.read.isWitness([alice.account.address]), true);
    assertAddressEqual(await token.read.witnesses([6n]), alice.account.address);
    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY + WITNESS_ALLOCATION);
  });

  it("allows witness onboarding with exactly 1,000 L6C of lifetime headroom", async function () {
    const { token, founder, alice, bob } = await networkHelpers.loadFixture(deployFixture);
    const mintBeforeWitness = MAX_SUPPLY - INITIAL_SUPPLY - WITNESS_ALLOCATION;

    await token.write.mint([founder.account.address, mintBeforeWitness], {
      account: founder.account,
    });
    await token.write.addWitness([alice.account.address], {
      account: founder.account,
    });

    assert.equal(await token.read.totalMinted(), MAX_SUPPLY);
    assert.equal(await token.read.totalSupply(), MAX_SUPPLY);
    assert.equal(await token.read.balanceOf([alice.account.address]), WITNESS_ALLOCATION);
    assert.equal(await token.read.isWitness([alice.account.address]), true);
    assertAddressEqual(await token.read.witnesses([6n]), alice.account.address);

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.mint([bob.account.address, 1n], {
        account: founder.account,
      }),
      token,
      "MaxSupplyExceeded",
      [MAX_SUPPLY, 1n, MAX_SUPPLY],
    );
  });

  it("rejects witness onboarding when fewer than 1,000 lifetime tokens remain", async function () {
    const { token, founder, alice } = await networkHelpers.loadFixture(deployFixture);
    const amountLeaving999 = MAX_SUPPLY - INITIAL_SUPPLY - 999n * UNIT;

    await token.write.mint([founder.account.address, amountLeaving999], {
      account: founder.account,
    });
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.addWitness([alice.account.address], {
        account: founder.account,
      }),
      token,
      "MaxSupplyExceeded",
      [MAX_SUPPLY - 999n * UNIT, WITNESS_ALLOCATION, MAX_SUPPLY],
    );

    assert.equal(await token.read.isWitness([alice.account.address]), false);
    assert.equal(await token.read.totalMinted(), MAX_SUPPLY - 999n * UNIT);
  });

  it("leaves all witness storage and balances unchanged when onboarding fails at the cap", async function () {
    const { token, founder, alice } = await networkHelpers.loadFixture(deployFixture);
    const amountLeaving999 = MAX_SUPPLY - INITIAL_SUPPLY - 999n * UNIT;

    await token.write.mint([founder.account.address, amountLeaving999], {
      account: founder.account,
    });

    const previousSupply = await token.read.totalSupply();
    const previousTotalMinted = await token.read.totalMinted();
    const previousWitnesses = await Promise.all(
      Array.from({ length: WITNESS_ADDRESSES.length }, (_, index) =>
        token.read.witnesses([BigInt(index)]),
      ),
    );
    const previousAliceBalance = await token.read.balanceOf([alice.account.address]);

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.addWitness([alice.account.address], {
        account: founder.account,
      }),
      token,
      "MaxSupplyExceeded",
      [previousTotalMinted, WITNESS_ALLOCATION, MAX_SUPPLY],
    );

    assert.equal(await token.read.totalSupply(), previousSupply);
    assert.equal(await token.read.totalMinted(), previousTotalMinted);
    assert.equal(await token.read.balanceOf([alice.account.address]), previousAliceBalance);
    assert.equal(await token.read.isWitness([alice.account.address]), false);
    for (const [index, witness] of previousWitnesses.entries()) {
      assertAddressEqual(await token.read.witnesses([BigInt(index)]), witness);
    }
    await assert.rejects(token.read.witnesses([BigInt(WITNESS_ADDRESSES.length)]));
  });

  it("rejects minting to the zero address without changing supply accounting", async function () {
    const { token, founder } = await networkHelpers.loadFixture(deployFixture);
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.mint([zeroAddress, 1n], {
        account: founder.account,
      }),
      token,
      "ERC20InvalidReceiver",
      [zeroAddress],
    );

    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY);
    assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY);
  });

  it("restricts minting, witness onboarding, and ownership proposals to the owner", async function () {
    const { token, alice, bob } = await networkHelpers.loadFixture(deployFixture);

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.mint([bob.account.address, 1n], {
        account: alice.account,
      }),
      token,
      "UnauthorizedOwner",
      [alice.account.address],
    );
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.addWitness([bob.account.address], {
        account: alice.account,
      }),
      token,
      "UnauthorizedOwner",
      [alice.account.address],
    );
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.transferOwnership([alice.account.address], {
        account: alice.account,
      }),
      token,
      "UnauthorizedOwner",
      [alice.account.address],
    );
  });

  it("requires the proposed owner to accept a two-step ownership transfer", async function () {
    const { token, founder, alice, bob } = await networkHelpers.loadFixture(deployFixture);

    await token.write.transferOwnership([alice.account.address], {
      account: founder.account,
    });
    assertAddressEqual(await token.read.owner(), founder.account.address);
    assertAddressEqual(await token.read.pendingOwner(), alice.account.address);

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.acceptOwnership({ account: bob.account }),
      token,
      "UnauthorizedOwner",
      [bob.account.address],
    );

    await token.write.acceptOwnership({ account: alice.account });
    assertAddressEqual(await token.read.owner(), alice.account.address);
    assertAddressEqual(
      await token.read.pendingOwner(),
      "0x0000000000000000000000000000000000000000",
    );

    await token.write.mint([bob.account.address, 1n], {
      account: alice.account,
    });
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.mint([bob.account.address, 1n], {
        account: founder.account,
      }),
      token,
      "UnauthorizedOwner",
      [founder.account.address],
    );
  });

  it("lets a new ownership proposal replace the earlier pending owner", async function () {
    const { token, founder, alice, bob } = await networkHelpers.loadFixture(deployFixture);

    await token.write.transferOwnership([alice.account.address], {
      account: founder.account,
    });
    await token.write.transferOwnership([bob.account.address], {
      account: founder.account,
    });

    assertAddressEqual(await token.read.owner(), founder.account.address);
    assertAddressEqual(await token.read.pendingOwner(), bob.account.address);
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.acceptOwnership({ account: alice.account }),
      token,
      "UnauthorizedOwner",
      [alice.account.address],
    );

    await token.write.acceptOwnership({ account: bob.account });
    assertAddressEqual(await token.read.owner(), bob.account.address);
  });

  it("cancels a pending ownership transfer when the owner proposes the zero address", async function () {
    const { token, founder, alice } = await networkHelpers.loadFixture(deployFixture);
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    await token.write.transferOwnership([alice.account.address], {
      account: founder.account,
    });
    await token.write.transferOwnership([zeroAddress], {
      account: founder.account,
    });

    assertAddressEqual(await token.read.owner(), founder.account.address);
    assertAddressEqual(await token.read.pendingOwner(), zeroAddress);
    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.acceptOwnership({ account: alice.account }),
      token,
      "UnauthorizedOwner",
      [alice.account.address],
    );
  });

  it("lets a holder burn only their own tokens and reduces current supply", async function () {
    const { token, founder } = await networkHelpers.loadFixture(deployFixture);
    const amount = 100n * UNIT;

    await token.write.burn([amount], { account: founder.account });

    assert.equal(
      await token.read.balanceOf([founder.account.address]),
      FOUNDER_ALLOCATION - amount,
    );
    assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY - amount);
    assert.equal(await token.read.totalMinted(), INITIAL_SUPPLY);
  });

  it("does not restore lifetime minting capacity after a burn", async function () {
    const { token, founder } = await networkHelpers.loadFixture(deployFixture);
    const remaining = MAX_SUPPLY - INITIAL_SUPPLY;

    await token.write.mint([founder.account.address, remaining], {
      account: founder.account,
    });
    await token.write.burn([1n], { account: founder.account });

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.mint([founder.account.address, 1n], {
        account: founder.account,
      }),
      token,
      "MaxSupplyExceeded",
      [MAX_SUPPLY, 1n, MAX_SUPPLY],
    );
    assert.equal(await token.read.totalMinted(), MAX_SUPPLY);
    assert.equal(await token.read.totalSupply(), MAX_SUPPLY - 1n);
  });

  it("rejects a burn larger than the caller's balance without changing state", async function () {
    const { token, alice } = await networkHelpers.loadFixture(deployFixture);
    const previousSupply = await token.read.totalSupply();
    const previousTotalMinted = await token.read.totalMinted();
    const previousBalance = await token.read.balanceOf([alice.account.address]);

    await viem.assertions.revertWithCustomErrorWithArgs(
      token.write.burn([1n], { account: alice.account }),
      token,
      "ERC20InsufficientBalance",
      [alice.account.address, 0n, 1n],
    );

    assert.equal(await token.read.balanceOf([alice.account.address]), previousBalance);
    assert.equal(await token.read.totalSupply(), previousSupply);
    assert.equal(await token.read.totalMinted(), previousTotalMinted);
  });

  it("allows a zero-amount self-burn as a no-op", async function () {
    const { token, founder } = await networkHelpers.loadFixture(deployFixture);
    const previousBalance = await token.read.balanceOf([founder.account.address]);
    const previousSupply = await token.read.totalSupply();
    const previousTotalMinted = await token.read.totalMinted();

    await viem.assertions.emitWithArgs(
      token.write.burn([0n], { account: founder.account }),
      token,
      "Transfer",
      [
        founder.account.address,
        "0x0000000000000000000000000000000000000000",
        0n,
      ],
    );

    assert.equal(await token.read.balanceOf([founder.account.address]), previousBalance);
    assert.equal(await token.read.totalSupply(), previousSupply);
    assert.equal(await token.read.totalMinted(), previousTotalMinted);
  });

  it("gives the deployer both allocations when the deployer is witness six", async function () {
    const witnessSix = WITNESS_ADDRESSES[5];
    await networkHelpers.impersonateAccount(witnessSix);
    await networkHelpers.setBalance(witnessSix, 10n ** 18n);

    const witnessWallet = await viem.getWalletClient(witnessSix);
    const { contract, deploymentTransaction } =
      await viem.sendDeploymentTransaction("Legacy6CoinV2", [], {
        client: { wallet: witnessWallet },
      });
    const publicClient = await viem.getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: deploymentTransaction.hash,
    });
    const allocationEvents = parseEventLogs({
      abi: contract.abi,
      logs: receipt.logs,
      eventName: "FounderAllocated",
    });
    const witnessEvents = parseEventLogs({
      abi: contract.abi,
      logs: receipt.logs,
      eventName: "WitnessAllocated",
    });

    assert.equal(await contract.read.balanceOf([witnessSix]), FOUNDER_ALLOCATION + WITNESS_ALLOCATION);
    assert.equal(await contract.read.totalSupply(), INITIAL_SUPPLY);
    assertAddressEqual(await contract.read.owner(), witnessSix);
    assert.equal(allocationEvents.length, 1);
    assert.equal(allocationEvents[0].args.founder, witnessSix);
    assert.equal(allocationEvents[0].args.amount, FOUNDER_ALLOCATION);
    assert.equal(witnessEvents.length, WITNESS_ADDRESSES.length);
    assert.equal(
      witnessEvents.filter((event) => event.args.witness === witnessSix).length,
      1,
    );
  });

  it("preserves supply invariants across mixed minting, witness, and burn operations", async function () {
    const { token, founder, alice, bob, carol } =
      await networkHelpers.loadFixture(deployFixture);
    let previousMinted = await token.read.totalMinted();

    async function assertInvariants() {
      const currentMinted = await token.read.totalMinted();
      const currentSupply = await token.read.totalSupply();

      assert(currentMinted <= MAX_SUPPLY);
      assert(currentSupply <= currentMinted);
      assert(currentMinted >= previousMinted);
      previousMinted = currentMinted;
    }

    await assertInvariants();

    await token.write.mint([alice.account.address, 100n * UNIT], {
      account: founder.account,
    });
    await assertInvariants();

    const mintedBeforeBurn = await token.read.totalMinted();
    const supplyBeforeBurn = await token.read.totalSupply();
    await token.write.burn([25n * UNIT], { account: alice.account });
    assert.equal(await token.read.totalMinted(), mintedBeforeBurn);
    assert.equal(await token.read.totalSupply(), supplyBeforeBurn - 25n * UNIT);
    await assertInvariants();

    await token.write.addWitness([carol.account.address], {
      account: founder.account,
    });
    await assertInvariants();

    const remainingLifetimeCapacity = MAX_SUPPLY - previousMinted;
    await token.write.mint([bob.account.address, remainingLifetimeCapacity], {
      account: founder.account,
    });
    await assertInvariants();

    const mintedAtCap = await token.read.totalMinted();
    await token.write.burn([1n], { account: bob.account });
    assert.equal(await token.read.totalMinted(), mintedAtCap);
    await assertInvariants();
  });

  it("supports normal ERC-20 transfers, approvals, and delegated transfers", async function () {
    const { token, founder, alice, bob } = await networkHelpers.loadFixture(deployFixture);
    const transferAmount = 10n * UNIT;
    const delegatedAmount = 3n * UNIT;

    await token.write.transfer([alice.account.address, transferAmount], {
      account: founder.account,
    });
    assert.equal(await token.read.balanceOf([alice.account.address]), transferAmount);

    await token.write.approve([bob.account.address, delegatedAmount], {
      account: alice.account,
    });
    assert.equal(
      await token.read.allowance([alice.account.address, bob.account.address]),
      delegatedAmount,
    );

    await token.write.transferFrom(
      [alice.account.address, bob.account.address, delegatedAmount],
      { account: bob.account },
    );
    assert.equal(
      await token.read.balanceOf([alice.account.address]),
      transferAmount - delegatedAmount,
    );
    assert.equal(await token.read.balanceOf([bob.account.address]), delegatedAmount);
    assert.equal(
      await token.read.allowance([alice.account.address, bob.account.address]),
      0n,
    );
  });
});
