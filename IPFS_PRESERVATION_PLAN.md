# Legacy6Coin IPFS Preservation Plan

## Purpose

Preserve the Legacy6Coin branding assets for future generations.

The preservation package will retain the original sigil, portable derived
formats, source references, and documentation needed to verify and recover the
official visual identity.

## Phase 1: Local Preservation

- Preserve the original supplied image as `assets/L6C-Sigil.jpg`.
- Create a PNG representation at `assets/L6C-Sigil.png`.
- Create a scalable SVG representation at `assets/L6C-Logo.svg`.
- Record SHA-256 hashes for every archived branding file.
- Store source metadata, generation notes, and this preservation plan together.
- Do not replace or overwrite a previously published asset. Preserve a new
  version and document the change.

## Phase 2: IPFS Upload

- Upload the original JPG to IPFS.
- Upload the PNG representation to IPFS.
- Upload the SVG representation to IPFS.
- Upload or package the complete branding archive, including documentation.
- Verify every retrieved asset against its recorded hash.
- Record the CID values only after successful retrieval and independent
  verification.

## CID Records

- Official JPG CID: [TBD]
- Official PNG CID: [TBD]
- Official SVG CID: [TBD]
- Official Branding Archive CID: [TBD]

Each CID entry should include the upload date, uploader or operator, file
digest, and verification status. CIDs should not be presented as verified until
the pinned asset has been retrieved and compared with the source archive.

## Phase 3: Repository References

- Mirror the verified CIDs in `README.md`.
- Mirror the verified CIDs in `BRANDING.md`.
- Mirror them in `docs/branding.md` and `docs/ipfs-preservation.md` if those
  copies are retained.
- Do not remove earlier CID records; preserve them as archival history.
- Update this plan when a new generation of an asset is intentionally added.

## Preservation Recommendations

- Pin the archive to more than one independent IPFS provider or compatible
  storage service.
- Preserve a local archival copy outside the repository.
- Record the IPFS gateway and retrieval method used during verification.
- Keep a separate hash manifest for audit and recovery purposes.

## Verification Record

| Asset | Local SHA-256 | CID | Verified |
|---|---|---|---|
| `assets/L6C-Sigil.jpg` | `9c869cb1ba1c8986ffd0e0516d5017aa0684fa6a0ff147cf46245bf557e99f70` | [TBD] | No |
| `assets/L6C-Sigil.png` | `9576b99135039cea01893085e25ec656134c65be655e806ad752d31dcf106af2` | [TBD] | No |
| `assets/L6C-Logo.svg` | `cfa70ee223f2de4cf5c3c7a8d5406fe9765413d8d839af736a4cf656fc772614` | [TBD] | No |
| Complete branding archive | [TBD] | [TBD] | No |
