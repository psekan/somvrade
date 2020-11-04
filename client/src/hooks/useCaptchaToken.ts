import { useEffect, useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// https://developers.google.com/recaptcha/docs/v3
// google recaptcha expires in 2 minutes, refresh after 1 minute
const CAPTCHA_REFRESH_INTERVAL = 60000;

export function useCaptchaToken() {
  const googleRecaptchaContextValue = useGoogleReCaptcha();
  const [token, setToken] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  const handleExecuteRecaptcha = useCallback(async () => {
    const { executeRecaptcha } = googleRecaptchaContextValue;
    if (!executeRecaptcha) {
      console.warn('Execute recaptcha function not defined');
      return;
    }
    setLoading(true);
    try {
      const token = await executeRecaptcha();
      setToken(token);
    } finally {
      setLoading(false);
    }
  }, [googleRecaptchaContextValue]);

  useEffect(() => {
    handleExecuteRecaptcha();

    const interval = setInterval(handleExecuteRecaptcha, CAPTCHA_REFRESH_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [handleExecuteRecaptcha]);

  return {
    token,
    isLoading,
    refreshCaptchaToken: handleExecuteRecaptcha,
  };
}
