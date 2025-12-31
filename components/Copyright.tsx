'use client';

import { useEffect, useState } from 'react';

export function Copyright() {
    const [year, setYear] = useState<number | string>(2025);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return <span>{year}</span>;
}
