# Pull Request

## Description
<!-- Provide a clear and concise description of your changes -->

## Related Issues
<!-- Link to related issues using "Closes #123" or "Related to #456" -->
- Closes # 
- Related to # 

## Type of Change
<!-- Check all that apply -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 UI/UX change
- [ ] ♻️ Code refactor
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix

## Requirements Checklist
<!-- All items must be checked before PR can be merged -->

### Code Quality & Standards
- [ ] This PR uses only shared/scaffolded components from `@iiskills/ui` (no local overrides)
- [ ] All imports use proper package structure (`@iiskills/ui/*`, `@iiskills/core`, etc.)
- [ ] No prohibited patterns (direct config overrides, local component duplicates)
- [ ] Code follows existing conventions and style guides
- [ ] ESLint passes with no errors (`yarn lint:check`)
- [ ] Prettier formatting applied (`yarn format:check`)

### Architecture & Integration
- [ ] App generated using `node scripts/create-app.js` OR conforms to `common-integration-plan.md`
- [ ] Required files present/updated: `app.config.js`, shared UI components
- [ ] Access control for free, paid, and bundled apps handled via shared logic
- [ ] No duplicate code - reuses existing shared packages

### Testing
- [ ] Automated tests written/updated as needed
- [ ] All unit tests pass (`yarn test`)
- [ ] All E2E tests pass (`yarn test:e2e`)
- [ ] Manual testing completed on affected features
- [ ] Configuration validation passes (`yarn validate-config`)
- [ ] No regressions in existing functionality

### Visual Changes (if applicable)
- [ ] Screenshots attached for all UI changes (desktop, tablet, mobile)
- [ ] Visual regression tests pass
- [ ] Design reviewed and approved
- [ ] Responsive design verified across all breakpoints
- [ ] Accessibility standards met (WCAG 2.1 AA)

### Security & Dependencies
- [ ] Security scan passed (no new vulnerabilities)
- [ ] No secrets or sensitive data in code
- [ ] Dependencies reviewed (if added/updated)
- [ ] No known security issues with new dependencies

### Documentation
- [ ] Code comments added where necessary
- [ ] Documentation updated (if applicable)
- [ ] CHANGELOG.md updated
- [ ] README updated (if needed)

## Testing Evidence

### Test Results
<!-- Provide evidence that tests pass -->
```
# Run these commands and paste results:
# yarn test
# yarn test:e2e
# yarn validate-config
```

### Screenshots/Videos
<!-- For UI changes, attach screenshots or videos -->
<!-- Use ./capture-qa-screenshots.sh to generate standardized screenshots -->

#### Desktop (1920x1080)
<!-- Attach screenshots here -->

#### Tablet (768x1024)
<!-- Attach screenshots here -->

#### Mobile (375x667)
<!-- Attach screenshots here -->

## Performance Impact
<!-- Describe any performance implications -->
- [ ] No performance degradation
- [ ] Performance improvements (describe):
- [ ] Performance impact assessed and acceptable

## Breaking Changes
<!-- If this PR introduces breaking changes, describe them and the migration path -->
- [ ] No breaking changes
- [ ] Breaking changes documented with migration guide

## Deployment Notes
<!-- Any special considerations for deployment? -->
- [ ] No special deployment requirements
- [ ] Deployment notes provided below:

### Deployment Requirements
<!-- List any special steps needed for deployment -->

### Environment Variables
<!-- List any new or changed environment variables -->

### Database Migrations
<!-- Describe any database changes -->

### Rollback Plan
<!-- How to rollback if issues arise -->

## Additional Context
<!-- Add any other context, considerations, or notes about this PR -->

## Reviewer Checklist
<!-- To be completed by the reviewer -->
- [ ] All automated checks are green ✅
- [ ] All requirements in checklist are met
- [ ] Code quality is high and maintainable
- [ ] Tests adequately cover changes
- [ ] Documentation is clear and complete
- [ ] Edge cases manually verified (with comment below)
- [ ] No obvious bugs or issues
- [ ] Approved for merge

### Edge Cases Verified
<!-- Reviewer: Document any edge cases you manually tested -->

---

## Auto-Generated Analysis
<!-- This section will be populated by automated tools -->
<!-- Do not edit manually - Danger.js will add its report here -->
