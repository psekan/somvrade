export async function fetchJson(url: string, options?: RequestInit, cacheTime?: number) {
  const cacheKey = (options?.method || 'GET') + url;
  try {
    let cached = localStorage.getItem(cacheKey);
    if (cached) {
      const obj = JSON.parse(cached);
      if (obj.validity > Date.now()) {
        return Promise.resolve(obj.data);
      }
    }
  } catch {
    // noop
  }

  const resp = await fetch(url, options);
  const json = await resp.json();
  if (resp.ok) {
    if (cacheTime) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: json, validity: Date.now() + cacheTime * 1000 }),
      );
    }

    return json;
  }
  return Promise.reject(json);
}
