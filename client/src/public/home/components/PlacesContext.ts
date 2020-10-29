import { PlaceType } from './PlaceType';
import React from 'react';

export type PlacesContextProps = {
  error: string|null,
  places: PlaceType[]
}

export const PlacesContext = React.createContext<PlacesContextProps>({error: null, places: []});
