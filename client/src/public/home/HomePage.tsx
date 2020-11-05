import React from 'react';
import { Link, Typography, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/Today';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import { NavLink } from '../components/NavLink';
import { useSession } from '../../Session';

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
      fontSize: '1.2rem',
    },
    contact: {
      textAlign: 'center',
      margin: '1.5rem 0',
      fontSize: '1rem',
      paddingBottom: 40,
    },
    infoMessage: {
      margin: '20px 0px',
      display: 'flex',
    },
    infoMessageIcon: {
      verticalAlign: 'bottom',
      marginRight: 10,
    },
    bold: {
      fontWeight: 800,
    },
  }),
);

export function HomePage() {
  const classes = useStyles();
  const [session] = useSession();

  return (
    <div>
      <Typography variant={'h6'} className={classes.optionsTitle}>
        2. kolo celoplošného testovania
      </Typography>
      <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
        Zoznam odberných miest je aktualizovaný podľa okresov, v ktorých sa uskutočňuje 2. kolo
        celoplošného testovania.
      </Typography>
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
          <Grid item md={6} xs={12}>
            <NavLink
              to={`/favorites/${(session.favorites || [])
                .map(it => it.county + ':' + it.entryId)
                .join(',')}`}
              label={'Moje uložené odberné miesta'}
              description={'Chcem poznať stav'}
            />
          </Grid>
        </Grid>
      </div>
      <Typography variant={'h6'}>Informácie o testovaní:</Typography>
      <div className={classes.infoMessage}>
        <CalendarIcon fontSize={'small'} className={classes.infoMessageIcon} />
        <span>
          Druhé kolo celoplošného testovania prebieha{' '}
          <span className={classes.bold}>
            v 45. okresoch v sobotu 7. novembra a v nedeľu 8. novembra, od 8:00 do 20:00.
          </span>{' '}
          Zoznam okresov, v ktorých sa koná druhé kolo celoplošného testovania nájdete na stránke{' '}
          <Link href={'https://www.somzodpovedny.sk/'} target={'_blank'}>
            somzodpovedny.sk
          </Link>
        </span>
      </div>
      <div className={classes.infoMessage}>
        <ClockIcon fontSize={'small'} className={classes.infoMessageIcon} />
        <span>
          <span className={classes.bold}>Prestávka v testovaní</span> - odberné miesta budú mať{' '}
          <span className={classes.bold}>dve prestávny</span> počas testovacích dní a to spravidla{' '}
          <span className={classes.bold}>
            od 12:00 do 12:45 a od 17:00 do 17:30. Časy prestávok sa môžu líšiť
          </span>{' '}
          a preto odporúčame sledovať aktuálne informácie pre vami preferované odberné miesto.
        </span>
      </div>

      <Typography variant={'h6'}>Ako prebieha testovanie:</Typography>
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
