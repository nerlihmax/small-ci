import { exit } from 'process';
import { ValidateFunction } from 'ajv';
import { ErrorMessages } from './strings';


export const getScriptConfig = (
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
