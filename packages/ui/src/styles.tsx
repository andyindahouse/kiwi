import React from 'react';
// eslint-disable-next-line no-restricted-imports
import {createUseStyles as jssCreateUseStyles, createTheming, Styles} from 'react-jss';
import {palette} from './palette';

const theme = {palette};
type Theme = typeof theme;

const ThemeContext = React.createContext(theme);

const theming = createTheming(ThemeContext);

const {ThemeProvider: InnerThemeProvider, useTheme} = theming;

type ThemeProviderProps = {
    children: React.ReactNode;
};
export const ThemeProvider = ({children}: ThemeProviderProps) => (
    <InnerThemeProvider theme={theme}>{children}</InnerThemeProvider>
);

export {useTheme};

export const createUseStyles = <C extends string = string, Props = unknown>(
    styles: (theme: Theme) => Styles<C, Props, undefined>
) => jssCreateUseStyles<C, Props, Theme>(styles, {theming});
