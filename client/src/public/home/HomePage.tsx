import React from 'react';
import { Link, Typography, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import { NavLink } from '../components/NavLink';
import { useSession } from '../../Session';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    options: {
      // background: theme.palette.action.hover,
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
      maxWidth: 700,
      width: '95%',
      margin: '20px auto',
      height: '50vh',
      display: 'block',
    },
    bottomInfo: {
      textAlign: 'center',
      display: 'block',
    },
    contact: {
      textAlign: 'center',
      margin: '1.5rem 0',
      fontWeight: 800,
      fontSize: '1.2rem'
    }
  }),
);

export function HomePage() {
  const classes = useStyles();
  const [session] = useSession();

  return (
    <div>
      <Typography variant="subtitle2" style={{marginBottom: '1rem'}}>
        Prvé kolo testovania prebieha v sobotu 31. októbra a v nedeľu 1. novembra, od 7:00 do 21:30.
        Bližšie informácie nájdete na{' '}
        <Link href={'https://www.somzodpovedny.sk/'} target={'_blank'}>
          somzodpovedny.sk
        </Link>
      </Typography>
      <Alert severity="info">
        V sobotu využilo túto službu 360 000 ľudí. Ďakujeme že pomáhate ostatným a šírite ju ďalej.
      </Alert>
      <div className={classes.options}>
        <Typography variant={'h6'} className={classes.optionsTitle}>
          Vyberte jednu z možností:
        </Typography>
        <Grid container className={classes.linksContainer} spacing={2}>
          <Grid item md={6} xs={12}>
            <NavLink
              to={'/aktualne-pocty-cakajucich'}
              label={'Zistiť aktuálne počty čakajúcich'}
              description={'Idem sa dat testovať'}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <NavLink
              to={'/zadat-pocet-cakajucich'}
              label={'Zadať počet čakajúcich'}
              description={'Čakám v rade'}
            />
          </Grid>
          {session.favorites && session.favorites.length !== 0 && (
            <Grid item md={6} xs={12}>
              <NavLink
                to={`/favorites/${session.favorites
                  .map(it => it.county + ':' + it.entryId)
                  .join(',')}`}
                label={'Moje uložené odberné miesta'}
                description={'Chcem poznať stav'}
              />
            </Grid>
          )}
        </Grid>
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

      <Typography variant={'body1'}  className={classes.contact}>
        V prípade otázok nás kontaktujte na <Link href="mailto:somvrade@gmail.com">somvrade@gmail.com</Link>.
      </Typography>
    </div>
  );
}
