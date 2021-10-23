import { config } from 'dotenv';

config();

export const { SERVICE_PROVIDER_DOMAINS, NODE_ENV } = process.env;
