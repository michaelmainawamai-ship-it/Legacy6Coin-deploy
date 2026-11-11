# Legacy6Coin V2 Implementation Blueprint

> **SUPERSEDED — HISTORICAL BLUEPRINT; NOT CURRENT REQUIREMENTS**
>
> This blueprint describes an earlier, unapproved design, including the
> proposed `Legacy6Coin V2` / `L6C2` identity, a fixed 666,000 L6C lifetime
> maximum, no post-deployment minting, and no owner. Those choices were
> rejected or replaced by the founder-approved
> [Decision Record](./LEGACY6COIN-V2-ADR.md). The ADR is the sole authority for
> V2 requirements. Do not use this blueprint to implement, audit, or deploy
> V2. It is retained only as project history.

**Status:** Blueprint only. No Solidity has been written, and no deployment is
authorized by this document.

This blueprint translates the proposed [Legacy6Coin V2 Design
Specification](./LEGACY6COIN-V2-SPEC.md) into a build and test plan. It uses
the proposed 666,000 L6C initial supply, six fixed witness allocations, and no
post-deployment minting. These choices must be explicitly approved before
implementation.

V2 would be a separate contract at a new address. It would not upgrade V1,
replace the Sepolia token, or automatically transfer V1 balances.

## 1. Solidity files required

### Required project-authored Solidity

- `contracts/Legacy6CoinV2.sol` — the only project-authored production
  contract file required for the minimum design.

### Solidity dependency files

- Import the standard `ERC20` implementation from one specifically selected,
  audited, exact-pinned OpenZeppelin Contracts release.
- The package supplies its own Solidity files as installed dependencies; do
  not copy the V1 mixed-version vendor snapshot into V2 or hand-edit library
  source.
- Record the exact dependency version and lockfile used for the build.

### Solidity test files

- None are required for the proposed Hardhat TypeScript test setup. Put tests
  in `test/Legacy6CoinV2.ts`.
- A Solidity test harness may be added later only if the team selects a
  Solidity-native testing framework. It is not part of the minimum design.

No separate ownership, minting, proxy, governance, or witness-registry
contract is needed for this design.

## 2. Minimum contract architecture

The proposed contract is a single, non-upgradeable ERC-20 contract:

- Inherit from OpenZeppelin `ERC20`.
- Set the token name to `Legacy6Coin V2` and symbol to `L6C2`, subject to
  explicit approval. Do not silently reuse `L6C` for a new token if doing so
  could confuse users with V1.
- Use the standard 18 decimals.
- Mint all initial allocations in the constructor.
- Have no owner, roles, external mint function, pause control, blacklist,
  transfer tax, arbitrary external call, or proxy.
- Optionally provide a holder-only `burn(amount)` function, subject to the
  decision in section 7.
- Emit allocation events during construction if on-chain event-based
  allocation records are approved. Do not store personal names on-chain.

The contract needs no deployment-time administrator after construction. In
this design there is no ownership transfer strategy to implement: there is no
owner. If the requirements later change to add administration, stop and revise
this design before coding; do not casually add `Ownable`.

## 3. Proposed constructor inputs

Proposed inputs, in order:

1. `founderRecipient` — the address that receives the founder allocation.
2. `witnessAllocations` — a fixed-size list of exactly six allocation records.

The values must be confirmed and independently checked before any future
deployment. The deploying account is not automatically the founder and need
not receive tokens.

The proposed witness record is:

| Field | Type | Rule |
|---|---|---|
| `recipient` | `address` | Must not be zero, the founder recipient, or any other witness recipient. |
| `amount` | `uint256` | Must equal exactly `1,000 × 10^18` base units. It is not a free-choice amount. |

Use a fixed-length six-element array so the constructor cannot accept five or
seven witness records. Validate the amounts and addresses at construction.
Do not include names in the constructor: names are unnecessary for token
accounting, can expose personal information, and can be kept in approved
off-chain project documentation if needed.

The constructor must revert before completing if an input is invalid. Since a
reverted constructor creates no contract, it must never leave a partially
minted token behind.

## 4. Witness allocation data structure

The proposed conceptual Solidity struct has exactly two fields:

- `recipient`: the witness's receiving address.
- `amount`: the required allocation in base units.

There are exactly six struct entries. Every `amount` must equal the fixed
witness allocation constant; callers cannot use this input to change the
tokenomics.

Validation rules:

- No recipient may be the zero address.
- No witness may be the founder recipient.
- No two witnesses may have the same address.
- Each witness must receive exactly 1,000 L6C.
- Do not add a post-launch `addWitness` function.

If allocation events are approved, emit one `WitnessAllocated` event per
recipient during construction. Event data is public. Storing a permanent
on-chain array or names is not required by the minimum design; add persistent
registry storage only if a documented use case justifies its extra code and
cost.

## 5. Founder allocation logic

The constructor mints exactly `660,000 × 10^18` base units to the explicitly
provided founder recipient.

- Reject a zero founder address.
- Reject any witness entry that duplicates the founder recipient.
- Do not derive the founder from `msg.sender`.
- Do not assign founder tokens to an owner or deployer implicitly.
- If an allocation event is part of the approved design, emit a
  `FounderAllocated` event with the recipient and amount.

The exact founder recipient is a pre-deployment decision. It must not be
guessed from wallet history or filled in by an implementation default.

## 6. Exact fixed-supply implementation

### Agreed proposed quantities

- Token unit: `10^18` base units per L6C.
- Founder allocation: `660,000 × 10^18`.
- Witness allocation: `1,000 × 10^18` for each of six witnesses.
- Total initial issuance and lifetime maximum issuance:
  `660,000 × 10^18 + 6 × (1,000 × 10^18) = 666,000 × 10^18`.

### Required rule

Mint only those seven constructor allocations. There must be no external or
internal post-construction path that can mint more tokens, and no proxy or
upgrade mechanism that can replace this rule.

### Supply terminology, especially if burn is enabled

- **Lifetime issued supply / maximum issued:** always 666,000 L6C. No more can
  ever be created.
- **Current `totalSupply()`:** starts at 666,000 L6C and falls when holders
  burn tokens.
- Burning must never create permission or capacity to mint replacements.

Tests must prove the constructor distribution sums exactly to the proposed
total and that no later action can increase total supply.

## 7. Optional self-burn feature

**Decision required:** include or omit holder self-burn before implementation.
The preferred minimal version may omit it.

If approved, provide one function that lets the caller destroy only tokens
they own:

- The amount is denominated in base units.
- The caller's balance is reduced by the amount.
- `totalSupply()` is reduced by the same amount.
- Burning more than the caller owns reverts.
- Burning does not authorize or enable a later mint.
- There is no `burnFrom`, privileged burn, forced burn, or allowance-based
  burn.
- The burn event follows standard ERC-20 `Transfer`-to-zero behavior.

Test zero-amount behavior against the chosen OpenZeppelin version and document
it. Do not assume a revert for zero amount unless the implementation explicitly
requires it and the policy approves that behavior.

## 8. Required tests before any deployment

Write tests first or alongside the contract. All tests must pass on the exact
source and pinned dependencies proposed for release.

### Constructor and allocation tests

- Correct token name, symbol, and 18 decimals.
- Correct founder balance of exactly 660,000 L6C.
- Each of six distinct witnesses has exactly 1,000 L6C.
- Initial `totalSupply()` equals exactly 666,000 L6C in base units.
- Sum of all seven allocation balances equals initial supply.
- A zero founder recipient is rejected.
- A zero witness recipient is rejected.
- A witness equal to the founder is rejected.
- Duplicate witness recipients are rejected, including duplicates at different
  positions.
- A witness amount below or above 1,000 L6C is rejected.
- Exactly six witnesses are accepted; the fixed-size interface cannot accept
  a different number.
- Invalid input reverts contract creation rather than creating a partial
  allocation.
- Reordering valid witness entries does not change the allocation amount.

### Supply and permissions tests

- There is no public or owner-only `mint` function in the ABI.
- There is no owner, role, proxy, upgrade, pause, or alternate issuance path.
- After every available successful operation, supply never increases above
  the initial 666,000 L6C.
- If burning is enabled, supply decreases only by the caller's burned amount.
- Burning does not allow tokens to be minted again.

### Burn tests, only if burn is approved

- A holder can burn an amount no greater than their own balance.
- Holder balance and `totalSupply()` decrease by exactly the burned amount.
- A caller cannot burn another account's tokens.
- A caller cannot burn more than their balance.
- Zero-amount behavior matches the documented policy.
- No `burnFrom` or privileged burn entry point exists.
- Normal transfers and approvals remain unaffected by the burn feature.

### ERC-20 behavior tests

- Transfers update sender and recipient balances correctly.
- Transfers exceeding the sender balance revert.
- Approvals and `transferFrom` follow standard allowance behavior.
- Transfer and approval events contain the expected addresses and amounts.
- No transfer fee, blacklist, allowlist, or hidden transfer restriction exists.

### Build, review, and release checks

- Compile using the exact pinned compiler, optimizer, EVM, and dependency
  settings selected for V2.
- Run all unit tests and any property/fuzz tests repeatedly with recorded
  inputs/seeds.
- Run static analysis and resolve or document findings.
- Have an independent security professional review the final exact source.
- Re-run compilation and the full test suite after every audit fix.
- Review the deployment bytecode, constructor data, and recipient list against
  an independently checked release manifest.

## 9. Step-by-step builder roadmap

### Phase A — Approve requirements

1. Confirm that V2 should have the distinct name/symbol `Legacy6Coin V2` /
   `L6C2`, or approve alternatives.
2. Confirm 666,000 as both initial and lifetime maximum issued supply.
3. Confirm the founder recipient and all six witness recipients through a
   private, trusted process; never ask anyone to post a seed phrase or private
   key.
4. Confirm whether self-burn is included.
5. Decide whether allocation events are needed and whether witness addresses
   should be persisted on-chain. Do not store witness names by default.
6. Confirm the no-owner, no-mint, no-pause, no-blacklist, and no-upgrade policy.
7. Obtain independent design review and approval before implementation starts.

### Phase B — Prepare the development project

1. Create a separate V2 project or clearly isolated V2 directory; do not
   overwrite recovered V1 source.
2. Select and exact-pin a reviewed OpenZeppelin Contracts release.
3. Pin the Solidity compiler, optimizer settings, EVM target, and test tools.
4. Record the approved design and test cases in version control before writing
   implementation code.

### Phase C — Implement and test

1. Add only `contracts/Legacy6CoinV2.sol` for the minimum production
   architecture.
2. Implement the constructor validation and exact initial allocations.
3. Add self-burn only if Phase A approved it.
4. Add `test/Legacy6CoinV2.ts` and implement the required tests above.
5. Confirm the ABI has no unapproved administrative or minting functions.
6. Run compile, tests, and static analysis locally; do not configure a Mainnet
   endpoint or deploy during this phase.

### Phase D — Independent review

1. Ask an independent Solidity auditor to review the design and exact source.
2. Fix findings on a dedicated branch and add regression tests.
3. Repeat compilation, tests, and analysis against the final source.
4. Record source hash, compiler settings, dependency lockfile, test results,
   audit disposition, and approved constructor data in a release manifest.

### Phase E — Test-network rehearsal

1. Only after code review, separately approve a test-network rehearsal.
2. Verify the network and chain ID before any transaction.
3. Use a test-only deployment account and test funds; never place wallet
   secrets in source code or chat.
4. Compare deployed token metadata, balances, total supply, source verification,
   and constructor recipients with the approved manifest.
5. Stop and investigate any mismatch. Do not treat test deployment as
   approval for Mainnet.

### Phase F — Mainnet go/no-go, separately authorized

1. Review audit closure, operational security, deployment cost, address list,
   exact bytecode, and verification plan.
2. Have at least two trusted reviewers independently confirm chain, account,
   constructor arguments, and bytecode before signing.
3. Obtain explicit project-owner approval for Mainnet. This blueprint alone
   does not authorize deployment.
4. After any separately authorized deployment, verify the exact source and
   settings, confirm all balances and total supply, publish the new address,
   and retain immutable deployment records.

## Decisions that remain open

- Final V2 token name and symbol.
- Confirmed founder and six witness recipient addresses.
- Whether self-burn is included.
- Whether allocation events are required.
- Whether witness addresses need an on-chain registry.
- Exact pinned OpenZeppelin release and compiler settings.
- Whether and when to authorize a test-network rehearsal or Mainnet deployment.
