// ** React Import
import React, { useContext, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Icon,
} from "@mui/material"
import { createTheme, responsiveFontSizes, styled, ThemeProvider } from '@mui/material/styles'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Theme Config
import themeConfig from '../../../../../configs/themeConfig'

// ** Component Imports
import Drawer from './Drawer'
import VerticalNavItems from './VerticalNavItems'
import VerticalNavHeader from './VerticalNavHeader'

// ** Theme Options
import themeOptions from '../../../../theme/ThemeOptions'

// ** Util Import
import { hexToRGBA } from '../../../../utils/hex-to-rgba'
// import logoBlanco from "../../../../../../public/images/Web_Portal_blanco.svg";
// import logoNegro from "../../../../../../public/images/Web Portal Black.svg";

import logoClienteclaro from "../../../../../../public/images/SGROC-Blanco.png";
import logoClienteOscuro from "../../../../../../public/images/SGROC-Negro.png";
import logoBlanco from "../../../../../../public/images/WebPortal.png";
import logoNegro from "../../../../../../public/images/WebPortalDark.png";
import logoByBlanco from "../../../../../../public/images/ByHW-blanco.png";
import logoByNegro from "../../../../../../public/images/ByHW-dark.png";
import Image from "next/image";
import {
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as InvestmentIcon,
  Receipt as TransactionIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountBalanceWallet as WalletIcon,
  Assignment as DocumentIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material"

import { AuthContext } from '@/context/AuthContext'
import useGetUnidadDeNegocio from '@/hooks/useGetUnidadDeNegocio'
import { useRouter } from 'next/router'

const SIDEBAR_WIDTH_EXPANDED = 280
const SIDEBAR_WIDTH_COLLAPSED = 80

const StyledBoxForShadow = styled(Box)(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(${theme.palette.background.default} ${theme.direction === 'rtl' ? '95%' : '5%'
    },${hexToRGBA(theme.palette.background.default, 0.85)} 30%,${hexToRGBA(
      theme.palette.background.default,
      0.5
    )} 65%,${hexToRGBA(theme.palette.background.default, 0.3)} 75%,transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = props => {
  // ** Props
  const { hidden,
    settings,
    afterNavMenuContent,
    beforeNavMenuContent,
    navMenuContent: userNavMenuContent,
    currentSection = "Resumen de Posición",
    onSectionChange,
    isSidebarOpen = true,
    onToggleSidebar,
  } = props

  // const isDark = theme.palette.mode === "dark"
  // ** States
  const [navHover, setNavHover] = useState(false)
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const { referido } = useContext(AuthContext);
  const { lineasActivas } = useGetUnidadDeNegocio()
  const router = useRouter();
  const pathname = router.pathname
  // ** Ref
  const shadowRef = useRef(null)

  // ** Var
  const { navCollapsed } = settings
  const { afterVerticalNavMenuContentPosition, beforeVerticalNavMenuContentPosition } = themeConfig

  const navMenuContentProps = {
    ...props,
    navHover,
    groupActive,
    setGroupActive,
    currentActiveGroup,
    setCurrentActiveGroup
  }

  // ** Create new theme for the navigation menu when mode is `semi-dark`
  let darkTheme = createTheme(themeOptions(settings, 'dark'))

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    darkTheme = responsiveFontSizes(darkTheme)
  }

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = ref => {
    if (ref) {
      // @ts-ignore
      ref._getBoundingClientRect = ref.getBoundingClientRect
      ref.getBoundingClientRect = () => {
        // @ts-ignore
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  // ** Scroll Menu
  const scrollMenu = container => {
    if (beforeVerticalNavMenuContentPosition === 'static' || !beforeNavMenuContent) {
      container = hidden ? container.target : container
      if (shadowRef && container.scrollTop > 0) {
        // @ts-ignore
        if (!shadowRef.current.classList.contains('scrolled')) {
          // @ts-ignore
          shadowRef.current.classList.add('scrolled')
        }
      } else {
        // @ts-ignore
        shadowRef.current.classList.remove('scrolled')
      }
    }
  }
  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  const [menu, setMenu] = useState([])

  useEffect(() => {
    if (referido?.new_estadodelsocio === 100000000 && lineasActivas) {
      setMenu([
        { id: "Resumen-de-Posición", label: "Resumen de Posición", icon: DashboardIcon, badge: null, path: '/inicio' },
        { id: "Mi-Documentación-Digital", label: "Mi Documentación Digital", icon: AccountBalanceIcon, badge: null, path: '/carpeta-digital' },
        { id: "Mis-Garantías", label: "Mis Garantías", icon: InvestmentIcon, badge: null, path: '/garantias' },
        { id: "Mis-Líneas", label: "Mis Líneas", icon: TransactionIcon, badge: null, path: '/lineas' },
        { id: "Mis-Operaciones", label: "Mis Operaciones", icon: WalletIcon, badge: null, path: '/operaciones' },
        { id: "perfil", label: "Perfil", icon: DocumentIcon, badge: null, path: '/perfil' },
        { id: "Mis-Referidos", label: "Mis Referidos", icon: SecurityIcon, badge: null, path: '/' },
      ])
    } else if (referido?.new_estadodelsocio === 100000000 && !lineasActivas)
      setMenu([
        { id: "Resumen-de-Posición", label: "Resumen de Posición", icon: DashboardIcon, badge: null, path: '/inicio' },
        { id: "Mi-Documentación-Digital", label: "Mi Documentación Digital", icon: AccountBalanceIcon, badge: null, path: '/carpeta-digital' },
        { id: "Mis-Garantías", label: "Mis Garantías", icon: InvestmentIcon, badge: null, path: '/garantias' },
        { id: "Mis-Operaciones", label: "Mis Operaciones", icon: WalletIcon, badge: null, path: '/operaciones' },
        { id: "perfil", label: "Perfil", icon: DocumentIcon, badge: null, path: '/perfil' },
        { id: "Mis-Referidos", label: "Mis Referidos", icon: SecurityIcon, badge: null, path: '/' },
      ])
    else {
      setMenu([
        { id: "Resumen-de-Posición", label: "Resumen de Posición", icon: DashboardIcon, badge: null, path: '/inicio' },
        { id: "Mi-Documentación-Digital", label: "Mi Documentación Digital", icon: AccountBalanceIcon, badge: null, path: '/carpeta-digital' },
        { id: "perfil", label: "Perfil", icon: DocumentIcon, badge: null, path: '/perfil' },
        { id: "Mis-Referidos", label: "Mis Referidos", icon: SecurityIcon, badge: null, path: '/' },
      ])
    }
  }, [lineasActivas])

  const redireccion = (path) => {
    router.push(path)
    // Si es mobile y la función para cerrar está disponible
    if (hidden && typeof onToggleSidebar === "function") {
      onToggleSidebar(false) // o el valor que cierre el Drawer
    }
  }

  // const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8
      }
    } else {
      return 6
    }
  }
  const MenuLockedIcon = () => settings?.userMenuLockedIcon || <Icon icon='mdi:radiobox-marked' />
  const MenuUnlockedIcon = () => settings?.userMenuUnlockedIcon || <Icon icon='mdi:radiobox-blank' />

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer {...props} navHover={navHover} setNavHover={setNavHover}>
        <Box
          sx={{
            width: (!navCollapsed || navHover) ? { xs: 240, xl: 280 } : { xs: 60, xl: 80 },
            height: "100vh",
            background: settings.mode === "dark"
              ? "linear-gradient(180deg, rgba(28, 38, 73, 0.95) 0%, rgba(20, 25, 45, 0.98) 100%)"
              : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            borderRight: `1px solid ${settings.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 1200,
            boxShadow: settings.mode === "dark" ? "4px 0 20px rgba(0, 0, 0, 0.3)" : "4px 0 20px rgba(0, 0, 0, 0.08)",
            transition: "width 0.2s ease-in-out",
            overflowX: "hidden", // Hide horizontal scrollbar when collapsed
          }}
        >
          <Box sx={{ py: 2, overflowX: "hidden" }}>
            <VerticalNavHeader {...props} navHover={navHover} />
          </Box>
          <Divider sx={{ borderColor: settings.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)" }} />
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${settings.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
              display: "flex",
              flexDirection: "column",
              alignItems: (!navCollapsed || navHover) ? "flex-start" : "center",
              transition: "padding 0.2s ease-in-out",
              py: (!navCollapsed || navHover) ? 3 : 2,
              px: (!navCollapsed || navHover) ? 3 : 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: (!navCollapsed || navHover) ? 2 : 0,
                flexDirection: (!navCollapsed || navHover) ? "row" : "column",
                width: "100%",
                justifyContent: (!navCollapsed || navHover) ? "flex-start" : "center",
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >

              </Avatar>
              {(!navCollapsed || navHover) && (
                <Box sx={{ transition: "opacity 0.2s ease-in-out", opacity: (!navCollapsed || navHover) ? 1 : 0 }}>
                  <Typography sx={{ fontSize: { xs: 12, xl: 14 }, fontWeight: 700, lineHeight: 1.2 }}>
                    {referido?.name || "Socio"}
                  </Typography>
                  {
                    referido?.new_estadodelsocio == 100000000 ? (
                      <Chip
                        label="Activo"
                        size="small"
                        icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} color='#10B981' />}
                        sx={{
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          color: "#10B981",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          transition: "opacity 0.2s ease-in-out",
                          opacity: (!navCollapsed || navHover) ? 1 : 0,
                        }}
                      />) : (
                      <Chip
                        label="En Proceso de Onboarding"
                        size="small"
                        icon={<ScheduleIcon sx={{ fontSize: "16px !important" }} color='#f59e0b' />}
                        sx={{
                          backgroundColor: "rgba( 245, 158, 1, 0.1)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245, 158, 1, 0.3))",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          transition: "opacity 0.2s ease-in-out",
                          opacity: (!navCollapsed || navHover) ? 1 : 0,
                        }}
                      />
                    )
                  }
                </Box>
              )}
            </Box>
          </Box>

          {/* Navegación Principal */}
          <Box sx={{ flex: 1, py: 2, overflowY: "auto", overflowX: "hidden" }}>
            <List sx={{ px: (!navCollapsed || navHover) ? 2 : 1 }}>
              {menu?.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => redireccion(item.path)}
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: (!navCollapsed || navHover) ? 2 : 1,
                        backgroundColor: isActive
                          ? settings.mode === "dark"
                            ? "rgba(59, 130, 246, 0.15)"
                            : "rgba(59, 130, 246, 0.08)"
                          : "transparent",
                        border: isActive ? `1px solid rgba(59, 130, 246, 0.3)` : "1px solid transparent",
                        "&:hover": {
                          backgroundColor: settings.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                          transform: (!navCollapsed || navHover) ? "translateX(4px)" : "none",
                        },
                        transition: "all 0.2s ease",
                        justifyContent: (!navCollapsed || navHover) ? "flex-start" : "center",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: (!navCollapsed || navHover) ? 40 : "auto", mr: (!navCollapsed || navHover) ? 0 : 0 }}>
                        <Icon
                          sx={{
                            color: isActive ? "#3B82F6" : "#8A8D93",
                            fontSize: 22,
                          }}
                        />
                      </ListItemIcon>
                      {(!navCollapsed || navHover) && (
                        <ListItemText
                          primary={item.label}
                          sx={{
                            "& .MuiListItemText-primary": {
                              ml: 2,
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? "#3B82F6" : "#8A8D93",
                              // fontSize: "0.9rem",
                              fontSize: { xs: "0.80rem", md: "0.85rem", xl: "0.90rem" },
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                            transition: "opacity 0.2s ease-in-out",
                            opacity: (!navCollapsed || navHover) ? 1 : 0,
                          }}
                        />
                      )}
                      {item.badge && (!navCollapsed || navHover) && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            backgroundColor: item.badge === "New" ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)",
                            color: item.badge === "New" ? "#EF4444" : "#3B82F6",
                            border: `1px solid ${item.badge === "New" ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                            transition: "opacity 0.2s ease-in-out",
                            opacity: (!navCollapsed || navHover) ? 1 : 0,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>

          <Divider sx={{ borderColor: settings.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)" }} />

          {/* Navegación Inferior */}
          <Box sx={{ py: 2, overflowX: "hidden" }}>
            {(!navCollapsed || navHover) && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: "100%", // Asegura que el ancho sea el 100% del Drawer
                }}
              >
                {settings.mode === "dark" ? (
                  <Image src={logoBlanco} width={150} alt="logo" />
                ) : (
                  <Image src={logoNegro} width={150} alt="logo" />
                )}
              </Box>
            )}

            {(navCollapsed && !navHover) && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: "100%", // Asegura que el ancho sea el 100% del Drawer
                }}
              >
                {settings.mode === "dark" ? (
                  <Image src={logoByBlanco} width={50} alt="logo" />
                ) : (
                  <Image src={logoByNegro} width={50} alt="logo" />
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  )
}

export default Navigation
