# Repo Governance

## Rules

- Do not overwrite an existing remote without explicit approval.
- Do not push directly to main.
- Use topic branches for implementation.
- Do not commit secrets.
- Do not commit generated dependency folders or build outputs.
- Use conventional commit messages when committing.
- Keep one logical change per commit.

## Branch Conventions

Use short-lived branches with prefixes:

- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation
- `chore/` — maintenance, governance
- `experiment/` — spikes, prototypes

One coherent concern per branch.

## Commit Conventions

```
type(scope): description

Examples:
feat(auth): add example auth session support
docs(governance): add phase model documentation
fix(build): resolve TypeScript strict mode errors
chore(repo): update .gitignore for build outputs
```

## Remote

Set up your remote:

```bash
git remote add origin https://github.com/OWNER/REPO.git
```

Verify before pushing:

```bash
git status --short --branch
git branch --show-current
git remote get-url origin
```

## Safety

- `rg` scan for secrets before every commit
- Never commit `.env` files
- Never commit credentials, tokens, or keys
- Never commit generated build outputs
