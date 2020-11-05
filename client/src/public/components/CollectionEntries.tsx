import React, { useState } from 'react';
import { makeStyles, Typography, useTheme, useMediaQuery } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import InfoIcon from '@material-ui/icons/InfoRounded';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Backdrop from '@material-ui/core/Backdrop';
import isAfter from 'date-fns/isAfter';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';
import classNames from 'classnames';
import { CollectionPointEntry } from '../../services';

const useStyles = makeStyles(theme => ({
  headerCell: {
    fontSize: '0.8rem',
    lineHeight: '0.8rem',
  },
  countInfo: {
    textAlign: 'center',
    margin: '20px 0',
  },
  messageBackdrop: {
    zIndex: 999,
    color: '#fff',
    background: 'rgba(0,0,0, 0.9)',
  },
  messageContent: {
    maxWidth: 500,
    textAlign: 'center',
    padding: 20,
  },
  infoIconSmall: {
    fontSize: 14,
    cursor: 'pointer',
    verticalAlign: 'middle',
  },
  infoIconLarge: {
    fontSize: 60,
    marginBottom: 20,
  },
  verified: {
    background: theme.palette.primary.light,
  },
}));

interface CollectionEntriesProps {
  className?: string;
  limitTable?: number;
  maxItemsCollapsedMobile?: number;
  maxItemsCollapsedDesktop?: number;
  data: CollectionPointEntry[] | undefined;
}

const VALUES_FOR_MEDIAN = 10;

export function CollectionEntries({
  className,
  limitTable,
  data,
  maxItemsCollapsedMobile = 5,
  maxItemsCollapsedDesktop = 10,
}: CollectionEntriesProps) {
  const classes = useStyles();
  const [tableCollabsed, setTableCollapsed] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string>();
  const dataToDisplay = (limitTable ? data?.slice(0, limitTable) : data) || [];
  const dataSize = (dataToDisplay || []).length;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const maxItemsCollapsed = isMobile ? maxItemsCollapsedMobile : maxItemsCollapsedDesktop;
  const waiting = countWaiting(data || []);

  return (
    <div>
      {dataSize > 0 && (
        <div className={classes.countInfo}>
          <Typography
            variant={'h6'}
            onClick={() =>
              setInfoMessage(`Počet čakajúcich sa snažíme zobraziť vždy podľa posledného záznamu od administratívneho pracovníka z danného odberného miesta za poslednú hodinu. 
              Ak takýto záznam neexistuje, vypočítavame ho na základe údajov od ostatných používateľov.`)
            }
          >
            Približný počet čakajúcich <InfoIcon className={classes.infoIconSmall} />
          </Typography>
          <Typography variant={'h3'}>
            <Colored count={waiting} />
          </Typography>
          <Typography variant={'caption'}>
            Posledná aktualizácia: {dataToDisplay[0].arrive}
          </Typography>
        </div>
      )}
      <TableContainer component={Paper} className={className}>
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
            {dataToDisplay.slice(0, tableCollabsed ? maxItemsCollapsed : dataSize).map(row => (
              <TableRow
                key={row.id}
                className={classNames(row.verified ? classes.verified : undefined)}
                onClick={() => {
                  if (row.verified) {
                    setInfoMessage(
                      `Záznam uložený administratívnym pracovníkom priamo z daného odberného miesta.`,
                    );
                  }
                }}
              >
                <TableCell component="th" scope="row">
                  {formatTime(row.arrive)}{' '}
                  {row.verified && <CheckCircleIcon className={classes.infoIconSmall} />}
                </TableCell>
                <TableCell component="th" scope="row" align={'center'}>
                  {row.length}
                </TableCell>
                <TableCell component="th" scope="row" align={'right'}>
                  {formatTime(row.departure) || 'Čaká sa'}{' '}
                </TableCell>
              </TableRow>
            ))}
            {dataSize === 0 && (
              <TableRow>
                <TableCell component="th" scope="row" colSpan={3} align="center">
                  O tomto odbernom mieste zatiaľ nemáme žiadne informácie.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {dataSize > maxItemsCollapsed && (
          <Button
            size={'small'}
            fullWidth
            title={tableCollabsed ? 'Zobraziť všetko' : 'Schovaj staršie'}
            onClick={() => setTableCollapsed(!tableCollabsed)}
          >
            {tableCollabsed ? 'Zobraziť všetko' : 'Schovať staršie'}
            {tableCollabsed ? <ArrowDown fontSize={'small'} /> : <ArrowUp fontSize={'small'} />}
          </Button>
        )}
      </TableContainer>
      <Backdrop
        className={classes.messageBackdrop}
        open={!!infoMessage}
        onClick={() => setInfoMessage(undefined)}
      >
        <div className={classes.messageContent}>
          <InfoIcon className={classes.infoIconLarge} />
          <div>{infoMessage}</div>
        </div>
      </Backdrop>
    </div>
  );
}

function Colored({ count, additonalText }: { count: number; additonalText?: string }) {
  const theme = useTheme();
  const colorsMapping = [
    {
      color: theme.palette.primary.main,
      range: [0, 50],
    },
    {
      color: theme.palette.warning.dark,
      range: [50, 80],
    },
    {
      color: theme.palette.error.dark,
      range: [80, Infinity],
    },
  ];
  const color = colorsMapping.find(c => count >= c.range[0] && count <= c.range[1]);
  return (
    <span style={{ color: color?.color }}>
      {count} {additonalText}
    </span>
  );
}

function formatTime(time: string) {
  if (time) {
    if (time.length === 8) {
      time = time.substring(0, 5);
    }
    if (time.charAt(0) === '0') {
      time = time.substring(1);
    }
  }
  return time;
}

function countWaiting(data: CollectionPointEntry[]) {
  const valueForMedian = data.slice(0, VALUES_FOR_MEDIAN);

  let addedWithinHour = getWithinHour(data, true);
  if (addedWithinHour.length) {
    // if there are some verified items then don't count median and return the first one
    return addedWithinHour[0].length;
  }
  // otherwise get items from last hour
  addedWithinHour = getWithinHour(data);

  return Math.ceil(
    median((addedWithinHour.length ? addedWithinHour : valueForMedian).map(it => it.length)),
  );
}

function getWithinHour(data: CollectionPointEntry[], onlyVerified?: boolean) {
  const hourBefore = new Date(Date.now() - 3600000);
  const now = new Date();
  return data
    .filter(it => !onlyVerified || it.verified)
    .filter(it => {
      const hourMinutesPair = it.arrive.split(':');
      const timeAdded = setHours(
        setMinutes(now, Number(hourMinutesPair[1])),
        Number(hourMinutesPair[0]),
      );
      return isAfter(timeAdded, hourBefore);
    });
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
}
