import { useFetch } from '../hooks';
import { fetchJson } from '../utils';
import { useSession, Session } from '../Session';

export interface CollectionPointEntity {
  id: string;
  county: string;
  city: string;
  region: string;
  address: string;
  teams?: number;
  external_system_id?: 0 | 1 | 2 | 3;
  external_system_link?: string | null;
  break_start?: string | null;
  break_stop?: string | null;
  break_note?: string | null;
  note?: string | null;
}

export function useCollectionPointsPublic(county: string) {
  return useFetch<CollectionPointEntity[]>(
    `/api/collectionpoints?region=${county}`,
    undefined,
    300,
  );
}

export interface CollectionPointEntry {
  id: string;
  collection_point_id: string;
  arrive: string;
  departure: string;
  token: string;
  length: number;
  verified?: number;
  admin_note?: string | null;
}

export function useCollectionPointEntries(id: string) {
  return useFetch<CollectionPointEntry[]>(`/api/collectionpoints/${id}/entries`);
}

export interface RegisterToCollectionPointRequest {
  arrive: string;
  length: number;
  recaptcha: string;
  admin_note?: string | null;
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
  session?: Session,
): Promise<RegisterToCollectionPointResponse> {
  return fetchJson(`/api/collectionpoints/${collectionPointId}/entries`, {
    method: 'POST',
    body: JSON.stringify(entity),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...sessionHeaders(session),
    },
  });
}

export async function updateDeparture(
  token: string,
  id: string,
  departure: string,
  recaptchaToken: string,
): Promise<any> {
  return fetchJson(`/api/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ token, departure, recaptcha: recaptchaToken }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

/**
 * ADMIN
 */

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

export function refreshToken(token: Session['token']): Promise<LoginResponse> {
  return fetchJson('/api/auth/refresh', {
    method: 'POST',
    ...withSessionHeaders({ token }),
  });
}

export function useCollectionPointsAdmin() {
  const [session] = useSession();
  return useFetch<CollectionPointEntity[]>(`/api/auth/collectionpoints`, {
    method: 'GET',
    ...withSessionHeaders(session),
  });
}

export interface BreakRequest {
  break_start: string | null;
  break_stop: string | null;
  break_note?: string | null;
  token: string;
}

export async function setBreak(
  id: string,
  req: BreakRequest,
  session: Session,
): Promise<LoginResponse> {
  return fetchJson(`/api/collectionpoints/${id}/break`, {
    method: 'PUT',
    body: JSON.stringify(req),
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

function withSessionHeaders(session: { token?: Session['token'] }) {
  return {
    headers: sessionHeaders(session),
  };
}

function sessionHeaders(session?: { token?: Session['token'] }) {
  return (
    session && {
      Authorization: `${session.token?.tokenType} ${session.token?.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  );
}
