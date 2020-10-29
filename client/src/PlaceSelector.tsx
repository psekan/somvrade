import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography, Link } from '@material-ui/core';
import { PlaceType } from './PlaceType';
import { PlacesContext } from './PlacesContext';

export default function PlaceSelector() {
  return (
    <PlacesContext.Consumer>
      {({places, error}) => (
        <>
          {error != null && (
            <Typography variant="overline" display="block" gutterBottom>
              <b>{error}</b>
            </Typography>
          )}
          <Autocomplete
            options={places}
            groupBy={(option) => option.village}
            getOptionLabel={getPlaceLabelPlain}
            renderOption={getPlaceLabel}
            disabled={error != null}
            style={{ width: "100%" }}
            noOptionsText={(
              <div>
                Odberné miesto nebolo nájdené, môžete <Link href="#pridat-odberne-miesto">ho pridať</Link>.
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Odberové miesto"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
              />
            )}
          />
        </>
      )}
    </PlacesContext.Consumer>
  );
}

function getPlaceLabel(place: PlaceType) {
  return (
    <div>
      <b>{place.village}</b>, {place.district}, <i>{place.place}</i>
    </div>
  );
}

function getPlaceLabelPlain(place: PlaceType) {
  return `${place.village}, ${place.district}, ${place.place}`;
}
