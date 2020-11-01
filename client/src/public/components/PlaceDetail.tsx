import React from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import PlaceIcon from '@material-ui/icons/Place';
import { Typography, makeStyles, Chip, Tooltip, Badge } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FaceOutlinedIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';

import {
  useCollectionPointsPublic,
  useCollectionPointEntries,
  CollectionPointEntity,
} from '../../services';
import { Places } from '../components/Places';
import { CollectionEntries } from '../components/CollectionEntries';
import { useSession } from '../../Session';

const MAX_FAVORITES = 5;

const useStyles = makeStyles({
  placeTitle: {
    fontStyle: 'italic',
    fontSize: '1.2rem',
    lineHeight: '1.2rem',
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  placesSelect: {
    margin: '20px 0',
  },
  table: {
    marginBottom: 20,
  },
  locationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

interface PlaceDetailProps {
  county: string;
  id: string;
  showSearch?: boolean;
  limitTable?: number;
  className?: string;
}

export function PlaceDetail({ county, id, showSearch, limitTable, className }: PlaceDetailProps) {
  const classes = useStyles();
  const history = useHistory();
  const { isLoading, response, error, refresh } = useCollectionPointsPublic(county);
  const detail = response?.find(it => String(it.id) === id);
  return (
    <div className={className}>
      {showSearch && (
        <Places
          className={classes.placesSelect}
          size={'small'}
          label={'Odberné miesto'}
          selected={id}
          county={county}
          onChange={entity => history.push(`/aktualne-pocty-cakajucich/${county}/${entity.id}`)}
        />
      )}
      {isLoading && <LinearProgress />}
      {!isLoading && error && <ErrorHandler refresh={refresh} />}
      {!detail && !error && !isLoading && (
        <Alert severity={'warning'}>Odberné miesto nenájdene</Alert>
      )}
      {!isLoading && detail && (
        <PlaceDetailTable
          county={county}
          id={id}
          showSearch={showSearch}
          limitTable={limitTable}
          className={className}
          detail={detail}
        />
      )}
    </div>
  );
}

function PlaceDetailTable({
  detail,
  county,
  id,
  limitTable,
}: { detail: CollectionPointEntity } & PlaceDetailProps) {
  const classes = useStyles();

  const [session, sessionActions] = useSession();
  const { isLoading, response, error, refresh } = useCollectionPointEntries(detail.id);
  return (
    <>
      {!isLoading && error && <ErrorHandler refresh={refresh} />}
      {isLoading && (
        <>
          <PlaceName county={county} id={id} detail={detail} />
          <LinearProgress />
        </>
      )}
      {!isLoading && (
        <div>
          <div className={classes.locationContainer}>
            <PlaceName county={county} id={id} detail={detail} />
            <div style={{ textAlign: 'right' }}>
              {(response || []).length > 0 && (
                <Tooltip placement="left" arrow title="Priemerne čakajúcich">
                  <Chip
                    variant="outlined"
                    icon={<PeopleAltOutlinedIcon />}
                    label={response ? median(response.map(a => a.length).slice(0, 10)) : ''}
                  />
                </Tooltip>
              )}
              {session.favorites?.some(it => it.county === county && it.entryId === id) ? (
                <IconButton
                  onClick={() => sessionActions.setFavorite(county, id)}
                  title={'Odstrániť z obľúbených'}
                >
                  <FavoriteIcon />
                </IconButton>
              ) : (
                <Badge
                  badgeContent={
                    session.favorites && session.favorites.length > 0
                      ? MAX_FAVORITES - session.favorites.length
                      : MAX_FAVORITES
                  }
                  color="primary"
                  overlap="circle"
                >
                  <IconButton
                    onClick={() => sessionActions.setFavorite(county, id)}
                    title={'Pridať do obľúbených'}
                    color="primary"
                    disabled={session.favorites ? session.favorites.length >= MAX_FAVORITES : false}
                  >
                    <FaceOutlinedIcon />
                  </IconButton>
                </Badge>
              )}
            </div>
          </div>
          <CollectionEntries className={classes.table} limitTable={limitTable} data={response} />
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
        </div>
      )}
    </>
  );
}

function PlaceName({
  detail,
  county,
  id,
}: {
  detail: CollectionPointEntity;
  county: string;
  id: string;
}) {
  const classes = useStyles();
  return (
    <Typography variant={'subtitle1'} gutterBottom className={classes.placeTitle}>
      <PlaceIcon fontSize={'small'} />{' '}
      <RouterLink to={`/aktualne-pocty-cakajucich/${county}/${id}`}>{detail.address}</RouterLink>{' '}
    </Typography>
  );
}

function ErrorHandler({ refresh }: { refresh: () => void }) {
  return (
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
  );
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  values.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2 === 1) {
    return values[half];
  }
  return Math.round((values[half - 1] + values[half]) / 2.0);
}
