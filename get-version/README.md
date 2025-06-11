# Get version from package.json

Outputs the current date and time using a customizable format. Supports ISO-style and natural-language formats using [`date-fns`](https://date-fns.org/) formatting patterns.

## 🚀 Usage

```yaml
- name: Get Version
  id: get-version
  uses: mburumaxwell/actions/get-version@main
  with:
    path: app1/package.json

- name: Create Pull Request
  if: ${{ github.event_name != 'pull_request' }}
  uses: peter-evans/create-pull-request@v7
  with:
    base: main
    branch: 'update-dist'
    commit-message: 'Update dist files'
    title: 'Update dist files as of version ${{ steps.get-version.outputs.version }}'
    body: |
      Update dist files.

      These files are generated from the latest changes in the codebase.

      Ref: ${{ github.sha }}
    delete-branch: true
```

## 📥 Inputs

| Name | Description                     | Default        |
| ---- | ------------------------------- | -------------- |
| path | Path to the `package.json` file | `package.json` |

## 📤 Outputs

| Name    | Description                                |
| ------- | ------------------------------------------ |
| version | The version as found in the specified file |
