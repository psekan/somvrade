import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link, Typography, makeStyles } from '@material-ui/core';
import { Public } from './public';
import { Admin } from './admin';

const useStyles = makeStyles({
  contact: {
    margin: '60px 0 80px',
    textAlign: 'center',
    fontSize: '0.9rem',
    lineHeight: '1.5em',
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <>
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
      <Typography variant={'body1'} className={classes.contact}>
        Zaznamenali ste chybu, nenašli ste odberné miesto, alebo máte iný dotaz? Prosím, napíšte nám
        na <Link href="mailto:info@somvrade.sk">info@somvrade.sk</Link>, alebo nám zavolajte na{' '}
        <Link href="tel:0233070498">02/33070498</Link>, kde zistíte viac informácií.
      </Typography>
    </>
  );
}
