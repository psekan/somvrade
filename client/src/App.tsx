import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Public } from './public';
import { Admin } from './admin';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/">
          <Public />
        </Route>
      </Switch>
    </Router>
  );
}
