import * as core from '@actions/core';
import * as github from '@actions/github';

try {
  const { ref } = github.context;

  const image = core.getInput('image', { required: true });
  const shortSha = core.getInput('short_sha', { required: true });
  const fullSemVer = core.getInput('full_semver', { required: true });
  const major = core.getInput('major', { required: true });
  const minor = core.getInput('minor', { required: true });

  let tags = [`${image}:${fullSemVer}`];
  if (ref === 'refs/heads/main' || ref.startsWith('refs/tags/')) {
    tags.push(`${image}:latest`);
    tags.push(`${image}:${shortSha}`);
  }
  if (ref.startsWith('refs/tags/')) {
    tags.push(`${image}:${major}.${minor}`);
    tags.push(`${image}:${major}`);
  }

  // result is list or CSV
  core.info(`Computed tags: "${tags.join(',')}"`);
  core.setOutput('tags', tags.join(','))
} catch (error) {
  core.setFailed((error as Error).message);
}
