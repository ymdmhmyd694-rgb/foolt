import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'cash-green': '#00D632',
                'cash-green-hover': '#00B029',
                'cash-black': '#000000',
                'cash-dark': '#121212',
                'cash-gray': '#333333',
                'cash-text-gray': '#8A8A8A',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            }
        },
    },
    plugins: [],
};
export default config;
