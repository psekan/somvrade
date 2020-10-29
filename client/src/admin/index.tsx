import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { AdminHomePage } from './home/AdminHomePage';
import { LoginPage } from './login/Login';
import { useSession } from '../Session';

export function Admin() {
  const history = useHistory();
  const [session] = useSession();

  useEffect(() => {
    history.replace(session.isLoggedIn ? '/admin' : '/admin/login');
  }, [history, session]);

  return (
    <Switch>
      <Route path="/admin/login" exact>
        <LoginPage />
      </Route>
      {session.isLoggedIn && (
        <Route path="/admin" exact>
          <AdminHomePage />
        </Route>
      )}
    </Switch>
  );
}
