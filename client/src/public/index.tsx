import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container } from './components/Container';
import { HomePage } from './home/HomePage';
import { CheckWaiting, PlaceDetail as CheckWaitingPlaceDetail } from './checkwaiting';
import { SetWaiting, PlaceRegister } from './setwaiting';

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
      </Switch>
    </Container>
  );
}
