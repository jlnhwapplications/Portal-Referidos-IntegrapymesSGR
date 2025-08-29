// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
// ** Icon Imports
import Icon from '../../../../@core/components/icon'

// ** Context
import { useAuth } from '../../../../hooks/useAuth'
import { Button, Tooltip, useTheme } from '@mui/material'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const { logout, user } = useAuth()

  

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePerfil = () => {
    router.push("/perfil")
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt='avatar'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={user?.photoURL}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 230, // Adjusted width as per snippet
            borderRadius: 3,
            background: isDark
              ? "linear-gradient(145deg, rgba(30, 37, 63, 0.95) 0%, rgba(20, 25, 45, 0.98) 100%)"
              : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Assuming LTR
        transformOrigin={{ vertical: "top", horizontal: "right" }} // Assuming LTR
      >
        {/* User Info Section */}
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                alt={user?.Name || "User Avatar"}
                src={user?.photoURL}
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box sx={{ display: "flex", ml: 3, alignItems: "flex-start", flexDirection: "column" }}>
              <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {user?.Name || "Usuario"}
              </Typography>
              <Tooltip title={user?.correo || "Usuario no autenticado"}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8rem",
                    color: theme.palette.text.secondary,
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.correo || "No disponible"}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: "0 !important", borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
        {/* Menu Items */}
        <MenuItem
          onClick={handlePerfil}
          sx={{ mt: 1, py: 2, "& svg": { mr: 2, fontSize: "1.375rem", color: theme.palette.text.primary } }}
        >
          <AccountIcon />
          Mi Perfil
        </MenuItem>
        <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, "& svg": { mr: 2, fontSize: "1.375rem", color: theme.palette.error.main } }}
        >
          <LogoutIcon />
          Salir
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
