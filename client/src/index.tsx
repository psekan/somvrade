import React from 'react';
import ReactDOM from 'react-dom';
import { Container, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import App from './App';
import theme from './theme';
import { SessionContextProvider } from './Session';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <GoogleReCaptchaProvider reCaptchaKey="6LeSbN0ZAAAAAPl65jiQdVBf8DK_qO2pA72oEJj-">
          <SessionContextProvider>
            <Container maxWidth="md">
              <App />
            </Container>
          </SessionContextProvider>
        </GoogleReCaptchaProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
