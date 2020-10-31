import React from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { Header } from './Header';

const useStyles = makeStyles({
  container: {
    padding: '30px 10px 10px',
  },
});

export function Container({ children }: React.PropsWithChildren<{}>) {
  const classes = useStyles();
  const location = useLocation();
  return (
    <div className={classes.container}>
      <Header compact={location.pathname !== '/'} />
      {children}
    </div>
  );
}
