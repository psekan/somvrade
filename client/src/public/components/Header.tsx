import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Fab } from '@material-ui/core';
import classNames from 'classnames';
import { useSession } from '../../Session';
import NavigationIcon from '@material-ui/icons/Navigation';

const useStyles = makeStyles(theme => ({
  margin: {
    marginBottom: '2rem',
  },
  compact: {
    // background: theme.palette.action.hover,
    padding: 10,

    '& h1': {
      fontSize: '2rem',
      // fontWeight: 600,
      transition: 'all 0.3s',
    },
  },
  headingLink: {
    textDecoration: 'none',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
}));

export function Header({ compact }: { compact: boolean }) {
  const classes = useStyles();
  const [session] = useSession();
  return (
    <div className={classNames(classes.margin/*, compact && classes.compact*/)}>
      <Link to={'/'} className={classes.headingLink}>
        <Typography variant="h1">Som v rade</Typography>
      </Link>
      <Typography variant="subtitle1" gutterBottom={!compact}>
        {compact
          ? 'a chcem pomôcť'
          : 'Aktuálne informácie o dĺžke čakania na celoplošné testovanie COVID-19.'}
      </Typography>
      {session.isRegistered && (
        <Fab
          variant="extended"
          color="primary"
          className={classes.fab}
          href={`/zadat-pocet-cakajucich/${session.registeredToken?.county}/${session.registeredToken?.collectionPointId}/register`}>
          <NavigationIcon/>
          Moje odberné miesto
        </Fab>
        // <TextLink
        //   to={`/zadat-pocet-cakajucich/${session.registeredToken?.county}/${session.registeredToken?.collectionPointId}/register`}
        //   text={'Moje odberné miesto'}
        // />
      )}
    </div>
  );
}
