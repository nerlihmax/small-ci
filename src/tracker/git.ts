import { exit } from 'process';
import execSh from 'exec-sh';

import { ErrorMessages } from './strings';
import { DERROR, DLOG } from '../common/logger';

const sh = execSh.promise;

export type GitTag = string;
export type GitCommit = string;

export type GitRef = GitTag | GitCommit;

export const checkGit = async () => {
  try {
    const cmd = 'git --version';
    DLOG(cmd);
    await sh(cmd);
  } catch (ex) {
    DERROR(ex)
    console.error(ErrorMessages.gitNotFound);
    exit(-1);
  }
};

export const getTags = async (pattern: string): Promise<GitTag[]> => {
  try {
    const cmd = `git --no-pager tag --list ${pattern}`;
    DLOG(cmd);
    const { stdout } = await sh(cmd, true);
    const tags: GitTag[] = stdout
      .split('\n')
      .filter((i) => i !== '')
      .reverse();

    return tags;
  } catch (ex) {
    DERROR(ex);
    console.error(ErrorMessages.noTagsInRepository);
    exit(-1);
  }
};

export const getTail = async (): Promise<GitRef> => {
  try {
    const cmd = `git rev-list --max-parents=0 HEAD`;
    DLOG(cmd);
    const tail: GitRef = (await sh(cmd)).stdout;
    return tail;
  } catch (ex) {
    DERROR(ex);
    console.error(ErrorMessages.somethingWentWrong);
    exit(-1);
  }
}

export const getLastTag = (tags: GitTag[]) => tags[0];

export const getPreviousRef = async (tags: GitTag[], current: GitTag): Promise<GitRef> => {
  const currentTagIndex = tags.indexOf(current);
  if (currentTagIndex === -1) {
    DLOG(tags);
    DLOG(current);
    DLOG('currentTagIndex === -1');
    console.error(ErrorMessages.somethingWentWrong);
    exit(-1);
  }
  if (currentTagIndex === tags.length - 1) {
    return await getTail();
  } else {
    return tags[currentTagIndex + 1];
  }
}

export const makeChangelogs = async (from: GitTag, to: GitTag) => {
  try {
    const cmd = `git --no-pager log ${from}..${to} --pretty=format:'%h %s'`;
    DLOG(cmd);
    const changelogs = (await sh(cmd, true)).stdout;
    return changelogs;
  } catch (ex) {
    DERROR(ex);
    console.error(ErrorMessages.cantGetChangelogs);
    exit(-1);
  }
};

export const getRefAuthor = async (ref: GitRef) => {
  try {
    const cmd = `git --no-pager show -s --pretty=format:"%aN %aE" ${ref}`;
    DLOG(cmd);
    const author = (await sh(cmd, true)).stdout;
    return author;
  } catch (ex) {
    DERROR(ex);
    console.error(ErrorMessages.somethingWentWrong);
    exit(-1);
  }
}