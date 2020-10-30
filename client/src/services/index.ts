import { useFetch } from '../hooks';
import { fetchJson } from '../utils';
import { useSession, Session } from '../Session';

interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

export function login(username: string, password: string): Promise<LoginResponse> {
  let formData = new FormData();
  formData.append('email', username);
  formData.append('password', password);

  return fetchJson('/api/login', {
    method: 'POST',
    body: formData
  });
}

export interface CollectionPointEntity {
  id: string;
  county: string;
  city: string;
  district: string;
  place: string;
  active: boolean;
}

export function useCollectionPoints(onlyWaiting: boolean) {
  const [session] = useSession();

  return useFetch<CollectionPointEntity[]>('/api/collectionpoints' + (onlyWaiting ? '/waiting' : ''), withSessionHeaders(session));
}

export async function deleteCollectionPoint(id: string, session: Session): Promise<LoginResponse> {
  return fetchJson(`/api/collectionpoints/${id}`, {
    method: 'DELETE',
    ...withSessionHeaders(session),
  });
}

export async function approveCollectionPoint(entity: CollectionPointEntity, session: Session): Promise<LoginResponse> {
  entity.active = !entity.active;
  return fetchJson(`/api/collectionpoints/${entity.id}`, {
    method: 'PUT',
    body: JSON.stringify(entity),
    ...withSessionHeaders(session),
  });
}

export async function updateCollectionPoint(
  entity: CollectionPointEntity,
  session: Session,
): Promise<LoginResponse> {
  return fetchJson(`/api/collectionpoints/${entity.id}`, {
    method: 'PUT',
    body: JSON.stringify(entity),
    ...withSessionHeaders(session),
  });
}

function withSessionHeaders(session: Session) {
  return {
    headers: {
      Authorization: `${session.token?.tokenType} ${session.token?.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  };
}
