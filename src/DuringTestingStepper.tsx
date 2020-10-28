import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlaceSelector from "./PlaceSelector";
import {
  Grid,
  TextField
} from "@material-ui/core";
import {TimePicker} from "@material-ui/pickers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    table: {
      width: '100%',
    },
    fullWidth: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

function getSteps() {
  return ['Vyberte odberové miesto', 'Zadajte počet čakajúcich', 'Zadajte čas odchodu'];
}

export default function DuringTestingStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedDate, handleDateChange] = React.useState<Date | null>(new Date());
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} style={{ backgroundColor: "transparent" }}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Grid container justify="center">
        <Grid item xs={10}>
          {activeStep === 0 && (
            <>
              <Typography className={classes.instructions}>
                V zozname nižšie sa snažte dohľadať odberové miesta, kam ste sa prišli otestovať.
                Pokiaľ dané miesto v zozname neexistuje, bude možné ho vytvoriť.
              </Typography>
              <PlaceSelector/>
            </>
          )}
          {activeStep === 1 && (
            <>
              <Typography className={classes.instructions}>
                Po výbere miesta, budete vyzvaný na zadanie času príchodu a počtu čakajúcich ľudí.
                Čas príchodu sa nastaví automaticky na aktuálny čas.
              </Typography>
              <Grid container justify="center" spacing={2}>
                <Grid item md={4} xs={6}>
                  <TimePicker
                    label="Čas príchodu"
                    ampm={false}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={classes.fullWidth}
                    minutesStep={5}
                  />
                </Grid>
                <Grid item md={4} xs={6}>
                  <TextField
                    label="Počet čakajúcich ľudí"
                    type="number"
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0, max: 200 } }}
                    defaultValue={10}
                    className={classes.fullWidth}
                  />
                </Grid>
              </Grid>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Typography className={classes.instructions}>
                Po získaní certifikátu s výsledkom testu budete môcť informovať ostatných občas, koľko trval celý čas
                strávený na danom odberovom mieste. Niektoré miesta budú vykonávať odbery rýchlejšie, iné pomalšie,
                preto sa táto informácia môže zísť pre ostatných.
              </Typography>
              <Grid container justify="center" spacing={2}>
                <Grid item md={4} xs={6}>
                  <TimePicker
                    label="Čas odchodu"
                    ampm={false}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={classes.fullWidth}
                    minutesStep={5}
                  />
                </Grid>
              </Grid>
              <Typography className={classes.instructions}>
                Nič viac od Vás stránka nebude požadovať, nebude uklada žiadne údaje o Vás. No informácie o časoch a
                počte ľudí budú prospešne pre ostatných, ktorí pôjdu na test po Vás.
              </Typography>
              <Typography className={classes.instructions}>
                Ďakujeme, že na nich myslíte. Len spoločne si vieme pomôcť.
              </Typography>
            </>
          )}
          <div className={classes.instructions}>
            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
              Krok späť
            </Button>
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Nasledujúci krok
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
