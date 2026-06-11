# Security Policy

## Reporting a Vulnerability

PNPD-OS is a governance framework, not a runtime. It contains no executable code, no servers, no network listeners, and no cryptographic implementations.

If you discover a vulnerability in PNPD-OS documentation (e.g., a governance rule that could be exploited to bypass agent authority), please report it privately.

**Do not open a public issue.**

Report vulnerabilities using GitHub private vulnerability reporting if enabled on the repository.
If private vulnerability reporting is unavailable, open a GitHub security advisory request or create a minimal issue requesting a secure contact channel without disclosing sensitive details.

You will receive a response within 72 hours.

## Scope

Security reports are accepted for:
- Governance rule contradictions that allow authority bypass
- Anti-drift control gaps
- AgentBridge protocol vulnerabilities (e.g., handoff forgery paths)
- Schema validation bypasses

Security reports are NOT accepted for:
- Bugs in your project's implementation of PNPD-OS
- Issues caused by not following the framework
- General AI safety concerns not specific to PNPD-OS

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
