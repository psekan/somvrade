import React from 'react';
import ReactDOM from 'react-dom';
import {Container, CssBaseline} from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import App from './App';
import theme from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container maxWidth="md">
          <App />
        </Container>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
