import type { ExtendOptions } from 'got';
import got from 'got';
import { CookieJar } from 'tough-cookie';
import { HttpsProxyAgent } from 'hpagent';
import { getUserAgent } from './user-agents.js';

export function getHttpClient(options?: ExtendOptions) {
  const cookieJar = new CookieJar();

  const client = got.extend({
    cookieJar,
    headers: {
      'User-Agent': getUserAgent(),
    },
    agent: process.env.HTTPS_PROXY
      ? {
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            proxy: process.env.HTTPS_PROXY,
          }),
        }
      : {},
    ...options,
  });

  return client;
}
