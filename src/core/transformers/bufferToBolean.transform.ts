import { ValueTransformer } from 'typeorm';

export const bufferToBoolean: ValueTransformer = {
  from: (dbValue: any) => !!dbValue, // Convert to boolean
  to: (entityValue: boolean) => (entityValue ? 1 : 0), // Convert to TINYINT(1)
};
