import { ValidateFunction } from 'ajv';

export type CiScriptExecutor = (config: any) => void | Promise<void>;

export interface CiScript {
  name: string;
  cliCmd: string;
  run: CiScriptExecutor;
  configValidator: ValidateFunction<any>;
}
