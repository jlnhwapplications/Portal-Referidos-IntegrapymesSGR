"use client"

import { useState } from "react"
import { Button, Menu, MenuItem, Box, Typography, Divider, alpha } from "@mui/material"
import {
  Logout as LogoutIcon,
  FiberManualRecord as StatusIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"

const ReferidorDropDown = ({ userName = "Usuario", onLogout }) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<ArrowDownIcon />}
        sx={{
          color: theme.palette.text.primary,
          borderColor: alpha(theme.palette.primary.main, 0.3),
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderColor: alpha(theme.palette.primary.main, 0.5),
            transform: "translateY(-1px)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {userName}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {/* Estado del usuario */}
        <MenuItem
          sx={{
            cursor: "default",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
            <StatusIcon
              sx={{
                color: "#4caf50",
                fontSize: 12,
                filter: "drop-shadow(0 0 4px rgba(76, 175, 80, 0.4))",
              }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {userName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#4caf50",
                  fontWeight: 500,
                }}
              >
                Conectado
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Botón de cerrar sesión */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: theme.palette.error.main,
            transition: "all 0.2s ease",
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              transform: "translateX(4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Cerrar Sesión
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ReferidorDropDown
