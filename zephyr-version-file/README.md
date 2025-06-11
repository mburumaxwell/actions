# Generate VERSION file for Zephyr

Generates a VERSION file for a Zephyr application based on a given SemVer 2.0 input.

## 🚀 Usage

```yaml
- name: Generate Zephyr Version
  id: generate-version
  uses: mburumaxwell/actions/zephyr-version-file@main
  with:
    version: ${{ ref.tag_name }} # or another relevant source like mburumaxwell/actions/get-version

- name: Create Pull Request
  if: ${{ github.event_name != 'pull_request' }}
  uses: peter-evans/create-pull-request@v7
  with:
    base: main
    branch: 'update-files'
    commit-message: 'Update files'
    title: 'Update files'
    body: |
      Update dist files.

      These files are generated from the latest changes in the codebase.

      Ref: ${{ github.sha }}
    delete-branch: true
```

## 📥 Inputs

| Name        | Description                                            | Required | Default     |
| ----------- | ------------------------------------------------------ | -------- | ----------- |
| version     | Version to be parsed. Must be a valid SemVer 2.0 value | ✅ Yes   |             |
| destination | The path to the VERSION file to be generated.          |          | `./VERSION` |

## 📤 Outputs

| Name     | Description                                 |
| -------- | ------------------------------------------- |
| contents | The contents of the generated VERSION file. |
