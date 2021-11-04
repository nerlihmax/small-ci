import { CiScript, CiScriptExecutor } from '../common/types';
import { CiTrackerConfig, configValidator } from './config';
import {
  checkGit,
  getLastTag,
  getPreviousRef,
  getRefAuthor,
  getTags,
  makeChangelogs,
} from './git';
import { TrackerIssue, useTracker } from './tracker';
 
const executor: CiScriptExecutor = async (config: any) => {
  const {
    oauth,
    orgId,
    tagPattern,
    queue,
  } = config as CiTrackerConfig;

  await checkGit();

  const tags = await getTags(tagPattern);

  const last = await getLastTag(tags);

  const prev = await getPreviousRef(tags, last);

  const changelogs = await makeChangelogs(prev, last);

  const author = await getRefAuthor(last);

  const { createIssue } = useTracker(oauth, orgId);

  const issue: TrackerIssue = {
    summary: last,
    assignee: author,
    description: changelogs,
    type: 'task',
    queue,
  };

  await createIssue(issue);
};

const script: CiScript = {
  name: 'Tracker',
  cliCmd: 'tracker',
  run: executor,
  configValidator,
};

export default script;
