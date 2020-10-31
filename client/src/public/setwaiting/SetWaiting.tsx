import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { CountyLinks } from '../components/CountyLinks';
import { SearchPlace } from '../components/SearchPlace';
import { BackToStartLink } from '../components/BackToStartLink';

export function SetWaiting() {
  const history = useHistory();
  const { county } = useParams<{ county?: string }>();

  return (
    <div>
      <Typography variant={'h6'} gutterBottom>
        Zadať počet čakajúcich
      </Typography>
      <Typography variant={'subtitle1'} gutterBottom>
        <strong>Vyberte kraj</strong>, v ktorom sa chcete dať testovať:
      </Typography>
      <CountyLinks linkBase={'/zadat-pocet-cakajucich'} selected={county} />
      {county && (
        <SearchPlace
          county={county}
          onSelect={entity =>
            history.push(`/zadat-pocet-cakajucich/${county}/${entity.id}/register`)
          }
        />
      )}
      <BackToStartLink />
    </div>
  );
}
