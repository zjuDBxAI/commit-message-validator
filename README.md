# commit-message-validator
Action to validate commits follow the guidelines

## Usage
In your workflow you first need to checkout you repository and then run the action. The action will fail if the commit messages do not follow the guidelines.

Refer to the following example:
```yaml
name: check commit message
on: [push, pull_request]
permissions:
    contents: read
    pull-requests: read
jobs:
    check:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Check commit message
              uses: YingHongBin/commit-message-validator@version
              with:
                github-token: ${{ github.token }}
                scope-values: 'scope1, scope2'
```

### github-token

Required GitHub token, defaulting to `${{ github.token }}`. For pull requests,
grant `pull-requests: read` so the action can read commits in private repositories.
The action runs on Node.js 24 and fetches all pages returned by the PR commits API.
GitHub limits this endpoint to 250 commits per pull request.

### scope-values

Customized scope values, default undifined, means any scope would be denied. If you want to use customized scope values, you can set the values in the `scope-values` input. The values should be separated by comma. Wildcard is acceptable if scope-values has been set.

## Commit Message Guidelines

Commit Message format as follows
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type
Must be one of the following:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing or correcting existing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scope
Scope is optional. Scope must be a word or wildcard which means change affects more than a single scope.

### Subject
Must satisfy following rules:
- Less than 80 characters
- Do not start or end with space
- Do not cpatialize first letter
- Do not end with a period

### Body
Body is optional. Body must satisfy following rules:
- Paragraphs must be capitalized
- Lines do not start or end with space
- Lines must be wrapped at 100 characters

### Footer
Footer is optional. If the last paragraph start with `close` or `fix`, it is considered as footer. Footer must satisfy following rules:
- Only use `close` or `fix` as keywords
- Format like `close #{issue_number}` or `fix #{issue_number}`
- Close multi issue in one line like `close #{issue_number}, close #{issue_number}`, no additional space in the line.

### Pull Request Merge Commit
If the commit is a merge commit from merge pull request in github, the commit message header line must be `Merge pull request #{pull_request_number} from {branch_name}`, which is default format from github.