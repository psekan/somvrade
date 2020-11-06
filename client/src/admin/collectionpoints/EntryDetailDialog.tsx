import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { CollectionPointEntity } from '../../services';
import { PlaceDetail } from '../../public/components/PlaceDetail';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

const useStyles = makeStyles({
  dialogFooter: {
    justifyContent: 'center',
  },
});

export function EntryDetailDialog({
  onCancel,
  entity,
}: React.PropsWithChildren<{
  entity?: CollectionPointEntity;
  onCancel: () => void;
}>) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={!!entity}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
      fullScreen={isMobile}
    >
      <DialogContent>
        {entity && <PlaceDetail county={entity.county} id={entity.id} adminView />}
      </DialogContent>
      <DialogActions className={classes.dialogFooter}>
        <Button onClick={onCancel} color="primary">
          Späť
        </Button>
      </DialogActions>
    </Dialog>
  );
}
