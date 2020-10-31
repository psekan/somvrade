import React from 'react';
import { Link, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import { NavLink } from '../components/NavLink';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    options: {
      background: theme.palette.action.hover,
      margin: '20px -26px',
      padding: '20px 20px 40px',
    },
    optionsTitle: {
      margin: '0 0 20px',
    },
    linksContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '0 -5px',
    },
    video: {
      maxWidth: 500,
      width: '100%',
      margin: '20px auto',
      height: 180,
      display: 'block',
    },
    bottomInfo: {
      textAlign: 'center',
      display: 'block',
    },
  }),
);

export function HomePage() {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Prvé kolo testovania prebieha v sobotu 31. októbra a v nedeľu 1. novembra, od 7:00 do 21:30.
        Bližšie informácie nájdete na{' '}
        <Link href={'https://www.somzodpovedny.sk/'} target={'_blank'}>
          somzodpovedny.sk
        </Link>
      </Typography>
      <div className={classes.options}>
        <Typography variant={'h6'} className={classes.optionsTitle}>
          Vyberte jednu z možností:
        </Typography>
        <div className={classes.linksContainer}>
          <NavLink
            to={'/aktualne-pocty-cakajucich'}
            label={'Zistiť aktuálne počty čakajúcich'}
            description={'Idem sa dat testovať'}
          />
          <NavLink
            to={'/zadat-pocet-cakajucich'}
            label={'Zadať počet čakajúcich'}
            description={'Čakám v rade'}
          />
        </div>
      </div>
      <Typography variant={'h6'}>Informácie o testovaní:</Typography>
      <Typography variant={'body1'}>Ako prebieha testovanie:</Typography>
      <iframe
        title={'Ako prebieha testovanie'}
        className={classes.video}
        src={'https://www.youtube.com/embed/oTKriurg7Co'}
        frameBorder="0"
        allow={'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
        allowFullScreen
      ></iframe>
      <Typography variant={'body1'} className={classes.bottomInfo}>
        Aktuálne informácie o celoplošnom testovaní nájdete na{' '}
        <Link href={'https://www.somzodpovedny.sk/'} target={'_blank'}>
          somzodpovedny.sk
        </Link>
      </Typography>
    </div>
  );
}
