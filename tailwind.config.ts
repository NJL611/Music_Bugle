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
        graphiklight: ['GraphikLight', 'sans-serif'],
        graphiknormal: ['GraphikNormal', 'sans-serif'],
        graphikmedium: ['GraphikMedium', 'sans-serif'],
        graphiksemibold: ['GraphikSemibold', 'sans-serif'],
        graphikbold: ['GraphikBold', 'sans-serif'],
        gentiumBookPlusRegular: ['GentiumBookPlus-Regular', 'serif'],
        gentiumBookPlusItalic: ['GentiumBookPlus-Italic', 'serif'],
        gentiumBookPlusBold: ['GentiumBookPlus-Bold', 'serif'],
        gentiumBookPlusBoldItalic: ['GentiumBookPlus-BoldItalic', 'serif'],
        bodoniModa: ['var(--font-bodoni-moda)', 'serif'],
        prata: ['var(--font-prata)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
