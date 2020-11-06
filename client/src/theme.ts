import { createMuiTheme } from '@material-ui/core/styles';
import { cyan, grey } from '@material-ui/core/colors';

const primaryColor = cyan['700'];

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: cyan['50'],
    },
    secondary: {
      main: primaryColor,
      light: cyan['100'],
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
    subtitle2: {
      color: grey['700'],
    },
    body1: {
      color: grey['700'],
    },
    h3: {
      color: grey['700'],
      fontWeight: 800,
    },
    h4: {
      color: grey['700'],
    },
    h5: {
      color: grey['700'],
    },
    h6: {
      color: grey['700'],
    },
    caption: {
      color: grey['700'],
    },
  },
});

export default theme;
