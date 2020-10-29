import React, { useContext, useState, useMemo } from 'react';

const defaultSession: Session = {
  isLoggedIn: false,
};

const STORAGE_KEY = '@somvrade';

const initialActions: SessionContextActions = {
  initSecureSession: () => null,
  destroySession: () => null,
};

interface Session {
  isLoggedIn: boolean;
  token?: Token;
}

type SessionContextType = [Session, SessionContextActions];

export interface Token {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface SessionContextActions {
  initSecureSession: (token: Token) => void;
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
    const tokenFromStorage = sessionStorage.getItem(STORAGE_KEY);
    const restoredSessionToken: Token = tokenFromStorage ? JSON.parse(tokenFromStorage) : {};
    if (restoredSessionToken.accessToken && restoredSessionToken.tokenType) {
      return {
        isLoggedIn: true,
        token: restoredSessionToken,
      };
    }
  } catch {
    return undefined;
  }
}
