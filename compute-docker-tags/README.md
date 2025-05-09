# Compute Docker Tags

A GitHub Action that computes Docker image tags based on the current Git reference (branch or tag) and semantic version inputs. This action works with any container registry or for local-only builds by allowing you to specify the full image name.

## 🔧 Inputs

| Name          | Description                                                              | Required |
|---------------|--------------------------------------------------------------------------|----------|
| `image`       | Full image name (e.g. `ghcr.io/org/app`, `docker.io/user/app`, or `app`) | ✅ Yes    |
| `short_sha`   | Short Git commit SHA (e.g. `abc1234`)                                    | ✅ Yes    |
| `full_semver` | Full semantic version (e.g. `1.2.3`)                                     | ✅ Yes    |
| `major`       | Major version (e.g. `1`)                                                 | ✅ Yes    |
| `minor`       | Minor version (e.g. `2`)                                                 | ✅ Yes    |

## 📤 Outputs

| Name    | Description                                              |
|---------|----------------------------------------------------------|
| `tags`  | Comma-separated list of Docker tags (e.g. `tag1,tag2`)   |

## 🧠 Tag Generation Logic

Tags are computed as follows:

- Always includes `${image}:${full_semver}`
- If the ref is `refs/heads/main` or a tag:
  - Adds `${image}:latest`
  - Adds `${image}:${short_sha}`
- If the ref is a tag:
  - Adds `${image}:${major}.${minor}`
  - Adds `${image}:${major}`

## 🚀 Example Usage

```yaml
env:
  IMAGE_NAME: 'azddns'

steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Install GitVersion
    uses: gittools/actions/gitversion/setup@v3
    with:
        versionSpec: '6.0.x'

  - name: Determine Version
    id: gitversion
    uses: gittools/actions/gitversion/execute@v3

  - name: Compute Docker Tags
    id: docker_tags
    uses: mburumaxwell/actions/compute-docker-tags@main
    with:
      image: ghcr.io/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}
      short_sha: ${{ steps.gitversion.outputs.shortSha }}
      full_semver: ${{ steps.gitversion.outputs.fullSemVer }}
      major: ${{ steps.gitversion.outputs.major }}
      minor: ${{ steps.gitversion.outputs.minor }}

  - name: Set up Docker Buildx
    uses: docker/setup-buildx-action@v3

  - name: Log into registry
    uses: docker/login-action@v3
    with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}

  - name: Build and push multi-arch image
    uses: docker/build-push-action@v6
    with:
      context: ${{ github.workspace }}
      file: Dockerfile
      platforms: linux/amd64,linux/arm64
      push: ${{ !startsWith(github.ref, 'refs/pull') }}
      cache-from: type=registry,ref=ghcr.io/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:latest
      cache-to: type=inline
      tags: ${{ steps.docker_tags.outputs.tags }}
      labels: |
        org.opencontainers.image.source=${{ github.repository }}
        org.opencontainers.image.version=${{ steps.gitversion.outputs.fullSemVer }}
        org.opencontainers.image.revision=${{ github.sha }}
        org.opencontainers.image.created=${{ github.event.head_commit.timestamp }}
        com.github.image.run.id=${{ github.run_id }}
        com.github.image.run.number=${{ github.run_number }}
        com.github.image.job.id=${{ github.job }}
        com.github.image.source.sha=${{ github.sha }}
        com.github.image.source.branch=${{ github.ref }}
```
