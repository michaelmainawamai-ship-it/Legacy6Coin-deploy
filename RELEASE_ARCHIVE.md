# GitHub Release Archive Recommendations

## Purpose

GitHub Releases should preserve the official Legacy6Coin source, documentation,
branding assets, and integrity evidence associated with each major milestone.
The archive establishes a stable historical record rather than relying only on
the current branch or mutable documentation.

## Why Branding Should Be Archived

The Legacy6Coin Flame Sigil is a permanent project artifact. Archiving it with
the corresponding source release preserves:

- the official asset used at that milestone;
- the relationship between code and visual identity;
- historical provenance;
- checksum evidence for subsequent verification; and
- a record of superseded branding changes.

## Why Each Major Milestone Should Have a Release

Each major Legacy6Coin milestone should correspond to an identifiable,
reviewed release record. This provides:

- an immutable Git tag or release commit;
- source and dependency evidence;
- build and test records;
- branding asset snapshots;
- deployment or test-network status; and
- explicit audit and authorization context.

## Why Historical Versions Matter

Historical versions show which source, documentation, and branding were
reviewed at a particular point. They help project maintainers, contributors,
auditors, and future archivists distinguish current work from earlier decisions
without rewriting or losing prior evidence.

Preserve prior releases even when later releases replace them. A superseded
release is historical context and should not be silently deleted.

## Recommended Release Contents

For each major release, preserve:

- the exact source commit or tag;
- the dependency manifest and lockfile;
- fresh build and test logs;
- source and dependency hash manifests;
- branding assets and branding documentation;
- audit or review records;
- test-network rehearsal records when applicable; and
- the explicit status of Mainnet authorization.

Do not include private keys, seed phrases, wallet files, local environment
files, generated caches, or unrelated workspace directories.

## Branding Archive Procedure

1. Select the reviewed branding asset versions.
2. Calculate and record their SHA-256 hashes.
3. Package the assets with the matching branding documentation.
4. Upload the package to IPFS when the archive process is approved.
5. Record all CIDs and verification results.
6. Attach the package or documented artifact references to the GitHub Release.
7. Preserve the release identifier and tag for later retrieval.

## Release Status Language

Release descriptions should distinguish:

- source candidate;
- frozen release;
- audited release;
- test-network rehearsal;
- separately authorized production release.

The source freeze or Git tag is not, by itself, deployment approval.
