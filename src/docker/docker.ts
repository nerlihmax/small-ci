import execSh from 'exec-sh';
import { exit } from 'process';

import { DERROR } from '../common/logger';
import { ErrorMessages } from './strings';

const sh = execSh.promise;

export const buildImage = async (filename: string) => {
  try {
    const cmd = `docker build -t ${filename} .`;
    await sh(cmd);
  } catch (ex) {
    DERROR(ex);
    console.error(ErrorMessages.cantBuildImage);
    exit(-1);
  }
};