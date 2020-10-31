import React from 'react';
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom';
import PlaceIcon from '@material-ui/icons/Place';
import { Typography, makeStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

import { useCollectionPointsPublic } from '../../services';
import { Places } from '../components/Places';
import { CollectionEntries } from '../components/CollectionEntries';
import { TextLink } from '../components/TextLink';
import { BackToStartLink } from '../components/BackToStartLink';
import { useSession } from '../../Session';

const useStyles = makeStyles({
  placeTitle: {
    fontStyle: 'italic',
    fontSize: '1.2rem',
    lineHeight: '1.2rem',
    marginBottom: 20,
  },
  placesSelect: {
    margin: '20px 0',
  },
  table: {
    marginBottom: 20,
  },
});

export function PlaceDetail() {
  const classes = useStyles();
  const { county, id } = useParams<{ county: string; id: string }>();
  const history = useHistory();
  const { isLoading, response, error, refresh } = useCollectionPointsPublic(county);
  const detail = response?.find(it => String(it.id) === id);
  const [session] = useSession();

  return isLoading ? (
    <LinearProgress />
  ) : (
    <>
      {!detail && !error && <Alert severity={'warning'}>Miesto nenajdene</Alert>}
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
            Aktuálne počty čakajúcich
          </Typography>
          <Places
            className={classes.placesSelect}
            size={'small'}
            label={'Odberne miesto'}
            selected={id}
            county={county}
            onChange={entity => history.push(`/aktualne-pocty-cakajucich/${county}/${entity.id}`)}
          />
          <Typography variant={'subtitle1'} gutterBottom className={classes.placeTitle}>
            <PlaceIcon fontSize={'small'} /> {detail.address}
          </Typography>
          <CollectionEntries collectionPoint={detail} className={classes.table} />
          {!session.isRegistered && (
            <Button
              component={RouterLink}
              variant={'contained'}
              color={'primary'}
              fullWidth
              to={`/zadat-pocet-cakajucich/${county}/${id}/register`}
            >
              Sem sa idem testovať
            </Button>
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
