import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e', // Emerald 500 for success/stock
                    600: '#16a34a',
                    700: '#15803d', // Hunter Green feel
                    900: '#14532d',
                },
                slate: {
                    850: '#1e293b', // Custom dark for headers
                }
            }
        },
    },
    plugins: [],
}
export default config
