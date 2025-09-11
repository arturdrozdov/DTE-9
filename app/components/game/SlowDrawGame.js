import React, { useRef, useEffect, useState } from "react";

const SlowDrawGame = () => {
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
  // const [trackStatus, setTrackStatus] = useState([]); // each point status


  const canvasWidth = 600;
  const canvasHeight = 400;
  const dragRadius = 30;
  const segmentsCount = 6;

  // --- Generate smooth U-like road ---
  const generateSmoothRoad = () => {
    const basePoints = [
      { x: 100, y: 40 },
      { x: 180, y: 60 },
      { x: 100, y: 160 },
      { x: 160, y: 200 },
      { x: 180, y: 300 },
      { x: 140, y: 350 },
      { x: 200, y: 380 },
      { x: 240, y: 200 },
      { x: 240, y: 100 },
      { x: 300, y: 160 },
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
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      pathPoints.forEach((p) => ctx.lineTo(p.x, p.y));
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

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(pathPoints[0].x, pathPoints[0].y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 8, 0, Math.PI * 2);
    ctx.fill();
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
      setTrackRed(false);
      if (raceNumber > 1) setCurrentTimes(Array(segmentsCount).fill(null)); // only reset for 2nd+ attempts
    }
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
        const segStart = seg * dotsPerSegment;
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

      if (nextIndex === pathPoints.length - 1) {
        setRaceNumber(raceNumber + 1);
        setDotIndex(0);
        setDotPos(pathPoints[0]);
        setIsDragging(false);
        setSegmentStartTime(null);
      }
    }
  };

  const handleUp = () => {
    setIsDragging(false);
    setSegmentStartTime(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Drag the blue dot along the road</h2>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid black", cursor: "pointer", touchAction: "none" }}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />

      {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
      {showRestart && (
        <button
          onClick={() => {
            setDotIndex(0);
            setDotPos(pathPoints[0]);
            setTrackRed(false);
            setErrorMessage("");
            setShowRestart(false);
            setIsDragging(false);
            setSegmentStartTime(null);
            // Notice: we DO NOT clear currentTimes or firstAttemptTimes
          }}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "lightgray",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      )}
      <h3>Segment Times (ms)</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
        {currentTimes.map((time, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <div>Part {idx + 1}</div>
            <div style={{ fontWeight: "bold" }}>{time !== null ? time : "-"} ms</div>
            <div style={{ fontSize: "12px", color: "gray" }}>
              First: {firstAttemptTimes[idx] !== null ? firstAttemptTimes[idx] : "-"} ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlowDrawGame;
