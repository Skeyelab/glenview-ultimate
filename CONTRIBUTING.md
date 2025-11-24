# Contributing to Glenview Ultimate

Thank you for your interest in contributing to the Glenview Ultimate website!

## Development Workflow

1. **Never commit to main branch** - Always create a new branch for your changes
2. **Run tests before committing** - Ensure all tests pass with `yarn test`
3. **Run linter** - Fix linting issues with `yarn standard` before committing
4. **Write tests** - Add tests for new features and bug fixes
5. **Keep code concise** - Write clean, maintainable code

## Branch Naming

Use descriptive branch names:
- `feature/description` - For new features
- `fix/description` - For bug fixes
- `docs/description` - For documentation updates
- `refactor/description` - For code refactoring

## Code Style

The project follows strict TypeScript and React patterns:

- **TypeScript**: Strict mode enabled, prefer `interface` for props/DTOs
- **Exports**: Named exports for components, default exports only for Next.js pages
- **Components**: Use `React.JSX.Element` or `React.ReactElement` for return types
- **Styling**: Tailwind CSS with `cn()` helper for class merging
- **Client Components**: Add `'use client';` as first statement when needed

See `.cursor/rules/` for detailed coding standards.

## Testing

- Write tests for all new features
- Maintain or improve test coverage
- Tests should be in `__tests__/` mirroring source structure
- Use React Testing Library for component tests
- Mock external dependencies appropriately

## Pull Requests

Before submitting a PR:

1. ✅ All tests pass (`yarn test`)
2. ✅ Build succeeds (`yarn build`)
3. ✅ Linter passes (`yarn standard:check`)
4. ✅ Code follows project conventions
5. ✅ Tests added for new functionality

PRs will be reviewed and must pass CI checks before merging.

## Commit Messages

Write clear, descriptive commit messages:
- Use present tense ("Add feature" not "Added feature")
- Be specific about what changed
- Reference issues/PRs when applicable

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

