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

  const fetchFn =
    process.env.REACT_APP_USE_MOCK === 'true' ? (await import('./mock')).default : fetch;

  const resp = await fetchFn(url, options);
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
