"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";

const SlowDrawGame = () => {
  const router = useRouter();

  const canvasRef = useRef(null);

  const [pathPoints, setPathPoints] = useState([]);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotIndex, setDotIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [currentTimes, setCurrentTimes] = useState(Array(6).fill(null));
  const [firstAttemptTimes, setFirstAttemptTimes] = useState(Array(6).fill(null));
  const [segmentStartTime, setSegmentStartTime] = useState(null);
  const [raceNumber, setRaceNumber] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [trackRed, setTrackRed] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [modalFor, setModalFor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const canvasWidth = 350;
  const canvasHeight = 600;
  const dragRadius = 70;
  const segmentsCount = 6;

  const onModalAction = () => {
    if (!hasFinished) {
      setModalVisible(false);
    } else {
      router.push("/modal");
    }
  }

  const generateSmoothRoad = () => {
    const basePoints = [
      { x: 70, y: 40 },
      { x: 150, y: 100 },
      { x: 70, y: 200 },
      { x: 130, y: 240 },
      { x: 150, y: 340 },
      { x: 110, y: 400 },
      { x: 210, y: 420 },
      { x: 250, y: 200 },
      { x: 250, y: 100 },
      { x: 310, y: 30 },
    ];

    const jitter = 15;
    const controlPoints = basePoints.map((p) => ({
      x: p.x + (Math.random() * jitter * 2 - jitter),
      y: p.y + (Math.random() * jitter * 2 - jitter),
    }));

    const smoothPoints = [];
    const steps = 20;

    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p0 = controlPoints[i === 0 ? i : i - 1];
      const p1 = controlPoints[i];
      const p2 = controlPoints[i + 1];
      const p3 = controlPoints[i + 2 < controlPoints.length ? i + 2 : i + 1];

      for (let t = 0; t <= 1; t += 1 / steps) {
        const t2 = t * t;
        const t3 = t2 * t;

        const x =
          0.5 *
          ((2 * p1.x) +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

        const y =
          0.5 *
          ((2 * p1.y) +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

        smoothPoints.push({ x, y });
      }
    }

    smoothPoints.push(controlPoints[controlPoints.length - 1]);
    return smoothPoints;
  };

  // --- Draw road ---
  const draw = (ctx) => {
    if (!pathPoints.length) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.lineWidth = 10;

    if (trackRed) {
      // Background full track
      ctx.strokeStyle = "rgba(124, 121, 206, 0.2)";
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      pathPoints.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Only the passed portion in red
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i <= dotIndex; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      ctx.stroke();
    } else {
      ctx.strokeStyle = "rgba(124, 121, 206, 0.2)";
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      pathPoints.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();

      ctx.strokeStyle =
        raceNumber === 1
          ? "rgba(124, 121, 206, 1)"   // 1st attempt
          : "rgba(178, 255, 139, 1)";    // 2nd attempt+
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i <= dotIndex; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      ctx.stroke();

    }

    // ctx.fillStyle = "rgb(124, 121, 206)";
    ctx.beginPath();
    // ctx.arc(pathPoints[0].x, pathPoints[0].y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "normal 14px 'DM Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Start", pathPoints[0].x - 15, pathPoints[0].y + 45);

    // ctx.fillStyle = "rgba(124, 121, 206, 0.3)";
    ctx.beginPath();
    // ctx.arc(pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "normal 14px 'DM Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Finish", pathPoints[pathPoints.length - 1].x - 15, pathPoints[pathPoints.length - 1].y + 25);

    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 30, 0, Math.PI * 2);
    ctx.fillStyle = isDragging ? "rgba(37, 53, 89, 0.5)" : "#253559";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    if (trackRed && showRestart) {
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("Too fast!", dotPos.x, dotPos.y + 45);
      ctx.fillText("Try again.", dotPos.x, dotPos.y + 65);

    }
  };

  useEffect(() => {
    const smoothRoad = generateSmoothRoad();
    setPathPoints(smoothRoad);
    setDotPos(smoothRoad[0]);
    setDotIndex(0);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    draw(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathPoints, dotPos, trackRed]);

  // --- Get mouse or touch coordinates ---
  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleDown = (e) => {
    const { x, y } = getCoords(e);
    if (Math.hypot(x - dotPos.x, y - dotPos.y) <= dragRadius) {
      setIsDragging(true);
      setSegmentStartTime(performance.now());
      setErrorMessage("");
      if (raceNumber > 1) setCurrentTimes(Array(segmentsCount).fill(null)); // only reset for 2nd+ attempts
    }
    if (trackRed) restart();
  };

  const handleMove = (e) => {
    if (!isDragging || trackRed) return;
    const { x: mouseX, y: mouseY } = getCoords(e);

    const maxIndex = Math.min(dotIndex + 3, pathPoints.length - 1);

    let nextIndex = dotIndex;
    for (let i = dotIndex + 1; i <= maxIndex; i++) {
      const distToCursor = Math.hypot(pathPoints[i].x - mouseX, pathPoints[i].y - mouseY);
      const distCurrent = Math.hypot(pathPoints[nextIndex].x - mouseX, pathPoints[nextIndex].y - mouseY);
      if (distToCursor < distCurrent) nextIndex = i;
    }

    if (nextIndex > dotIndex) {
      setDotIndex(nextIndex);
      setDotPos(pathPoints[nextIndex]);

      // --- segment timing ---
      const dotsPerSegment = Math.floor(pathPoints.length / segmentsCount);
      for (let seg = 0; seg < segmentsCount; seg++) {
        const segEnd =
          seg === segmentsCount - 1 ? pathPoints.length - 1 : (seg + 1) * dotsPerSegment - 1;

        if (dotIndex >= segEnd && currentTimes[seg] === null && segmentStartTime) {
          const elapsed = performance.now() - segmentStartTime;
          const newTimes = [...currentTimes];
          newTimes[seg] = Math.round(elapsed);
          setCurrentTimes(newTimes);

          if (raceNumber === 1) {
            const first = [...firstAttemptTimes];
            first[seg] = Math.round(elapsed);
            setFirstAttemptTimes(first);
          } else if (
            firstAttemptTimes[seg] !== null &&
            elapsed < firstAttemptTimes[seg]
          ) {
            setTrackRed(true);
            setErrorMessage(`Too fast on segment ${seg + 1}!`);
            setIsDragging(false);
            setShowRestart(true);
          }

          setSegmentStartTime(performance.now());
        }
      }

      if (nextIndex === pathPoints.length - 1 && raceNumber === 1) {
        setRaceNumber(raceNumber + 1);
        setDotIndex(0);
        setDotPos(pathPoints[0]);
        setIsDragging(false);
        setSegmentStartTime(null);
        setModalFor("calibration");
        setModalVisible(true);
      } else if (nextIndex === pathPoints.length - 1 && raceNumber > 1) {
        setHasFinished(true);
        setModalFor("success");
        setModalVisible(true);
      }
    }
  };

  const handleUp = () => {
    setIsDragging(false);
    setSegmentStartTime(null);
  };

  const restart = () => {
    setDotIndex(0);
    setDotPos(pathPoints[0]);
    setTrackRed(false);
    setErrorMessage("");
    setShowRestart(false);
    setIsDragging(false);
    setSegmentStartTime(null);
  }

  return (
    <div>
      <h2 className="text-[24px] leading-[24px] font-medium text-white mb-4 font-bold">{raceNumber === 1 ? 'Calibration Phase' : 'Challenge Phase'}</h2>
      <p className="text-[16px] mb-12 font-normal">{raceNumber === 1 ? 'Trace the path at your normal pace. This will set your personal speed baseline.' : 'Now trace the same path, but slower. Keep your pace under the target speed.'}</p>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ cursor: "pointer", touchAction: "none" }}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />
      {modalVisible && (
        <div className='fixed inset-0 z-[999] flex items-center justify-center px-4'>
          <div
            className='absolute inset-0 bg-black/60'
            onClick={() => setModalVisible(false)}
          />
          <div className='relative max-w-md w-full bg-[#1b1b1b] rounded-2xl p-6 shadow-2xl border border-white/6'>
            <h3 className='text-2xl font-bold mb-3 text-center'>
              {modalFor === "calibration"
                ? "Calibration complete!"
                : "Success! You stayed calm and controlled."}
            </h3>
            <p className='text-white/70 text-center'>
              {modalFor === "calibration"
                ? "Your average speed has been recorded. Get ready for the challenge."
                : ""}
            </p>

            <div className='flex justify-center my-6'>
              <Image src='/check.png' alt='Done' width={60} height={60} />
            </div>

            <button
              onClick={onModalAction}
              className='w-full py-3 rounded-full bg-white text-black font-medium'
            >
              Go to Challenge Phase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlowDrawGame;
