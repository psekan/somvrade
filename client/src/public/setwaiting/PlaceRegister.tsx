import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PlaceIcon from '@material-ui/icons/Place';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

import {
  useCollectionPointsPublic,
  registerToCollectionPoint,
  updateDeparture,
} from '../../services';
import { TextLink } from '../components/TextLink';
import { BackToStartLink } from '../components/BackToStartLink';
import { useSession } from '../../Session';
import { TimePicker } from '@material-ui/pickers';

const useStyles = makeStyles({
  placeTitle: {
    fontStyle: 'italic',
    fontSize: '1.2rem',
    lineHeight: '1.2rem',
    marginBottom: 20,
  },
  timePicker: {
    width: 100,
  },
  waitingPeople: {
    width: 200,
  },
  formFields: {
    padding: 10,
    margin: '10px 0 20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  fullWidth: {
    width: '100%',
  },
});

export function PlaceRegister() {
  const classes = useStyles();
  const { county, id } = useParams<{ county: string; id: string }>();
  const { isLoading, response, error, refresh } = useCollectionPointsPublic(county);
  const detail = response?.find(it => String(it.id) === id);
  const [session] = useSession();

  return isLoading ? (
    <LinearProgress />
  ) : (
    <>
      {!detail && !error && <Alert severity={'warning'}>Odberné miesto nenájdené</Alert>}
      {error && (
        <Alert
          severity={'error'}
          action={
            <Button color="inherit" size="small" onClick={refresh}>
              Obnoviť
            </Button>
          }
        >
          Nastala neznáma chyba
        </Alert>
      )}
      {detail && (
        <div>
          <Typography variant={'h6'} gutterBottom>
            Na odbernom mieste
          </Typography>
          <Typography variant={'subtitle1'} gutterBottom className={classes.placeTitle}>
            <PlaceIcon fontSize={'small'} /> {detail.address}
          </Typography>
          {!session.isRegistered && !session.registeredToken?.completed && (
            <RegisterPlace id={id} county={county} />
          )}
          {session.isRegistered && !session.registeredToken?.completed && <UpdateDeparture />}
          {session.registeredToken?.completed && (
            <Alert severity={'success'}>
              Vaše údaje boli uložené. Prispeli ste k hladkému priebehu celoplošného testovania a
              pomohli ste mnohým ľuďom. Ďakujeme!
            </Alert>
          )}

          <TextLink
            to={`/aktualne-pocty-cakajucich/${county}`}
            text={'Pozrieť iné odberné miesto'}
            center
          />
          <BackToStartLink center />
        </div>
      )}
    </>
  );
}

function RegisterPlace({ id, county }: { id: string; county: string }) {
  const classes = useStyles();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [, sessionActions] = useSession();
  const [selectedDate, handleDateChange] = React.useState<Date | null>(new Date());

  const onCaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
  }, []);

  async function handleFormSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setRegisterError('');
    const form = evt.target as any;
    const arrivetime = selectedDate
      ? selectedDate.getHours() + ':' + selectedDate.getMinutes()
      : '';
    const waitingnumber = form.waitingnumber.value;
    if (!arrivetime || !waitingnumber) {
      setRegisterError('Všetky údaje sú povinné');
      return;
    }
    try {
      setIsRegistering(true);
      const response = await registerToCollectionPoint(id, {
        arrive: arrivetime,
        length: waitingnumber,
        recaptcha: recaptchaToken,
      });
      sessionActions.registerToCollectionPoint(
        response.token,
        String(response.id),
        String(response.collection_point_id),
        county,
      );
    } catch (err) {
      setIsRegistering(false);
      setRegisterError(
        err && err.messageTranslation
          ? err.messageTranslation
          : 'Chyba pri odosielaní dát, skúste znova neskôr.',
      );
    }
  }
  return (
    <>
      <Typography variant={'subtitle2'} gutterBottom>
        Keď dorazíte na toto odberné miest, zadajte čas vášho príchodu a počet ľudí čakajúcich pred
        vami:
      </Typography>
      <Typography variant={'h6'}>Zadať počet cakajúcich</Typography>
      <form onSubmit={handleFormSubmit}>
        <div className={classes.formFields}>
          <GoogleReCaptcha onVerify={onCaptchaVerify} />
          <Grid container justify="center" spacing={2}>
            <Grid item md={4} xs={6}>
              <TimePicker
                label="Čas príchodu"
                ampm={false}
                value={selectedDate}
                onChange={handleDateChange}
                className={classes.fullWidth}
                minutesStep={5}
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <TextField
                label="Počet čakajúcich ľudí"
                type="number"
                name={'waitingnumber'}
                InputProps={{ inputProps: { min: 0, max: 500 } }}
                className={classes.fullWidth}
              />
            </Grid>
          </Grid>
        </div>
        {(isRegistering || !recaptchaToken) && <LinearProgress />}
        {registerError && <Alert severity={'error'}>{registerError}</Alert>}
        <Button
          type={'submit'}
          variant={'contained'}
          color={'primary'}
          fullWidth
          disabled={isRegistering || !recaptchaToken}
        >
          Odoslať
        </Button>
      </form>
    </>
  );
}

function UpdateDeparture() {
  const classes = useStyles();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [session, sessionActions] = useSession();
  const [selectedDate, handleDateChange] = React.useState<Date | null>(new Date());

  const onCaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
  }, []);

  async function handleFormSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setIsRegistering(true);
    setRegisterError('');
    const departure = selectedDate ? selectedDate.getHours() + ':' + selectedDate.getMinutes() : '';
    if (!departure) {
      setRegisterError('Všetky údaje sú povinné');
      return;
    }
    try {
      await updateDeparture(
        session.registeredToken?.token || '',
        session.registeredToken?.entryId || '',
        departure,
        recaptchaToken,
      );
      sessionActions.completeCollectionPoint();
    } catch (err) {
      setIsRegistering(false);
      setRegisterError(
        err && err.messageTranslation
          ? err.messageTranslation
          : 'Chyba pri odosielaní dát, skúste znova neskôr.',
      );
    }
  }
  return (
    <>
      <Typography variant={'h6'}>Zadajte čas vášho odchodu</Typography>
      <Alert severity={'info'}>
        Údaje o Vašom príchode boli uložené. Nechajte si túto stránku otvorenú a keď dostanete
        výsledok testu, zadajte čas vášho odchodu.
      </Alert>
      <form onSubmit={handleFormSubmit}>
        <div className={classes.formFields}>
          <GoogleReCaptcha onVerify={onCaptchaVerify} />
          <Grid container justify="center" spacing={2}>
            <Grid item md={4} xs={6}>
              <TimePicker
                label="Čas odchodu"
                ampm={false}
                value={selectedDate}
                onChange={handleDateChange}
                className={classes.fullWidth}
                minutesStep={5}
              />
            </Grid>
          </Grid>
        </div>
        {(isRegistering || !recaptchaToken) && <LinearProgress />}
        {registerError && <Alert severity={'error'}>{registerError}</Alert>}
        <Button
          type={'submit'}
          variant={'contained'}
          color={'primary'}
          fullWidth
          disabled={isRegistering || !recaptchaToken}
        >
          Odoslať
        </Button>
      </form>
    </>
  );
}
