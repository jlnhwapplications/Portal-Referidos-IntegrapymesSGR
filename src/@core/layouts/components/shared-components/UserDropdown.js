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

  return (
    // <Menu
    //   anchorEl={anchorEl}
    //   open={Boolean(anchorEl)}
    //   onClose={handleClose}
    //   PaperProps={{
    //     sx: {
    //       mt: 1,
    //       minWidth: 200,
    //       borderRadius: 3,
    //       background: isDark
    //         ? "linear-gradient(145deg, rgba(30, 37, 63, 0.95) 0%, rgba(20, 25, 45, 0.98) 100%)"
    //         : "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
    //       backdropFilter: "blur(20px)",
    //       border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
    //       boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
    //     },
    //   }}
    // >
    //   <MenuItem onClick={handleClose}>
    //     <AccountIcon sx={{ mr: 2, fontSize: 20 }} />
    //     Mi Perfil
    //   </MenuItem>
    //   <MenuItem onClick={handleClose}>
    //     <SecurityIcon sx={{ mr: 2, fontSize: 20 }} />
    //     Seguridad
    //   </MenuItem>
    //   <MenuItem onClick={handleClose}>
    //     <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
    //     Configuración
    //   </MenuItem>
    //   <Divider />
    //   <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
    //     <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
    //     Cerrar Sesión
    //   </MenuItem>
    // </Menu>
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
      {/* <Button
        onClick={handleProfileClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 3,
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
          "&:hover": {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
          },
          textTransform: "none",
        }}
      >
        <Badge
          overlap="circular"
          badgeContent={<BadgeContentSpan />}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Avatar
            alt={user?.nombreUsuario || "User Avatar"}
            src={user?.photoURL}
            sx={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {user?.nombreUsuario ? user.nombreUsuario.charAt(0).toUpperCase() : "U"}
          </Avatar>
        </Badge>
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: "0.8rem" }}
          >
            {user?.nombreUsuario || "Usuario"}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
            Premium
          </Typography>
        </Box>
      </Button> */}
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
                alt={user?.nombreUsuario || "User Avatar"}
                src={user?.photoURL}
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box sx={{ display: "flex", ml: 3, alignItems: "flex-start", flexDirection: "column" }}>
              <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {user?.nombreUsuario || "Usuario"}
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
          onClick={handleClose}
          sx={{ mt: 1, py: 2, "& svg": { mr: 2, fontSize: "1.375rem", color: theme.palette.text.primary } }}
        >
          <AccountIcon />
          Mi Perfil
        </MenuItem>
        {/* <MenuItem
          onClick={handleClose}
          sx={{ py: 2, "& svg": { mr: 2, fontSize: "1.375rem", color: theme.palette.text.primary } }}
        >
          <SecurityIcon />
          Seguridad
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{ py: 2, "& svg": { mr: 2, fontSize: "1.375rem", color: theme.palette.text.primary } }}
        >
          <SettingsIcon />
          Configuración
        </MenuItem> */}
        <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, "& svg": { mr: 2, fontSize: "1.375rem", color: theme.palette.error.main } }}
        >
          <LogoutIcon />
          Salir
        </MenuItem>
      </Menu>
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt={user?.nombreUsuario} src={user?.photoURL} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user?.nombreUsuario || null}</Typography>
              <Tooltip title={user?.correo || 'Usuario no autenticado'}>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.correo || null}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} /> */}
      {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Perfil
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            Configuraciones
          </Box>
        </MenuItem>
        <Divider /> */}
      {/* <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Salir
        </MenuItem>
      </Menu> */}
    </Fragment>
  )
}

export default UserDropdown
