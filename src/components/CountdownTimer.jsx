"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer({ deals }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [hasActiveTags, setHasActiveTags] = useState(false);

    useEffect(() => {
        // 1. Find nearest future dealEndsAt
        const now = new Date();
        const futureDeals = deals.filter(d => d.dealEndsAt && new Date(d.dealEndsAt) > now);

        if (futureDeals.length === 0) {
            setHasActiveTags(false);
            return;
        }

        setHasActiveTags(true);

        // Sort by end time ascending (earliest ending first)
        const sortedDeals = futureDeals.sort((a, b) => new Date(a.dealEndsAt) - new Date(b.dealEndsAt));
        const targetDate = new Date(sortedDeals[0].dealEndsAt);

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        // Initial set
        const timer = calculateTimeLeft();
        if (timer) setTimeLeft(timer);

        // Update every second
        const id = setInterval(() => {
            const t = calculateTimeLeft();
            if (t) {
                setTimeLeft(t);
            } else {
                clearInterval(id);
                setHasActiveTags(false);
            }
        }, 1000);

        return () => clearInterval(id);
    }, [deals]);

    if (!hasActiveTags || !timeLeft) return null;

    return (
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 text-white text-center min-w-[280px] sm:min-w-[320px]">
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 opacity-90">Offer Ends In</p>
            <div className="flex items-center justify-center gap-4">
                <TimeBlock value={timeLeft.days} label="Days" />
                <span className="text-2xl font-light -mt-4">:</span>
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <span className="text-2xl font-light -mt-4">:</span>
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <span className="text-2xl font-light -mt-4">:</span>
                <TimeBlock value={timeLeft.seconds} label="Secs" />
            </div>
        </div>
    );
}

function TimeBlock({ value, label }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold leading-none mb-1">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80">{label}</span>
        </div>
    );
}
