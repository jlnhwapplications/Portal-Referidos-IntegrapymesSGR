// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import logo from '../../../../public/images/Logo-human.png'
import logoBlanco from '../../../../public/images/Logo-Human-blanco.png'
import Image from 'next/image'
import themeConfig from '@/configs/themeConfig'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      {
        theme.palette.mode == 'dark' ?
          <Image src={logoBlanco} alt="Logo" width={80} height={80} /> :
          <Image src={logo} alt="Logo" width={80} height={80} />
      }
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
