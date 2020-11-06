import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { PlaceDetail } from '../components/PlaceDetail';
import { TextLink } from '../components/TextLink';
import { BackToStartLink } from '../components/BackToStartLink';

export function PlaceDetailPage() {
  const { county, id } = useParams<{ county: string; id: string }>();

  return (
    <div>
      <Typography variant={'h6'} gutterBottom>
        Aktuálne počty čakajúcich
      </Typography>
      <PlaceDetail id={id} county={county} showSearch showSocialButtons />
      <TextLink
        to={`/aktualne-pocty-cakajucich/${county}`}
        text={'Pozrieť iné odberné miesto'}
        center
      />
      <BackToStartLink center />
    </div>
  );
}
