import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import FacebookShareButton from 'react-share/es/FacebookShareButton';
import FacebookIcon from 'react-share/es/FacebookIcon';
import TwitterShareButton from 'react-share/es/TwitterShareButton';
import TwitterIcon from 'react-share/es/TwitterIcon';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'fixed',
    left: 20,
    bottom: 20,
  },
}));

export function SocialButtons() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const fabProps = {
    component: React.forwardRef(
      (
        { children, className }: React.PropsWithChildren<{ className: string }>,
        ref: React.Ref<any>,
      ) => {
        return (
          <div className={className} ref={ref}>
            {children}
          </div>
        );
      },
    ),
  };

  return (
    <SpeedDial
      ariaLabel={'share'}
      className={classes.speedDial}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction={'up'}
      icon={<ShareIcon />}
    >
      <SpeedDialAction
        icon={
          <FacebookShareButton url={window.location.href} hashtag={'#somvrade'}>
            <FacebookIcon round size={50} />
          </FacebookShareButton>
        }
        tooltipPlacement={'right'}
        tooltipTitle={'Zdieľaj na Facebooku'}
        onClick={handleClose}
        FabProps={{
          ...(fabProps as any), // workaround to pass custom component
        }}
      />
      <SpeedDialAction
        icon={
          <TwitterShareButton url={window.location.href} hashtags={['somvrade']}>
            <TwitterIcon round size={50} />
          </TwitterShareButton>
        }
        FabProps={{
          ...(fabProps as any), // workaround to pass custom component
        }}
        tooltipPlacement={'right'}
        tooltipTitle={'Zdieľaj na Twitteri'}
        onClick={handleClose}
      />
    </SpeedDial>
  );
}
