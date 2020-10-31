import { createMuiTheme } from '@material-ui/core/styles';
import { cyan, grey } from '@material-ui/core/colors';

const primaryColor = cyan['700'];

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: primaryColor,
    },
    text: {
      primary: grey['700'],
      // secondary: grey["50"]
    },
  },
  typography: {
    h1: {
      fontSize: '3rem',
      // fontWeight: 400,
      color: primaryColor,
    },
    subtitle1: {
      color: grey['700'],
    },
    body1: {
      color: grey['700'],
    },
    h5: {
      color: grey['700'],
    },
    h6: {
      color: grey['700'],
    },
  },
});

export default theme;
