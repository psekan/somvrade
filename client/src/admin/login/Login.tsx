import React, { FormEvent, useState } from 'react';
import { TextField, Button, makeStyles, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSession } from '../../Session';
import { login } from '../../services';

const useStyles = makeStyles({
  container: {
    marginTop: 50,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 300,
    width: '100%',

    '& > *': {
      margin: 10,
    },
  },
});

export function LoginPage() {
  const [, sessionActions] = useSession();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginLoading, setLoginLoading] = useState(false);
  const classes = useStyles();

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    const form = evt.target as any;
    const username = form.username.value;
    const password = form.password.value;

    try {
      if (!username || !password) {
        throw new Error('username and password required');
      }
      setLoginLoading(true);
      const resp = await login(form.username.value, form.password.value);
      sessionActions.initSecureSession({
        accessToken: resp.access_token,
        tokenType: resp.token_type,
        expiresIn: resp.expires_in,
      });
    } catch {
      setErrorMessage('Prihlasenie neuspesne.');
      setLoginLoading(false);
    }
  }

  function closeMessage() {
    setErrorMessage('');
  }

  return (
    <Paper className={classes.container}>
      <Typography variant={'h4'}>Prihlasenie</Typography>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField name={'username'} placeholder={'Pouzivatelske meno'} />
        <TextField name={'password'} type={'password'} placeholder={'Heslo'} />
        <Button type={'submit'} variant={'contained'} color={'primary'} disabled={isLoginLoading}>
          Prihlas sa
        </Button>
        {isLoginLoading && <LinearProgress />}
      </form>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={5000}
        onClose={closeMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeMessage} severity={'error'}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
