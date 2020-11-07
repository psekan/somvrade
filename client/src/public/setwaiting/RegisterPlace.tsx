import React, { useState } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { TimePicker } from '@material-ui/pickers';

import { registerToCollectionPoint } from '../../services';
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

interface RegisterPlaceProps {
  id: string;
  county: string;
}

export function RegisterPlace({ id, county }: RegisterPlaceProps) {
  const classes = useStyles();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [, sessionActions] = useSession();
  const [selectedDate, handleDateChange] = useState<Date | null>(new Date());

  const {
    isLoading: isCaptchaLoading,
    token: recaptchaToken,
    refreshCaptchaToken,
  } = useCaptchaToken();

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
      <Typography variant={'subtitle2'} gutterBottom>
        Keď dorazíte na toto odberné miest, zadajte čas vášho príchodu a počet ľudí čakajúcich pred
        vami:
      </Typography>
      <Typography variant={'h6'}>Zadať počet cakajúcich</Typography>
      <form onSubmit={handleFormSubmit}>
        <div className={classes.formFields}>
          <Grid container justify="center" spacing={2}>
            <Grid item md={4} xs={6}>
              <TimePicker
                label="Čas príchodu"
                ampm={false}
                value={selectedDate}
                onChange={handleDateChange}
                className={classes.fullWidth}
                minutesStep={1}
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <TextField
                label="Počet čakajúcich"
                type="number"
                name={'waitingnumber'}
                InputProps={{ inputProps: { min: 0, max: 500 } }}
                className={classes.fullWidth}
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
