// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import ModeToggler from '../../../@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from '../../../@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from '@/@core/layouts/components/shared-components/NotificationDropdown'

const AppBarContent = props => {
  // ** Props
  const { settings, saveSettings } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <NotificationDropdown settings={settings} />
      <UserDropdown settings={settings} />
    </Box>
  )
}

export default AppBarContent
