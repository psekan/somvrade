import React from 'react';
import { LinearProgress, makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CollectionPointEntity, useCollectionPointEntries } from '../../services';

const useStyles = makeStyles({
  headerCell: {
    fontSize: '0.8rem',
    lineHeight: '0.8rem',
  },
});

interface CollectionEntriesProps {
  collectionPoint: CollectionPointEntity;
  className?: string;
  limitTable?: number;
}

export function CollectionEntries({
  collectionPoint,
  className,
  limitTable,
}: CollectionEntriesProps) {
  const classes = useStyles();
  const { response, isLoading } = useCollectionPointEntries(collectionPoint.id);
  let data = limitTable ? response?.slice(0, limitTable) : response;
  return (
    <TableContainer component={Paper} className={className}>
      {isLoading && <LinearProgress />}
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell}>Návštevník prišiel o:</TableCell>
            <TableCell align={'center'} className={classes.headerCell}>
              Počet osôb pred ním:
            </TableCell>
            <TableCell align={'right'} className={classes.headerCell}>
              Návštevník odišiel o:
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data || []).map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.arrive}
              </TableCell>
              <TableCell component="th" scope="row" align={'center'}>
                {row.length}
              </TableCell>
              <TableCell component="th" scope="row" align={'right'}>
                {row.departure}
              </TableCell>
            </TableRow>
          ))}
          {(response || []).length === 0 && (
            <TableRow>
              <TableCell component="th" scope="row" colSpan={3} align="center">
                O tomto odbernom mieste zatiaľ nemáme žiadne informácie.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
