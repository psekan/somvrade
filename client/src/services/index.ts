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
    body: formData,
  });
}

export interface CollectionPointEntity {
  id: string;
  county: string;
  city: string;
  district: string;
  address: string;
  active: boolean;
}

export function useCollectionPoints(onlyWaiting: boolean) {
  const [session] = useSession();

  return useFetch<CollectionPointEntity[]>(
    '/api/collectionpoints' + (onlyWaiting ? '/waiting' : ''),
    withSessionHeaders(session),
  );
}

export async function deleteCollectionPoint(id: string, session: Session): Promise<LoginResponse> {
  return fetchJson(`/api/collectionpoints/${id}`, {
    method: 'DELETE',
    ...withSessionHeaders(session),
  });
}

export async function approveCollectionPoint(
  entity: CollectionPointEntity,
  session: Session,
): Promise<LoginResponse> {
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
      'Content-Type': 'application/json',
    },
  };
}

export function useCollectionPointsPublic(county: string) {
  return useFetch<CollectionPointEntity[]>(
    `/api/collectionpoints?region=${county}`,
    undefined,
    900,
  );
}

export interface CollectionPointEntry {
  id: string;
  arrive: string;
  departure: string;
  token: string;
  length: number;
}

export function useCollectionPointEntries(id: string) {
  return useFetch<CollectionPointEntry[]>(`/api/collectionpoints/${id}/entries`);
  // return useFetch<CollectionPointEntry[]>(`/mock/entries.json`);
}

export interface RegisterToCollectionPointRequest {
  arrive: string;
  length: number;
  recaptcha: string;
}

export interface RegisterToCollectionPointResponse {
  arrive: string;
  length: number;
  collection_point_id: string;
  token: string;
  id: number;
}

export async function registerToCollectionPoint(
  collectionPointId: string,
  entity: RegisterToCollectionPointRequest,
): Promise<RegisterToCollectionPointResponse> {
  return fetchJson(`/api/collectionpoints/${collectionPointId}/entries`, {
    method: 'POST',
    body: JSON.stringify(entity),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export async function updateDeparture(token: string, id: string, departure: string, recaptchaToken: string): Promise<any> {
  return fetchJson(`/api/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ token, departure, recaptcha: recaptchaToken }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
