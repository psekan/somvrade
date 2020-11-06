import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from './components/Container';
import { HomePage } from './home/HomePage';
import { CheckWaiting, PlaceDetailPage as CheckWaitingPlaceDetail } from './checkwaiting';
import { SetWaiting, PlaceRegister } from './setwaiting';
import { Favorites } from './favorites';
import { NotFound } from './notfound';
import { Link, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  contact: {
    margin: '60px 0',
    textAlign: 'center',
    fontSize: '0.9rem',
    lineHeight: '1.5em',
  },
});

export function Public() {
  const classes = useStyles();
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
      <Typography variant={'body1'} className={classes.contact}>
        Zaznamenali ste chybu, nenašli ste odberné miesto, alebo máte iný dotaz? Prosím, napíšte nám
        na <Link href="mailto:info@somvrade.sk">info@somvrade.sk</Link>, alebo nám zavolajte na{' '}
        <Link href="tel:0233070498">02/33070498</Link>, kde zistíte viac informácií.
      </Typography>
    </Container>
  );
}
