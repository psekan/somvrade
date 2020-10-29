export function login(username: string, password: string) {
  return Promise.resolve({
    access_token: 'fdsfds',
    token_type: 'Bearer',
    expires_in: 3600,
  });
}
