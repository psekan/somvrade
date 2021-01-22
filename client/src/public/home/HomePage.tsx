import React from 'react';
import { Link, Typography, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/Today';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import { NavLink } from '../components/NavLink';
import odberneMiestaLogo from './components/odbernemiesta.sk_logo.png';
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
      marginBottom: 20,
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
    odbernieMiestaLogo: {
      display: 'block',
      textAlign: 'center',
      padding: 10,
      '& img': {
        maxWidth: 300,
      },
    },
  }),
);

export function HomePage() {
  const classes = useStyles();
  const [session] = useSession();

  return (
    <div>
      {/*<Typography variant={'h6'} className={classes.optionsTitle}>*/}
      {/*  Antigénové testovania*/}
      {/*</Typography>*/}
    <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
        V prípade, že sa Vaša obec alebo odberné miesto nenachádza v zozname, napíšte nám na emailovú adresu{' '}
        <Link href="mailto:somvrade@gmail.com">somvrade@gmail.com</Link>.
    </Typography>
    <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
        Zoznam odberných miest je aktualizovaný podľa údajov zverejnených Ministerstvom zdravotníctva.
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
              to={`/watching/${(session.favorites || [])
                .map(it => it.county + ':' + it.entryId)
                .join(',')}`}
              label={'Sledované odberné miesta'}
              description={'Chcem poznať stav'}
            />
          </Grid>
        </Grid>
      </div>
      <Typography variant={'h6'}>Informácie o testovaní:</Typography>
      <div className={classes.infoMessage}>
        <CalendarIcon fontSize={'small'} className={classes.infoMessageIcon} />
        <span>
          <span className={classes.bold}>Posledné odbery</span> sú vykonávané <span className={classes.bold}>cca 30 min. pre koncom</span> otváracej doby, z dôvodu vyhodnocovania testov.
Počas sviatkov <span className={classes.bold}>24.12. - 26.12.2020, 1.1.2021 a 6.1.2021</span> budú bezplatné antigénové <span className={classes.bold}>odberné miesta zatvorené</span>.
        </span>
      </div>
      <div className={classes.infoMessage}>
        <ClockIcon fontSize={'small'} className={classes.infoMessageIcon} />
        <span>
          <span className={classes.bold}>Prestávka v testovaní</span> - odberné miesta majú obvikle{' '}
          <span className={classes.bold}>obedné prestávky</span>. Ich čas su môžete skontrolovať na stránke {' '}
          <span className={classes.bold}>
            Ministerstva zdravotníctva
          </span>{' '}
          prípadne na našich stránach, po vyhľadaní odberného miesta.
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
        Aktuálne informácie o antigénovom testovaní nájdete na{' '}
        <Link href={'https://www.health.gov.sk/?ag-mom'} target={'_blank'}>
            https://www.health.gov.sk/?ag-mom
        </Link>
      </Typography>
      {/*<Typography variant={'subtitle2'} align={'center'}>*/}
      {/*  Ak ste nenašli vaše odberné miesto, využite partnerskú službu na:*/}
      {/*</Typography>*/}
      {/*<Link*/}
      {/*  href={'https://odbernemiesta.sk/'}*/}
      {/*  target={'_blank'}*/}
      {/*  className={classes.odbernieMiestaLogo}*/}
      {/*>*/}
      {/*  <img src={odberneMiestaLogo} alt={'odbernemiesta.sk'} />*/}
      {/*</Link>*/}
    </div>
  );
}
