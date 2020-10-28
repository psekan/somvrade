import { createMuiTheme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: cyan["700"]
    },
    secondary: {
      main: teal["700"],
    },
    text: {
      // primary: grey["50"],
      // secondary: grey["50"]
    }
  },
});

export default theme;
