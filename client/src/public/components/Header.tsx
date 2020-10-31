import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { useSession } from '../../Session';
import { TextLink } from './TextLink';

const useStyles = makeStyles(theme => ({
  compact: {
    background: theme.palette.action.hover,
    padding: 10,
    marginBottom: 50,

    '& h1': {
      fontSize: '1.4rem',
      fontWeight: 600,
      transition: 'all 0.3s',
    },
  },
  headingLink: {
    textDecoration: 'none',
  },
}));

export function Header({ compact }: { compact: boolean }) {
  const classes = useStyles();
  const [session] = useSession();
  return (
    <div className={classNames(compact && classes.compact)}>
      <Link to={'/'} className={classes.headingLink}>
        <Typography variant="h1">Som v rade</Typography>
      </Link>
      <Typography variant="subtitle1" gutterBottom={!compact}>
        {compact
          ? 'a chcem pomôcť'
          : 'Aktuálne informácie o dĺžke čakania na celoplošné testovanie COVID-19.'}
      </Typography>
      {session.isRegistered && (
        <TextLink
          to={`/zadat-pocet-cakajucich/${session.registeredToken?.county}/${session.registeredToken?.entryId}/register`}
          text={'Moje odberné miesto'}
        />
      )}
    </div>
  );
}
