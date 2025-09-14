"use client"
import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/ui/BackButton";

export default function QuestionsPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setCurrentSlide(2);
  };

  const handleLevelSelect = (level: number) => {
    if (level > 3) {
      setSelectedLevel(level);
      setCurrentSlide(3);
    }
  };

  const handleReasonSelect = (reason: string) => {
    if (reason === "I\’m clear on my goals and making progress.") {
      setSelectedReason(reason);
      // Navigate to modal after completing all questions
      router.push('/modal?train=true');
    }
  };

  const handleBack = () => {
    if (currentSlide === 1) {
      router.push('/notification');
    } else {
      setCurrentSlide(currentSlide - 1);
    }
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

            <div className='flex gap-[0.938rem] mb-[3.375rem] items-center'>
              <BackButton onClick={handleBack} />
              <span className='font-bold text-2xl'>Discover</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-[30px]">
              <div className="w-full h-[10px] bg-white/10 rounded-[12px] overflow-hidden">
                <div
                  className="h-full bg-white rounded-[12px] transition-all duration-300 ease-out"
                  style={{ width: `${(currentSlide / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Slide 1: Theme Selection */}
            {currentSlide === 1 && (
              <div className="flex-1 flex flex-col">
                <div className="mb-[30px] min-h-[44px] mt-[30px]">
                  <h2 className="text-[20px] leading-[24px] font-medium text-white">What do you want to focus on today?</h2>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <button
                    onClick={() => handleThemeSelect('Control')}
                    className="w-full flex items-center justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[18px] font-medium">Control</span>
                  </button>

                  <button
                    onClick={() => handleThemeSelect('Focus')}
                    className="w-full flex items-center justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[18px] font-medium">Focus</span>
                  </button>

                  <button
                    onClick={() => handleThemeSelect('Composure')}
                    className="w-full flex items-center justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[18px] font-medium">Composure</span>
                  </button>
                </div>
              </div>
            )}

            {/* Slide 2: High/Low Route Selection */}
            {currentSlide === 2 && (
              <div className="flex-1 flex flex-col">
                <div className="mb-[30px] min-h-[44px] mt-[30px]">
                  <h2 className="text-[20px] leading-[24px] font-medium text-white">
                    How are you feeling about your Control today?
                  </h2>
                </div>

                <div className="flex-1 flex flex-col gap-3 text-left">
                  <button
                    onClick={() => handleLevelSelect(5)}
                    className="w-full text-left flex items-center px-[15px] h-[60px] bg-[#FFFFFF26] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="w-[28px] h-[28px] flex-shrink-0 flex items-center justify-center bg-[#353535] rounded-full mr-2.5 font-bold text-[14px] text-[#FFFFFF80]">5</span><span className="text-[16px] text-white">I’ve been steady and composed, even under pressure.</span>
                  </button>

                  <button
                    onClick={() => handleLevelSelect(4)}
                    className="w-full text-left flex items-center px-[15px] h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="w-[28px] h-[28px] flex-shrink-0 flex items-center justify-center bg-[#353535] rounded-full mr-2.5 font-bold text-[14px] text-[#FFFFFF80]">4</span><span className="text-[16px] text-white">I can settle myself pretty well when things get tough.</span>
                  </button>

                  <button
                    onClick={() => handleLevelSelect(3)}
                    className="w-full text-left flex items-center px-[15px] h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="w-[28px] h-[28px] flex-shrink-0 flex items-center justify-center bg-[#353535] rounded-full mr-2.5 font-bold text-[14px] text-[#FFFFFF80]">3</span><span className="text-[16px] text-white">I hold it together sometimes, but not always.</span>
                  </button>

                  <button
                    onClick={() => handleLevelSelect(2)}
                    className="w-full text-left flex px-[15px] items-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="w-[28px] h-[28px] flex-shrink-0 flex items-center justify-center bg-[#353535] rounded-full mr-2.5 font-bold text-[14px] text-[#FFFFFF80]">2</span><span className="text-[16px] text-white">I lose control quickly when things go wrong.</span>
                  </button>

                  <button
                    onClick={() => handleLevelSelect(1)}
                    className="w-full text-left flex items-center px-[15px] h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="w-[28px] h-[28px] flex-shrink-0 flex items-center justify-center bg-[#353535] rounded-full mr-2.5 font-bold text-[14px] text-[#FFFFFF80]">1</span><span className="text-[16px] text-white">I feel reactive and scattered most of the time.</span>
                  </button>
                </div>
              </div>
            )}

            {/* Slide 3: Performance Reason */}
            {currentSlide === 3 && (
              <div className="flex-1 flex flex-col">
                <div className="mb-[30px] min-h-[44px] mt-[30px]">
                  <h2 className="text-[20px] leading-[24px] font-medium text-white">
                    What’s been helping you stay strong in your Control?
                  </h2>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <button
                    onClick={() => handleReasonSelect('I\’m coming off a breakthrough.')}
                    className="w-full flex items-center p-[20px] justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"

                  >
                    <span className="text-[16px] text-left w-full">I’m coming off a breakthrough.</span>
                  </button>

                  <button
                    onClick={() => handleReasonSelect('I\’m clear on my goals and making progress.')}
                    className="w-full flex items-center p-[20px] justify-center h-[60px] bg-[#FFFFFF26] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[16px] text-left w-full">I’m clear on my goals and making progress.</span>
                  </button>

                  <button
                    onClick={() => handleReasonSelect('I\’m focused and determined.')}
                    className="w-full flex items-center p-[20px] justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[16px] text-left w-full">I’m focused and determined.</span>
                  </button>

                  <button
                    onClick={() => handleReasonSelect('I\’m building habits that work for me.')}
                    className="w-full flex items-center p-[20px] justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"

                  >
                    <span className="text-[16px] text-left w-full">I’m building habits that work for me.</span>
                  </button>

                  <button
                    onClick={() => handleReasonSelect('I\’m pushing myself to lead or improve. ')}
                    className="w-full flex items-center p-[20px] justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"

                  >
                    <span className="text-[16px] text-left w-full">I’m pushing myself to lead or improve. </span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}