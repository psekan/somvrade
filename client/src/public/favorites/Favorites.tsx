import React, { useEffect, useRef } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { PlaceDetail } from '../components/PlaceDetail';
import { useSession } from '../../Session';
import Alert from '@material-ui/lab/Alert';
import { BackToStartLink } from '../components/BackToStartLink';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detail: {
    marginBottom: 40,
    flex: '0 0 48%',
  },
  title: {
    marginBottom: 30,
  },
});

export function Favorites() {
  const classes = useStyles();
  const params = useParams<{ ids: string }>();
  const history = useHistory();
  const pairs = (params.ids || '').split(',');
  const [session] = useSession();
  const nextRender = useRef(false);

  useEffect(() => {
    if (nextRender.current) {
      if (!(session.favorites || []).length) {
        history.push('/favorites');
      } else {
        history.push(
          `/favorites/${session.favorites!.map(it => it.county + ':' + it.entryId).join(',')}`,
        );
      }
    }

    nextRender.current = true;
    // eslint-disable-next-line
  }, [session]);

  const favorites = pairs
    .filter(pair => !!pair)
    .map(pair => {
      const items = pair.split(':');
      return {
        county: items[0],
        entityId: items[1],
      };
    });

  return (
    <>
      <Typography variant={'h6'} className={classes.title}>
        Sledované odberné miesta
      </Typography>
      {!favorites.length && <Alert severity={'info'}>Žiadne sledované odberné miesta.</Alert>}
      <div className={classes.container}>
        {favorites.map(fav => (
          <PlaceDetail
            className={classes.detail}
            key={`${fav.entityId}_${fav.county}`}
            id={fav.entityId}
            county={fav.county}
            showSearch={false}
            limitTable={5}
          />
        ))}
      </div>
      <BackToStartLink center />
    </>
  );
}
