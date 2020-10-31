import React, { useContext, useState, useMemo } from 'react';

const defaultSession: Session = {
  isLoggedIn: false,
};

const STORAGE_KEY = '@somvrade';
const STORAGE_KEY_COL_POINT_TOKEN = '@somvrade_cl_p_token';

const initialActions: SessionContextActions = {
  initSecureSession: () => null,
  destroySession: () => null,
  registerToCollectionPoint: () => null,
  completeCollectionPoint: () => null,
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
}

type SessionContextType = [Session, SessionContextActions];

export interface Token {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface SessionContextActions {
  initSecureSession: (token: Token) => void;
  registerToCollectionPoint: (token: string, entityId: string, collectionPointId: string, county: string) => void;
  completeCollectionPoint: () => void;
  destroySession: () => void;
}

const SessionContext = React.createContext<SessionContextType>([defaultSession, initialActions]);

export function SessionContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [state, setState] = useState({ ...defaultSession, ...restoreSession() });

  const sessionContext = useMemo<SessionContextType>(() => {
    return [
      state,
      {
        initSecureSession: token => {
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
            county
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

    return restored;
  } catch {
    return undefined;
  }
}
