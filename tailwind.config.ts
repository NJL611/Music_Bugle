import type { Config } from "tailwindcss";

const config: Config = {
  mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        graphiklight: ['var(--font-graphik)', 'sans-serif'],
        graphiknormal: ['var(--font-graphik)', 'sans-serif'],
        graphikmedium: ['var(--font-graphik)', 'sans-serif'],
        graphiksemibold: ['var(--font-graphik)', 'sans-serif'],
        graphikbold: ['var(--font-graphik)', 'sans-serif'],
        prata: ['var(--font-prata)', 'serif'],
        abril: ['var(--font-abril)', 'serif'],
        abrilFatface: ['var(--font-abril)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
