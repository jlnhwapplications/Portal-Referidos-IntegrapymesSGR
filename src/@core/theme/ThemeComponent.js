// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'

// ** Theme Config
import themeConfig from '../../configs/themeConfig'

// ** Direction component for LTR or RTL
import Direction from '../../layouts/components/Direction'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'
import { ToastProvider } from '../components/toast/ToastProvider'

const ThemeComponent = props => {
  // ** Props
  const { settings, children } = props

  // ** Pass merged ThemeOptions (of core and user) to createTheme function
  let theme = createTheme(themeOptions(settings, 'light'))

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <Direction direction={settings.direction}>
          <CssBaseline />
          <GlobalStyles styles={() => GlobalStyling(theme)} />
          {children}
        </Direction>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default ThemeComponent
