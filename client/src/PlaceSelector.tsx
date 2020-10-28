import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function PlaceSelector() {
  return (
    <Autocomplete
      options={places}
      getOptionLabel={getPlaceLabel}
      renderOption={(option) => (
        <React.Fragment>
          <span>{getPlaceLabel(option)}</span>
        </React.Fragment>
      )}
      style={{ width: "100%" }}
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
  );
}

interface PlaceType {
  inputValue?: string;
  village: string;
  place: string;
}

function getPlaceLabel(place: PlaceType) {
  return place.village + ", " + place.place;
}

const places: PlaceType[] = [
  { village: 'Žilina', place: 'Staré Mesto 1' },
  { village: 'Žilina', place: 'Staré Mesto 2' },
  { village: 'Žilina', place: 'Staré Mesto 3' },
  { village: 'Žilina', place: 'Hliny 1' },
  { village: 'Žilina', place: 'Hliny 2' },
  { village: 'Žilina', place: 'Bôrik 1' },
  { village: 'Žilina', place: 'Bôrik 2' },
  { village: 'Bratislava', place: 'Rača 1' },
  { village: 'Bratislava', place: 'Rača 2' },
  { village: 'Bratislava', place: 'Ružinov 1' },
  { village: 'Bratislava', place: 'Ružinov 2' },
  { village: 'Bratislava', place: 'Petržalka 1' },
  { village: 'Bratislava', place: 'Petržalka 2' },
  { village: 'Liptovský Mikuláš', place: 'Staré Mesto 1' },
  { village: 'Liptovský Mikuláš', place: 'Staré Mesto 2' },
  { village: 'Liptovský Mikuláš', place: 'Staré Mesto 3' },
  { village: 'Liptovský Mikuláš', place: 'Vrbica 1' },
  { village: 'Liptovský Mikuláš', place: 'Vrbica 2' },
  { village: 'Liptovský Mikuláš', place: 'Vrbica 3' },
  { village: 'Liptovský Mikuláš', place: 'Vrbica 4' },
  { village: 'Liptovský Mikuláš', place: 'Podbreziny 1' },
  { village: 'Liptovský Mikuláš', place: 'Podbreziny 2' },
  { village: 'Liptovský Mikuláš', place: 'Podbreziny 3' },
  { village: 'Liptovský Mikuláš', place: 'Vitálišovce' },
  { village: 'Liptovský Mikuláš', place: 'Okoličné' },
  { village: 'Liptovský Mikuláš', place: 'Iľanovo,' },
  { village: 'Liptovský Mikuláš', place: 'Ploštín' },
  { village: 'Liptovský Mikuláš', place: 'Demänová' },
  { village: 'Liptovský Mikuláš', place: 'Bodice' },
  { village: 'Liptovský Mikuláš', place: 'Palúdzka' },
  { village: 'Liptovský Mikuláš', place: 'Andice' },
  { village: 'Liptovský Mikuláš', place: 'Benice' },
  { village: 'Liptovský Mikuláš', place: 'Liptovská Ondrašova' }
];

