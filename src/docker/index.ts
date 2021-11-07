import { getScriptConfig } from '../common/config';
import { DLOG } from '../common/logger';
import { CiScript, CiScriptExecutor } from '../common/types';
import trackerScript from '../tracker';
import {
  CiTrackerConfig,
  configValidator as trackerConfigValidator,
} from '../tracker/config';
import { getTags, getLastTag } from '../tracker/git';
import { buildImage } from './docker';

const executor: CiScriptExecutor = async (
  fullConfig,
  commands,
  args,
) => {
  const trackerConfig = getScriptConfig(
    fullConfig,
    trackerScript.cliCmd,
    trackerConfigValidator,
  );

  const {
    tagPattern,
  } = trackerConfig as CiTrackerConfig;
  
  const tags = await getTags(tagPattern);
  DLOG(tags);

  const last = await getLastTag(tags);
  DLOG(last);

  await buildImage(last);
};

const script: CiScript = {
  name: 'Docker',
  cliCmd: 'docker',
  run: executor,
};

export default script;