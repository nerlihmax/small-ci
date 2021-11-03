import { exit } from 'process';
import execSh from 'exec-sh';

import { ErrorMessages } from './strings';

const sh = execSh.promise;

export type GitTag = string;
export type GitCommit = string;

export type GitRef = GitTag | GitCommit;

export const checkGit = async () => {
  try {
    const cmd = 'git --version';
    await sh(cmd);
  } catch (err) {
    console.error(ErrorMessages.gitNotFound);
    exit(-1);
  }
};

export const getTags = async (pattern: string): Promise<GitTag[]> => {
  try {
    const cmd = `git --no-pager tag --list ${pattern}`;
    const { stdout } = await sh(cmd, true);
    const tags: GitTag[] = stdout
      .split('\n')
      .filter((i) => i !== '')
      .reverse();

    return tags;
  } catch (err) {
    console.error(ErrorMessages.noTagsInRepository);
    exit(-1);
  }
};

export const getTail = async (): Promise<GitRef> => {
  try {
    const cmd = `git rev-list --max-parents=0 HEAD`;
    const tail: GitRef = (await sh(cmd)).stdout;
    return tail;
  } catch (ex) {
    console.error(ex);
    console.error(ErrorMessages.somethingWentWrong);
    exit(-1);
  }
}

export const getLastTag = (tags: GitTag[]) => tags[0];

export const getPreviousRef = async (tags: GitTag[], current: GitTag): Promise<GitRef> => {
  const currentTagIndex = tags.indexOf(current);
  if (currentTagIndex === -1) {
    console.error('currentTagIndex === -1');
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
    const changelogs = (await sh(cmd, true)).stdout;
    return changelogs;
  } catch (err) {
    console.error(ErrorMessages.cantGetChangelogs);
    exit(-1);
  }
};

export const getRefAuthor = async (ref: GitRef) => {
  try {
    const cmd = `git --no-pager show -s --pretty=format:"%aN %aE" ${ref}`;
    const author = (await sh(cmd, true)).stdout;
    return author;
  } catch (err) {
    console.error(err);
    console.error(ErrorMessages.somethingWentWrong);
    exit(-1);
  }
}