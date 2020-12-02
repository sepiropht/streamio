import { theme as chakraTheme } from "@chakra-ui/react";

const fonts = { ...chakraTheme.fonts, mono: `'Menlo', monospace` };

const breakpoints = ["40em", "52em", "64em"];

const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
    black: "#16161D",
  },
  fontFamily: "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif",
  breakpoints,
};

export default theme;
