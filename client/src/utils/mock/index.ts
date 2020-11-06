import mocks from './mocks';

export default async function mock(url: string, options?: RequestInit) {
  const method = options?.method || 'GET';
  console.log('MOCK Req:', method, url, options?.body);

  const mockObj = mocks.find(m => m.method === method && new RegExp(m.urlMath).test(url));

  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!mockObj) {
    console.log('MOCK Res:', 'Mock not found');
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Mock not found' }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => {
      const response = mockObj.response();
      console.log('MOCK Res:', JSON.stringify(response));
      return Promise.resolve(response);
    },
  });
}
