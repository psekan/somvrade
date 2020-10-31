import React from 'react';
import { makeStyles } from '@material-ui/core';
import { COUNTY } from '../../constants';
import { NavLink } from '../components/NavLink';

const useStyles = makeStyles({
  county: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  countyLink: {
    margin: '1em 5px',
    minWidth: 95,
    wordWrap: 'break-word',
    minHeight: 60,
  },
  changeLink: {
    display: 'block',
    textDecoration: 'underline',
    fontStyle: 'normal',
    marginTop: 10,
  },
});

interface CountyLinksProps {
  linkBase: string;
  selected?: string;
}

export function CountyLinks({ linkBase, selected }: CountyLinksProps) {
  const classes = useStyles();
  return (
    <div className={classes.county}>
      {COUNTY.filter(c => !selected || c.id === selected).map(county => (
        <NavLink
          compact
          key={county.id}
          to={selected ? linkBase : `${linkBase}/${county.id}`}
          label={county.name.split(' ')[0]}
          description={selected ? <i className={classes.changeLink}>Zmenit</i> : undefined}
          className={classes.countyLink}
        />
      ))}
    </div>
  );
}
