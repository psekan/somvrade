import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { CountyLinks } from '../components/CountyLinks';
import { SearchPlace } from '../components/SearchPlace';
import { BackToStartLink } from '../components/BackToStartLink';

export function CheckWaiting() {
  const history = useHistory();
  const { county } = useParams<{ county?: string }>();

  return (
    <div>
      <Typography variant={'h6'} gutterBottom>
        Aktuálne počty čakajúcich
      </Typography>
      <Typography variant={'subtitle1'} gutterBottom>
        <strong>Vyberte kraj</strong>, v ktorom sa chcete dať testovať:
      </Typography>
      <CountyLinks linkBase={'/aktualne-pocty-cakajucich'} selected={county} />
      {county && (
        <SearchPlace
          county={county}
          onSelect={entity => history.push(`/aktualne-pocty-cakajucich/${county}/${entity.id}`)}
        />
      )}
      <BackToStartLink />
    </div>
  );
}
