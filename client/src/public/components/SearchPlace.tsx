import React from 'react';
import { Typography } from '@material-ui/core';
import { Places } from '../components/Places';
import { CollectionPointEntity } from '../../services';

interface SearchPlaceProps {
  county: string;
  onSelect: (entity: CollectionPointEntity) => void;
}

export function SearchPlace({ county, onSelect }: SearchPlaceProps) {
  return (
    <div>
      <Typography variant={'subtitle1'} gutterBottom>
        <strong>Vyhľadajte odberné miesto</strong>, kde sa chcete ísť dať otestovať:
      </Typography>
      <Places county={county} onChange={onSelect} />
    </div>
  );
}
