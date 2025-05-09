import core from '@actions/core';
import github from '@actions/github';
import type { Context } from '@actions/github/lib/context';
import { afterEach } from 'node:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { compute } from '../src/compute-docker-tags-logic';

describe('Compute Docker Tags', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

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

  type ExecuteOptions = {
    image?: string;
    shortSha?: string;
    fullSemVer?: string;
    major?: string;
    minor?: string;
  };
  function setInputs(options?: ExecuteOptions) {
    const {
      image = 'ghcr.io/tesla/self-driving',
      shortSha = 'abc1234',
      fullSemVer = '1.2.3',
      major = '1',
      minor = '2',
    } = options ?? {};

    vi.stubEnv('INPUT_IMAGE', image);
    vi.stubEnv('INPUT_SHORT_SHA', shortSha);
    vi.stubEnv('INPUT_FULL_SEMVER', fullSemVer);
    vi.stubEnv('INPUT_MAJOR', major);
    vi.stubEnv('INPUT_MINOR', minor);
  }

  it('exports tags based on a tag ref', async () => {
    vi.spyOn(github, 'context', 'get').mockReturnValue({ ...defaultContext, ref: 'refs/tags/1.2.3' });
    setInputs();

    const exportSpy = vi.spyOn(core, 'setOutput');
    compute();

    expect(exportSpy).toHaveBeenCalledWith(
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
  });

  it('exports tags based on main branch', async () => {
    vi.spyOn(github, 'context', 'get').mockReturnValue({ ...defaultContext, ref: 'refs/heads/main' });
    setInputs({ fullSemVer: '1.2.4-ci.1' });

    const exportSpy = vi.spyOn(core, 'setOutput');
    compute();
    expect(exportSpy).toHaveBeenCalledWith(
      'tags',
      expect.stringMatching(
        [
          'ghcr.io/tesla/self-driving:1.2.4-ci.1',
          'ghcr.io/tesla/self-driving:latest',
          'ghcr.io/tesla/self-driving:abc1234',
        ].join(','),
      ),
    );
  });

  it('exports tags based on non-main branch', async () => {
    vi.spyOn(github, 'context', 'get').mockReturnValue({ ...defaultContext, ref: 'refs/heads/dev' });
    setInputs({ fullSemVer: '1.2.4-ci.4' });

    const exportSpy = vi.spyOn(core, 'setOutput');
    compute();
    expect(exportSpy).toHaveBeenCalledWith(
      'tags',
      expect.stringMatching(['ghcr.io/tesla/self-driving:1.2.4-ci.4'].join(',')),
    );
  });
});
