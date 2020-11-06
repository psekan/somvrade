import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import { CollectionPointEntity, CollectionPointEntry } from '../../services';

const mocks = [
  {
    urlMath: '/api/collectionpoints/[^/]*/entries',
    method: 'GET',
    response: () => generateEntries(),
  },
  {
    urlMath: '/api/collectionpoints',
    method: 'GET',
    response: getCollectionPoints,
  },
  {
    urlMath: '/api/auth/collectionpoints',
    method: 'GET',
    response: getCollectionPoints,
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

  {
    urlMath: '/api/login',
    method: 'POST',
    response: () => ({
      token: '123',
      token_type: 'Bearer',
      expires_in: 33,
    }),
  },
  {
    urlMath: '/api/collectionpoints/[^/]*/break',
    method: 'PUT',
    response: () => ({}),
  },
];

function getCollectionPoints(): CollectionPointEntity[] {
  return [
    {
      id: '1',
      county: 'Bratislavsky',
      city: 'Bratislava',
      region: 'region',
      address: 'Bratislava, Stare mesto',
      teams: 1,
    },
    {
      id: '2',
      county: 'Bratislavsky',
      city: 'Bratislava',
      region: 'region',
      address: 'ZŠ I. Bukovčana 3 ',
      teams: 3,
      break_start: '10:10',
      break_stop: '10:40',
      break_note: 'Prestavka pre technicke problemy',
    },
    {
      id: '3',
      county: 'Bratislavsky',
      city: 'Bratislava',
      region: 'region',
      address: 'Šport. areál P. Horova 16 ',
      teams: 2,
    },
    {
      id: '4',
      county: 'Bratislavsky',
      city: 'Bratislava',
      region: 'region',
      address: 'Vila Košťálová, Novoveská 17 ',
    },
    {
      id: '5',
      county: 'Bratislavsky',
      city: 'Bratislava',
      region: 'region',
      address: 'Istra Centrum, Hradištná 43',

      teams: 4,
    },
    {
      id: '6',
      county: 'Bratislavsky',
      city: 'Bratislava',
      region: 'region',
      address: 'Duálna akadémia, J. Jonáša 5',
    },
  ];
}

function generateEntries(count = Math.ceil(Math.random() * 40)) {
  const template: CollectionPointEntry = {
    id: '1',
    arrive: '07:10',
    departure: '07:10',
    token: '123',
    length: 10,
    verified: false,
    collection_point_id: '0',
    admin_note: null,
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
      admin_note: i % 2 === 0 ? 'Prestavka o 10:15 do 10:45.' : null,
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
