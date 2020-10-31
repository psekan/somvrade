import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CollectionPointEntity, updateCollectionPoint } from '../../services';
import { useSession } from '../../Session';

const commonInputProps: TextFieldProps = {
  type: 'text',
  fullWidth: true,
  margin: 'dense',
  variant: 'outlined',
};

export function EditDialog({
  onCancel,
  onConfirm,
  entity,
}: React.PropsWithChildren<{
  entity?: CollectionPointEntity;
  onCancel: () => void;
  onConfirm: () => void;
}>) {
  const [session] = useSession();
  const [state, setState] = useState<CollectionPointEntity>(entity!);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setState(entity!);
    setError('');
  }, [entity]);

  async function handleEdit() {
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await updateCollectionPoint(state, session);
      onConfirm();
    } catch (err) {
      setError(err ? JSON.stringify(err) : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        const value = state[key as keyof typeof state];
        if (value === undefined || value === '') {
          setError('All fields are required');
          return false;
        }
      }
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
    <Dialog open={!!entity} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        Odberné miesto <i>{state?.address}</i>
      </DialogTitle>
      <DialogContent>
        <TextField
          {...commonInputProps}
          name={'county'}
          label="Okres"
          value={state?.county || ''}
          onChange={handleInputChange}
        />
        <TextField
          {...commonInputProps}
          name={'city'}
          label="Mesto/Obec"
          value={state?.city || ''}
          onChange={handleInputChange}
        />
        <TextField
          {...commonInputProps}
          name={'district'}
          label="Okrsok"
          value={state?.district || ''}
          onChange={handleInputChange}
        />
        <TextField
          {...commonInputProps}
          name={'place'}
          label="Názov odberného miesta"
          value={state?.address || ''}
          onChange={handleInputChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state?.active}
              onChange={evt => setState(prev => ({ ...prev, active: evt.target.checked }))}
              name="gilad"
            />
          }
          label={'Aktívne'}
        />
      </DialogContent>
      {error && <Alert severity={'error'}>{error}</Alert>}
      {isLoading && <LinearProgress />}
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Zrusit
        </Button>
        <Button onClick={handleEdit} color="primary">
          Editovat
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/*


  active: boolean;
*/
