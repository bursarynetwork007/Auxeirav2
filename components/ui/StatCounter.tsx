"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string; // e.g. "49", "3.3×", "$2M" — numeric prefix extracted automatically
  label: string;
  className?: string;
}

function parseNumeric(val: string): { prefix: string; number: number; suffix: string } | null {
  // Match optional prefix ($, R), digits with optional decimal, optional suffix (×, M, B, %)
  const match = val.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], number: parseFloat(match[2]), suffix: match[3] };
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatCounter({ value, label, className = "" }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);

  const parsed = parseNumeric(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        observer.unobserve(el);

        const duration = 1400;
        const start = performance.now();
        const target = parsed.number;
        const isDecimal = String(target).includes(".");

        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const current = easeOut(progress) * target;
          const formatted = isDecimal ? current.toFixed(1) : Math.round(current).toString();
          setDisplay(formatted);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, started]);

  if (!parsed) {
    return (
      <div ref={ref} className={className}>
        <p className="font-display text-3xl lg:text-4xl font-semibold text-[#C9A84C]">{value}</p>
        <p className="mt-1 text-xs text-[#F5F0E8]/50 leading-snug tracking-wide">{label}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <p className="font-display text-3xl lg:text-4xl font-semibold text-[#C9A84C]">
        {parsed.prefix}
        {display}
        {parsed.suffix}
      </p>
      <p className="mt-1 text-xs text-[#F5F0E8]/50 leading-snug tracking-wide">{label}</p>
    </div>
  );
}
