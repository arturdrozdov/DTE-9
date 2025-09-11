"use client";

import { Suspense } from "react";
import DashboardInner from "../components/ui/DashboardInner";

export default function DashboardDemo() {
  return (
    <Suspense fallback={<div className='text-white'>Loading...</div>}>
      <DashboardInner />
    </Suspense>
  );
}
