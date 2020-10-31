import React from 'react';
import { TextLink } from './TextLink';

export function BackToStartLink({ center }: { center?: boolean }) {
  return <TextLink to={'/'} text={'Späť na začiatok'} center={center} />;
}
