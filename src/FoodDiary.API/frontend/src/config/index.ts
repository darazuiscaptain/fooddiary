import config from '../features/__shared__/config';

export const { apiUrl: API_URL } = config;

export const AUTH_CHECK_INTERVAL = process.env.REACT_APP_AUTH_CHECK_INTERVAL
  ? Number(process.env.REACT_APP_AUTH_CHECK_INTERVAL)
  : 60000;
