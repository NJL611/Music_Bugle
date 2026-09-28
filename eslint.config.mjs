import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  { ignores: [".next/**", ".sanity/**", "functions/**/.build/**", "out/**", "dist/**"] },
];

export default config;
