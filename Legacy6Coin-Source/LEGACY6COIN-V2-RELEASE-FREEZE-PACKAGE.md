# Legacy6Coin V2 Release Freeze Package

**Status:** Freeze preparation; not a frozen release  
**Deployment status:** No deployment authorized or performed  
**Design authority:** [Founder Decision Record](./LEGACY6COIN-V2-ADR.md)  
**Implementation candidate:** `Legacy6CoinV2`

This document defines the proposed version, freeze inputs, integrity checks,
audit handoff, and readiness gates. It does not modify contract or test code,
create transactions, or establish that a Git release tag or immutable package
already exists.

## 1. Release Version Identifier

**Recommended candidate identifier:** `2.0.0-rc.1`

Use Semantic Versioning for the source-code release:

- `2` is the major release: V2 is a separate contract with new mint,
  ownership, witness, and supply-control behavior. It is not a V1 upgrade.
- `0` is the minor version.
- `0` is the patch version.
- `rc.1` means the first release candidate, not an approved production
  release.

This identifier is not the ERC-20 name or symbol. The token remains
`Legacy6Coin` / `L6C` under the ADR. The version belongs in Git tags, audit
records, and package names, not as an implied new on-chain token symbol.

Use an annotated Git tag such as `v2.0.0-rc.1` only after the freeze commit is
reviewed. Any source, test, dependency, compiler-setting, or requirements
change after the tag requires a new candidate tag (for example
`v2.0.0-rc.2`) and a new audit of the changed release. Reserve `v2.0.0` for a
separately approved final release; the tag itself must never be treated as
deployment authorization.

## 2. Release Freeze Checklist

### Exact freeze inputs

Commit and hash the following project files as one reviewed release candidate.
The ADR is the sole authority for V2 requirements. The specification and
roadmap are included only as clearly labeled superseded historical context;
they are not normative audit requirements.

1. `contracts/Legacy6CoinV2.sol` — V2 production contract and primary audit
    target.
2. `contracts/Legacy6Coin.sol` — recovered V1 source, reference-only; not the
    V2 audit target.
3. `test/Legacy6CoinV2.ts` — the 23-test suite.
4. `LEGACY6COIN-V2-ADR.md` — approved design authority.
5. `LEGACY6COIN-V2-SPEC.md` — include only as clearly labeled superseded
    history; do not treat as normative requirements.
6. `LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md` — include only as clearly labeled
    superseded history; do not treat as normative requirements.
7. `LEGACY6COIN-V2-RELEASE-CANDIDATE.md` — current release-candidate report,
    including the verified V1 deployment date of 2026-01-07 15:23:48 UTC.
8. `LEGACY6COIN-V2-RELEASE-FREEZE-PACKAGE.md` — this package manifest and
    process.
9. `LEGACY6COIN-V2-RELEASE-FREEZE-EXECUTION-PLAN.md` — reviewed freeze
    procedure.
10. `LEGACY6COIN-V2-DOCUMENTATION-CLEANUP-PACKAGE.md` and
     `LEGACY6COIN-V2-DOCUMENTATION-CHANGE-REPORT.md` — documentation change
     record and consistency validation.
11. `package.json` and `package-lock.json` — declared and resolved dependency
    graph.
12. `hardhat.config.ts` and `tsconfig.json` — Solidity and TypeScript build
    configuration.
13. `README.md` and `HARDHAT.md` — build and project instructions, after
    checking they do not conflict with the ADR.
14. The following individual files from the vendored V1 dependency:
     - `vendor/openzeppelin-contracts/access/Ownable.sol`
     - `vendor/openzeppelin-contracts/interfaces/draft-IERC6093.sol`
     - `vendor/openzeppelin-contracts/package.json`
     - `vendor/openzeppelin-contracts/README.md`
     - `vendor/openzeppelin-contracts/security/ReentrancyGuard.sol`
     - `vendor/openzeppelin-contracts/token/ERC20/ERC20.sol`
     - `vendor/openzeppelin-contracts/token/ERC20/extensions/IERC20Metadata.sol`
     - `vendor/openzeppelin-contracts/token/ERC20/IERC20.sol`
     - `vendor/openzeppelin-contracts/utils/Context.sol`
     - `vendor/openzeppelin-contracts/utils/math/Math.sol`
     - `vendor/openzeppelin-contracts/utils/math/SafeCast.sol`
     - `vendor/openzeppelin-contracts/utils/math/SignedMath.sol`
     - `vendor/openzeppelin-contracts/utils/Panic.sol`
     - `vendor/openzeppelin-contracts/utils/Strings.sol`

The following are audit evidence, not freeze-commit inputs: `release-files.txt`,
`SHA256SUMS.txt`, fresh build and test logs, tool-version records, and the exact
OpenZeppelin Contracts 5.6.1 source archive or source tree resolved by
`package-lock.json`. Generate the manifests and logs from the frozen commit
and retain them in a separate audit-evidence bundle. Verify the OpenZeppelin
source against the lockfile's resolved URL and integrity value, and record its
SHA-256 digest. Do not add the archive or all of `node_modules` to Git.

Exclude `.agents/` and `.claude/` skill files, `AGENTS.md`, `CLAUDE.md`,
`deployments/sepolia.json`, `node_modules`, build artifacts, caches,
credentials, wallet files, and `.env` files from the freeze commit. Exclusion
means leave these files unstaged; it does not mean delete them.

Do not silently edit any of these inputs after hashing or tagging. Any change
requires a new freeze commit, regenerated hashes and logs, and a new RC tag.

### Current freeze state and blockers

- The repository currently reports `Legacy6Coin-Source/` as untracked. The
  project therefore does not yet have a versioned freeze commit. Create and
  review a Git commit before claiming a source freeze.
- The earlier V2 specification and implementation roadmap are labeled as
  superseded historical proposals and included in the freeze commit only as
  historical context. The Founder Decision Record is the sole authority for V2
  requirements; exclude the superseded proposals from normative audit
  requirements.
- `deployments/sepolia.json` contains older V1 transaction/date metadata that
  conflicts with the explorer-verified creation record in the current
  Release Candidate Report. Do not include that JSON as authoritative
  deployment evidence. If V1 history is needed, include it as explicitly
  superseded context alongside the explorer links and corrected date.
- There are no deployment scripts in the current `scripts/` or `ignition/`
  directories. This package must not add or imply one.

### Freeze confirmation

- [x] Confirm the ADR is the sole V2 requirements authority and the older
  specification and roadmap are labeled as superseded history.
- [ ] Review all freeze inputs and confirm the exact witness list, ownership,
  issuance, and burn behavior against the ADR.
- [ ] Record the source commit, branch, candidate identifier, and file hashes.
- [ ] Run a clean dependency install from the lock file and record environment
  versions.
- [ ] Rebuild and run all 23 tests from the frozen commit; archive full logs.
- [ ] Have an independent reviewer compare the committed tree with the audit
  bundle and hash manifest.
- [ ] Create an annotated RC tag only after the above checks pass.
- [ ] Confirm the release bundle contains no secrets, wallet files, local
  environment files, node_modules, artifacts, cache, or unreviewed deployment
  material.

## 3. Source Integrity Plan

### Hash generation

Generate SHA-256 hashes for every file in the release allowlist, including
Solidity files, tests, design documents, build files, lockfile, and vendored
dependency files. Use repository-relative paths with `/` separators in a
sorted manifest. Keep generated compiler artifacts and caches out of the
source manifest; if bytecode or ABI outputs are archived, hash them in a
separate build-output manifest. Hash the separate OpenZeppelin Contracts
5.6.1 audit dependency in a dependency checksum manifest, not in the source
freeze manifest.

Example PowerShell procedure from the `Legacy6Coin-Source` directory after
the freeze commit exists. Keep the evidence directory outside the Git working
tree:

```powershell
$evidenceDir = Join-Path $env:USERPROFILE 'Legacy6Coin-V2-audit-evidence'
New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
$files = Get-Content (Join-Path $evidenceDir 'release-files.txt')
$rows = foreach ($file in ($files | Sort-Object)) {
    $path = Join-Path (Get-Location) $file
    $hash = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  $($file -replace '\\', '/')"
}
$rows | Set-Content -Encoding ascii (Join-Path $evidenceDir 'SHA256SUMS.txt')
Get-FileHash (Join-Path $evidenceDir 'SHA256SUMS.txt') -Algorithm SHA256
```

The allowlist must enumerate individual files; directory entries such as
`vendor/openzeppelin-contracts/**` must be expanded to all contained files.
Review the output before signing or publishing the manifest. Do not include
the evidence files in the list of frozen source files or hash `SHA256SUMS.txt`
as one of its own inputs. Include a separate dependency checksum manifest for
the OpenZeppelin Contracts 5.6.1 audit source and record its lockfile integrity
value.

### Later verification

1. Obtain the manifest from the signed release tag or another authenticated,
   read-only release archive.
2. Verify the manifest signature and compare its commit ID and tag with the
   approved release record.
3. Recompute each file's SHA-256 digest from a clean checkout and compare the
   exact path-and-hash pairs. Any missing, extra, or mismatched file is a
   failed verification.
4. Confirm the lockfile and dependency package hashes match the frozen package.
5. Re-run the recorded build and tests; compare compiler settings and, where
   reproducible, bytecode hashes. A matching source hash alone does not prove
   the compiler or build environment was correct.
6. Record who verified the package, when, on which commit, and the result.

Publish checksums with the tag and preserve a signed copy outside the
repository. Do not rely on an editable checksum file in the same untrusted
location as the files being checked.

## 4. Git Release Process

### Commit strategy

1. Start from a reviewed base branch and create a dedicated branch such as
   `release/legacy6coin-v2`.
2. Verify the ADR as the sole requirements authority and confirm that
   historical proposals are clearly marked as superseded.
3. Commit the release inputs as a coherent, reviewable freeze commit. Keep
   generated evidence (hash manifest and logs) in a clearly named release
   directory or attach it to the release record; do not commit secrets or
   machine-specific files.
4. Require a second-person review of the diff, manifest, build output, and
   test logs. Record the full commit hash in the audit request.
5. If any audited input changes, create a new commit and candidate version;
   never rewrite the audited commit or move its tag.

This is a process recommendation only. No commit or branch has been created
for this package.

### Tag strategy

- Tag the reviewed freeze commit with an annotated
  `v2.0.0-rc.1` tag and include a message stating that it is test/audit
  candidate material, not deployment approval.
- Sign the tag where the project maintainers have a verified signing-key
  process. Publish the commit ID and package checksum with the audit request.
- Never force-move or delete a published release tag.
- Create `v2.0.0-rc.2` or later for any post-audit changes. Use `v2.0.0` only
  after audit findings, rehearsal gates, and separate founder authorization
  are complete.

### Branch protection recommendations

- Protect the default and release branches from direct pushes and force pushes.
- Require pull requests, at least one independent approval, and passing
  build/test status checks before merge.
- Require signed commits or verified identities where supported.
- Restrict release-tag creation to designated maintainers and prohibit
  tag deletion or force-update.
- Keep deployment permissions and credentials separate from source review;
  do not store wallet secrets in repository settings, files, or CI logs.

## 5. Audit Package Contents

The external audit bundle should contain:

| Category | Files or evidence | Notes |
|---|---|---|
| V2 contract | `contracts/Legacy6CoinV2.sol` | Primary scope; exact frozen commit. |
| V1 reference | `contracts/Legacy6Coin.sol` | Context only; explicitly not the V2 audit target. |
| Tests | `test/Legacy6CoinV2.ts` | Current suite has 23 passing tests by task assumption; include fresh logs. |
| Design authority | `LEGACY6COIN-V2-ADR.md` | Binding approved design; supersedes conflicting historical drafts. |
| Historical design documents | `LEGACY6COIN-V2-SPEC.md`, `LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md` | Superseded notices must be present. The ADR alone defines current V2 requirements; exclude these documents from normative audit scope. |
| Release report | `LEGACY6COIN-V2-RELEASE-CANDIDATE.md` | Includes known risks, corrected V1 date, and test summary. |
| Freeze policy and evidence | `LEGACY6COIN-V2-RELEASE-FREEZE-PACKAGE.md`, `LEGACY6COIN-V2-RELEASE-FREEZE-EXECUTION-PLAN.md`; generated file list and checksums | The two policy documents are committed. Generate `release-files.txt` and `SHA256SUMS.txt` from the frozen commit and provide them separately as audit evidence. |
| Dependency manifests | `package.json`, `package-lock.json` | Include lockfile and resolved dependency information. |
| Build settings | `hardhat.config.ts`, `tsconfig.json` | Solidity 0.8.31; optimizer enabled, 200 runs; EVM `paris`. |
| Dependency source | Individual files under `vendor/openzeppelin-contracts/`; exact OpenZeppelin Contracts 5.6.1 source archive or source tree | Commit and hash the V1 local dependency. Provide the exact V2 dependency separately as audit evidence, verified against the lockfile and separately checksummed. |
| Build instructions | `README.md`, `HARDHAT.md` | Include only after confirming they match actual commands and ADR. |
| Build evidence | Clean install, build, type-check, and test logs; tool versions | Recreate from the frozen commit; do not substitute logs from an earlier tree. |
| Integrity evidence | Source SHA-256 manifest, dependency checksum manifest, and authenticated manifest digest | Provide as audit evidence; distinguish frozen source files, external dependencies, and generated build outputs. |

Dependency versions recorded by the current lockfile:

- Solidity compiler setting: `0.8.31`, optimizer 200 runs, EVM `paris`.
- Hardhat: `3.21.2`.
- `@nomicfoundation/hardhat-toolbox-viem`: `5.0.7`.
- `@types/node`: `22.20.5`.
- TypeScript: `6.0.3`.
- viem: `2.57.16`.
- V2 import package `@openzeppelin/contracts-v2`: OpenZeppelin Contracts
  `5.6.1`.
- V1 import package `@openzeppelin/contracts`: local
  `vendor/openzeppelin-contracts` snapshot, to be frozen and hashed.

Do not send `node_modules`, Hardhat artifacts/cache, local wallet files,
secrets, or an unreviewed deployment record as part of the source package.
`deployments/sepolia.json` and `LEGACY6COIN-V2-SPEC.md` should not be treated
as authoritative V2 inputs; the former has stale V1 deployment metadata and
the latter contains an obsolete design proposal.

## 6. Independent Audit Preparation

### What to provide

Provide the auditor with the complete contents in section 5, plus:

- A short scope letter identifying `Legacy6CoinV2` as the contract under
  review and V1 files as reference-only.
- The exact commit ID, immutable RC tag, checksum manifest, compiler and
  dependency versions, and commands used to build and test.
- The 23-test suite and full fresh logs, including failures if any; do not
  present test count as proof of security.
- The finalized ADR as the sole requirements authority. Include the
  specification and roadmap as clearly labeled superseded historical context;
  exclude their proposals from normative requirements.
- The recovered V1 vulnerability context: `addWitness` could exceed the V1
  supply cap, which V2 intends to fix by applying one lifetime cap to every
  issuance path.
- Known administrative and economic risks, including founder-controlled
  minting and the initial owner/deployer relationship.
- A written statement that no V2 deployment has been authorized and that the
  auditor is not being asked to sign transactions, access wallets, or handle
  keys.

### Questions for the auditor

1. Can any constructor allocation, `mint`, or `addWitness` path exceed the
   lifetime cap, including at the exact cap boundary?
2. Is `totalMinted` monotonic and correctly independent from `totalSupply()`
   after every possible burn sequence?
3. Can zero, duplicate, or otherwise invalid witness inputs alter balances,
   witness state, or events on failure?
4. Are initial allocations and the founder/witness #6 overlap correct and
   observable through the intended events?
5. Can any non-owner mint, onboard witnesses, or propose an ownership change?
6. Can ownership transfer be accepted by the wrong account, become stuck, or
   be irreversibly renounced despite the approved design?
7. Does self-burn permit burning another account's tokens or otherwise bypass
   expected ERC-20 balance and allowance rules?
8. Are ERC-20 transfers, approvals, and delegated transfers standard and
   free of hidden restrictions, taxes, or blacklist behavior?
9. Are there compiler, dependency, reentrancy, arithmetic, access-control,
   event, denial-of-service, or integration concerns not covered by tests?
10. Are the build and bytecode reproducible from the committed source,
    dependency lock, compiler settings, and documented toolchain?
11. Which missing tests, fuzz campaigns, invariants, or static-analysis checks
    are necessary before testnet rehearsal or Mainnet consideration?
12. What findings remain, what severity and confidence should be assigned,
    and which are deployment blockers?

## 7. Sepolia Rehearsal Readiness Review

### Prerequisites

- [x] Founder design decisions are finalized in the ADR.
- [x] V1 creation date has been corrected in the Release Candidate Report to
  **2026-01-07 15:23:48 UTC**, based on the verified Sepolia explorer record.
- [x] The requested release-candidate assumptions state that compilation
  succeeds and all 23 tests pass.
- [ ] Commit and tag the exact release candidate; it is currently not frozen.
- [x] Label the historic specification and roadmap as superseded, and establish
  the ADR as the sole requirements authority.
- [ ] Obtain an independent external audit of the exact frozen source and
  resolve or explicitly accept findings.
- [ ] Reproduce a clean install, build, type-check, and all tests from the
  frozen commit; archive logs and hashes.
- [ ] Verify all six witness addresses and deployment account independently.
- [ ] Confirm the owner-key custody plan and rehearsal-only test account.
- [ ] Complete an independently reviewed Sepolia transaction manifest and
  obtain separate, explicit approval for any rehearsal deployment.
- [ ] Prepare post-deployment checks for owner, token metadata, balances,
  `totalSupply`, `totalMinted`, witness state, events, and explorer source
  verification.

### Remaining blocker

**A Sepolia rehearsal should not begin yet.** The superseded V2 documents are
identified as historical and the ADR is the sole requirements authority. The
source still requires a reviewed freeze commit, an independent audit of that
exact frozen build, and separate explicit rehearsal authorization. No wallet
connection or transaction is part of this documentation package.

## 8. Updated Readiness Score

These are provisional project-readiness estimates, not audit grades,
probabilities of safety, or deployment approvals. They assume the stated
successful compilation and 23 passing tests.

| Area | Score | Basis |
|---|---:|---|
| Design readiness | **100/100** | Founder-level V2 decisions are finalized; deployment approval remains a separate gate. |
| Implementation readiness | **90/100** | Implementation and test completion are assumed, and documentation is aligned; no versioned source freeze exists. |
| Audit readiness | **70/100** | The ADR is clear and superseded proposals are labeled; the exact release still needs a frozen, hash-verifiable package and an external audit. |
| Sepolia rehearsal readiness | **50/100** | Documentation conflicts are resolved, but source freeze, external audit, reproducible release evidence, and separate rehearsal approval remain outstanding. |
| Release freeze readiness | **45/100** | Documentation is aligned, but project source remains untracked and there is no reviewed freeze commit, release hash manifest, fresh frozen-tree build/test evidence, or immutable RC tag. |
| Mainnet readiness | **15/100** | Mainnet is not approved; a final audit, rehearsal, owner-custody decision, and separate founder go/no-go are outstanding. |

## 9. Founder Recommendation

### What should happen next

1. Confirm that the ADR remains the sole V2 design authority.
2. Review the freeze allowlist, commit the exact source/tests/configuration,
   generate and independently verify hashes, and tag `v2.0.0-rc.1`.
3. Deliver the frozen package to an independent external auditor and address
   findings with a new RC version for every code or configuration change.
4. After audit completion, request a separate founder decision to perform a
   Sepolia rehearsal and follow the approved checklist.

### What should not happen yet

- Do not deploy to Mainnet or treat this document, an RC tag, or passing tests
  as deployment approval.
- Do not perform a Sepolia deployment before the documented freeze and audit
  blockers are cleared and explicit rehearsal approval is given.
- Do not change contract code, tests, dependencies, or compiler settings under
  the existing RC identifier after its source hashes are published.
- Do not connect a wallet, expose a private key or seed phrase, or create a
  deployment transaction as part of this release-preparation work.
- Do not use the stale deployment metadata or superseded V2 design documents
  as authoritative release inputs.
