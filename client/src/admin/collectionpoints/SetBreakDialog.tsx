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
import { ButtonGroup, Grid, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';
import { CollectionPointEntity, setBreak, BreakRequest } from '../../services';
import { useSession } from '../../Session';
import { useCaptchaToken } from '../../hooks';

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
  breakStart?: Date | null;
  breakStop?: Date | null;
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
  const [state, setState] = useState<ModalState>(getInitialState(entity));
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingBreak, setEditingBreak] = useState(!entity?.break_start);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { token, refreshCaptchaToken, isLoading: isCaptchaTokenLoading } = useCaptchaToken();

  useEffect(() => {
    setState(getInitialState(entity));
    setError('');
    setEditingBreak(!entity?.break_start);
  }, [entity]);

  function handleEdit(evt: React.FormEvent) {
    evt.stopPropagation();
    evt.preventDefault();

    if (!validate()) {
      return;
    }
    sendBreakData({
      break_start: formatTime(state.breakStart)!,
      break_stop: formatTime(state.breakStop)!,
      break_note: state.note,
      token,
    });
  }

  function handleBreakCancel(evt: React.FormEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    sendBreakData({
      break_start: null,
      break_stop: null,
      break_note: null,
      token,
    });
  }

  async function sendBreakData(breakReq: BreakRequest) {
    setLoading(true);
    try {
      await setBreak(entity?.id!, breakReq, session);
      onConfirm();
    } catch (err) {
      setError(err && err.message ? String(err.message) : 'Nastala neznáma chyba');
      refreshCaptchaToken();
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    let mandatoryFilled = !!state.breakStart && !!state.breakStop;

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
    <Dialog
      open={!!entity}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
      fullScreen={isMobile}
    >
      <DialogTitle>
        <ClockIcon /> Zadať prestávku pre odberné miesto{' '}
        <i>
          {entity?.city} {entity?.address}
        </i>
      </DialogTitle>
      <DialogContent>
        {editingBreak ? (
          <>
            <Grid container justify={'center'} spacing={2}>
              <Grid item md={4} xs={6}>
                <TimePicker
                  name={'time'}
                  label={'Začiatok prestávky'}
                  ampm={false}
                  value={state.breakStart}
                  onChange={time =>
                    setState({
                      ...state,
                      breakStart: time,
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
                  value={state.breakStop}
                  onChange={time =>
                    setState({
                      ...state,
                      breakStop: time,
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
              <Button
                onClick={handleBreakCancel}
                color="primary"
                variant={'contained'}
                disabled={isLoading || isCaptchaTokenLoading}
              >
                Zrušiť prestávku
              </Button>
              <Button
                onClick={() => setEditingBreak(true)}
                color="default"
                variant={'contained'}
                disabled={isLoading || isCaptchaTokenLoading}
              >
                Upraviť prestávku
              </Button>
            </ButtonGroup>
          </div>
        )}
      </DialogContent>
      {error && <Alert severity={'error'}>{error}</Alert>}
      {(isLoading || isCaptchaTokenLoading) && <LinearProgress />}

      <DialogActions className={classes.dialogFooter}>
        <Button onClick={onCancel} color="primary" disabled={isLoading || isCaptchaTokenLoading}>
          Späť
        </Button>
        {editingBreak && (
          <Button
            onClick={handleEdit}
            color="primary"
            variant={'contained'}
            disabled={isLoading || isCaptchaTokenLoading}
          >
            Potvrdiť
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function getInitialState(entity?: CollectionPointEntity): ModalState {
  return {
    breakStart: parseTime(entity?.break_start) || new Date(),
    breakStop: parseTime(entity?.break_start) || new Date(),
  };
}

function formatTime(date?: Date | null) {
  return date ? date.getHours() + ':' + date.getMinutes() : undefined;
}

function parseTime(time?: string | null) {
  if (time) {
    const now = new Date();
    const pair = time.split(':').map(it => Number(it));
    now.setHours(pair[0]);
    now.setMinutes(pair[1]);
    return now;
  }
  return undefined;
}
