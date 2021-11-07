import { exit } from 'process';
import { getScriptConfig } from '../common/config';
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
import { LogMessages } from './strings';
import { summaryWithAuthor, TrackerIssue, useTracker } from './tracker';

const createTask = async (config: any, commands: string[], args: any) => {
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

  const { createIssue, findIssue } = useTracker(oauth, orgId);

  const summary = summaryWithAuthor(last, author);
  DLOG(summary);
  
  const { key } = await findIssue(queue, summary);
  DLOG(key);

  if (key) {
    console.log(LogMessages.issueExists);
    exit(0);
  }

  const issue: TrackerIssue = {
    summary,
    assignee: author,
    description: changelogs,
    type: 'task',
    queue,
  };
  DLOG(issue);

  await createIssue(issue);
};

const comment = async (config: any, commands: string[], args: any) => {
  const {
    oauth,
    orgId,
    queue,
    tagPattern,
  } = config as CiTrackerConfig;

  const { findIssue, addComment } = useTracker(oauth, orgId);

  const text = args.comment;
  DLOG(text);

  await checkGit();
  DLOG('found git');

  const tags = await getTags(tagPattern);
  DLOG(tags);

  const last = await getLastTag(tags);
  DLOG(last);

  const author = await getRefAuthor(last);
  DLOG(author);

  const summary = summaryWithAuthor(last, author);
  DLOG(summary)

  const { key } = await findIssue(queue, summary);
  DLOG(key);

  await addComment(text, key);
};

const executor: CiScriptExecutor = async (
  fullConfig,
  commands,
  args,
) => {
  const config = getScriptConfig(
    fullConfig,
    script.cliCmd,
    configValidator,
  );
  
  if (!!args?.comment) {
    await comment(config, commands, args);
  } else {
    await createTask(config, commands, args);
  }
};

const script: CiScript = {
  name: 'Tracker',
  cliCmd: 'tracker',
  run: executor,
};

export default script;
