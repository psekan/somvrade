import React from 'react';
import { makeStyles, Theme, createStyles, Grid, TextField, Button, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputs: {
      width: '100%',
    },
  }),
);

enum formStateType {
  Input,
  Error,
  Success
}

type PlaceInputFormProps = {
  onChange: () => void
}

export default function PlaceInputForm(props: PlaceInputFormProps) {
  const classes = useStyles();
  const [county, setCounty] = React.useState<string|null>(null);
  const [city, setCity] = React.useState<string|null>(null);
  const [district, setDistrict] = React.useState<string|null>(null);
  const [place, setPlace] = React.useState<string|null>(null);
  const [formState, setFormState] = React.useState<formStateType>(formStateType.Input);

  return (
    <Grid container justify="center" spacing={2}>
      {(formState === formStateType.Input || formState === formStateType.Error) && (
        <>
          <Grid item xs={12} md={3}>
            <TextField
              label="Názov okresu"
              variant="outlined"
              className={classes.inputs}
              value={county}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCounty(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Názov obce/mesta"
              variant="outlined"
              className={classes.inputs}
              value={city}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCity(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Časť obce/mesta"
              variant="outlined"
              className={classes.inputs}
              value={district}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDistrict(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Názov odberného miesta"
              variant="outlined"
              className={classes.inputs}
              value={place}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPlace(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                fetch('/api/places', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    county,
                    city,
                    district,
                    place
                  }),
                })
                  .then(response => {
                    if (response.status === 201) {
                      setFormState(formStateType.Success);
                      props.onChange();
                    }
                    else {
                      setFormState(formStateType.Error);
                    }
                  })
                  .catch((error) => {
                    setFormState(formStateType.Error);
                  });
              }}
            >
              Pridať odberné miesto
            </Button>
          </Grid>
          {formState === formStateType.Error && (
            <Grid item xs={12}>
              <Alert severity="error">Ospravedlňujeme sa, ale nastal neznámy problém. Vyskúšajte zopakovať požiadavku
                neskôr, alebo nás kontaktovať na <Link href="mailto:somvrade@gmail.com">somvrade@gmail.com</Link>.</Alert>
            </Grid>
          )}
        </>
      )}
      {formState === formStateType.Success && (
        <>
          <Grid item xs={12}>
            <Alert severity="success">Ďakujeme za pridanie odberného miesta. Ak viete o ďalších, prosíme, pridajte aj tie.</Alert>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setDistrict('');
                setPlace('');
                setFormState(formStateType.Input);
              }}
            >
              Pridať ďalšie odberné miesto
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
}
