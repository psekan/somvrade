import React, { useEffect, useRef } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import FaceOutlinedIcon from '@material-ui/icons/BookmarkBorder';
import Alert from '@material-ui/lab/Alert';
import { PlaceDetail } from '../components/PlaceDetail';
import { useSession } from '../../Session';
import { BackToStartLink } from '../components/BackToStartLink';
import { MAX_FAVORITES } from '../../constants';
import { SocialButtons } from '../components/SocialButtons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detail: {
    border: '1px solid #dcdcdc',
    borderRadius: 4,
    padding: 10,
  },
  title: {
    marginBottom: 30,
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
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
        history.push('/watching');
      } else {
        history.push(
          `/watching/${session.favorites!.map(it => it.county + ':' + it.entryId).join(',')}`,
        );
      }
    }

    nextRender.current = true;
    // eslint-disable-next-line
  }, [session]);

  useEffect(() => {
    // protection for max watching places
    if (pairs.length > MAX_FAVORITES) {
      history.replace(`/watching/${pairs.slice(0, MAX_FAVORITES).join(',')}`);
    }
  });

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
      <div className={classes.titleWrapper}>
        <Typography variant={'h6'} className={classes.title}>
          Sledované odberné miesta
        </Typography>
        <SocialButtons />
      </div>
      {!favorites.length && (
        <Alert severity={'info'}>
          Žiadne sledované odberné miesta. Začať sledovať odberné miesto môžete kliknutím na ikonu{' '}
          <FaceOutlinedIcon fontSize={'small'} /> nad tabuľkou odberného miesta.
        </Alert>
      )}
      <Grid container spacing={2}>
        {favorites.map(fav => (
          <Grid item key={`${fav.entityId}_${fav.county}`} xs={12} md={6}>
            <PlaceDetail
              id={fav.entityId}
              county={fav.county}
              showSearch={false}
              limitTable={5}
              className={classes.detail}
            />
          </Grid>
        ))}
      </Grid>
      <BackToStartLink center />
    </>
  );
}
