import React from 'react';
import { TextLink } from '../components/TextLink';

export function NotFound() {
  return (
    <div>
      Prepáčte ale táto stránka neexistuje.
      <TextLink to={'/'} text={'Späť na úvodnu stránku'} />
    </div>
  );
}
