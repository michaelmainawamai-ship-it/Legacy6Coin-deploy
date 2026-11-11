# Legacy6Coin V2 Release Freeze Execution Plan

**Status:** Instructions only; no freeze actions have been performed  
**Design authority:** [Founder Decision Record](./LEGACY6COIN-V2-ADR.md)  
**Recommended candidate:** `v2.0.0-rc.1`  
**Safety:** This plan does not deploy a contract, connect a wallet, or create
transactions.

This guide explains how to preserve the exact reviewed V2 source as a Git
commit, produce SHA-256 integrity evidence, create an annotated release
candidate tag, and prepare the package for an auditor. A Git commit or tag
records files; it does not deploy anything or approve Mainnet.

## Before starting

1. Read the [Release Freeze Package](./LEGACY6COIN-V2-RELEASE-FREEZE-PACKAGE.md)
   and confirm the ADR remains the only V2 requirements authority.
2. Confirm that `LEGACY6COIN-V2-SPEC.md` and
   `LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md` visibly say they are superseded
   historical documents.
3. Use a second person to review the release file list and source tree before
   staging.
4. Do not copy private keys, seed phrases, `.env` files, wallets, or credentials
   into the repository or release package.
5. Do not stage the stale `deployments/sepolia.json` as authoritative V2
   evidence. It is an old V1 recovery record with date/transaction details
   that conflict with explorer-verified evidence.
6. Never use `git add .` or `git add -A` for this first freeze. The project is
   currently untracked, so those commands could accidentally include
   generated files or unrelated material.

The commands below are examples for Windows PowerShell. Read each command and
its output before continuing. Stop if the results differ from the expected
state.

## 1. Review the current Git state

Open PowerShell and go to the repository root:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy'
git status --short
git branch --show-current
git log -1 --oneline
```

In beginner terms:

- `git status --short` lists changed and untracked files.
- `git branch --show-current` tells you which branch you are on.
- `git log -1 --oneline` shows the latest commit.

The project directory may appear as `?? Legacy6Coin-Source/`, meaning Git has
not started tracking its files yet. That is expected from the last inspection.
If you see changes outside this project, or files you do not recognize, stop
and ask the project owner before staging.

Create a separate release branch from the current reviewed base:

```powershell
git switch -c release/legacy6coin-v2
```

If Git says the branch already exists, do not delete or overwrite it. Inspect
it with `git branch --list` and ask the maintainer which branch to use.

## 2. Stage only the reviewed release files

First, inspect the project contents:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy\Legacy6Coin-Source'
Get-ChildItem -Force
git -C 'C:\Users\user\Legacy6Coin-deploy' status --short
```

Stage explicit paths from the repository root. This sample includes the
production V2 and reference V1 sources, tests, approved/current release
documents, build files, and every individually allowlisted V1 dependency file.
It matches the source freeze allowlist in the Release Freeze Package.

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy'
git add `
  Legacy6Coin-Source/contracts/Legacy6CoinV2.sol `
  Legacy6Coin-Source/contracts/Legacy6Coin.sol `
  Legacy6Coin-Source/test/Legacy6CoinV2.ts `
  Legacy6Coin-Source/LEGACY6COIN-V2-ADR.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-SPEC.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-RELEASE-CANDIDATE.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-RELEASE-FREEZE-PACKAGE.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-DOCUMENTATION-CLEANUP-PACKAGE.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-DOCUMENTATION-CHANGE-REPORT.md `
  Legacy6Coin-Source/LEGACY6COIN-V2-RELEASE-FREEZE-EXECUTION-PLAN.md `
  Legacy6Coin-Source/README.md `
  Legacy6Coin-Source/HARDHAT.md `
  Legacy6Coin-Source/package.json `
  Legacy6Coin-Source/package-lock.json `
  Legacy6Coin-Source/hardhat.config.ts `
  Legacy6Coin-Source/tsconfig.json `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/access/Ownable.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/interfaces/draft-IERC6093.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/package.json `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/README.md `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/security/ReentrancyGuard.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/token/ERC20/ERC20.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/token/ERC20/extensions/IERC20Metadata.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/token/ERC20/IERC20.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/utils/Context.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/utils/math/Math.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/utils/math/SafeCast.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/utils/math/SignedMath.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/utils/Panic.sol `
  Legacy6Coin-Source/vendor/openzeppelin-contracts/utils/Strings.sol
```

Do not blindly run this list if a path is missing or has changed purpose. The
specification and roadmap are staged only as explicitly superseded history,
not as requirements. The OpenZeppelin V1 dependency files are included because
they are part of the recovered project. Leave excluded files, generated
evidence, and the OpenZeppelin 5.6.1 package archive out of this commit.

The exact OpenZeppelin 5.6.1 dependency used by V2 is resolved by
`package-lock.json`; it is not the V1 `vendor/openzeppelin-contracts`
snapshot. Include an unchanged copy of that exact package source or its
verified registry archive in the auditor's separate bundle. Compare it with
the lockfile's resolved URL and integrity value, then record its SHA-256
alongside the bundle evidence. Do not add all of `node_modules` to Git.

Review the staged list carefully:

```powershell
git status --short
git diff --cached --stat
git diff --cached --check
```

In beginner terms:

- `git status` shows what is staged (`A` means a new file).
- `git diff --cached --stat` gives a summary of staged files.
- `git diff --cached --check` looks for whitespace mistakes.

If the staged list includes `node_modules`, artifacts, cache, wallet files,
`.env`, the stale deployment JSON, or anything unexpected, unstage only those
specific paths and inspect why they were included. Do not proceed until the
list matches the reviewed release allowlist.

## 3. Create the freeze commit

Before committing, have an independent reviewer check the staged source,
tests, ADR, documents, build settings, and staged file list. Then commit:

```powershell
git commit -m "Freeze Legacy6Coin V2 release candidate 2.0.0-rc.1"
```

The commit is the saved snapshot of the exact staged files. It does not change
the Solidity code; it records the reviewed files in Git.

Record the full commit ID and confirm the working tree is clean:

```powershell
$commit = git rev-parse HEAD
$commit
git status --short
git show --stat --oneline HEAD
```

Save the full commit ID in the release record. `git status --short` should
print no project changes. If it lists changes, do not create the tag yet:
determine whether they are generated files, accidental edits, or omitted
release files. Any change to an intended release input means the commit must
be reviewed again.

Do not amend or rewrite this commit after it is audited. If a release input
needs to change, create a new reviewed commit and use a new candidate tag such
as `v2.0.0-rc.2`.

## 4. Generate the SHA-256 file manifest

### What a SHA-256 hash means

A SHA-256 hash is a long fingerprint calculated from a file's contents. If
even one character changes, its fingerprint should change. The hash does not
prove that the file is correct; it helps prove later that the file still
matches the reviewed version.

### Create the audit-evidence file list

Generate evidence from a clean checkout of the freeze commit. Store the
evidence outside the Git working tree. This explicit list matches the Release
Freeze Package allowlist and expands the local V1 vendor dependency into
individual paths:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy\Legacy6Coin-Source'
$evidenceDir = Join-Path $env:USERPROFILE 'Legacy6Coin-V2-audit-evidence'
New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null

$files = @(
  'contracts/Legacy6CoinV2.sol',
  'contracts/Legacy6Coin.sol',
  'test/Legacy6CoinV2.ts',
  'LEGACY6COIN-V2-ADR.md',
  'LEGACY6COIN-V2-SPEC.md',
  'LEGACY6COIN-V2-IMPLEMENTATION-ROADMAP.md',
  'LEGACY6COIN-V2-RELEASE-CANDIDATE.md',
  'LEGACY6COIN-V2-RELEASE-FREEZE-PACKAGE.md',
  'LEGACY6COIN-V2-RELEASE-FREEZE-EXECUTION-PLAN.md',
  'LEGACY6COIN-V2-DOCUMENTATION-CLEANUP-PACKAGE.md',
  'LEGACY6COIN-V2-DOCUMENTATION-CHANGE-REPORT.md',
  'README.md',
  'HARDHAT.md',
  'package.json',
  'package-lock.json',
  'hardhat.config.ts',
  'tsconfig.json',
  'vendor/openzeppelin-contracts/access/Ownable.sol',
  'vendor/openzeppelin-contracts/interfaces/draft-IERC6093.sol',
  'vendor/openzeppelin-contracts/package.json',
  'vendor/openzeppelin-contracts/README.md',
  'vendor/openzeppelin-contracts/security/ReentrancyGuard.sol',
  'vendor/openzeppelin-contracts/token/ERC20/ERC20.sol',
  'vendor/openzeppelin-contracts/token/ERC20/extensions/IERC20Metadata.sol',
  'vendor/openzeppelin-contracts/token/ERC20/IERC20.sol',
  'vendor/openzeppelin-contracts/utils/Context.sol',
  'vendor/openzeppelin-contracts/utils/math/Math.sol',
  'vendor/openzeppelin-contracts/utils/math/SafeCast.sol',
  'vendor/openzeppelin-contracts/utils/math/SignedMath.sol',
  'vendor/openzeppelin-contracts/utils/Panic.sol',
  'vendor/openzeppelin-contracts/utils/Strings.sol'
)

$files = $files | Sort-Object -Unique
$files | Set-Content -Encoding ascii (Join-Path $evidenceDir 'release-files.txt')
```

Before hashing, verify every named file exists:

```powershell
$missing = $files | Where-Object { -not (Test-Path -LiteralPath $_ -PathType Leaf) }
if ($missing) {
  $missing
  throw 'A file in the release list is missing. Stop and review the allowlist.'
}
```

Write a sorted hash manifest:

```powershell
$rows = foreach ($file in $files) {
  $hash = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
  "$hash  $($file.Replace('\', '/'))"
}
$rows | Set-Content -Encoding ascii (Join-Path $evidenceDir 'SHA256SUMS.txt')
Get-FileHash (Join-Path $evidenceDir 'SHA256SUMS.txt') -Algorithm SHA256
```

Review `SHA256SUMS.txt` and save its own SHA-256 value in the release record.
Both `release-files.txt` and `SHA256SUMS.txt` are audit evidence, not files in
the freeze commit. Do not include either evidence file in the list of frozen
source files or hash `SHA256SUMS.txt` as one of its own inputs. Retain the
files and the manifest's authenticated digest in the separate audit-evidence
bundle.

Keep the manifest and its recorded digest in the authenticated audit/release
bundle, not as an unreviewed edit to the committed source tree. This avoids
changing the freeze commit after computing its fingerprints. If the manifest
is attached to the Git release, its full digest should be included in the tag
message and the manifest should be signed or stored in an independently
authenticated location.

The OpenZeppelin 5.6.1 package source used by the V2 import is a separate
dependency from the local V1 vendor tree. Include the exact lockfile-resolved
source archive or source tree in the audit bundle and add it to a separate
dependency checksum manifest. Record its SHA-256 digest and the lockfile's
integrity value. Do not add it to the freeze commit or source checksum list.

## 5. Verify the frozen release before audit

Do these checks against a clean checkout of the commit, not a possibly edited
working folder:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy'
git status --short
git rev-parse HEAD
git show --stat --oneline HEAD
```

Confirm the commit ID matches the recorded freeze commit and that the status
is clean. Then, from the project directory, reproduce the local build and test
checks:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy\Legacy6Coin-Source'
npm.cmd ci
npx.cmd hardhat build
npx.cmd tsc --noEmit
npx.cmd hardhat test nodejs
```

`npm.cmd ci` installs the exact dependency versions recorded in the lockfile.
The Hardhat build compiles locally; the type-check checks TypeScript; the test
command runs the local test suite. These commands do not connect to a wallet,
Sepolia, or Mainnet. Capture their full output and record the Node.js and npm
versions used:

```powershell
node --version
npm.cmd --version
```

If any command fails, stop and investigate. Do not label the release as
verified using old test results. Fixes to contract code, tests, dependencies,
compiler settings, or other frozen files require a new commit, new hashes,
fresh validation, and a new release-candidate version.

Check the documentation package and scope:

- The ADR is the only V2 requirements authority.
- The V2 specification and roadmap are marked superseded and are historical
  only.
- The Release Candidate Report and Freeze Package identify the correct current
  V1 deployment date and state that Mainnet is not approved.
- No stale deployment record is presented as authoritative V2 evidence.
- The audit bundle does not contain `node_modules`, generated build artifacts,
  caches, credentials, wallet data, or `.env` files.
- The auditor receives the exact source commit, tests, compiler settings,
  lockfile, dependency sources, checksums, and fresh build/test logs.

An independent reviewer should compare the audit bundle's file list and hashes
with the reviewed commit. Only after these checks should the package be
handed to an auditor.

## 6. Create the annotated RC tag

Create the tag only after:

- the freeze commit has been reviewed,
- the working tree is clean,
- clean build and test checks pass,
- the source and dependency hash manifests are reviewed, and
- an independent reviewer confirms the bundle matches the commit.

From the repository root:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy'
$evidenceDir = Join-Path $env:USERPROFILE 'Legacy6Coin-V2-audit-evidence'
$commit = git rev-parse HEAD
$manifestHash = (Get-FileHash (Join-Path $evidenceDir 'SHA256SUMS.txt') -Algorithm SHA256).Hash.ToLowerInvariant()
$tagMessage = "Legacy6Coin V2 v2.0.0-rc.1; source/audit candidate only; not deployment approval. Commit: $commit. SHA256SUMS SHA-256: $manifestHash"
git tag -a 'v2.0.0-rc.1' -m $tagMessage
```

An annotated tag is a named Git record with a message, attached to the exact
freeze commit. Where a verified signing-key process exists, use a signed
annotated tag (`git tag -s`) instead of `-a`; do not create or manage signing
keys as part of this plan.

Verify where the tag points:

```powershell
git show --no-patch --decorate 'v2.0.0-rc.1'
git rev-parse 'v2.0.0-rc.1^{commit}'
git rev-parse HEAD
git tag -v 'v2.0.0-rc.1'
```

The two commit IDs must match. `git tag -v` is useful for a signed tag; with
an unsigned annotated tag it can report that no signature is available. If
the team requires signed tags, absence or failure of signature verification
is a stop condition.

Do not move or delete a published tag. Do not push the branch or tag until the
maintainer has reviewed and authorized publication. A candidate tag is not
deployment approval.

## 7. Verify hashes later

An auditor or maintainer can verify the release on another computer:

1. Obtain the source from the authenticated Git repository or trusted release
   archive.
2. Check out the exact RC tag:

   ```powershell
   git clone https://github.com/michaelmainawamai-ship-it/Legacy6Coin-deploy.git Legacy6Coin-audit
   Set-Location 'Legacy6Coin-audit'
   git checkout 'v2.0.0-rc.1'
   git rev-parse HEAD
   git show --no-patch --decorate 'v2.0.0-rc.1'
   git tag -v 'v2.0.0-rc.1'
   ```

   Compare the commit ID with the one in the release record. Verify the tag
   signature if the tag is signed. Set the evidence directory variable and
   enter the project subfolder:

   ```powershell
   $evidenceDir = Join-Path $env:USERPROFILE 'Legacy6Coin-V2-audit-evidence'
   Set-Location '.\Legacy6Coin-Source'
   ```

3. Obtain `SHA256SUMS.txt` and its authenticated expected digest. Calculate
   the manifest's current digest from the separate evidence directory:

   ```powershell
   Get-FileHash (Join-Path $evidenceDir 'SHA256SUMS.txt') -Algorithm SHA256
   ```

   If this digest differs from the recorded digest, stop; the manifest itself
   may have been replaced.

4. From the `Legacy6Coin-Source` directory, compare each listed file's current
hash with the manifest:

```powershell
foreach ($line in Get-Content (Join-Path $evidenceDir 'SHA256SUMS.txt')) {
     if ($line -notmatch '^([0-9a-fA-F]{64})  (.+)$') {
       throw "Invalid checksum line: $line"
     }
     $expected = $Matches[1].ToLowerInvariant()
     $file = $Matches[2]
     if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
       throw "Missing release file: $file"
     }
     $actual = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
     if ($actual -ne $expected) {
       throw "HASH MISMATCH: $file"
     }
     Write-Output "OK  $file"
   }
   ```

5. Confirm there are no uncommitted edits or unexpected extra files:

   ```powershell
   git status --short
   ```

   If a required file is missing, a hash differs, or the tree is unexpectedly
   modified, the release did not verify. Do not edit the file to make its hash
   match. Retrieve the correct version from the trusted tag and investigate
   the difference.

6. Re-run the clean build/tests and compare the results with the archived
   logs. Verify the OpenZeppelin dependency archive/source against its
   separately recorded checksums and the package lockfile.

## 8. Final release-to-audit checklist

- [ ] ADR confirmed as the only current V2 requirements authority.
- [ ] Superseded specification and roadmap clearly labeled and excluded from
  normative audit requirements.
- [ ] Exact allowlisted files reviewed and staged; no `git add .` or
  `git add -A` was used.
- [ ] Freeze commit created, independently reviewed, and recorded by full ID.
- [ ] Clean working tree confirmed at that commit.
- [ ] Clean install, build, type-check, and all 23 tests rerun on that commit;
  logs and tool versions preserved.
- [ ] Source and dependency hashes generated from that exact commit and
  independently checked.
- [ ] Annotated `v2.0.0-rc.1` tag points to the recorded commit; signature
  verified if required by the release policy.
- [ ] Audit package contains only reviewed source, documentation, tests,
  dependency material, and evidence.
- [ ] No private keys, seed phrases, wallets, credentials, `.env` files,
  `node_modules`, build cache, or unintended deployment files included.
- [ ] Auditor receives the exact tag, commit, manifest digest, dependencies,
  build settings, and fresh test logs.
- [ ] Separate explicit approval is obtained before any Sepolia rehearsal.
- [ ] Mainnet remains unapproved unless and until the founder makes a separate
  explicit go/no-go decision.

**Current state:** This plan does not perform any freeze step. The Git status
last observed showed `Legacy6Coin-Source/` as untracked. A reviewed commit,
hash manifest, fresh frozen-tree validation, and RC tag still need to be
created before the candidate can be described as frozen.
