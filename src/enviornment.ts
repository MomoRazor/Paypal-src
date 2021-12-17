import { config } from 'dotenv';

config();

export const { API_KEY, NODE_ENV } = process.env;
