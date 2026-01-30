import { CssBaseline, ThemeProvider as MuiThemeProvider, Theme, ThemeOptions, createTheme } from '@mui/material'
import { ReactNode } from 'react'

const fontFamily = `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
const typography: ThemeOptions['typography'] = {
  fontFamily,
  body1: {
    lineHeight: 1.625,
  },
  body2: {
    fontSize: '0.8125rem',
    lineHeight: 1.8461538462,
  },
  h4: {
    fontSize: '1.725rem',
  },
}

const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: { main: '#141417', contrastText: '#ffffff' },
  secondary: { main: '#49B989', contrastText: '#ffffff', light: '#F7FCEC' },
  info: { main: '#4E86CF' }, // blue
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  divider: '#DBDBDB',

  text: {
    primary: '#141417',
    secondary: '#3B3B3B',
    disabled: '#A5A5A5',
  },
  grey: {
    50: '#FAF9F8', // off white
    100: '#EFEFEE', // disabled bg
    300: '#DBDBDB', // border
    500: '#A5A5A5', // disabled font
    700: '#767676', // light font
    800: '#3B3B3B', // secondary font
  },
}

const transition = `background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;, border-width 0ms`

const getTheme = (baseTheme: Theme) => {
  const componentsOverrides: ThemeOptions['components'] = {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: '0.875rem',
          fontFamily,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fieldset: {
            transition,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ ownerState }) => {
          return { borderColor: ownerState.variant === 'outlined' ? '#e9e7e4' : undefined }
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { display: 'block' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '8px',
          '&:hover, &:focus': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: baseTheme.palette.primary.main,
        },
      },
    },
  }

  return createTheme(baseTheme, {
    components: componentsOverrides,
  })
}

const themeWithLightPalette = createTheme({
  typography,
  palette: lightPalette,
})

export const lightTheme = getTheme(themeWithLightPalette)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MuiThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
