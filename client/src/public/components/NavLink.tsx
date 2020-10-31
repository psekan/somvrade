import React, { ReactNode } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: 'block',
      color: theme.palette.text.primary,
      fontSize: '1rem',
      textDecoration: 'none',
      margin: 5,
      flex: '0 1 50%',
      textAlign: 'center',

      '& span:first-child': {
        textAlign: 'center',
        border: `1px solid ${theme.palette.primary.main}`,
        padding: '20px 7px',
        display: 'flex',
        borderRadius: 5,
        background: theme.palette.action.hover,
        '&:hover': {
          background: theme.palette.action.selected,
        },
        minHeight: 60,
        alignItems: 'center',
        wordWrap: 'break-word',
        overflowWrap: 'anywhere',
        justifyContent: 'center',
      },
      '& span:last-child': {
        fontSize: '0.8rem',
        display: 'block',
      },
    },
    compact: {
      fontSize: '0.9rem',
      flex: '0',
      '& span:first-child': {
        padding: '7px',
      },
    },
  }),
);

interface NavLinkProps {
  to: string;
  label: string;
  description?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function NavLink({ to, label, description, compact, className }: NavLinkProps) {
  const classes = useStyles();
  return (
    <RouterLink to={to} className={classNames(classes.link, compact && classes.compact, className)}>
      <span>{label}</span>
      <span>{description}</span>
    </RouterLink>
  );
}
