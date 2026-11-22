# Remix Compatibility Guidance

## Why the project build compiles

`Legacy6CoinV2.sol` imports ERC-20 from `@openzeppelin/contracts-v2`. The source project defines that npm alias in `package.json` as `npm:@openzeppelin/contracts@5.6.1`. This allows the V2 project build to resolve V2's OpenZeppelin dependency at the pinned 5.6.1 release, separately from the V1 source's local vendored OpenZeppelin snapshot under `vendor/openzeppelin-contracts`.

The `contracts-v2` name is an npm package alias, not a distinct OpenZeppelin contract implementation or version. The alias points to OpenZeppelin Contracts 5.6.1.

## Why Remix may not resolve the alias

A Remix workspace does not automatically inherit this repository's `package.json` dependency alias or its local npm installation and lockfile. Remix's import resolver may therefore fail to map `@openzeppelin/contracts-v2/...`, even though the configured project build resolves that path successfully.

## Temporary Remix compilation procedure

For a compilation rehearsal in Remix only:

1. Copy `Legacy6CoinV2.sol` into a separate Remix workspace or temporary copy. Do not edit the repository working copy.
2. In that temporary copy, replace the import with the standard package path:

   ```solidity
   import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
   ```

3. Ensure Remix resolves OpenZeppelin Contracts **5.6.1** for this dependency, using Remix's supported package import/resolution mechanism. Do not substitute the repository's vendored V1 snapshot.
4. Compile using the project's intended Solidity compiler version and settings where Remix permits. Treat this as a compatibility check only; it is not a reproducible release build or deployment authorization.
5. Keep the temporary file and resulting artifacts clearly labeled as rehearsal-only. Do not deploy from them. Discard the temporary adjustment or restore the original import after the rehearsal.

## Source and release policy

The temporary import substitution is a Remix resolver workaround; it does not by itself establish that the repository import is incorrect or that the deployed contract should change. A repository source migration requires review of dependency configuration and lockfile, a clean rebuild, the full V2 test suite, and a new source-freeze/release review. Existing deployment-history records must not be rewritten to reflect a temporary local compilation change.

Remix compatibility adjustments are rehearsal-only unless approved through a formal source-freeze and rebuild process.
