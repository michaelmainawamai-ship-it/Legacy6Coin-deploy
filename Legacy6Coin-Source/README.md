# Legacy6Coin source recovery

This folder contains the source recovered for the deployed Legacy6Coin (L6C)
contract. The original repository checkout contained documentation and
supporting files, but no Solidity source.

## What has been recovered

- `contracts/Legacy6Coin.sol` is the contract source returned by the verified
  contract record. It has not been edited.
- `vendor/openzeppelin-contracts/` contains the 12 imported source files
  returned with that verified record. They are saved locally so the original
  `@openzeppelin/contracts/...` imports can be resolved without guessing a
  library version.
- `deployments/sepolia.json` is a historical recovery record. Its recorded V1
  deployment date and transaction hash do not match the currently verified
  Sepolia contract-creation record; use the explorer evidence in the
  [Legacy6Coin V2 Release Candidate Report](./LEGACY6COIN-V2-RELEASE-CANDIDATE.md)
  for the verified V1 creation date and transaction. Do not treat the JSON's
  conflicting date/hash as authoritative without correction and review.

The [Sepolia Etherscan contract page](https://sepolia.etherscan.io/address/0x9C857fEeF228157F8Ee2dCD4DDdbad116F5a6088#code)
reports that the contract source is verified as an **Exact Match**.

## Recovery findings

The recovered contract is named `Legacy6Coin`, uses symbol `L6C`, and was
verified with Solidity `0.8.31+commit.fd3a2265`, optimization enabled for 200
runs, and EVM version `paris`.

The constructor's initial witness list includes the wallet address you
provided. This is public address data in the verified contract source; it is
not a wallet secret.

The source sets `MAX_SUPPLY` to 1,000,000 tokens and mints 666,000 tokens during
construction. This differs from the old repository README, which describes
666,000 as the total supply. The Solidity source is the code to use when
rebuilding the project.

## Legacy6Coin V2 status

Legacy6Coin V2 is a separate implementation governed by the founder-approved
[Decision Record](./LEGACY6COIN-V2-ADR.md). Its implementation and 23-test
suite exist, and a [Release Candidate Report](./LEGACY6COIN-V2-RELEASE-CANDIDATE.md)
documents the current design and readiness gates. Earlier V2 specification
and roadmap documents are superseded historical proposals and are not current
requirements. V2 has not been approved for Mainnet deployment.

## Hardhat project status

The Hardhat 3 TypeScript project is initialized in this folder. Its
`hardhat.config.ts` selects the verified Solidity compiler version
`0.8.31`, enables the optimizer for 200 runs, and sets the EVM version to
`paris`. No external RPC network or wallet configuration is present; compiling
uses the local development tools and does not connect to Sepolia or mainnet.

The original Solidity imports are resolved using the saved source snapshot,
not an assumed OpenZeppelin release. From the repository root, install it with
the Windows npm command:

```powershell
Set-Location 'C:\Users\user\Legacy6Coin-deploy\Legacy6Coin-Source'
npm.cmd install '@openzeppelin/contracts@file:./vendor/openzeppelin-contracts'
```

Then compile locally:

```powershell
npx.cmd hardhat compile
```

`npm.cmd` and `npx.cmd` avoid a common Windows PowerShell issue where script
execution policy blocks `npm.ps1` or `npx.ps1`. Check the installed tools with
`node --version` and `npm.cmd --version`. Hardhat 3 requires Node.js 22.13.0 or
later.

Compilation only builds the local source. It does not deploy or change the
existing Sepolia contract. No wallet, recovery phrase, private key, or `.env`
file is needed. Never paste wallet secrets into chat or commit them to GitHub.
