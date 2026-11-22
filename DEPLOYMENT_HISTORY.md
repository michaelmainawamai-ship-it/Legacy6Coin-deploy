# Legacy6Coin Deployment History

This archive records the deployment and verification evidence identified for the Legacy6Coin project. It distinguishes historical deployments from the current project reference contract and records known source inconsistencies without treating stale metadata as authoritative.

## Legacy6Coin V1

- **Contract:** `Legacy6Coin`
- **Address:** `0x9C857fEeF228157F8Ee2dCD4DDdbad116F5a6088`
- **Creator / initial owner:** `0x21EC335039Bca45896f75741433FF869d8a1cB8c`
- **Creation transaction:** `0x1ca8e3d7fb256a419769b4875b6257d92cf310bd4ba42df109d548a761791f45`
- **Deployment date:** `2026-01-07T15:23:48Z`
- **Verification status:** Exact Match
- **Verification:** [Sepolia Etherscan contract and source](https://sepolia.etherscan.io/address/0x9C857fEeF228157F8Ee2dCD4DDdbad116F5a6088#code)
- **Status:** Historical Verified Deployment

### V1 historical evidence

The Sepolia explorer record identifies the contract address as a contract-created deployment, with the creation transaction and creator shown above. The record matches an exact-source verification and establishes this as the historical verified V1 deployment.

## Legacy6Coin V2

- **Contract:** `Legacy6CoinV2`
- **Address:** `0xae0F6F5B2E3C2312d9748d7A18642Af041f8b925`
- **Release:** Legacy6Coin Archive v1.0
- **Verification:** [Sepolia Etherscan contract and source](https://sepolia.etherscan.io/address/0xae0F6F5B2E3C2312d9748d7A18642Af041f8b925#code)
- **Status:** Current Project Reference Contract

V2 is a separate implementation and is not a migration or ownership transfer of V1. V1 balances do not automatically migrate to V2. Public documentation should distinguish the two contract addresses and explain their separate deployment status.

## Known Historical Inconsistencies

The following inconsistencies were found during the repository audit and must be resolved through authoritative records rather than assumed corrections:

1. The repository README previously listed V1 as deployed on `2024-04-16T13:06:35Z` and associated it with a different creation transaction and deployer address:
   - Address: `0x9C857fEeF228157F8Ee2dCD4DDdbad116F5a6088`
   - Transaction: `0x7e163effbc559a584f1f48aa8c14f9d30771c71e00cdea7ee64d7e14e5135f2c`
   - Deployer: `0x9722a4c6e8eeb86b874e4d8bbd9a1871d7be5f93`
   - Date: `2024-04-16T13:06:35Z`

   Those values do not match the checked Sepolia contract-creation record. They should be retained as historical repository evidence, but they are not the authoritative V1 creation record documented above.

2. Legacy6Coin V1 and Legacy6Coin V2 are different contracts. V2 should not be described as an upgrade or migration of V1 unless the project explicitly documents and verifies such a process.

3. The old README and some release summaries may describe 666,000 L6C as a total supply while the recovered V1 source defines a one-million-token maximum supply and initial construction behavior. The verified source and subsequent release-candidate documentation should govern technical interpretation.

4. Deployment metadata in recovery and archive documents should not be copied forward as authoritative where it conflicts with the exact-match explorer record or an independent verified-source record.

## Known Addresses

### Owner Wallet

- **Address:** `0x21EC335039Bca45896f75741433FF869d8a1cB8c`
- **Role:** Founder / owner wallet

### Treasury Wallet

- **Address:** `0xAC643D786Bad1Ef8ADB6a8e320BF12cd990b868a`
- **Role:** Treasury wallet

## Operational Use

For operational decisions, deployment planning, and release communication:

- Use the verified V1 address and creation evidence above for historical V1 references.
- Use the V2 address and release reference above for the current documented project reference contract.
- Preserve conflicting historical values rather than silently deleting them.
- Recheck all addresses, transaction hashes, source verification, chain IDs, and constructor settings against the explorer and frozen source before any privileged or production action.

Related documentation:

- [Project Registry](PROJECT_REGISTRY.md)
- [Wallet Architecture](WALLET_ARCHITECTURE.md)
- [Recovery Plan](RECOVERY_PLAN.md)
- [Mainnet Launch Checklist](MAINNET_LAUNCH_CHECKLIST.md)
