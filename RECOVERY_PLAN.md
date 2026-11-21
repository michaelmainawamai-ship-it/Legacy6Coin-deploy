# Legacy6Coin Recovery Plan

## Purpose and scope

This plan describes how to restore project documentation and operational
continuity after loss of access, accidental deletion, or a suspected security
incident. It is not a substitute for wallet-provider instructions, legal
advice, or an independently reviewed incident-response procedure.

## Security boundaries

- Never put seed phrases, private keys, keystore files, passwords, recovery
  codes, or other credentials in this repository, an issue, a pull request, or
  a chat.
- Keep wallet backups offline and under the owner's control. Do not send them
  to another person as part of a recovery exercise.
- Use a trusted device and the wallet provider's official recovery
  documentation. Do not follow recovery links or instructions from unsolicited
  messages.
- Treat public addresses and transaction records as public information, but
  verify them against authoritative chain records before relying on them.

## Repository and documentation recovery

1. Restore access to the GitHub account using GitHub's official account
   recovery process and secure the account with multifactor authentication.
2. Clone the repository from its verified GitHub location. Review commit
   history and tags before using files in a deployment or recovery procedure.
3. If files are missing or corrupted, restore them from a reviewed commit or
   release archive. Record the source commit and the files restored.
4. Review the README, launch checklist, deployment records, and security
   documentation for consistency. Resolve discrepancies against verified
   source and authoritative network records; do not treat an unverified archive
   as proof of deployment state.
5. Do not deploy or change contract ownership as a recovery shortcut. Any
   deployment or privileged action requires the normal independent checks and
   approvals.

## Wallet access or suspected compromise

1. Do not disclose or enter wallet secrets into this repository or share them
   with anyone offering help.
2. If access is lost, consult the wallet provider's official recovery
   instructions and use the owner's securely stored backup in a private,
   trusted environment.
3. If a secret may have been exposed, consider the wallet compromised. From a
   trusted device, follow a reviewed incident procedure to move remaining
   assets and privileges to a newly secured wallet, if applicable.
4. Verify any resulting transactions and addresses independently. Document
   public evidence and decisions without recording secrets.
5. Notify relevant maintainers through a verified channel and review account,
   repository, and deployment access.

## Validation and follow-up

- Confirm repository access and that required documentation can be restored.
- Recheck account security, wallet controls, and authorized maintainers.
- Record the incident timeline, actions, evidence references, and follow-up
  owners in an appropriate public or restricted location, excluding secrets.
- Rehearse this plan periodically and update it when responsibilities or
  operational controls change.

> Recovery procedures must preserve secrets, verify evidence, and require
> independent review before any privileged action.
