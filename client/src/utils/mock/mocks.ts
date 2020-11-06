import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';

const mocks = [
  {
    urlMath: '/api/collectionpoints\\?',
    method: 'GET',
    response: () => [
      {
        id: '1',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'Bratislava, Stare mesto',
        active: true,
        teams: 1,
      },
      {
        id: '2',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'ZŠ I. Bukovčana 3 ',
        active: true,
        teams: 3,
      },
      {
        id: '3',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'Šport. areál P. Horova 16 ',
        active: true,
        teams: 2,
      },
      {
        id: '4',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'Vila Košťálová, Novoveská 17 ',
        active: true,
      },
      {
        id: '5',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'Istra Centrum, Hradištná 43',
        active: true,
        teams: 4,
      },
      {
        id: '6',
        county: 'Bratislavsky',
        city: 'Bratislava',
        district: 'foo',
        address: 'Duálna akadémia, J. Jonáša 5',
        active: true,
      },
    ],
  },
  {
    urlMath: '/api/collectionpoints/[^/]*/entries',
    method: 'GET',
    response: () => generateEntries(),
  },

  {
    urlMath: '/api/collectionpoints/[^/]*/entries',
    method: 'POST',
    response: () => ({
      arrive: '',
      length: 10,
      collection_point_id: '1',
      token: '111',
      id: '123',
    }),
  },
  {
    urlMath: '/api/entries/',
    method: 'PUT',
    response: () => ({}),
  },
];

function generateEntries(count = Math.ceil(Math.random() * 40)) {
  const template = {
    id: '1',
    arrive: '07:10',
    departure: '07:10',
    token: '123',
    length: 10,
    verified: false,
  };
  const entries = [];
  for (let i = 0; i < count; i++) {
    const arrivedSub = Math.ceil(Math.random() * 400000 * (count - i));
    entries.push({
      ...template,
      id: i,
      length: Math.ceil(Math.random() * 100),
      arrive: format(new Date(Date.now() - arrivedSub), 'HH:mm'),
      departure: format(new Date(Date.now() - arrivedSub + 1000000), 'HH:mm'),
      verified: i % 6 === 0,
    });
  }

  return entries.sort((a, b) => {
    const firstArrivePair = a.arrive.split(':');
    const secondArrivePair = b.arrive.split(':');

    const firstDate = new Date();
    firstDate.setHours(Number(firstArrivePair[0]));
    firstDate.setMinutes(Number(firstArrivePair[1]));

    const secondDate = new Date();
    secondDate.setHours(Number(secondArrivePair[0]));
    secondDate.setMinutes(Number(secondArrivePair[1]));

    return isAfter(firstDate, secondDate) ? -1 : 1;
  });
}

export default mocks;
