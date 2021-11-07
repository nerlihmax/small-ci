import { ValidateFunction } from 'ajv';

export type CiScriptExecutor = (
  config: any,
  commands: string[],
  args: any,
) => void | Promise<void>;

export interface CiScript {
  name: string;
  cliCmd: string;
  run: CiScriptExecutor;
}
