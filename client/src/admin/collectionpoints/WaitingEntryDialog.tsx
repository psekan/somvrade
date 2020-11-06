import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import AddNewEntryIcon from '@material-ui/icons/AddToPhotos';
import { Grid, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';
import { useCaptchaToken } from '../../hooks';
import { CollectionPointEntity, registerToCollectionPoint } from '../../services';
import { useSession } from '../../Session';

const useStyles = makeStyles({
  noteInput: {
    marginTop: 20,
  },
  dialogFooter: {
    justifyContent: 'center',
  },
});

interface ModalState {
  time?: Date | null;
  waitingnumber?: number;
  note?: string;
}

const MAX_NOTE_LENGTH = 500;

export function WaitingEntryDialog({
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { token, refreshCaptchaToken } = useCaptchaToken();

  useEffect(() => {
    setState({ time: new Date() });
    setError('');
  }, [entity]);

  async function handleEdit() {
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await registerToCollectionPoint(
        entity?.id!,
        {
          arrive: formatTime(state.time)!,
          length: Number(state.waitingnumber),
          admin_note: state.note,
          recaptcha: token,
        },
        session,
      );
      onConfirm();
    } catch (err) {
      refreshCaptchaToken();
      setError(err && err.message ? String(err.message) : 'Nastala neznáma chyba');
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    let mandatoryFilled = !!state.time && !!state.waitingnumber;

    if (!mandatoryFilled) {
      setError('Čas a počet čakajúcich sú povinné');
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
        <AddNewEntryIcon /> Zadať počet čakajúcich pre odberné miesto{' '}
        <i>
          {entity?.city} {entity?.address}
        </i>
      </DialogTitle>
      <DialogContent>
        <Grid container justify={'center'} spacing={2}>
          <Grid item md={4} xs={6}>
            <TimePicker
              name={'time'}
              label={'Čas príchodu'}
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
            <TextField
              label={'Počet čakajúcich'}
              type={'number'}
              name={'waitingnumber'}
              InputProps={{ inputProps: { min: 0, max: 500 } }}
              fullWidth
              onChange={handleInputChange}
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
      </DialogContent>
      {error && <Alert severity={'error'}>{error}</Alert>}
      {isLoading && <LinearProgress />}
      <DialogActions className={classes.dialogFooter}>
        <Button onClick={onCancel} color="primary" disabled={isLoading}>
          Späť
        </Button>
        <Button onClick={handleEdit} color="primary" variant={'contained'} disabled={isLoading}>
          Potvrdiť
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function formatTime(date?: Date | null) {
  return date ? date.getHours() + ':' + date.getMinutes() : undefined;
}
