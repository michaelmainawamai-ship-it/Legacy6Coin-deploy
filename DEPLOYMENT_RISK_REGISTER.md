# Deployment Risk Register

## Payable Constructor Without Ether Recovery

**Source:** Slither

**Severity:** Medium

**Description:**

Legacy6CoinV2 contains a payable constructor but does not implement an ETH withdrawal mechanism.

If Ether is intentionally or accidentally sent to the contract address, those funds may become permanently inaccessible.

**Impact:**

Ether sent directly to the contract may become unrecoverable.

ERC20 token functionality is not affected.

The following are unaffected:

- Transfers
- Minting
- Burning
- Witness allocations
- Ownership transfers
- Supply cap enforcement

**Decision:** Accepted Risk

**Rationale:**

Legacy6CoinV2 is intended to function as an ERC20 token and not as an ETH treasury.

Deployment procedures require:

`Value = 0`

during deployment.

Treasury activities use:

Treasury Wallet:
`0xAC643D786Bad1Ef8ADB6a8e320BF12cd990b868a`

rather than the token contract itself.

**Mitigation:**

- Do not send ETH to the token contract.
- Do not use the token contract as a treasury wallet.
- Use designated wallets for treasury activities.
- Deploy with `Value = 0`.

**Status:** Accepted
