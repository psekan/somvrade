import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import { CollectionPointEntity, setBreak } from '../../services';
import { useSession } from '../../Session';
import { ButtonGroup, Grid, makeStyles } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';

const useStyles = makeStyles({
  noteInput: {
    marginTop: 20,
  },
  dialogFooter: {
    justifyContent: 'center',
  },
  dialogCancelBreakButtons: {
    textAlign: 'center',
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
  },
});

interface ModalState {
  time?: Date | null;
  waitingnumber?: number;
  note?: string;
}

const MAX_NOTE_LENGTH = 500;

export function SetBreakDialog({
  onCancel,
  onConfirm,
  entity,
}: React.PropsWithChildren<{
  entity?: CollectionPointEntity;
  onCancel: () => void;
  onConfirm: () => void;
}>) {
  const classes = useStyles();
  const [session] = useSession();
  const [state, setState] = useState<ModalState>({
    time: new Date(),
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setState({ time: new Date() });
    setError('');
  }, [entity]);

  async function handleEdit(evt: React.FormEvent) {
    evt.stopPropagation();
    evt.preventDefault();

    console.log(evt);
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await setBreak(
        entity?.id!,
        {
          break_start: '',
          break_stop: '',
          break_note: '',
        },
        session,
      );
      onConfirm();
    } catch (err) {
      setError(err && err.message ? String(err.message) : 'Nastala neznáma chyba');
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    console.log(state);
    let mandatoryFilled = !!state.time && !!state.waitingnumber;

    if (!mandatoryFilled) {
      setError('Začiatok a koniec prestávky sú povinné');
      return false;
    }

    if (state.note && state.note.length > MAX_NOTE_LENGTH) {
      setError(`Prekročený maximálny počet znakov (${MAX_NOTE_LENGTH}) pre poznámku`);
      return false;
    }

    setError('');
    return true;
  }

  function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setState(prev => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  }

  return (
    <Dialog open={!!entity} onClose={onCancel} aria-labelledby="form-dialog-title" fullScreen>
      <DialogTitle>
        <ClockIcon /> Zadať prestávku pre odberné miesto{' '}
        <i>
          {entity?.city} {entity?.address}
        </i>
      </DialogTitle>
      <DialogContent>
        {!entity?.break_start ? (
          <>
            <Grid container justify={'center'} spacing={2}>
              <Grid item md={4} xs={6}>
                <TimePicker
                  name={'time'}
                  label={'Začiatok prestávky'}
                  ampm={false}
                  value={state.time}
                  onChange={time =>
                    setState({
                      ...state,
                      time,
                    })
                  }
                  minutesStep={5}
                  fullWidth
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <TimePicker
                  name={'time'}
                  label={'Koniec prestávky'}
                  ampm={false}
                  value={state.time}
                  onChange={time =>
                    setState({
                      ...state,
                      time,
                    })
                  }
                  minutesStep={5}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Poznámka (nepovinné)"
              type={'text'}
              name={'note'}
              className={classes.noteInput}
              fullWidth
              multiline
              rows={3}
              onChange={handleInputChange}
            />
            <p>
              <strong>Informácia o prestávke sa používateľom zobrazí ihneď po jej odoslaní.</strong>
            </p>
          </>
        ) : (
          <div>
            <Alert severity={'info'}>
              Pre vybrané odberné miesto je prestávka už zadaná. Chcete ju upraviť alebo zrusiť?
            </Alert>
            <ButtonGroup className={classes.dialogCancelBreakButtons}>
              <Button onClick={handleEdit} color="primary" variant={'contained'}>
                Zrušiť prestávku
              </Button>
              <Button onClick={handleEdit} color="primary" variant={'contained'}>
                Upraviť prestávku
              </Button>
            </ButtonGroup>
          </div>
        )}
      </DialogContent>
      {error && <Alert severity={'error'}>{error}</Alert>}
      {isLoading && <LinearProgress />}

      <DialogActions className={classes.dialogFooter}>
        <Button onClick={onCancel} color="primary">
          Späť
        </Button>
        {!entity?.break_start && (
          <Button onClick={handleEdit} color="primary" variant={'contained'}>
            Potvrdiť
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function parseTime(date?: Date | null) {
  return date ? date.getHours() + ':' + date.getMinutes() : undefined;
}
