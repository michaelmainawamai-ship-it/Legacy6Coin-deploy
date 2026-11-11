# Legacy6Coin V2 Design Specification

> **SUPERSEDED — HISTORICAL PROPOSAL; NOT CURRENT REQUIREMENTS**
>
> This specification records an earlier design proposal. Its fixed 666,000
> L6C maximum, no-post-deployment-minting policy, no-owner model, and related
> choices were not approved and are superseded by the founder-approved
> [Decision Record](./LEGACY6COIN-V2-ADR.md). The ADR is the sole authority for
> V2 requirements. Do not use this document to implement, audit, or deploy V2.
> It is retained only as project history.

**Status:** Proposed design for discussion; not Solidity and not an implementation

This document describes a safer possible design for a future Legacy6Coin version.
It does not change the existing Sepolia contract. A V2 contract would be a
separate token at a new address, and existing L6C balances would not move to it
automatically.

## 1. Token purpose

Legacy6Coin V2 is proposed as a simple, transferable ERC-20 token that
recognizes the project's founder and witnesses and records a fixed allocation
on a public blockchain.

The token should not promise investment returns, profit, redemption, or any
financial benefit. Any practical use beyond holding and transferring tokens
must be decided, documented, and reviewed separately before implementation.
The contract should not include extra features merely because they are common
in other tokens.

## 2. Fixed supply design

### Proposed supply

- **Maximum and initial supply:** 666,000 L6C
- **Decimals:** 18, following the ERC-20 convention
- **Initial founder allocation:** 660,000 L6C
- **Initial witness allocations:** 1,000 L6C to each of six witnesses
- **Total:** 660,000 + (6 × 1,000) = 666,000 L6C

This proposal chooses 666,000 because it matches the documented original
allocation. It resolves the conflict with the recovered V1 source, which sets
`MAX_SUPPLY` to 1,000,000 even though its constructor initially mints 666,000.
The project owner must explicitly approve this policy before V2 is coded.

### No post-launch minting

The preferred design is to mint the entire 666,000 L6C during V2 creation and
provide no function that can mint more afterward. This is simpler to explain
and avoids reliance on an administrator to respect a cap.

There should be no proxy or upgrade mechanism that can later replace the
no-mint rules. If a later project needs different token behavior, it should
receive a separately reviewed version and address rather than silently
changing V2.

### Burning

The proposed default is **no privileged burn function**. If holders need to
destroy their own tokens, that policy can be considered separately. In any
case, burning must never create permission to mint replacement tokens. The
lifetime number of tokens issued should remain at or below 666,000.

## 3. Witness system redesign

Treat the six witnesses as a fixed launch allocation, not as an ongoing way to
create tokens.

- Provide the initial witness addresses and allocations before deployment.
- Reject a zero address and duplicate addresses in the deployment inputs.
- Check that the founder address is valid and that the six witness entries
  follow the agreed allocation rules.
- Record witness membership and any approved display name as read-only data, or
  omit the registry if it is not needed by users.
- Do not add a post-launch `addWitness` function that mints tokens.
- Do not publish a person's name without consent; public addresses and
  on-chain transactions are visible to everyone.

Any later recognition of additional people should use a separately decided
process that cannot mint or redistribute V2 tokens unless the project formally
changes this fixed-supply policy before launch.

## 4. Ownership model

### Preferred default: no ongoing owner powers

If V2 has no minting, pausing, blacklist, metadata-editing, or upgrade controls,
it should not need an owner after creation. Avoiding privileged controls
reduces the risk of a compromised key or an administrator making unexpected
changes.

The founder allocation should go to an explicitly selected founder recipient,
not automatically to whichever account submits the deployment transaction.
The recipient and all witness addresses must be confirmed before a deployment
is ever considered.

### If administration is later required

If a future requirement truly needs administrative actions:

- Enumerate each action and explain why it is necessary.
- Use a multisig wallet rather than one person's everyday wallet.
- Require a timelock for sensitive actions where practical, so users have time
  to see a queued change.
- Use two-step ownership transfer so the proposed new owner must accept.
- Test key recovery, signer changes, and transaction approval procedures.
- Do not give governance mint or upgrade powers by default.

An optional multisig is not itself a reason to add an owner to a contract that
does not need one.

## 5. Supply protection rules

The design must make these statements true by construction:

1. The initial mint is exactly 666,000 L6C across the founder and six witnesses.
2. No address receives an unintended allocation because of a duplicate or
   invalid input.
3. There is no public or owner-only post-deployment mint path.
4. There is no alternate administrative or upgrade path that can increase
   supply.
5. Any optional burn can only destroy tokens; it cannot authorize replacement
   minting.
6. Tests independently sum the allocations and verify the resulting total
   supply is 666,000 × 10^18 raw units.

All amounts should be handled in the smallest on-chain unit (wei-like token
units), not floating-point numbers. User-facing displays may show 666,000 L6C,
but code and deployment records must preserve exact integer values.

## 6. Security improvements

- Base the V2 implementation on a reviewed, pinned release of OpenZeppelin
  Contracts, and record its exact version and source.
- Keep the contract small: standard ERC-20 transfers and the agreed initial
  allocations only.
- Do not include unused imports, unused reentrancy guards, arbitrary external
  calls, transfer taxes, hidden restrictions, or unnecessary custom logic.
- Avoid proxy/upgradeability unless a separate, compelling requirement and
  independent review justify it.
- Test invalid and duplicate recipients, total allocation, balances, decimals,
  transfers, and the absence of post-deployment mint authority.
- Add property or invariant tests for the fixed lifetime supply.
- Use static analysis and an independent professional Solidity security audit.
- Keep deployment addresses, source, compiler version, optimizer settings,
  dependency versions, and transaction records together in a reviewed release
  record.
- Protect deployment access and review every transaction on a trusted device.
  Never place seed phrases or private keys in source files, chat, or Git.

The V1 supply-cap issue must not be copied into V2: in particular, witness
onboarding must not be a second, unchecked mint path.

## 7. Mainnet readiness plan

Mainnet deployment is a later decision, not part of this specification.

1. **Approve the policy.** Confirm the token's purpose, 666,000 supply,
   allocation recipients, witness handling, and no-mint policy.
2. **Review the design.** Have the project owner and an independent Solidity
   professional review this specification before anyone writes V2 code.
3. **Implement and test.** Write the contract only after design approval; add
   unit, boundary, and invariant tests for allocations and supply.
4. **Review the build.** Pin the Solidity compiler and dependencies, reproduce
   the build, inspect bytecode settings, and verify the artifact.
5. **Audit and fix.** Commission an independent audit, resolve findings, and
   retest the final exact source.
6. **Rehearse off Mainnet.** Practice the deployment and verification process
   on a test network with the exact intended parameters. Confirm all addresses
   and allocations.
7. **Prepare operations.** Decide who reviews deployment details, how the
   deployment account is protected, what gas budget is acceptable, and how
   records and public communications will be handled.
8. **Make a separate go/no-go decision.** Mainnet requires explicit approval.
   Verify the network, chain, contract source, constructor inputs, and
   deployment address on a trusted device. No seed phrase or private key
   should be disclosed to a mentor, chat, or source repository.
9. **Verify and monitor.** After any approved deployment, verify the exact
   source and compiler settings on a block explorer, check the deployed token
   name, symbol, decimals, supply, and allocation balances, and publish the
   new address clearly. Keep V1 and V2 addresses distinct in all records.

An independent audit cannot guarantee that a contract is risk-free. A new
Mainnet V2 would not upgrade, replace, or transfer balances from the existing
Sepolia V1 contract.

## 8. Future governance options

Governance is optional and should be introduced only when there is a real
community need. Possible off-chain options include public proposals and
non-binding token-holder polls. Binding on-chain governance is a much larger
security and operational commitment.

If governance is considered later:

- Decide whether token voting is appropriate and address concentration,
  delegation, quorum, and voter eligibility.
- Keep governance separate from token supply; voting must not silently add
  minting or upgrade authority.
- Consider a multisig and timelock for narrowly scoped actions rather than
  giving a DAO unrestricted control.
- Publish proposal rules, notice periods, execution rules, and emergency
  procedures before enabling votes.
- Commission a separate review of governance contracts and their interactions
  with the token.

## Decisions required before V2 implementation

- Confirm that 666,000, rather than 1,000,000, is the intended maximum.
- Confirm the exact founder recipient and six witness recipients.
- Confirm whether witness names should be stored on-chain at all.
- Confirm whether holders may burn their own tokens.
- Confirm that no ongoing owner, mint, pause, blacklist, or upgrade powers are
  required.
- Obtain independent design and security review before Mainnet planning.
