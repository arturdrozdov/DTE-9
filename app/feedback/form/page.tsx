"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
// import BackButton from "@/components/ui/BackButton";
// import Button from "@/components/ui/Button";
// import OptionButton from "@/components/OptionButton";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
// import { sendFeedback } from "@/lib/sendFeedback";
import BackButton from "../../components/ui/BackButton";
import OptionButton from "../../components/ui/OptionButton";
import Button from "../../components/ui/Button";
import { sendFeedback } from "../../../lib/sendFeedback";

const DRAFT_KEY = "FEEDBACK_DRAFT";

type Draft = {
  helpful: number;
  engaging: number;
  overall: number;
};

type LengthChoiceValue = "long" | "right" | "short";

const LENGTH_OPTIONS: { label: string; value: LengthChoiceValue }[] = [
  { label: "Too Long", value: "long" },
  { label: "Just Right", value: "right" },
  { label: "Too Short", value: "short" },
] as const;

function sanitizeName(input: string): string {
  return input
    .replace(/[^\p{L}\p{N}\s'’-]/gu, "")
    .trim()
    .slice(0, 40);
}

export default function FeedbackFormPage() {
  const router = useRouter();

  const draftRef = useRef<Draft | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) {
        router.replace("/feedback");
        return;
      }
      draftRef.current = JSON.parse(raw) as Draft;
    } catch {
      router.replace("/feedback");
    }
  }, [router]);

  const draft = draftRef.current;

  const [lengthChoice, setLengthChoice] = useState<LengthChoiceValue | null>(
    null
  );
  const [days, setDays] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => lengthChoice !== null && days !== null && name.trim().length > 0,
    [lengthChoice, days, name]
  );

  const HITE_BASE = 952;
  const COMPLETED_VAL = 100;
  const STREAK_VAL = 7;
  const CORRECT_ROW_VAL = 15;

  const onSubmit = async () => {
    if (!canSubmit || submitting) return;
    if (!draft) {
      router.replace("/feedback");
      return;
    }

    setSubmitting(true);
    setSubmitErr(null);

    try {
      router.replace("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submit failed";
      setSubmitErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-dvh relative text-white'>
      <div className='absolute inset-0 -z-10 bg-cover bg-center' style={{ backgroundImage: `url('/quiz-bg.png')`}}/>

      <div className='max-w-md mx-auto px-4 pb-[calc(env(safe-area-inset-bottom,0px)+24px)]'>
        <BackButton onClick={() => router.back()} className='mt-2 mb-4' />

        {/* Q1 */}
        <h2 className='text-base font-medium mb-4'>
          What did you think of the length?
        </h2>
        <div className='space-y-3 mb-8'>
          {LENGTH_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              align='center'
              size='sm'
              selected={lengthChoice === opt.value}
              onClick={() => setLengthChoice(opt.value)}
            >
              {opt.label}
            </OptionButton>
          ))}
        </div>

        {/* Q2 */}
        <h2 className='text-base font-medium mb-3'>
          How many days a week could you see yourself doing trainings like this?
        </h2>
        <div className='flex items-center gap-3 mb-10'>
          {Array.from({ length: 8 }, (_, i) => i).map((n) => {
            const active = days === n;
            return (
              <button
                key={n}
                onClick={() => setDays(n)}
                className={twMerge(
                  "w-10 h-10 rounded-full grid place-items-center text-[16px] font-medium",
                  active ? "bg-white text-black" : "bg-white/10 text-white/85"
                )}
                aria-label={`${n} days`}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Q3 — notes */}
        <h3 className='text-[16px] text-white/85 mb-2'>
          Anything else you’d like to share
        </h3>
        <div className='relative mb-6'>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
            placeholder='Type your answer...'
            rows={2}
            className='w-full resize-none rounded-2xl bg-white/5 border border-white/20 px-4 py-3 outline-none placeholder:text-white/40'
          />
          <div className='absolute right-3 bottom-2 text-xs text-white/50'>
            {notes.length}/1000
          </div>
        </div>

        {/* Q4 — name */}
        <h3 className='text-[16px] text-white/85 mb-2'>
          Please enter your name
        </h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your name'
          className='w-full h-14 rounded-2xl bg-white/5 border border-white/20 px-4 outline-none mb-10'
        />

        {/* SUBMIT */}
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={twMerge(
            "w-full rounded-[999px] py-4 text-lg flex items-center justify-center px-5",
            !canSubmit && "opacity-60 pointer-events-none"
          )}
          variant='button'
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
        {submitErr && <p className='mt-2 text-sm text-red-400'>{submitErr}</p>}
      </div>
    </div>
  );
}
