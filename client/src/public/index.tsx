import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from './components/Container';
import { HomePage } from './home/HomePage';
import { CheckWaiting, PlaceDetailPage as CheckWaitingPlaceDetail } from './checkwaiting';
import { SetWaiting, PlaceRegister } from './setwaiting';
import { Favorites } from './favorites';
import { NotFound } from './notfound';

export function Public() {
  return (
    <Container>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/aktualne-pocty-cakajucich" exact>
          <CheckWaiting />
        </Route>
        <Route path="/aktualne-pocty-cakajucich/:county" exact>
          <CheckWaiting />
        </Route>
        <Route path="/aktualne-pocty-cakajucich/:county/:id" exact>
          <CheckWaitingPlaceDetail />
        </Route>
        <Route path="/zadat-pocet-cakajucich" exact>
          <SetWaiting />
        </Route>
        <Route path="/zadat-pocet-cakajucich/:county" exact>
          <SetWaiting />
        </Route>
        <Route path="/zadat-pocet-cakajucich/:county/:id" exact>
          <SetWaiting />
        </Route>
        <Route path="/zadat-pocet-cakajucich/:county/:id/register" exact>
          <PlaceRegister />
        </Route>
        <Route path={['/watching/:ids', '/watching']} exact>
          <Favorites />
        </Route>
        <Redirect exact path={'//'} to={'/'} />
        <Route default>
          <NotFound />
        </Route>
      </Switch>
    </Container>
  );
}
