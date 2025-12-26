'use client';

import React, { useEffect, useState } from 'react';

export default function TimeDisplay() {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        // Set initial time on mount
        setTime(new Date().toLocaleString());
    }, []);

    if (!time) {
        // Return a placeholder or null during server-side rendering/hydration
        // to avoid hydration mismatch
        return <span className="text-slate-400">Loading...</span>;
    }

    return (
        <span>{time}</span>
    );
}
