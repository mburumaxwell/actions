import core from '@actions/core';
import github from '@actions/github';
import type { Context } from '@actions/github/lib/context';
import { expect, test, vi } from 'vitest';
import { run } from '../src/compute-docker-tags';

test('Compute Docker Tags', async () => {
  const defaultContext = {
    action: '',
    actor: '',
    apiUrl: '',
    eventName: '',
    graphqlUrl: '',
    issue: { number: 0, owner: 'tesla', repo: 'self-driving' },
    job: '',
    payload: {},
    ref: '',
    repo: { owner: 'tesla', repo: 'self-driving' },
    runId: 0,
    runNumber: 0,
    serverUrl: '',
    sha: '',
    workflow: '',
  } satisfies Context;

  vi.stubEnv('INPUT_IMAGE', 'ghcr.io/tesla/self-driving');
  vi.stubEnv('INPUT_SHORT_SHA', 'abc1234');
  vi.stubEnv('INPUT_FULL_SEMVER', '1.2.3');
  vi.stubEnv('INPUT_MAJOR', '1');
  vi.stubEnv('INPUT_MINOR', '2');
  const setOutput = vi.spyOn(core, 'setOutput');
  const setFailed = vi.spyOn(core, 'setFailed');

  // exports tags based on a tag ref
  vi.spyOn(github, 'context', 'get').mockReturnValue({ ...defaultContext, ref: 'refs/tags/1.2.3' });
  run();
  expect(setOutput).toHaveBeenCalledWith(
    'tags',
    expect.stringMatching(
      [
        'ghcr.io/tesla/self-driving:1.2.3',
        'ghcr.io/tesla/self-driving:latest',
        'ghcr.io/tesla/self-driving:abc1234',
        'ghcr.io/tesla/self-driving:1.2',
        'ghcr.io/tesla/self-driving:1',
      ].join(','),
    ),
  );

  // exports tags based on main branch
  vi.spyOn(github, 'context', 'get').mockReturnValue({ ...defaultContext, ref: 'refs/heads/main' });
  vi.stubEnv('INPUT_FULL_SEMVER', '1.2.4-ci.1');
  run();
  expect(setOutput).toHaveBeenCalledWith(
    'tags',
    expect.stringMatching(
      [
        'ghcr.io/tesla/self-driving:1.2.4-ci.1',
        'ghcr.io/tesla/self-driving:latest',
        'ghcr.io/tesla/self-driving:abc1234',
      ].join(','),
    ),
  );

  // exports tags based on non-main branch
  vi.spyOn(github, 'context', 'get').mockReturnValue({ ...defaultContext, ref: 'refs/heads/dev' });
  vi.stubEnv('INPUT_FULL_SEMVER', '1.2.4-ci.4');
  run();
  expect(setOutput).toHaveBeenCalledWith(
    'tags',
    expect.stringMatching(['ghcr.io/tesla/self-driving:1.2.4-ci.4'].join(',')),
  );
  expect(setFailed).not.toHaveBeenCalled();

  vi.unstubAllEnvs();
});
