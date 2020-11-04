import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceIcon from '@material-ui/icons/Place';
import { Typography, makeStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

import { useCollectionPointsPublic } from '../../services';
import { TextLink } from '../components/TextLink';
import { BackToStartLink } from '../components/BackToStartLink';
import { useSession } from '../../Session';
import { UpdateDeparture } from './UpdateDeparture';
import { RegisterPlace } from './RegisterPlace';

const useStyles = makeStyles({
  placeTitle: {
    fontStyle: 'italic',
    fontSize: '1.2rem',
    lineHeight: '1.2rem',
    marginBottom: 20,
  },
});

export function PlaceRegister() {
  const classes = useStyles();
  const { county, id } = useParams<{ county: string; id: string }>();
  const { isLoading, response, error, refresh } = useCollectionPointsPublic(county);
  const detail = response?.find(it => String(it.id) === id);
  const [session] = useSession();

  return isLoading ? (
    <LinearProgress />
  ) : (
    <>
      {!detail && !error && <Alert severity={'warning'}>Odberné miesto nenájdené</Alert>}
      {error && (
        <Alert
          severity={'error'}
          action={
            <Button color="inherit" size="small" onClick={refresh}>
              Obnoviť
            </Button>
          }
        >
          Nastala neznáma chyba
        </Alert>
      )}
      {detail && (
        <div>
          <Typography variant={'h6'} gutterBottom>
            Na odbernom mieste
          </Typography>
          <Typography variant={'subtitle1'} gutterBottom className={classes.placeTitle}>
            <PlaceIcon fontSize={'small'} /> {detail.address}
          </Typography>
          {!session.isRegistered && !session.registeredToken?.completed && (
            <RegisterPlace id={id} county={county} />
          )}
          {session.isRegistered && !session.registeredToken?.completed && <UpdateDeparture />}
          {session.registeredToken?.completed && (
            <Alert severity={'success'}>
              Vaše údaje boli uložené. Prispeli ste k hladkému priebehu celoplošného testovania a
              pomohli ste mnohým ľuďom. Ďakujeme!
            </Alert>
          )}

          <TextLink
            to={`/aktualne-pocty-cakajucich/${county}`}
            text={'Pozrieť iné odberné miesto'}
            center
          />
          <BackToStartLink center />
        </div>
      )}
    </>
  );
}
