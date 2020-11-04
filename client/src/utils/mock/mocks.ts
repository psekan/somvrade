const mocks = [
  {
    urlMath: '/api/collectionpoints\\?',
    method: 'GET',
    response: [
      {
        id: '1',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'bar',
        active: true,
      },
    ],
  },
  {
    urlMath: '/api/collectionpoints/[^/]*/entries',
    method: 'GET',
    response: generateEntries(30),
  },

  {
    urlMath: '/api/collectionpoints/[^/]*/entries',
    method: 'POST',
    response: {
      arrive: '',
      length: 10,
      collection_point_id: '1',
      token: '111',
      id: '123',
    },
  },
  {
    urlMath: '/api/entries/',
    method: 'PUT',
    response: {},
  },
];

function generateEntries(count = 10) {
  const template = {
    id: '1',
    arrive: '7:10',
    departure: '7:20',
    token: '123',
    length: 10,
  };
  const entries = [];
  for (let i = 0; i < count; i++) {
    entries.push({ ...template, id: i });
  }

  return entries;
}

export default mocks;
