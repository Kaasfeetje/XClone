import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    screens: {
      md: "500px",
      lg: "1282px",
      xl: "1310px",
    },
    extend: {
      fontFamily: {
        sans: ["Libre Franklin", ...fontFamily.sans],
      },
      colors: {
        grayText: "rgb(15, 20, 25)",
        lightGrayText: "rgb(83, 100, 113)",
      },
      spacing: {
        "18": "4.5rem",
      },
      fontSize: {
        "17px": "17px",
        sm: "14px",
        normal: "15px",
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
