# Legacy6Coin V2 — Founder Decision Record

**Purpose:** Record the founder-approved requirements for Legacy6Coin V2  
**Status:** Founder decisions finalized; Solidity implementation, 23-test suite, and Release Candidate Report exist. This ADR is not deployment authorization.  
**Scope:** V2 is a separate contract and will not upgrade V1 or move V1 balances.

**Status key:** **Approved** = selected by the founder; **Rejected** = explicitly
excluded; **Pending** = founder decision still required. This ADR supersedes
conflicting proposals in the earlier V2 specification and implementation
blueprint. It is the sole authority for V2 requirements; other documents may
summarize it but cannot override it.

| Decision | Status | Recorded decision |
|---|---|---|
| Token purpose | **Approved** | Preserve the V1 spirit as a simple transferable ERC-20; make no promise of profit, redemption, or financial return. |
| Token name and symbol | **Approved** | `Legacy6Coin` / `L6C`, as in V1. V2 is distinguished by its separately published contract address, not a changed ticker. |
| Decimals | **Approved** | Preserve V1's 18 decimals. |
| Initial allocation | **Approved** | Follow V1: 660,000 L6C to the founder and 1,000 L6C to each of six original witnesses; initial issued supply is 666,000 L6C. |
| Founder allocation philosophy | **Approved** | The deployment caller is the founder recipient and initial owner, matching V1 (`msg.sender`). |
| Original witness recipients | **Approved** | Preserve the six V1 addresses listed below. Confirm each address and ordering against the recovered source before any deployment. |
| Fixed-supply-only model | **Rejected** | V2 must retain post-deployment minting rather than stop at the initial 666,000 allocation. |
| Maximum supply | **Approved** | Preserve V1's `MAX_SUPPLY` of 1,000,000 L6C. Initial issuance is 666,000 L6C, leaving at most 334,000 L6C of minting headroom. |
| Minting policy | **Approved** | Preserve founder-controlled V1 minting with one immutable, founder-approved cap and one shared enforcement rule on every mint path. Both general `mint` and `addWitness` issuance count toward the same cap. |
| Post-deployment witness onboarding | **Approved** | Preserve `addWitness`-style onboarding and its 1,000 L6C allocation, subject to the same cap; reject zero and duplicate witness recipients. |
| Founder/witness address overlap | **Approved** | The recovered wallet is witness #6. Treat that overlap as intentional unless the founder later changes it; if it is also the deployment caller, preserve both allocations (660,000 + 1,000 L6C) and report each allocation distinctly. |
| Witness allocation events | **Approved** | Emit a blockchain event for every initial and later witness allocation. |
| One cap across all issuance | **Approved** | Apply the same cap-enforcing internal mint operation to constructor allocations, general owner minting, and witness onboarding. Reject any issuance that would exceed 1,000,000 L6C. A failed witness allocation must leave no registry entry or event. |
| Duplicate witness onboarding | **Rejected** | Do not permit a witness address to be added more than once; this prevents repeated 1,000 L6C allocations and overwritten witness records. |
| Burn feature | **Approved** | Allow holders to burn only their own tokens. A burn permanently reduces current supply and must not increase the amount that can ever be minted; track cumulative issuance against the 1,000,000 L6C cap. No owner-forced or allowance-based burn. |
| Witness address registry | **Approved** | Preserve the V1-style witness address list as part of onboarding, in addition to approved allocation events. |
| Witness display names | **Rejected** | Do not store witness names on-chain. Human-readable names belong in project documentation and may be published only with the relevant person's consent. |
| Initial ownership | **Approved** | Keep the founder/deployment caller as the initial owner and mint authority. |
| Multisig migration | **Deferred** | Multisig migration may be reviewed later; no multisig or timelock is required for the initial implementation decision. |
| Ownership transfer | **Approved** | Use two-step ownership transfer: a proposed new owner must accept ownership before control changes. |
| Ownership renunciation | **Rejected** | V2 must not include irreversible `renounceOwnership()`. Ownership must remain transferable through the approved two-step transfer process so minting and witness onboarding authority cannot be permanently destroyed. |
| Proxy or upgradeability | **Rejected** | No proxy or upgrade mechanism. Future changes require a separately reviewed contract and address. |
| Transfer tax or hidden restrictions | **Rejected** | Standard ERC-20 transfers without fees, blacklist, or hidden restrictions. |
| Separate token governance | **Rejected** | No DAO or token-holder governance in the V2 implementation; any future governance requires a separate design and review. |
| Dependency and build settings | **Approved** | The implementation build is recorded with Solidity `0.8.31`, optimizer enabled for 200 runs, EVM target `paris`, Hardhat `3.21.2`, and a lockfile. V2 imports OpenZeppelin Contracts `5.6.1` through `@openzeppelin/contracts-v2`; the recovered V1 source continues to use the local `vendor/openzeppelin-contracts` snapshot. Freeze and audit the exact lockfile and dependency sources with the release candidate. |
| Mainnet deployment | **Pending** | Not authorized by this ADR; requires completed implementation, tests, independent audit, test-network rehearsal, and a separate explicit go/no-go approval. |

## V1 witness recipient addresses

These are the six addresses in the recovered V1 constructor, in its original
order:

1. `0xA9f38f1F7537bfA77e6A10e5C3203a441211E548`
2. `0x00839730DB60Ff3769208808A82134c3974a90F5`
3. `0xF87767e56650d66E254551dc09391f0F83bc51c0`
4. `0xBa1856c474998DbaC4936AD43633f9846368b9B6`
5. `0xC445dCe81f57e2E5eBf3e78aDf71F884bb2533A2`
6. `0x21EC335039Bca45896f75741433FF869d8a1cB8c`

## Approved supply-control direction

V2 should preserve both V1 minting features and fix the audit finding. The
owner-only general mint and 1,000-token witness allocation must call the same
cap-enforcing internal operation. That operation must reject any issuance that
would make cumulative tokens ever minted exceed the immutable 1,000,000 L6C
cap. Record a witness only
when its allocation succeeds; a failed cap check must revert the whole
onboarding. Reject duplicate witness additions so repeat calls cannot create
unintended allocations or overwrite witness records.

The cap check must cover constructor allocations too. The recovered wallet is
witness #6; if it is also the deploying founder, preserve both V1 allocations
and make their allocation events distinguishable. Verify the deployment
account and resulting allocations before any deployment. Holder burns reduce
current `totalSupply()` but never decrement cumulative issuance or restore
minting capacity.

## Implementation and release status

Founder-level V2 design decisions are finalized in this ADR. The
`Legacy6CoinV2.sol` implementation exists, and `test/Legacy6CoinV2.ts`
contains 23 tests. The Release Candidate Report summarizes the implementation,
test coverage, known risks, and outstanding release gates.

These facts do not establish that the source has been frozen, externally
audited, rehearsed on Sepolia, or approved for deployment. Mainnet deployment
remains unapproved and requires a separate explicit founder go/no-go decision
after the required release, audit, and rehearsal gates.

## Founder signoff

The founder has approved the decisions marked **Approved** above. This
approval records the V2 design; it is not approval to deploy.

**Founder name:** __________________________  
**Signature:** ______________________________  
**Date:** ___________________________________

**Release gate:** Mainnet deployment still requires a separate explicit
go/no-go approval. No deployment is authorized by this document.
