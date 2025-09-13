"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/mousewheel";
import TextArea from "../components/ui/TextArea";
import Counter from "../components/ui/Counter";
import BackButton from "../components/ui/BackButton";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Card {
  title?: string;
  content?: string;
}

const cards: Card[] = [
  { title: "Think about the rhythm you’ve been operating at lately. Has it helped you stay clear and present, or has it made it harder to stay steady?", content: "" },
  { title: "Motivation", content: "Motivation tends to speed things up. You might move faster, decide quicker, or skip steps without noticing. Control means learning to work with that energy without letting it take over your rhythm. You can still move with purpose while keeping your internal pace smooth and steady." },
  { title: "The Slow Draw", content: "Slow one part of your current rhythm today." },
];

export default function Flashcards() {
  const router = useRouter();

  const [userInputs, setUserInputs] = useState<string[]>(["", "", ""]);
  const [showSwipeUp, setShowSwipeUp] = useState(true);
  const swiperRef = useRef<any>(null);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const handleBack = () => {
    router.push('/train');
  };

  const triggerSwipeUp = (data?) => {
    const activeIndex = data?.activeIndex || 0;
    if (activeIndex < cards.length - 1) {
      setShowSwipeUp(true);
      setTimeout(() => setShowSwipeUp(false), 2000);
    } else {
      setShowSwipeUp(false);
    }
  };

  useEffect(() => {
    triggerSwipeUp();
  }, []);

  const handleTextSubmit = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext(); // swipe to next slide
    }
  }

  const handleBeforeSlideChange = (swiper) => {
    console.log(swiper);
    if (swiper.activeIndex === 0 && !userInputs[0].trim()) {
      // Prevent swipe if text is empty
      swiper.allowSlideNext = false;
      swiper.allowSlidePrev = true;
    } else {
      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md h-full">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 blur-[8px]"
          style={{ backgroundImage: `url("/Train.jpg")` }}
        />
        <div className="absolute inset-0 bg-white/15" />
        <div className='flex items-center relative'>
          <BackButton onClick={handleBack} />
        </div>
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={20}
          mousewheel={true}
          modules={[Mousewheel]}
          className="h-full"
          onSlideChange={triggerSwipeUp}
          onSlideChangeTransitionStart={handleBeforeSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            if (!userInputs[0].trim()) {
              swiper.allowSlideNext = false;
            }
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col space-y-4 w-full max-w-md px-2">
                <Counter
                  count={index}
                  length={cards.length}
                  title={index === 2 ? 'Mini Game' : 'Flashcard'}
                />
                <p className="text-white text-[22px] text-left">{card.title}</p>
                <p className="text-white text-[16px] text-left">{card.content}</p>

                {index === 0 && (
                  <div className="flex flex-col">
                    <TextArea
                      size="sm"
                      value={userInputs[index]}
                      onChange={(e) => {
                        handleInputChange(index, e.target.value);
                        if (swiperRef.current) {
                          if (e.target.value.trim().length === 0) {
                            swiperRef.current.allowSlideNext = false; // block if empty
                          } else {
                            swiperRef.current.allowSlideNext = true;  // allow if not empty
                          }
                        }
                      }}
                      placeholder="Type your answer..."
                      className="text-white rounded-md p-2 w-full"
                    />
                    <div className='px-2 pb-6 w-full mt-10'>
                      {index === 0 && userInputs[index].trim().length > 0 && (
                        <div className='mt-4'>
                          <button
                            onClick={handleTextSubmit}
                            className='w-full max-w-[420px] mx-auto block rounded-3xl px-6 py-3 text-black text-lg font-medium bg-white'
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div className="w-full">
                    <button
                      className="w-full py-4 rounded-full bg-white text-black font-medium text-lg mt-8"
                      onClick={() => router.push('/game')}
                    >
                      Start
                    </button>
                  </div>
                )}
              </div>
              {showSwipeUp && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce text-white">
                  <Image
                    src="/swipeUp.svg"
                    alt="swipeUp"
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", color: 'red' }}
                    priority
                  />
                </div>
              )}
            </SwiperSlide>

          ))}
        </Swiper>
      </div>
    </div>
  );
}
