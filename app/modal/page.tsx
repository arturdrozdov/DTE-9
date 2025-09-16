"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "../components/ui/Button";

function ModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isTrain = searchParams.get("train");

  const onSubmit = () => {
        isTrain ? router.push("/train") : router.push("/execute");
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="min-h-screen max-w-md w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/modal-bg.png')` }}
        />

        <div className="absolute inset-0 bg-[#111111] opacity-90 z-10" />

        <div className="relative z-20 h-dvh p-[18px] flex flex-col justify-center">
          <div className="w-full h-[282px] bg-[#FFFFFF1A] border border-[#FFFFFF4D] rounded-[24px] p-4 flex flex-col items-center justify-between backdrop-blur-[40px] relative">
            <div>
              <h1 className="text-[20px] font-bold text-white text-center leading-[20px]">
                {isTrain
                  ? "Train Section Unlocked!"
                  : "Execute Section Unlocked!"}
              </h1>

              <p className="text-[#FFFFFFCC] text-center text-[14px] mt-2">
                {isTrain
                  ? "Track And Grow Your Personal Skills — Now Available In Your Dashboard."
                  : "Set clear Execute to stay aligned and focused each day."}
              </p>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] flex items-center justify-center">
              <Image
                src="/lock1.png"
                alt="Unlock Icon"
                width={190}
                height={190}
                className="object-contain"
              />
            </div>

            <Button onClick={onSubmit} className="z-[100]">
              {isTrain ? "Go to Train" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModalPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ModalContent />
    </Suspense>
  );
}
