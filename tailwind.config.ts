import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    red: '#B94445',
                    button: '#C14E4E',
                    banner: '#BB4242',
                    border: '#EC3535',
                    share: '#E93F33',
                    dark: '#1B1B1B',
                    text: '#363434',
                    'ad-bg': '#D9D9D9',
                    'bg-dark': '#444444',
                    'bg-light': '#F2F2F2',
                }
            }
        },
    },
    plugins: [],
};
export default config;

