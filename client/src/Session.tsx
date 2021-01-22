import React, { useContext, useState, useMemo, useEffect } from 'react';
import { refreshToken } from './services';

const defaultSession: Session = {
  isLoggedIn: false,
};
const currentDate = new Date();
const STORAGE_KEY = '@somvrade';
const STORAGE_KEY_COL_POINT_TOKEN = `@somvrade_cl_p_token_${currentDate.getFullYear()}_${currentDate.getMonth()}_${currentDate.getDay()}`;
const STORAGE_KEY_FAVORITES = '@somvrade_favorites';

const initialActions: SessionContextActions = {
  initSecureSession: () => null,
  destroySession: () => null,
  registerToCollectionPoint: () => null,
  completeCollectionPoint: () => null,
  setFavorite: () => null,
};

export interface Session {
  isLoggedIn: boolean;
  token?: Token;
  isRegistered?: boolean;
  registeredToken?: {
    token: string;
    entryId: string;
    collectionPointId: string;
    county: string;
    completed: boolean;
  };
  favorites?: Array<{ county: string; entryId: string }>;
}

type SessionContextType = [Session, SessionContextActions];

export interface Token {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface SessionContextActions {
  initSecureSession: (token: Token) => void;
  registerToCollectionPoint: (
    token: string,
    entityId: string,
    collectionPointId: string,
    county: string,
  ) => void;
  completeCollectionPoint: () => void;
  destroySession: () => void;
  setFavorite: (county: string, entryId: string) => void;
}

const SessionContext = React.createContext<SessionContextType>([defaultSession, initialActions]);

export function SessionContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [state, setState] = useState({ ...defaultSession, ...restoreSession() });

  useEffect(() => {
    let timeout: any;

    if (state.token) {
      const runRefreshIn = state.token.expiresIn - Date.now();
      //eslint-disable-next-line
      console.log('token valid', runRefreshIn / 1000, 'seconds');

      const destroSession = () =>
        setState(prev => {
          sessionStorage.removeItem(STORAGE_KEY);
          return { ...prev, token: undefined, isLoggedIn: false };
        });

      if (runRefreshIn < 0) {
        destroSession();
        return;
      }

      timeout = setTimeout(() => {
        //eslint-disable-next-line
        console.log('refreshing token');
        refreshToken(state.token)
          .then(resp =>
            setState(prev => ({
              ...prev,
              token: {
                accessToken: resp.token,
                tokenType: resp.token_type,
                expiresIn: new Date(Date.now() + (resp.expires_in - 60) * 1000).getTime(),
              },
            })),
          )
          .catch(destroSession);
      }, runRefreshIn);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [state.token]);

  const sessionContext = useMemo<SessionContextType>(() => {
    return [
      state,
      {
        initSecureSession: token => {
          token.expiresIn = new Date(Date.now() + (token.expiresIn - 60) * 1000).getTime();
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(token));
          setState({ ...state, isLoggedIn: true, token });
        },
        destroySession: () => {
          sessionStorage.removeItem(STORAGE_KEY);
          setState({ ...defaultSession });
        },
        registerToCollectionPoint: (token, entryId, collectionPointId, county) => {
          const registeredObj = {
            token,
            entryId,
            collectionPointId,
            completed: false,
            county,
          };
          localStorage.setItem(STORAGE_KEY_COL_POINT_TOKEN, JSON.stringify(registeredObj));
          setState({ ...state, isRegistered: true, registeredToken: registeredObj });
        },
        completeCollectionPoint: () => {
          const newRegistrationToken = { ...state.registeredToken, completed: true };
          localStorage.setItem(STORAGE_KEY_COL_POINT_TOKEN, JSON.stringify(newRegistrationToken));
          setState({
            ...state,
            isRegistered: true,
            registeredToken: newRegistrationToken as any,
          });
        },
        setFavorite: (county, entryId) => {
          const exists = state.favorites?.some(
            it => it.county === county && it.entryId === entryId,
          );
          const newState = exists
            ? state.favorites?.filter(it => it.county !== county || it.entryId !== entryId)
            : [...(state.favorites || []), { county, entryId }];
          localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newState));
          setState({
            ...state,
            favorites: newState,
          });
        },
      },
    ];
  }, [state]);

  return <SessionContext.Provider value={sessionContext}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}

function restoreSession(): Session | undefined {
  try {
    const restored: Session = {} as any;
    const tokenFromStorage = sessionStorage.getItem(STORAGE_KEY);
    const restoredSessionToken: Token = tokenFromStorage ? JSON.parse(tokenFromStorage) : {};
    const isAdminLoggedId = restoredSessionToken.accessToken && restoredSessionToken.tokenType;
    if (isAdminLoggedId) {
      restored.isLoggedIn = true;
      restored.token = restoredSessionToken;
    }

    const registeredCollectionPointToken = localStorage.getItem(STORAGE_KEY_COL_POINT_TOKEN);
    const parsedRegisteredCollectionPointToken =
      registeredCollectionPointToken && JSON.parse(registeredCollectionPointToken);

    if (registeredCollectionPointToken) {
      restored.isRegistered = true;
      restored.registeredToken = parsedRegisteredCollectionPointToken;
    }

    const favoritesFromStorage = localStorage.getItem(STORAGE_KEY_FAVORITES);
    const parsedFavorites = favoritesFromStorage && JSON.parse(favoritesFromStorage);
    if (favoritesFromStorage) {
      restored.favorites = parsedFavorites;
    }

    return restored;
  } catch {
    return undefined;
  }
}
