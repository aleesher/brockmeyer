import React from "react";

export const defaultTheme = {
  primary_color: "#59b55c",
  secondary_color: "#0b6b99"
};

const ThemeContext = React.createContext(defaultTheme);

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;
export default ThemeContext;
