import React from 'react';
import { Link, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'block',
    marginTop: 20,
    color: theme.palette.primary.main,
  },
  center: {
    textAlign: 'center',
  },
}));

export function TextLink({ to, text, center }: { to: string; text: string; center?: boolean }) {
  const classes = useStyles();
  return (
    <RouterLink to={to} className={classNames(classes.link, center && classes.center)}>
      <Link component={'span'}>{text}</Link>
    </RouterLink>
  );
}
