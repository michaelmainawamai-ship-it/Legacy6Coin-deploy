# Legacy6Coin V2 Documentation Cleanup Package

**Status:** Applied as documented in [Documentation Change Report](./LEGACY6COIN-V2-DOCUMENTATION-CHANGE-REPORT.md)  
**Authority:** [Founder Decision Record](./LEGACY6COIN-V2-ADR.md)  
**Scope:** Documentation changes only. Do not edit Solidity or tests as part of
this cleanup package.

This package preserves the approved wording used for the documentation
cleanup. The excerpts below record changes already applied; they are not
pending instructions. The cleanup changed documentation only; Solidity, tests,
and deployment files were not modified. See the change report for the
edited-file list, validation, and remaining release-freeze blockers.

## 1. Documents updated

| Document | Action applied | Reason |
|---|---|---|
| `LEGACY6COIN-V2-ADR.md` | Updated lifecycle/status wording and recorded the implementation build configuration, preserving approved decisions. | The former wording described a pre-implementation signoff. |
| `LEGACY6COIN-V2-SPEC.md` | Added the superseded notice and retained the body as historical context. | It proposed a fixed 666,000 maximum, no post-deployment minting, and no owner. |
| `LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md` | Added the superseded notice and retained the body as historical context. | It proposed `L6C2`, fixed supply, no owner, and no minting. |
| `LEGACY6COIN-V2-RELEASE-CANDIDATE.md` | Replaced the stale statement that dependencies/build settings remain to be pinned. | The project configuration already records compiler and dependency versions. |
| `LEGACY6COIN-V2-RELEASE-FREEZE-PACKAGE.md` | Updated documentation-blocker statements, audit-package guidance, and readiness scores; retained source-freeze and audit blockers. | The superseded notices are in place; the Git/source freeze is still incomplete. |
| `README.md` | Clarified the original checkout history, qualified the deployment JSON, and added a V2 status section. | The JSON's earlier V1 date and transaction hash conflict with explorer-verified creation evidence. |

The other Markdown files found (`HARDHAT.md`, `AGENTS.md`, `CLAUDE.md`, and
vendored/tool skill documentation) have no identified V2 design-status
conflict requiring edits in this cleanup. The separate
`deployments/sepolia.json` is not a Markdown document; this package proposes a
README warning rather than changing that file.

## 2. ADR wording applied

### Applied purpose/status block

The following applied wording replaced the former purpose/status block:

```markdown
**Purpose:** Design signoff before Solidity implementation  
**Status:** Updated from founder-approved decisions; not deployment authorization  
**Scope:** V2 is a separate contract and will not upgrade V1 or move V1 balances.
```

with:

```markdown
**Purpose:** Record the founder-approved requirements for Legacy6Coin V2  
**Status:** Founder decisions finalized; implementation and 23-test suite exist; a Release Candidate report exists. This ADR is not deployment authorization.  
**Scope:** V2 is a separate contract and will not upgrade V1 or move V1 balances.
```

### Applied dependency/build-settings table row

The following wording replaced the existing **Dependency and build settings**
row:

```markdown
| Dependency and build settings | **Approved** | The implementation build is recorded with Solidity `0.8.31`, optimizer enabled for 200 runs, EVM target `paris`, Hardhat `3.21.2`, and a lockfile. V2 imports OpenZeppelin Contracts `5.6.1` through `@openzeppelin/contracts-v2`; the recovered V1 source continues to use the local `vendor/openzeppelin-contracts` snapshot. Freeze and audit the exact lockfile and dependency sources with the release candidate. |
```

This wording records the current configuration without implying the V1
recovered dependency snapshot is the V2 dependency. Verify exact package
versions against the lockfile when applying the edit.

### Applied implementation/release status section

The following wording replaced the stale section beginning `## Founder
decisions remaining before Solidity implementation` and its implementation
gate:

```markdown
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
```

Do not change the ADR's decision table or witness list as part of this status
cleanup unless the founder separately changes a design decision.

## 3. Superseded notices applied

The following notice appears immediately after the title in
`LEGACY6COIN-V2-SPEC.md`:

```markdown
> **SUPERSEDED — HISTORICAL PROPOSAL; NOT CURRENT REQUIREMENTS**
>
> This specification records an earlier design proposal. Its fixed 666,000
> L6C maximum, no-post-deployment-minting policy, no-owner model, and related
> choices were not approved and are superseded by the founder-approved
> [Decision Record](./LEGACY6COIN-V2-ADR.md). The ADR is the sole authority for
> V2 requirements. Do not use this document to implement, audit, or deploy V2.
> It is retained only as project history.
```

The following notice appears immediately after the title in
`LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md`:

```markdown
> **SUPERSEDED — HISTORICAL BLUEPRINT; NOT CURRENT REQUIREMENTS**
>
> This blueprint describes an earlier, unapproved design, including the
> proposed `Legacy6Coin V2` / `L6C2` identity, a fixed 666,000 L6C lifetime
> maximum, no post-deployment minting, and no owner. Those choices were
> rejected or replaced by the founder-approved
> [Decision Record](./LEGACY6COIN-V2-ADR.md). The ADR is the sole authority for
> V2 requirements. Do not use this blueprint to implement, audit, or deploy
> V2. It is retained only as project history.
```

Keep the historical body intact unless the founder chooses to archive these
documents separately. If archived, preserve the notices and update links
accordingly; do not silently delete their project history.

## 4. Release Candidate Report wording applied

In the Founder Decisions section, the stale sentence was replaced with:

```markdown
- Final dependency and build versions are to be pinned during implementation.
```

with:

```markdown
- The current implementation configuration records Solidity `0.8.31`,
  optimizer enabled for 200 runs, EVM target `paris`, and pinned dependency
  resolutions in `package-lock.json`. The V2 dependency is OpenZeppelin
  Contracts `5.6.1` through `@openzeppelin/contracts-v2`; V1 recovery source
  uses the local `vendor/openzeppelin-contracts` snapshot. The exact source,
  configuration, and dependency files still require release freezing and
  integrity verification.
```

This is a documentation correction, not a claim that a versioned source freeze
or external audit is complete.

## 5. Release Freeze Package wording applied

The following updates were applied after the superseded notices and ADR status
changes were reviewed.

### Updated historical-document bullet under “Current freeze state and blockers”

```markdown
- The earlier V2 specification and implementation roadmap are labeled as
  superseded historical proposals. The Founder Decision Record is the sole
  authority for V2 requirements. Exclude the superseded bodies from normative
  audit requirements; include them only if historical context is specifically
  requested.
```

Retain the separate untracked-source/commit blocker if it remains true. Do not
state that a Git commit, tag, or source freeze exists until it has actually
been created and verified.

### Updated audit-package historical-documents row

```markdown
| Historical design documents | `LEGACY6COIN-V2-SPEC.md`, `LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md` | Superseded notices must be present. The ADR alone defines current V2 requirements; exclude these documents from normative audit scope. |
```

### Updated “Remaining blocker” paragraph in the Sepolia readiness section

The following wording now reflects that the documentation conflict is resolved:

```markdown
**A Sepolia rehearsal should not begin yet.** The superseded V2 documents have
been identified as historical and the ADR is the sole requirements authority.
The source still requires a reviewed freeze commit, an independent audit of
that exact frozen build, and separate explicit rehearsal authorization. No
wallet connection or transaction is part of this documentation package.
```

The source-freeze, external-audit, and explicit rehearsal-approval blockers
remain in effect.

## 6. README wording applied

The deployment metadata bullet was replaced with:

```markdown
- `deployments/sepolia.json` records the known deployment details and compiler
  settings.
```

with:

```markdown
- `deployments/sepolia.json` is a historical recovery record. Its recorded V1
  deployment date and transaction hash do not match the currently verified
  Sepolia contract-creation record; use the explorer evidence in the
  [Legacy6Coin V2 Release Candidate Report](./LEGACY6COIN-V2-RELEASE-CANDIDATE.md)
  for the verified V1 creation date and transaction. Do not treat the JSON's
  conflicting date/hash as authoritative without correction and review.
```

The following section was added after the recovery findings:

```markdown
## Legacy6Coin V2 status

Legacy6Coin V2 is a separate implementation governed by the founder-approved
[Decision Record](./LEGACY6COIN-V2-ADR.md). Its implementation and 23-test
suite exist, and a [Release Candidate Report](./LEGACY6COIN-V2-RELEASE-CANDIDATE.md)
documents the current design and readiness gates. Earlier V2 specification
and roadmap documents are superseded historical proposals and are not current
requirements. V2 has not been approved for Mainnet deployment.
```

Do not claim the 23 tests pass in the README unless the result has been checked
for the exact source revision being documented.

## 7. Edit record

The documentation-only edits applied were:

1. Updated ADR lifecycle/status and implementation gate; recorded build and
   dependency settings.
2. Marked the specification and roadmap as superseded historical proposals.
3. Updated the Release Candidate Report's build/dependency status statement.
4. Updated the README's V1 metadata caveat and V2 status.
5. Updated the Freeze Package's audit guidance, checklist, and provisional
   readiness scores while retaining outstanding freeze and audit gates.
6. Searched for legacy design and implementation-status language; remaining
   legacy tokenomics and `L6C2` mentions are within the superseded documents or
   descriptions of that history.

No Solidity or test edits are included. No deployment, wallet interaction,
transaction creation, commit, or release tag is authorized by this package.
