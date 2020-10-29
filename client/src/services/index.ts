import { useFetch } from '../hooks';
import { fetchJson } from '../utils';
import { useSession, Session } from '../Session';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export function login(username: string, password: string): Promise<LoginResponse> {
  const token = btoa(`${username}:${password}`);
  return fetchJson('/mock/login.json', {
    method: 'GET', // FIXME change to POST
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
}

interface CollectionPointsResponse {
  data: CollectionPointEntity[];
}

export interface CollectionPointEntity {
  id: string;
  county: string;
  city: string;
  district: string;
  place: string;
  active: boolean;
}

export function useCollectionPoints() {
  const [session] = useSession();

  return useFetch<CollectionPointsResponse>('/mock/points.json', withSessionHeaders(session));
}

export async function deleteCollectionPoint(id: string, session: Session): Promise<LoginResponse> {
  return fetchJson('/mock/removeApprovePoint.json', {
    method: 'GET', // FIXME DELETE
    ...withSessionHeaders(session),
  });
}

export async function approveCollectionPoint(id: string, session: Session): Promise<LoginResponse> {
  return fetchJson('/mock/removeApprovePoint.json', {
    method: 'GET', // FIXME PUT
    ...withSessionHeaders(session),
  });
}

export async function updateCollectionPoint(
  entity: CollectionPointEntity,
  session: Session,
): Promise<LoginResponse> {
  return fetchJson('/api/collectionpoints', {
    method: 'PUT',
    body: JSON.stringify(entity),
    ...withSessionHeaders(session),
  });
}

function withSessionHeaders(session: Session) {
  return {
    headers: {
      Authorization: `${session.token?.tokenType} ${session.token?.accessToken}`,
    },
  };
}
