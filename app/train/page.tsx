"use client"
import { useRouter } from "next/navigation";
import BackButton from "../components/ui/BackButton";
import { useState } from "react";
import Image from "next/image";

export default function FlashCard() {
  const [isBackBtn, setIsBackBtn] = useState(false);
  const router = useRouter();
  const handleBack = () => {
    router.push('/notification');
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="min-h-screen max-w-md w-full relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/quiz-bg.png')" }}
        />

        {/* Content */}
        <div className="relative z-10 h-dvh px-4 pt-4 pb-[3.125rem] flex flex-col overflow-scroll">
          {/* Header */}
          {isBackBtn && (
            <div className="flex gap-3 mb-[3.375rem] items-center">
              <BackButton onClick={handleBack} />
              <span className="font-bold text-2xl">Discover</span>
            </div>
          )}

          {/* Card */}
          <div className="w-full mb-4 flex justify-center">
            <div
              className="w-full max-w-[520px] rounded-[24px] p-3 flex flex-col items-center overflow-hidden"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.02), 0 12px 40px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* Image container */}
              <div
                className="relative w-full rounded-[14px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.2)",
                  height: "320px",
                }}
              >
                <Image
                  src="/Train.jpg"
                  alt="Train"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              {/* Text Content */}
              <div className="w-full flex-1 pt-4 flex flex-col">
                <h1 className="text-[28px] font-extrabold text-white leading-snug mb-3">
                  Mastering Control
                </h1>

                <p className="text-[15px] text-white/70 leading-relaxed mb-6">
                  As routines shift, your attention can start scanning in too many directions. When you’re adding new elements—more reps, different feedback, higher expectations—it’s easy for your focus to feel stretched. Athletes who stay grounded during growth phases usually return to one constant. They build around a steady focal point instead of chasing everything at once. This is what keeps your attention useful, even in the middle of change.
                </p>

                {/* Info */}
                <div className="flex items-center gap-3 text-white/75 mb-8">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center">
                    <Image
                      src="/Union.svg"
                      alt="Train"
                      width={20}
                      height={20}
                      style={{ objectFit: "cover", color: 'red' }}
                      priority
                    />
                  </div>
                  <div className="text-sm text-white/80">3 Flashcards</div>
                </div>

                {/* Start Button */}
                <div className="mt-auto w-full">
                  <button
                    className="w-full py-4 rounded-full bg-white text-black font-medium text-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                    style={{
                      boxShadow:
                        "0 12px 30px rgba(11,14,24,0.7), inset 0 -6px 18px rgba(0,0,0,0.25)",
                    }}
                  onClick={() => router.push('/flashcards')}
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End of Card */}
        </div>
      </div>
    </div>
  )
}