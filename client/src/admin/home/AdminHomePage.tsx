import React from 'react';
import {
  Button,
  makeStyles,
  Typography,
  Paper,
  Toolbar,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core';
import { useSession } from '../../Session';
import { CollectionPoints } from '../collectionpoints';

const useStyles = makeStyles({
  container: {
    margin: '80px 0',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flexGrow: 1,
    color: '#FFF',
  },
  toolbar: {
    zIndex: 9,
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export function AdminHomePage() {
  const [, sessionActions] = useSession();
  const classes = useStyles();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar className={classes.toolbar}>
        <Toolbar>
          <Typography variant="subtitle1" className={classes.title}>
            Administrácia somvrade.sk
          </Typography>
          <Button onClick={() => sessionActions.destroySession()} color="inherit">
            Odhlásenie
          </Button>
        </Toolbar>
      </AppBar>
      <Paper className={classes.container}>
        <Tabs variant={'fullWidth'} value={value} onChange={handleChange}>
          <Tab label={'Spravované odberné miesta'} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <CollectionPoints onlyWaiting={false} />
        </TabPanel>
      </Paper>
    </>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
