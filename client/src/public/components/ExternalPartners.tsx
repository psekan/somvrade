import React from 'react';
import { Typography, Link, makeStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 60,
    color: theme.palette.action.active,
  },
  iconWrapper: {
    textAlign: 'center',
  },
}));

export function OdberneMiesta() {
  return (
    <div>
      <ExternalIndicator />
      <Typography variant={'h6'} align={'center'} gutterBottom>
        Toto odberné miesto využíva na informovanie o čakacích dobách webovú stránku{' '}
        <Link href={'https://odbernemiesta.sk/'} target={'_blank'}>
          odbernemiesta.sk
        </Link>
      </Typography>
    </div>
  );
}

export function DefaultExternal() {
  return (
    <div>
      <ExternalIndicator />
      <Typography variant={'h6'} align={'center'} gutterBottom>
        Toto odberné miesto využíva vlastný systém. <br />
        Pre viac informácii navštívte webovú stránku mesta / obce.
      </Typography>
    </div>
  );
}

function ExternalIndicator() {
  const classes = useStyles();
  return (
    <div className={classes.iconWrapper}>
      <OpenInNewIcon className={classes.icon} />
    </div>
  );
}
