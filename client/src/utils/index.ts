export async function fetchJson(url: string, options?: RequestInit) {
  const resp = await fetch(url, options);
  const json = await resp.json();
  if (resp.ok) {
    return Promise.resolve(json);
  }
  return Promise.reject(json);
}
