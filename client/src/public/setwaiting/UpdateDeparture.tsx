import React, { useState } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { TimePicker } from '@material-ui/pickers';

import { updateDeparture } from '../../services';
import { useCaptchaToken } from '../../hooks';
import { useSession } from '../../Session';

const useStyles = makeStyles({
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

export function UpdateDeparture() {
  const classes = useStyles();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [session, sessionActions] = useSession();
  const [selectedDate, handleDateChange] = useState<Date | null>(new Date());

  const {
    isLoading: isCaptchaLoading,
    token: recaptchaToken,
    refreshCaptchaToken,
  } = useCaptchaToken();

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
      refreshCaptchaToken();
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
        {(isRegistering || isCaptchaLoading) && <LinearProgress />}
        {registerError && <Alert severity={'error'}>{registerError}</Alert>}
        <Button
          type={'submit'}
          variant={'contained'}
          color={'primary'}
          fullWidth
          disabled={isRegistering || isCaptchaLoading}
        >
          Odoslať
        </Button>
      </form>
    </>
  );
}
