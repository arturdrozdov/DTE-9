"use client";

import { useRouter } from "next/navigation";
import BackButton from "../components/ui/BackButton";
import SlowDrawGame from "../components/game/SlowDrawGame";

export default function GamePage() {
  const router = useRouter();
  const handleBack = () => {
    router.push('/flashcards');
  };
  return (
    <div className="w-full h-full flex justify-center">
      <div className="min-h-screen max-w-md w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/quiz-bg.png')` }}
        />

        <div className="relative z-10 h-dvh px-4 pt-[1rem] pb-[3.125rem]">
          <div className="h-full w-full flex flex-col">

            <div className='flex mb-6 items-center'>
              <BackButton onClick={handleBack} />
            </div>
          <SlowDrawGame/>
          </div>
        </div>
      </div>
    </div>
  )
}