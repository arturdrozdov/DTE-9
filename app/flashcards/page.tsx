"use client";

import { useEffect, useState } from "react";
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
                  <TextArea
                    value={userInputs[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Type your answer..."
                    className="text-white rounded-md p-2 w-full"
                  />
                )}
                {index === 2 && (
                  <div className="w-full">
                    <button
                      className="w-full py-4 rounded-full bg-white text-black font-medium text-lg"
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
