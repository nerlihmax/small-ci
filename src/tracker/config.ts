import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ useDefaults: true });
addFormats(ajv);

export interface CiTrackerConfig {
  orgId: string;
  oauth: string;
  tagPattern: string;
  queue: string;
}

const configSchema: JSONSchemaType<CiTrackerConfig> = {
  type: 'object',
  properties: {
    orgId: { type: 'string' },
    oauth: {
      type: 'string',
      default: process.env.SCI_TRACKER_OAUTH || ''
    },
    tagPattern: {
      type: 'string',
      default: 'v\\*.\\*.\\*'
    },
    queue: { type: 'string' },
  },
  required: ['orgId', 'oauth', 'tagPattern', 'queue'],
};

export const configValidator = ajv.compile<CiTrackerConfig>(configSchema);
