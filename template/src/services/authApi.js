import { get, post } from './api';

export async function loginApi(credentials) {
  return post('/auth/login', credentials);
}

export async function meApi() {
  return get('/auth/me');
}
