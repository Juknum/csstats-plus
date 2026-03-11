# Contributing to CSStats+

Thanks for contributing.

## How to contribute

- Report bugs or request features via Issues.
- Open a Pull Request for fixes or improvements.
- Keep changes focused and small when possible.

## Development setup

1. Fork the repository.
2. Create a branch from `main`:
   - `feat/<short-description>` for features
   - `fix/<short-description>` for bug fixes
3. Install dependencies:
   - `pnpm install`
4. Run the project locally:
   - `pnpm run dev`

## Quality checks

Before opening a PR, run and fix any issues with:

- `pnpm lint`
- `pnpm prepublish`

## Commit guidelines

Use clear, descriptive commit messages.  
Conventional style is preferred, for example:

- `feat: add clickable rank filter`
- `fix: correct map icon fallback`
- `docs: update README comparison section`

## Pull Request checklist

- [ ] Change is scoped and documented
- [ ] No unrelated refactors included
- [ ] Tests your code (if applicable)
- [ ] Screenshots added for UI changes
- [ ] README/docs updated if behavior changed

## Reporting bugs

Include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Screenshots (if UI-related)
- Environment details (OS, browser, extension version)

## Notes

By submitting a contribution, you agree that your code can be distributed under this repository’s license.