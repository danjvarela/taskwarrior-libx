# Contributing

Contributions are welcome! Please read this guide before submitting a pull request.

## Requirements

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)
- [Taskwarrior](https://taskwarrior.org/) v3+ installed and available in `PATH`

## Setup

```bash
git clone https://github.com/danjvarela/taskwarrior-libx
cd taskwarrior-libx
pnpm install
```

## Development

```bash
pnpm test        # run tests in watch mode
pnpm test:run    # run tests once
pnpm typecheck   # type check without emitting
pnpm build       # typecheck + build to dist/
pnpm docs        # regenerate API docs
```

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`
2. Make your changes and add tests where appropriate
3. Ensure all tests pass (`pnpm test:run`) and there are no type errors (`pnpm typecheck`)
4. Open a pull request against `main`

### PR title format

PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add logTask support
fix: handle empty filter in purgeTasks
docs: update README usage examples
chore: update dependencies
```

The PR title becomes the squash commit message on merge, which drives automatic versioning and changelog generation via semantic-release.

| Prefix | When to use | Version bump |
|---|---|---|
| `feat:` | New feature or operation | Minor |
| `fix:` | Bug fix | Patch |
| `docs:` | Documentation only | None |
| `chore:` | Maintenance, deps, tooling | None |
| `test:` | Adding or updating tests | None |
| `refactor:` | Code change with no behavior change | None |
| `feat!:` / `fix!:` | Breaking change | Major |

## Adding a New Operation

Operations follow a consistent pattern. When adding a new one:

1. Implement it in `src/operations.ts` following the existing patterns
2. Export it from `src/operations.ts`
3. Add it to `src/client.ts` with full JSDoc
4. Re-export any new types from `src/index.ts`
5. Add tests in `test/operations.test.ts`
6. Run `pnpm docs` to regenerate the API docs
