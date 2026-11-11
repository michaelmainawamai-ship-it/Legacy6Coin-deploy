# Legacy6Coin V2 Release Candidate

**Document status:** Release-candidate review record  
**Deployment status:** Not approved; no deployment performed  
**Source of truth for design:** [Founder Decision Record](./LEGACY6COIN-V2-ADR.md)  
**Contract:** `Legacy6CoinV2`  
**Scope:** This report documents the implementation and readiness plan. It
does not authorize deployment, create a deployment transaction, or change V1.

## 1. Executive Summary

Legacy6Coin V2 is a separate ERC-20 release candidate intended to preserve the
V1 token identity and founder-led minting and witness onboarding, while fixing
V1's supply-cap bypass. Its design uses one lifetime issuance cap across
constructor allocations, owner minting, and witness onboarding. Holders may
burn only their own tokens; burns do not restore issuance capacity.

The implementation is reported to compile, the 23-test suite is reported to
pass, and an independent source review found no confirmed exploitable
vulnerabilities in the reviewed paths. The review did identify important trust
risks: the owner controls remaining issuance, and the deployment caller
determines the founder allocation and initial ownership.

**Recommendation:** Treat V2 as a candidate for a controlled Sepolia rehearsal
only after the release inputs, owner custody, and final source/build have been
independently checked. Mainnet is not approved by the Founder Decision Record
and must remain a separate go/no-go decision.

## 2. Project History

### Legacy6Coin V1

V1 is an ERC-20 token named `Legacy6Coin` with symbol `L6C`, deployed on Sepolia
at `0x9C857fEeF228157F8Ee2dCD4DDdbad116F5a6088`. The verified contract-creation
transaction is
`0x1ca8e3d7fb256a419769b4875b6257d92cf310bd4ba42df109d548a761791f45`, in
block `9,997,222`, with a timestamp of **2026-01-07 15:23:48 UTC**. The
repository's earlier deployment metadata listed 2024-04-16 and a different
transaction hash; those entries do not match the explorer's creation record
and should be treated as stale or incorrect. V1 initially allocated 660,000
L6C to its deployer and 1,000 L6C to each of six witness addresses.

### Verified deployment-date evidence

- The Sepolia Blockscout contract record for
  `0x9C857fEeF228157F8Ee2dCD4DDdbad116F5a6088` identifies the creation
  transaction as
  `0x1ca8e3d7fb256a419769b4875b6257d92cf310bd4ba42df109d548a761791f45` and
  the creator as `0x21EC335039Bca45896f75741433FF869d8a1cB8c`.
- The Blockscout transaction record reports timestamp
  `2026-01-07T15:23:48.000000Z` and block `9997222`.
- The matching Sepolia Etherscan transaction page labels it “Contract
  Created” at the stated contract address and shows “Jan-07-2026 03:23:48 PM
  +UTC,” with status `Success` and block `9997222`.
- The older hash in the repository deployment metadata,
  `0x7e163effbc559a584f1f48aa8c14f9d30771c71e00cdea7ee64d7e14e5135f2c`, is
  not found on the checked Sepolia Etherscan transaction page. It is not the
  creation hash returned by the contract address's explorer record.

V1 also has owner-controlled `mint` and `addWitness` functions. Its `mint`
function checks the one-million-token `MAX_SUPPLY`, but `addWitness` minted
without applying the same cap check. This was the confirmed supply-control
issue addressed in the V2 design.

### Recovery process

The original repository clone contained its README, license, Git attributes
and ignore files, and a PNG image, but not the Solidity source or a complete
development project. The README described files and scripts not present in
that checkout.

### Recovery of source code

The verified Sepolia contract record was used to recover V1's `Legacy6Coin.sol`
and its imported source files. The recovered primary source was checked
byte-for-byte against the verified source record. The original source was
preserved under `Legacy6Coin-Source`; it was not rewritten as V2.

### Recovery of development environment

A Hardhat 3 project was set up under `Legacy6Coin-Source`, with the recovered
V1 source and dependencies kept available. Node.js, npm, and Hardhat were
installed and used for local compilation. PowerShell's `npm.ps1` execution
policy issue was worked around with the Windows `npm.cmd` and `npx.cmd`
commands.

### V2 redesign goals

- Preserve V1's `Legacy6Coin` / `L6C` identity, founder allocation philosophy,
  six original witness addresses, founder-controlled minting, and witness
  onboarding.
- Enforce one 1,000,000 L6C lifetime issuance cap across all mint paths.
- Prevent duplicate witness onboarding.
- Keep witness addresses and allocation events on-chain, but not human-readable
  names.
- Use two-step ownership transfer and make ownership renunciation unavailable.
- Allow holder self-burn without restoring lifetime issuance capacity.
- Avoid proxies, upgradeability, transfer taxes, blacklists, and unrelated
  governance features.

## 3. Token Specification

| Property | Release-candidate design |
|---|---|
| Name | `Legacy6Coin` |
| Symbol | `L6C` |
| Decimals | 18 |
| Initial supply | 666,000 L6C |
| Maximum lifetime issuance | 1,000,000 L6C |
| Founder allocation | 660,000 L6C to the deployment caller, who becomes initial owner |
| Initial witness allocation | 1,000 L6C for each of the six V1 witness addresses |
| Initial minting headroom | Up to 334,000 L6C, subject to owner authorization and the shared cap |
| Burn policy | Holder may burn only their own tokens; burning does not restore minting capacity |

Amounts are represented internally using integer base units with 18 decimals.
If the founder/deployer is also witness #6, the founder receives both
allocations (661,000 L6C total for that address); total initial issuance
remains 666,000 L6C.

## 4. Founder Decisions

The current [Founder Decision Record](./LEGACY6COIN-V2-ADR.md) is the
authoritative design record. Its approved decisions are summarized here:

- Preserve the V1 spirit and use the exact name `Legacy6Coin`, symbol `L6C`,
  and 18 decimals.
- Allocate 660,000 L6C to the deploying founder and 1,000 L6C to each of the
  six original V1 witness addresses.
- Treat the recovered wallet's overlap with witness #6 as intentional unless
  the founder later changes it.
- Retain founder-controlled general minting and 1,000-token witness
  onboarding.
- Enforce one immutable 1,000,000 L6C lifetime issuance cap on constructor
  allocations, general minting, and witness onboarding.
- Reject zero-address and duplicate witness onboarding; record successful
  witness addresses and emit allocation events for initial and later
  allocations.
- Store no human-readable witness names on-chain; names belong in documentation
  and require consent before publication.
- Allow holders to burn only their own tokens. Burning reduces current
  `totalSupply()` but never lowers cumulative `totalMinted` or restores cap
  capacity.
- Keep the founder/deployment caller as initial owner.
- Require a proposed owner to accept a two-step ownership transfer.
- Do not support irreversible `renounceOwnership()`.
- Do not use a proxy or upgrade mechanism, transfer taxes, blacklists, or
  separate token governance.
- Multisig migration is deferred for later review.
- The current implementation configuration records Solidity `0.8.31`,
  optimizer enabled for 200 runs, EVM target `paris`, and pinned dependency
  resolutions in `package-lock.json`. The V2 dependency is OpenZeppelin
  Contracts `5.6.1` through `@openzeppelin/contracts-v2`; V1 recovery source
  uses the local `vendor/openzeppelin-contracts` snapshot. The exact source,
  configuration, and dependency files still require release freezing and
  integrity verification.
- Mainnet deployment requires a separate approval; this report is not that
  approval.

## 5. Contract Architecture

The implementation is a single ERC-20 contract based on OpenZeppelin's ERC-20
implementation. It is not a proxy and has no upgrade path.

### Ownership

The deploying account is recorded as owner and receives the founder
allocation. Owner-only actions are general minting, witness onboarding, and
proposing a new owner. Ownership is not renounceable.

### Minting

The owner may mint arbitrary amounts to a nonzero recipient while there is
lifetime issuance capacity. Any successful mint is reflected in `totalMinted`.
The maximum remaining issuance after construction is 334,000 L6C.

### Witness onboarding

The constructor allocates 1,000 L6C to each of the six fixed V1 witness
addresses. The owner may later onboard a new, nonzero address for a 1,000 L6C
allocation. An address already marked as a witness cannot be added again.
Successful allocations are recorded in the witness address list and emit a
`WitnessAllocated` event. Human-readable names are not stored in the contract.

### Shared cap enforcement

All issuance paths use the same cap-enforcing internal function. It tracks
cumulative tokens ever minted and rejects issuance that would make
`totalMinted` exceed `MAX_SUPPLY`. This counter is intentionally separate from
ERC-20 `totalSupply()`, which decreases when tokens are burned.

### Burn mechanism

`burn(amount)` destroys tokens from the caller's own balance. It cannot burn
another account's tokens and has no allowance-based variant. A burn decreases
current supply but does not reduce `totalMinted`; therefore, burned tokens do
not make room for future minting.

### Two-step ownership transfer

The current owner nominates a pending owner. The nominee must call
`acceptOwnership()` before becoming owner. A new nomination replaces the
previous pending owner; proposing the zero address clears a pending transfer.
Renunciation is not available.

## 6. Security Review Summary

An independent read-only review found **no confirmed exploitable
vulnerabilities** in the reviewed V2 code paths. The review is not a formal
third-party audit, does not guarantee security, and should be repeated against
the exact release source and compiler configuration.

### High findings

No confirmed high-severity code vulnerability was reported. The reviewer
classified owner-key control as a **high administrative trust risk**, not a
code defect: the owner can direct remaining issuance and add witnesses, up to
the lifetime cap.

### Medium findings

No confirmed medium-severity code vulnerability was reported. The reviewer
identified a **medium operational deployment risk**: the deployment caller
becomes both founder-allocation recipient and initial owner. An unintended
caller or an unexpected deployment path could assign those roles incorrectly.

### Informational findings

- `totalMinted` is intentionally distinct from `totalSupply()` so burning
  cannot reopen issuance capacity.
- Two-step transfer requires acceptance by the proposed owner.
- The ABI does not expose a `renounceOwnership` function.
- The contract has no proxy or upgrade mechanism.

### Centralization risks

The owner controls minting and witness onboarding. After the initial 666,000
L6C issuance, up to 334,000 L6C may be issued under the owner's authority.
Two-step transfer prevents an unaccepted ownership handoff, but it does not
remove owner power. Multisig migration is deferred, so owner-key security is
an operational responsibility.

### Economic risks

Issuing some or all of the remaining 334,000 L6C can dilute existing holders.
The cap limits total lifetime issuance, but does not set a schedule, allocation
policy, or market value for future minting. Holder burns are irreversible and
do not increase remaining issuance capacity.

### Ownership risks

The deployer's account becomes owner and founder recipient. Loss or compromise
of that account can affect minting and witness onboarding until ownership is
transferred. Two-step transfer reduces accidental acceptance but requires
careful verification of the proposed address. The absence of renunciation
preserves administrative continuity but means ownership cannot be intentionally
destroyed through the contract.

## 7. Test Results Summary

The V2 suite is reported to contain **23 passing tests**. Tests use Hardhat's
local simulated network; they are not Sepolia or Mainnet deployments.

Coverage includes:

1. Founder receives 660,000 L6C and is initial owner.
2. Each original witness receives 1,000 L6C and is recorded.
3. Initial `totalSupply`, `totalMinted`, and `MAX_SUPPLY` values.
4. Duplicate witness rejection.
5. Zero-address witness rejection.
6. Owner minting below the cap.
7. Rejection of minting above the cap.
8. Successful witness onboarding below the cap with allocation event.
9. Successful witness onboarding with exactly 1,000 L6C of headroom.
10. Rejection of witness onboarding with less than 1,000 L6C remaining.
11. Failed witness onboarding leaves balances and registry storage unchanged.
12. Minting to the zero address reverts without changing supply accounting.
13. Owner-only restrictions on minting, witness onboarding, and ownership proposal.
14. Two-step ownership transfer and rejection of an unapproved acceptor.
15. Replacing an earlier pending owner.
16. Cancelling a pending transfer by proposing the zero address.
17. Holder self-burn reduces balance and current supply.
18. Burning at the cap does not restore minting capacity.
19. Burning more than the caller's balance reverts without state changes.
20. Zero-amount burn is a no-op with the standard transfer event.
21. Founder/witness #6 overlap receives both allocations and event records.
22. Mixed issuance/burn operations preserve supply invariants.
23. ERC-20 transfers, approvals, and delegated transfers.

Passing tests demonstrate expected behavior for tested cases; they do not prove
the absence of all vulnerabilities or replace independent review.

## 8. Remaining Risks

- **Owner authority:** The owner can allocate the remaining cap. A single
  compromised key could misuse that approved authority.
- **Initial owner assignment:** The deployment caller receives founder tokens
  and becomes owner; this must match the release plan exactly.
- **Founder/witness overlap:** The recovered wallet is witness #6. If it is
  also the deployer, its combined initial balance is 661,000 L6C. This is
  intentional under the ADR, but must be checked in rehearsal.
- **Burn permanence:** Users can permanently destroy their own tokens.
- **Limited automated assurance:** Twenty-three tests are useful coverage but
  do not replace fuzzing, invariant testing over broad sequences, static
  analysis, or a full independent audit.
- **Deployment environment:** Local compilation and tests do not establish
  that a later network, account, constructor context, or verification process
  is configured correctly.
- **V1/V2 coexistence:** V2 is a new contract and ticker reuse can confuse
  users. V1 balances do not migrate automatically. Public materials must
  distinguish the contract addresses and explain the relationship.
- **Off-chain witness names:** Documentation is not automatically synchronized
  with on-chain addresses and events; review consent, spelling, and
  correspondence carefully.

## 9. Sepolia Rehearsal Plan

This is a checklist for a future, explicitly approved rehearsal. It is not a
deployment script or authorization. Do not share private keys, seed phrases,
or wallet recovery material.

### Before rehearsal

- [ ] Obtain explicit founder approval to perform a Sepolia rehearsal.
- [ ] Freeze the exact V2 source, tests, package lockfile, compiler version,
  optimizer settings, EVM target, and OpenZeppelin dependency version.
- [ ] Run a clean build and the complete 23-test suite against the frozen
  commit; save the logs and source hash.
- [ ] Complete an independent audit of that exact source and resolve all
  release-blocking findings.
- [ ] Prepare a reviewed rehearsal manifest containing the chain ID, expected
  deployer, expected initial owner, founder allocation, six witness addresses,
  initial supply, maximum lifetime issuance, constructor behavior, and
  verification settings.
- [ ] Independently compare every witness address and its ordering with the
  recovered V1 source.
- [ ] Confirm that the deployer is witness #6 or is not, and calculate the
  resulting founder balance accordingly.
- [ ] Review the owner-key custody plan and how the rehearsal account will be
  protected. Never put secrets in source, shell history, chat, or Git.
- [ ] Confirm the rehearsal wallet has only test funds and the selected
  environment cannot route to Mainnet.
- [ ] Have a second reviewer independently check the manifest and network
  selection.

### During rehearsal

- [ ] Confirm Sepolia chain ID **11155111** in the wallet/tool before
  authorizing any rehearsal transaction.
- [ ] Compare the transaction's network, sender, contract source, and
  constructor behavior to the approved manifest before signing.
- [ ] Deploy only after explicit user/founder confirmation in the appropriate
  secure wallet interface; never transmit secrets to an assistant.
- [ ] Save the resulting address and transaction hash in a clearly labeled
  **test rehearsal** record.
- [ ] Verify the source and exact compiler settings on the Sepolia explorer.
- [ ] Read back token name, symbol, decimals, owner, initial `totalSupply`,
  `totalMinted`, witness list, witness balances, founder balance, and allocation
  events.
- [ ] Confirm total initial issuance is 666,000 L6C and no more than
  1,000,000 L6C can ever be minted.
- [ ] Check the founder/witness #6 overlap result, if applicable.
- [ ] Exercise owner minting, capped witness onboarding, duplicate rejection,
  holder burn, and two-step ownership transfer on the rehearsal deployment,
  using only test funds and approved test accounts.
- [ ] Stop immediately if any address, balance, event, source verification, or
  chain detail differs from the manifest.

### After rehearsal

- [ ] Compare on-chain observations with local test expectations and document
  discrepancies.
- [ ] Revoke or secure test-only credentials and do not reuse them for Mainnet.
- [ ] Publish the rehearsal report as testnet-only; clearly state that it is
  not the production token.
- [ ] Update the audit and release record if any code or configuration changes.
- [ ] Require a fresh build, test run, and independent review after changes.

## 10. Mainnet Readiness Assessment

**Status: Not approved for Mainnet.**

The compile and test assumptions and the independent review are positive
release-candidate signals, but they are not sufficient for production
authorization. The owner-controlled mint authority remains a material trust
risk; the exact deployment context and constructor results require rehearsal;
and the approved ADR requires a separate Mainnet go/no-go decision.

Before any Mainnet consideration, the project should complete a final
independent audit of the frozen release, reproduce the build, complete a
Sepolia rehearsal, review the owner-key custody process, verify addresses and
allocation expectations, and prepare public V1/V2 distinction and support
communications. Mainnet requires a separate founder authorization after those
gates.

## 11. Mainnet Go/No-Go Checklist

Mark each item before a separate Mainnet decision:

- [ ] Exact source commit and hashes are frozen and independently reviewed.
- [ ] Clean reproducible build uses recorded compiler, optimizer, EVM, and
  dependency settings.
- [ ] All tests pass; additional fuzz/invariant testing and static analysis
  have been reviewed.
- [ ] Independent audit findings are resolved or explicitly accepted by the
  founder with rationale.
- [ ] Sepolia rehearsal completed and its results match the approved manifest.
- [ ] Deployer identity and initial owner assignment independently confirmed.
- [ ] Founder/witness #6 overlap and all six witness addresses independently
  checked.
- [ ] Initial supply, maximum lifetime issuance, mint authority, and burn
  behavior clearly documented for users.
- [ ] Owner key custody and recovery procedures reviewed; multisig decision
  revisited before production.
- [ ] Mainnet chain and chain ID independently confirmed on a trusted device.
- [ ] Production transaction details and gas budget independently reviewed by
  at least two authorized people.
- [ ] Explorer verification and post-deployment checks are prepared.
- [ ] Public V1/V2 address distinction and non-migration notice are ready.
- [ ] Founder signs a separate explicit **GO** decision; otherwise **NO-GO**.

## 12. Recommendation

Keep this release candidate off Mainnet. The next recommended action is to
freeze and independently audit the exact V2 source and build, then—after
explicit approval—perform a Sepolia rehearsal using the checklist above.
Evaluate multisig custody before that rehearsal or production planning. A
successful rehearsal does not itself authorize Mainnet deployment.
