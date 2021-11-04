import { DLOG } from '../common/logger';
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
  DLOG('found git');

  const tags = await getTags(tagPattern);
  DLOG(tags);

  const last = await getLastTag(tags);
  DLOG(last);

  const prev = await getPreviousRef(tags, last);
  DLOG(prev);

  const changelogs = await makeChangelogs(prev, last);
  DLOG(changelogs);

  const author = await getRefAuthor(last);
  DLOG(author);

  const { createIssue } = useTracker(oauth, orgId);

  const issue: TrackerIssue = {
    summary: last,
    assignee: author,
    description: changelogs,
    type: 'task',
    queue,
  };
  DLOG(issue);

  await createIssue(issue);
};

const script: CiScript = {
  name: 'Tracker',
  cliCmd: 'tracker',
  run: executor,
  configValidator,
};

export default script;
