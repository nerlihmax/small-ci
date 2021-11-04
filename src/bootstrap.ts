import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { exit } from 'process';
import { readFile } from 'fs/promises';
import fg from 'fast-glob';
import { ValidateFunction } from 'ajv';

import { CiScript } from './common/types';
import { ErrorMessages } from './common/strings';
import { setDebug } from './common/logger';

const CONFIG_FILENAME = 'small-ci.config.json';

const parseArgs = async (source: string[]) => {
  const { argv } = yargs(hideBin(source));

  const { _: commands, ...args } = await argv;

  if (commands.length !== 1) {
    console.error(ErrorMessages.invalidArgs);
    exit(-1);
  }

  const stringifyCmds = (cmds: typeof commands) =>
    cmds.map((cmd) => cmd.toString());

  return {
    commands: stringifyCmds(commands),
    args,
  };
};

const getFullConfig: any = async () => {
  const configPath = await fg(CONFIG_FILENAME);

  if (configPath.length < 1) {
    console.error(ErrorMessages.configNotFound);
    exit(-1);
  }

  return JSON.parse((await readFile(configPath[0])).toString());
};

const findScript = (scripts: CiScript[], args: string[]) => {
  const found = scripts
    .find((script: CiScript) => args.includes(script.cliCmd));

  if (!found) {
    console.error(ErrorMessages.invadidScript);
    exit(-1);
  }

  return found;
};

const getScriptConfig = (
  fullConfig: any,
  cliCmd: string,
  validator: ValidateFunction,
): any => {
  if (!fullConfig[cliCmd]) {
    console.error(ErrorMessages.invalidConfig);
    exit(-1);
  }

  const scriptConfig = fullConfig[cliCmd];

  if (!validator(scriptConfig)) {
    console.error(ErrorMessages.invalidConfig);
    exit(-1);
  }

  return scriptConfig;
};

export const bootstrap = async (scripts: CiScript[]) => {
  const {commands, args} = await parseArgs(process.argv);

  setDebug(!!args?.debug);

  const fullConfig = await getFullConfig();

  const {
    run,
    cliCmd,
    configValidator,
  } = findScript(scripts, commands);

  const config = getScriptConfig(
    fullConfig,
    cliCmd,
    configValidator,
  );

  run(config);
};
