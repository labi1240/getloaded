'use client';

import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    alt: string;
}

export function ImageWithFallback({
    src,
    fallbackSrc,
    alt,
    className,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
        setError(false);
    }, [src]);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (!error) {
            setError(true);
            if (fallbackSrc) {
                setImgSrc(fallbackSrc);
            } else {
                // Return null to unmount/hide image if no fallback
                // But we are in a hook. We need state to hide it.
                // Actually, simply setting error state is enough if we check it in render.
            }
        }
        if (props.onError) {
            props.onError(e);
        }
    };

    if (error && !fallbackSrc) return null;

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
}
