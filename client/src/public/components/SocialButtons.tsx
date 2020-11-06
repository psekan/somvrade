import React from 'react';
import { makeStyles } from '@material-ui/core';
import FacebookShareButton from 'react-share/es/FacebookShareButton';
import FacebookIcon from 'react-share/es/FacebookIcon';
import TwitterShareButton from 'react-share/es/TwitterShareButton';
import TwitterIcon from 'react-share/es/TwitterIcon';

const useStyles = makeStyles({
  socialButtons: {
    margin: '0 0 0 10px',
    textAlign: 'center',
  },
  socialButton: {
    margin: '0 3px',
  },
});

export function SocialButtons() {
  const classes = useStyles();
  return (
    <div className={classes.socialButtons}>
      <FacebookShareButton
        url={window.location.href}
        hashtag={'#somvrade'}
        className={classes.socialButton}
      >
        <FacebookIcon round size={30} />
      </FacebookShareButton>
      <TwitterShareButton
        url={window.location.href}
        hashtags={['somvrade']}
        className={classes.socialButton}
      >
        <TwitterIcon round size={30} />
      </TwitterShareButton>
    </div>
  );
}
