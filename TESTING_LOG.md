# Legacy6Coin Contract Testing Log

**Date:** November 4, 2026  
**Network:** Sepolia  
**Contract:** Legacy6CoinV2  
**Status:** Source Verified

---

## Section 1 — Contract Metadata Tests

### Test: `name()`

- **Expected:** Legacy6Coin
- **Actual:** Legacy6Coin
- **Status:** PASS ✅

### Test: `symbol()`

- **Expected:** L6C
- **Actual:** L6C
- **Status:** PASS ✅

### Test: `decimals()`

- **Expected:** 18
- **Actual:** 18
- **Status:** PASS ✅

---

## Section 2 — Supply Tests

### Test: `FOUNDER_ALLOCATION()`

- **Expected:** 660,000 L6C
- **Actual:** 660000000000000000000000
- **Status:** PASS ✅

### Test: `WITNESS_ALLOCATION()`

- **Expected:** 1,000 L6C
- **Actual:** 1000000000000000000000
- **Status:** PASS ✅

### Test: `MAX_SUPPLY()`

- **Expected:** 1,000,000 L6C
- **Actual:** 1000000000000000000000000
- **Status:** PASS ✅

### Test: `totalMinted()`

- **Expected:** 666,000 L6C
- **Actual:** 666000000000000000000000
- **Status:** PASS ✅

### Test: `totalSupply()`

- **Expected:** 666,000 L6C
- **Actual:** 666000000000000000000000
- **Status:** PASS ✅

**Observation:** `totalMinted` equals `totalSupply`. No burn activity was detected at the time of testing.

---

## Section 3 — Ownership Tests

### Test: `owner()`

- **Expected:** Founder owner wallet
- **Actual:** `0x21EC335039Bca45896f75741433FF869d8a1cB8c`
- **Status:** PASS ✅

### Test: `pendingOwner()`

- **Expected:** No pending owner
- **Actual:** `0x0000000000000000000000000000000000000000`
- **Status:** PASS ✅

---

## Section 4 — Witness Registry Tests

Witnesses identified:

- `0x21EC335039Bca45896f75741433FF869d8a1cB8c`
- `0xA9f38f1F7537bfA77e6A10e5C3203a441211E548`
- `0x00839730DB60Ff3769208808A82134c3974a90F5`
- `0xF87767e56650d66E254551dc09391f0F83bc51c0`
- `0xBa1856c474998DbaC4936AD43633f9846368b9B6`
- `0xC445dCe81f57e2E5eBf3e78aDf71F884bb2533A2`

### Test: `isWitness(address)`

- **Result:** `true`
- **Status:** PASS ✅

### Test: Witness Allocation Verification

- **`balanceOf(witness)` expected:** 1,000 L6C
- **Actual:** 1000000000000000000000
- **Status:** PASS ✅

---

## Section 5 — Founder Balance Test

### Test: `balanceOf(owner)`

- **Expected:** 661,000 L6C
- **Actual:** 661000000000000000000000
- **Status:** PASS ✅

**Observation:** Founder allocation plus witness allocation equals the expected founder balance.

---

## Section 6 — Burn Function Testing

### Simulation: `burn(1)`

- **Result:** Success
- **Estimated Gas:** 42,588
- **Status:** PASS ✅

### Simulation: `burn(1000000000000000000)`

- **Meaning:** 1 L6C
- **Result:** Success
- **Estimated Gas:** 42,649
- **Status:** PASS ✅

---

## Section 7 — Mint Function Testing

### Simulation: `mint(testAddress, 1 L6C)`

- **Result:** Success
- **Estimated Gas:** 156,473
- **Status:** PASS ✅

---

## Section 8 — Supply Cap Protection

### Simulation: `mint(testAddress, 500,000,000 L6C)`

- **Expected:** Revert
- **Actual:** Execution Reverted
- **Status:** PASS ✅

**Observation:** Cap protection successfully prevented issuance beyond `MAX_SUPPLY`.

---

## Section 9 — Boundary Testing

### Simulation: `mint(testAddress, 334,000 L6C)`

- **Expected:** Success
- **Actual:** Success
- **Estimated Gas:** 156,509
- **Status:** PASS ✅

**Observation:** The contract allows minting exactly up to the remaining issuance capacity.

---

## Summary

**Testing Status:**

- ✅ Metadata Tests Passed
- ✅ Supply Tests Passed
- ✅ Ownership Tests Passed
- ✅ Witness Registry Passed
- ✅ Witness Allocation Passed
- ✅ Founder Allocation Passed
- ✅ Burn Simulations Passed
- ✅ Mint Simulations Passed
- ✅ Supply Cap Protection Passed
- ✅ Boundary Conditions Passed

**Conclusion:**

The Legacy6CoinV2 Sepolia deployment behaved consistently with the verified source code during testing.

No unexpected contract behavior was observed during the documented test scenarios.

**Close with:**

Michael Wamai Maina Gatane

Legacy6Coin Archive v1.0

> “Scars that sing. Echoes that remain. Legacy that walks forward.”
