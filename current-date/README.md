# 🕒 Current Date GitHub Action

Outputs the current date and time using a customizable format. Supports ISO-style and natural-language formats using [`date-fns`](https://date-fns.org/) formatting patterns.

## 🚀 Usage

```yaml
- name: Get current date
  id: current-date
  uses: mburumaxwell/actions/current-date@main
  with:
    format: 'yyyy-MM-dd' # optional, default: "MMMM dd, yyyy"

- name: Create Pull Request
  if: ${{ github.event_name != 'pull_request' }}
  uses: peter-evans/create-pull-request@v7
  with:
    base: main
    branch: 'update-dist'
    commit-message: 'Update dist files'
    title: 'Update dist files as of ${{ steps.current-date.outputs.date }}'
    body: |
      Update dist files.

      These files are generated from the latest changes in the codebase.

      Ref: ${{ github.sha }}
    delete-branch: true
```

### 💡 Example output

- Format: `"MMMM dd, yyyy"` -> `May 09, 2025`
- Format: `"yyyy-MM-dd"` -> `2025-05-09`
- Format: `"EEEE, MMMM do yyyy"` -> `Friday, May 9th 2025`

## 📥 Inputs

| Name   | Description                                                    | Default         |
| ------ | -------------------------------------------------------------- | --------------- |
| format | A [`date-fns`](https://date-fns.org/docs/format) format string | `MMMM dd, yyyy` |

## 📤 Outputs

| Name | Description                       |
| ---- | --------------------------------- |
| date | The formatted current date string |
