'use client';

import React from 'react';
import { useGlobal } from './GlobalProvider';
import CompareTray from './CompareTray';

const CompareTrayWrapper: React.FC = () => {
    const { compareIds, setCompareIds } = useGlobal();

    return (
        <CompareTray compareIds={compareIds} setCompareIds={setCompareIds} />
    );
};

export default CompareTrayWrapper;
