"use client";

import { Suspense } from 'react';
import ModalPage from './page';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModalPage />
    </Suspense>
  );
}