import { type Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "9xl": [
          "8rem",
          {
            lineHeight: "9.75rem",
            letterSpacing: "-0.02em",
          },
        ],
        "8xl": [
          "6rem",
          {
            lineHeight: "8rem",
            letterSpacing: "-0.02em",
          },
        ],
        "7xl": [
          "4.5rem",
          {
            lineHeight: "5.625rem",
            letterSpacing: "-0.02em",
          },
        ],
        "6xl": [
          "3.75rem",
          {
            lineHeight: "4.625rem",
            letterSpacing: "-0.02em",
          },
        ],
        "5xl": [
          "3rem",
          {
            lineHeight: "3.75rem",
            letterSpacing: "-0.02em",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "2.75rem",
            letterSpacing: "-0.02em",
          },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "2.375rem",
            letterSpacing: "normal",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
            letterSpacing: "normal",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.875rem",
            letterSpacing: "normal",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.75rem",
            letterSpacing: "normal",
          },
        ],
        base: [
          "1rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "normal",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "normal",
          },
        ],
        xs: [
          "0.75rem",
          {
            lineHeight: "1.125rem",
            letterSpacing: "normal",
          },
        ],
      },
      ringWidth: {
        3: "3px",
      },
      colors: {
        neutral: {
          50: "#F6F8FB",
          100: "#EFF1F6",
          200: "#DFE3EB",
          300: "#C9D0DB",
          400: "#979FAD",
          500: "#666E7D",
          600: "#485261",
          700: "#323C4D",
          800: "#1D2736",
          900: "#0E1524",
        },
        primary: {
          50: "#EDF5FF",
          100: "#D8E8FE",
          200: "#BCD9FE",
          300: "#90C4FD",
          400: "#5DA3FA",
          500: "#3980F6",
          600: "#2160EB",
          700: "#1A4CD8",
          800: "#1C3EAF",
          900: "#1D398A",
        },
        success: {
          50: "#E6F8E7",
          100: "#B3EAB9",
          200: "#80DA8E",
          300: "#46C867",
          400: "#00B544",
          500: "#00A025",
          600: "#008A06",
          700: "#007400",
          800: "#005D00",
          900: "#004700",
        },
        error: {
          50: "#FFEEE8",
          100: "#FFCBBB",
          200: "#FFA891",
          300: "#FF866D",
          400: "#FF654D",
          500: "#F54533",
          600: "#DC271F",
          700: "#BE0A11",
          800: "#9D0009",
          900: "#790204",
        },
        warning: {
          50: "#FFEFE6",
          100: "#FFD0B5",
          200: "#FFB289",
          300: "#FF9561",
          400: "#F1793E",
          500: "#DD6020",
          600: "#C54A04",
          700: "#A93800",
          800: "#8B2A00",
          900: "#6B2000",
        },
      },
      boxShadow: ({ theme }: { theme: (key: string) => string }) => ({
        xs: `0px 1px 2px ${theme("colors.neutral.900/6%")}`,
        sm: `0px 2px 4px ${theme("colors.neutral.900/6%")}`,
        md: `0px 3px 6px ${theme("colors.neutral.900/7%")}`,
        lg: `0px 4px 8px -2px ${theme("colors.neutral.900/5%")}, 0px 5px 10px ${theme("colors.neutral.900/8%")}`,
        xl: `0px 20px 24px -4px ${theme("colors.neutral.900/10%")}, 0px 8px 8px -4px ${theme("colors.neutral.900/4%")}`,
      }),
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
      transitionDuration: {
        DEFAULT: "100ms",
      },
    },
  },
} satisfies Config
