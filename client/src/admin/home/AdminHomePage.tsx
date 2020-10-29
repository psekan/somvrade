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
  Box,
} from '@material-ui/core';
import { useSession } from '../../Session';
import { CollectionPoints } from '../collectionpoints';

const useStyles = makeStyles({
  container: {
    marginTop: 80,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flexGrow: 1,
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
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Administracia
          </Typography>
          <Button onClick={() => sessionActions.destroySession()} color="inherit">
            Odhlas ma
          </Button>
        </Toolbar>
      </AppBar>
      <Paper className={classes.container}>
        <AppBar position="static">
          <Tabs variant={'fullWidth'} value={value} onChange={handleChange}>
            <Tab label={'Odberne miesta'} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <CollectionPoints />
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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
