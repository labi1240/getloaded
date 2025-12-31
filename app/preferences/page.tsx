import React from 'react';
import Preferences from '@/components/Preferences';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AmmoMetric | Preferences',
    description: 'Customize your AmmoMetric experience with preferences.',
    keywords: ['preferences', 'customize', 'user settings'],
    openGraph: {
        title: 'AmmoMetric | Preferences',
        description: 'Customize your AmmoMetric experience with preferences.',
        type: 'website',
    }
};

export default function PreferencesPage() {
    return <Preferences />;
}
