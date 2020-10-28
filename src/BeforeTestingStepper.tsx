import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlaceSelector from "./PlaceSelector";
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    table: {
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
  return ['Vyberte odberové miesto', 'Skontrolujte aktuálnu situáciu', 'Vyberte sa ku odberovému miestu'];
}

interface DataType {
  arrive: string,
  waiting: number,
  departure: string
}

const data: DataType[] = [
  {arrive: '11:25', waiting: 15, departure: '-'},
  {arrive: '10:40', waiting: 20, departure: '11:45'},
  {arrive: '10:30', waiting: 10, departure: '11:35'}
];

export default function BeforeTestingStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
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
                V zozname nižšie sa snažte dohľadať odberové miesta, kam sa chcete ísť otestovať.
                Pokiaľ dané miesto v zozname neexistuje, bude možné ho vytvoriť.
              </Typography>
              <PlaceSelector/>
            </>
          )}
          {activeStep === 1 && (
            <>
              <Typography className={classes.instructions}>
                Následne uvidíte tabuľku s informáciami od ostatných, ktorí už boli pred Vami,
                kedy sa postavili do radu na vybranom odberovom mieste, aký dlhý rad stál pred nimi
                a ak už dostali výsledok a chceli informovať aj dĺžke celého testovania, tak aj čas kedy opustili
                odberové miesto s výsledkom testu.
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Čas príchodu</TableCell>
                      <TableCell align="right">Počet čakajúcich</TableCell>
                      <TableCell align="right">Čas odchodu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.arrive}>
                        <TableCell component="th" scope="row">
                          {row.arrive}
                        </TableCell>
                        <TableCell align="right">{row.waiting}</TableCell>
                        <TableCell align="right">{row.departure}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography className={classes.instructions}>
                Ak to bude v našich možnostiach a budeme mať dostatok dát, budeme sa snažiť vypočítavať čas,
                kedy Vám odporúčame prísť na testovanie, tak aby ste v rade nečakali dlho, ale zároveň, aby
                na odberovom mieste mali v každom čase dostatok ľudí na testovanie.
              </Typography>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Typography className={classes.instructions}>
                Podľa zobrazených informácií od iných občanov, prípadne od odporúčania nami vypočítaného času,
                sa rozhodnite, kedy pôjdete ku odberovému miestu. Nezabudnite započítať aj čas, ktorý Vám bude
                cesta k nemu trvať.
              </Typography>
              <Typography className={classes.instructions}>
                Môžete pokračovať na nasledujúcu sekciu Na odberovom mieste.
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
