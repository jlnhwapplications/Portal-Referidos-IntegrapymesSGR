import {
    alpha,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
    Fade,
    Grow,
    Slide,
    Collapse,
    useMediaQuery,
    Skeleton,
    Paper,
} from "@mui/material";
import React, { Fragment, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import BlankLayout from "@/@core/layouts/BlankLayout";

// Icons
import {
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowForwardIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    Logout as LogoutIcon,
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon,
    Refresh as RefreshIcon,
    LightMode,
    DarkMode,
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    PersonAddAlt as PersonAddAltIcon,
    TrendingUp,
    AccountBalance,
    AttachMoney,
    FilterList as FilterIcon,
    CalendarToday as CalendarIcon,
    Clear as ClearIcon,
    DateRange as DateRangeIcon
} from "@mui/icons-material"
import { useSettings } from "@/@core/hooks/useSettings";
import { useRouter } from "next/router";
import NotificationDropdown from "@/@core/layouts/components/shared-components/NotificationDropdown";
import NotificacionesReferidor from "./views/ui/inicio/NotificacionesReferidor";
import ReferidorDropDown from "./views/ui/Buttons/ReferidorDropDown";
import GraficoBarraApex from "@/@core/components/graficos/GraficoBarraApex";
import GraficoBarraApexDetalle from "@/@core/components/graficos/GraficoBarraApexDetalle";
import GraficoDonaApex from "@/@core/components/graficos/GraficoDonaApex";
import useGetGarantiasProximas from "@/hooks/useGetGarantiasProximas";
import useGetDisponibleLimitesGeneral from "@/hooks/useGetDisponibleLimitesGeneral";
import { CheckCircle, WarningAmber } from "@mui/icons-material";

// Animated Background Component
const AnimatedBackground = ({ isDark }) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isDark
                    ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 50%, ${alpha(theme.palette.secondary.dark, 0.6)} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isDark
                        ? `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`
                        : `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.light, 0.3)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.3)} 0%, transparent 50%)`,
                    pointerEvents: 'none',
                },
            }}
        />
    )
}

// Header Component
const Header = ({ isDark, handleModeToggle, handleAddAccount, handleLogout, referidor }) => {
    const theme = useTheme()

    return (
        <Fade in timeout={800}>
            <Box sx={{ mb: 6 }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 3, md: 0 }
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, textAlign: { xs: 'center', md: 'left' } }}>
                        <Avatar
                            sx={{
                                width: { xs: 48, md: 56 },
                                height: { xs: 48, md: 56 },
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                boxShadow: theme.shadows[8],
                            }}
                        >
                            <AccountBalance sx={{ fontSize: { xs: 24, md: 28 } }} />
                        </Avatar>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.primary.contrastText,
                                    fontSize: { xs: "1.6rem", md: "2rem" },
                                    textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.3)}`,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.contrastText}, ${alpha(theme.palette.primary.contrastText, 0.8)})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Portal de Referidos
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: alpha(theme.palette.primary.contrastText, 0.8),
                                    fontSize: { xs: "0.7rem", md: "0.9rem" },
                                }}
                            >
                                Gestiona tus cuentas de forma inteligente
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        <Tooltip title={isDark ? "Modo claro" : "Modo oscuro"} arrow>
                            <IconButton
                                onClick={handleModeToggle}
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
                                    color: theme.palette.primary.contrastText,
                                    backdropFilter: "blur(10px)",
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                {isDark ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>
                        <NotificacionesReferidor />
                        <Button
                            variant="outlined"
                            onClick={handleAddAccount}
                            startIcon={<PersonAddAltIcon />}
                            sx={{
                                color: theme.palette.primary.contrastText,
                                borderColor: alpha(theme.palette.primary.contrastText, 0.3),
                                backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
                                backdropFilter: "blur(10px)",
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
                                    borderColor: alpha(theme.palette.primary.contrastText, 0.5),
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[8],
                                },
                            }}
                        >
                            Alta de Cuenta
                        </Button>
                        <ReferidorDropDown userName={referidor} onLogout={handleLogout} />
                        {/* <Button
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                color: theme.palette.text.secondary,
                                borderColor: alpha(theme.palette.error.main, 0.7),
                                backgroundColor: alpha(theme.palette.error.main, 0.5),
                                backdropFilter: "blur(10px)",
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                "&:hover": {
                                    // backgroundColor: alpha(theme.palette.error.main, 0.2),
                                    // borderColor: alpha(theme.palette.error.main, 0.5),
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[8],
                                },
                            }}
                        >
                            Cerrar Sesión
                        </Button> */}
                    </Stack>
                </Box>

                <Slide in direction="up" timeout={1000}>
                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", md: "1.2rem" },
                            color: alpha(theme.palette.primary.contrastText, 0.9),
                            textAlign: "center",
                            fontWeight: 500,
                            mb: { xs: 1, xl: 4 },
                            mt: { xs: 1, xl: 4 },
                        }}
                    >
                        Selecciona la cuenta desde la cual deseas operar
                    </Typography>
                </Slide>
            </Box>
        </Fade>
    )
}

// Filters Component
const FiltersCard = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    statusOptions
}) => {
    const theme = useTheme()
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
    const esMobile = useMediaQuery(theme => theme.breakpoints.down('md'))

    return (
        <Grow in timeout={1000}>
            <Card
                sx={{
                    minHeight: 20,
                    mb: { xs: 1, xl: 4 },
                    background: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: 3,
                    boxShadow: theme.shadows[8],
                }}
            >
                <CardContent sx={{ p: { xs: 1, xl: 3 } }}>
                    <Grid container spacing={esPantallaChica ? 1 : 3} alignItems="center" sx={{ mb: { xs: -4, xl: -1 } }}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                size={esPantallaChica ? 'small' : 'medium'}
                                placeholder="Buscar por nombre, CUIT o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.action.hover, 0.7),
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {statusOptions?.map((option) => (
                                    <Tooltip key={option.value} title={`Filtrar por ${option.label.toLowerCase()}`} arrow>
                                        <Chip
                                            label={`${option.label} (${option.count})`}
                                            onClick={() => setStatusFilter(option.value)}
                                            variant={statusFilter === option.value ? "filled" : "outlined"}
                                            sx={{
                                                fontSize: { xs: "0.7rem", xl: "0.8rem" },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                ...(statusFilter === option.value ? {
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.contrastText,
                                                    boxShadow: theme.shadows[4],
                                                } : {
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    color: theme.palette.text.primary,
                                                }),
                                                "&:hover": {
                                                    backgroundColor: statusFilter === option.value
                                                        ? theme.palette.primary.dark
                                                        : alpha(theme.palette.primary.main, 0.1),
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[6],
                                                },
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Stack>
                        </Grid>
                        {
                            !esMobile ?
                                <Grid item xs={12} md={1}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Vista en grilla" arrow>
                                            <IconButton
                                                onClick={() => setViewMode("grid")}
                                                sx={{
                                                    color: viewMode === "grid" ? theme.palette.primary.main : theme.palette.text.secondary,
                                                    backgroundColor: viewMode === "grid" ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                                                    transition: 'all 0.3s ease',
                                                    "&:hover": {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                            >
                                                <ViewModuleIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Vista en lista" arrow>
                                            <IconButton
                                                onClick={() => setViewMode("list")}
                                                sx={{
                                                    color: viewMode === "list" ? theme.palette.primary.main : theme.palette.text.secondary,
                                                    backgroundColor: viewMode === "list" ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                                                    transition: 'all 0.3s ease',
                                                    "&:hover": {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                            >
                                                <ViewListIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Grid> : null
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Grow >
    )
}

// Account Card Component
const AccountCard = ({ account, index, viewMode, onSelect, getStatusConfig, limiteDisponible = 0, fmtCurrency }) => {
    const theme = useTheme()
    const [isHovered, setIsHovered] = useState(false)
    const statusConfig = getStatusConfig(account?.new_estadodelsocio)
    const StatusIcon = statusConfig.icon
    const isActive = account.new_estadodelsocio !== 100000009

    return (
        <Grow in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
            <Grid
                item
                xs={12}
                sm={viewMode === "grid" ? 6 : 12}
                md={viewMode === "grid" ? 4 : 12}
                lg={viewMode === "grid" ? 3 : 12}
                xl={viewMode === "grid" ? 2.4 : 12}
            >
                <Card
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    sx={{
                        height: viewMode === "grid" ? 320 : 200,
                        display: "flex",
                        flexDirection: viewMode === "grid" ? "column" : { xs: "column", sm: "row" },
                        borderRadius: 3,
                        background: theme.palette.background.paper,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        cursor: "pointer",
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        boxShadow: isHovered ? theme.shadows[12] : theme.shadows[2],
                        transform: isHovered
                            ? (viewMode === "grid" ? 'translateY(-8px) scale(1.02)' : 'translateX(8px)')
                            : 'none',
                        "&::before": {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            zIndex: 0,
                        },
                        "& > *": {
                            position: 'relative',
                            zIndex: 1,
                        },
                    }}
                >
                    {/* Avatar Section */}
                    <Box
                        sx={{
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: viewMode === "grid" ? 100 : 80,
                            flexShrink: 0,
                        }}
                    >
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={
                                <Avatar
                                    sx={{
                                        width: { xs: 22, xl: 24 },
                                        height: { xs: 22, xl: 24 },
                                        backgroundColor: statusConfig.bgColor,
                                        border: `2px solid ${statusConfig.borderColor}`,
                                        transition: 'all 0.3s ease',
                                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    <StatusIcon sx={{ fontSize: 14, color: statusConfig.borderColor }} />
                                </Avatar>
                            }
                        >
                            <Avatar
                                sx={{
                                    width: viewMode === "grid" ? { xs: 50, xl: 60 } : { xs: 40, xl: 50 },
                                    height: viewMode === "grid" ? { xs: 50, xl: 60 } : { xs: 40, xl: 50 },
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    fontSize: "1.8rem",
                                    boxShadow: theme.shadows[8],
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                            >
                                <PersonIcon />
                            </Avatar>
                        </Badge>
                    </Box>

                    {/* Content Section */}
                    <CardContent
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 3,
                            pt: viewMode === "grid" ? 1 : 3,
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: { xs: "1rem", md: "1.2rem" },
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: "1rem",
                                    textAlign: viewMode === "grid" ? "center" : "left",
                                    lineHeight: 1.3,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {account?.name?.length > 20 ? `${account.name.substr(0, 20)}...` : account.name}
                            </Typography>

                            <Box sx={{
                                mb: 2,
                                display: "flex",
                                justifyContent: viewMode === "grid" ? "center" : "flex-start"
                            }}>
                                <Chip
                                    icon={<StatusIcon />}
                                    label={statusConfig.label}
                                    size="small"
                                    sx={{
                                        backgroundColor: statusConfig.bgColor,
                                        color: statusConfig.borderColor,
                                        border: `1px solid ${statusConfig.borderColor}`,
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                        transition: 'all 0.3s ease',
                                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                />
                            </Box>

                            <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />

                            <Stack spacing={1.5} alignItems={viewMode === "grid" ? "center" : "flex-start"}>
                                {
                                    account.new_nmerodedocumento && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: "100%" }}>
                                            <BusinessIcon sx={{
                                                color: theme.palette.text.secondary,
                                                fontSize: 16,
                                                flexShrink: 0
                                            }} />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    fontSize: "0.85rem",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                CUIT: {account.new_nmerodedocumento}
                                            </Typography>
                                        </Box>
                                    )
                                }
                                {
                                    account.emailaddress1 && (
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, maxWidth: "100%" }}>
                                            <EmailIcon sx={{
                                                color: theme.palette.text.secondary,
                                                fontSize: 16,
                                                flexShrink: 0,
                                                mt: 0.2
                                            }} />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    fontSize: "0.85rem",
                                                    wordBreak: "break-word",
                                                    textAlign: viewMode === "grid" ? "center" : "left",
                                                    lineHeight: 1.3,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {account?.emailaddress1?.length > 30 ? `${account.emailaddress1.substr(0, 30)}...` : account?.emailaddress1}
                                            </Typography>
                                        </Box>
                                    )
                                }
                                {/* Límite Disponible */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <AttachMoney sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                                        Disponible: <Typography component="span" sx={{ fontSize: "0.85rem", fontWeight: 600, color: theme.palette.text.primary }}>
                                            {fmtCurrency ? fmtCurrency.format(limiteDisponible) : limiteDisponible.toLocaleString()}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => onSelect(account)}
                            disabled={!isActive}
                            endIcon={isActive ? <ArrowForwardIcon /> : null}
                            sx={{
                                borderRadius: 2,
                                py: 1.2,
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                textTransform: "none",
                                minHeight: 44,
                                mt: 2,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                ...(isActive ? {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    boxShadow: theme.shadows[4],
                                    "&:hover": {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                        transform: "translateY(-2px)",
                                        boxShadow: theme.shadows[8],
                                    },
                                } : {
                                    backgroundColor: alpha(theme.palette.action.disabled, 0.3),
                                    color: theme.palette.text.disabled,
                                    cursor: "not-allowed",
                                }),
                            }}
                        >
                            {isActive ? "Seleccionar Cuenta" : "Pendiente de Aprobación"}
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grow>
    )
}

// Empty State Component
const EmptyState = ({ loadingReferidos }) => {
    const theme = useTheme()

    return (
        <Fade in timeout={1000}>
            <Box
                sx={{
                    textAlign: "center",
                    py: 8,
                    color: theme.palette.text.secondary,
                }}
            >
                {
                    loadingReferidos ?
                        <Grid item xs={12} sm={6} md={3}>
                            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
                        </Grid> :
                        <>
                            <BusinessIcon sx={{
                                fontSize: 64,
                                mb: 2,
                                opacity: 0.5,
                                color: theme.palette.text.disabled,
                            }} />
                            <Typography variant="h5" sx={{ mb: 2, color: theme.palette.text.primary }}>
                                No se encontraron cuentas
                            </Typography>
                            <Typography variant="body1">
                                Intenta ajustar los filtros de búsqueda o contacta al administrador.
                            </Typography>
                        </>
                }
            </Box>
        </Fade>
    )
}

// Main Component
const Index = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [itemsPerPage, setItemsPerPage] = useState(4)
    const [viewMode, setViewMode] = useState("grid")
    const { actualizarReferido, referidos, logout, loadingReferidos, user } = useContext(AuthContext);

    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const router = useRouter()
    const { settings, saveSettings } = useSettings()

    const handleModeToggle = useCallback(() => {
        const newMode = settings.mode === 'light' ? 'dark' : 'light'
        saveSettings({ ...settings, mode: newMode })
    }, [settings, saveSettings])

    const handleLogout = useCallback(() => {
        logout()
    }, [logout])

    const handleAddAccount = useCallback(() => {
        router.push('/solicitud-alta')
    }, [router])

    // Debounced search
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const filteredData = useMemo(() => {
        let filtered = referidos || []

        if (debouncedSearchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    item.new_nmerodedocumento?.includes(debouncedSearchTerm) ||
                    item.emailaddress1?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((item) => item.new_estadodelsocio?.toString() === statusFilter)
        }

        return filtered
    }, [referidos, debouncedSearchTerm, statusFilter])

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage
        return filteredData.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredData, page, itemsPerPage])

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const statusOptions = useMemo(() => [
        { value: "all", label: "Todos los estados", count: referidos?.length || 0 },
        {
            value: "100000000",
            label: "Activo",
            count: referidos?.filter((r) => r.new_estadodelsocio === 100000000).length || 0,
        },
        {
            value: "100000001",
            label: "Alta Pendiente",
            count: referidos?.filter((r) => r.new_estadodelsocio === 100000001).length || 0,
        },
        {
            value: "100000006",
            label: "Pendiente de firma",
            count: referidos?.filter((r) => r.new_estadodelsocio === 100000006).length || 0,
        },
        {
            value: "100000002",
            label: "Inicial",
            count: referidos?.filter((r) => r.new_estadodelsocio === 100000002).length || 0,
        },
        {
            value: "100000003",
            label: "Análisis de Riesgo",
            count: referidos?.filter((r) => r.new_estadodelsocio === 100000003).length || 0,
        },
    ], [referidos])

    // Límites disponibles por cuenta (para mostrar en cada AccountCard)
    const { disponibles: dispPorCuenta } = useGetDisponibleLimitesGeneral()
    const limiteDisponiblePorCuenta = useMemo(() => {
        const map = new Map()
            ; (dispPorCuenta || []).forEach(d => {
                const accId = d?.new_cuenta_value
                const val = Number(d?.new_montodisponiblegeneral) || 0
                if (accId) map.set(accId, (map.get(accId) || 0) + val)
            })
        return map
    }, [dispPorCuenta])
    const fmtCurrency = useMemo(() => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }), [])

    const getStatusConfig = useCallback((status) => {
        const configs = {
            100000002: {
                label: "Inicial",
                icon: ScheduleIcon,
                color: "warning",
                bgColor: alpha(theme.palette.warning.main, 0.1),
                borderColor: theme.palette.warning.main,
            },
            100000003: {
                label: "Análisis de Riesgo",
                icon: ScheduleIcon,
                color: "warning",
                bgColor: alpha(theme.palette.warning.main, 0.1),
                borderColor: theme.palette.warning.main,
            },
            100000001: {
                label: "Alta Pendiente",
                icon: PersonAddIcon,
                color: "info",
                bgColor: alpha(theme.palette.info.main, 0.1),
                borderColor: theme.palette.info.main,
            },
            100000006: {
                label: "Pendiente de firma",
                icon: PersonAddIcon,
                color: "info",
                bgColor: alpha(theme.palette.info.main, 0.1),
                borderColor: theme.palette.info.main,
            },
            100000000: {
                label: "Activa",
                icon: CheckCircleIcon,
                color: "success",
                bgColor: alpha(theme.palette.success.main, 0.1),
                borderColor: theme.palette.success.main,
            },
        }
        return (
            configs[status] || {
                label: "Pendiente",
                icon: ScheduleIcon,
                color: "warning",
                bgColor: alpha(theme.palette.warning.main, 0.1),
                borderColor: theme.palette.warning.main,
            }
        )
    }, [theme])

    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                overflow: 'hidden',
            }}
        >
            <AnimatedBackground isDark={isDark} />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 2, xl: 4 } }}>
                <Header
                    isDark={isDark}
                    handleModeToggle={handleModeToggle}
                    handleAddAccount={handleAddAccount}
                    handleLogout={handleLogout}
                    referidor={user?.Name}
                />

                <FiltersCard
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    statusOptions={statusOptions}
                />

                {/* Results Summary */}
                <Slide in direction="up" timeout={560}>
                    <Box
                        sx={{
                            mb: { xs: 1, xl: 3 },
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: { xs: 1, sm: 0 },
                        }}
                    >
                        <Typography sx={{ color: alpha(theme.palette.primary.contrastText, 0.8), fontSize: { xs: 14, xl: 16 } }}>
                            Mostrando {paginatedData.length} de {filteredData.length} cuentas
                            {filteredData.length !== referidos?.length && ` (${referidos?.length} total)`}
                        </Typography>
                        {filteredData.length > itemsPerPage && (
                            <Typography sx={{ color: alpha(theme.palette.primary.contrastText, 0.6), fontSize: { xs: 14, xl: 16 } }}>
                                Página {page} de {totalPages}
                            </Typography>
                        )}
                    </Box>
                </Slide>

                {/* Accounts Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {paginatedData.map((account, index) => (
                        <AccountCard
                            key={account.accountid}
                            account={account}
                            index={index}
                            viewMode={viewMode}
                            onSelect={actualizarReferido}
                            getStatusConfig={getStatusConfig}
                            limiteDisponible={limiteDisponiblePorCuenta.get(account.accountid) || 0}
                            fmtCurrency={fmtCurrency}
                        />
                    ))}
                </Grid>

                {/* Empty State */}
                {filteredData.length === 0 && <EmptyState loadingReferidos={loadingReferidos} />}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Fade in timeout={1400}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: { xs: 0, xl: 4 },
                                gap: 2,
                                p: { xs: 1, xl: 3 },
                                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                backdropFilter: "blur(20px)",
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            }}
                        >
                            {/* Items per page selector */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Elementos por página:
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {[6, 12, 24, 48].map((itemsCount) => (
                                        <Button
                                            key={itemsCount}
                                            size="small"
                                            variant={itemsPerPage === itemsCount ? "contained" : "outlined"}
                                            onClick={() => {
                                                setItemsPerPage(itemsCount)
                                                setPage(1)
                                            }}
                                            sx={{
                                                minWidth: 40,
                                                height: 32,
                                                borderRadius: 1.5,
                                                fontSize: "0.75rem",
                                                transition: 'all 0.3s ease',
                                                "&:hover": {
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            {itemsCount}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>

                            {/* Pagination controls */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Tooltip title="Primera página" arrow>
                                    <IconButton
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            "&:hover:not(:disabled)": {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <FirstPageIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Página anterior" arrow>
                                    <IconButton
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            "&:hover:not(:disabled)": {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Tooltip>

                                <Typography variant="body2" sx={{ mx: 2, color: theme.palette.text.primary }}>
                                    {page} de {totalPages}
                                </Typography>

                                <Tooltip title="Página siguiente" arrow>
                                    <IconButton
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            "&:hover:not(:disabled)": {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Última página" arrow>
                                    <IconButton
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            "&:hover:not(:disabled)": {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <LastPageIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Fade>
                )}

                {/* KPIs y Gráficos de Garantías Próximas a Vencer */}
                <GarantiasProximasOverview />
            </Container>
        </Box>
    )
};

Index.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default Index;

// Sección de KPIs y Gráficos para Garantías Próximas a Vencer
function GarantiasProximasOverview() {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const { garantiasProximas, loading } = useGetGarantiasProximas()
    const list = Array.isArray(garantiasProximas) ? garantiasProximas : []
    const esMobile = useMediaQuery(theme => theme.breakpoints.down('md'))
    // Normaliza elementos por si vienen en crudo (Dynamics) o ya formateados por el hook
    const proximasList = useMemo(() => {
        const parseDate = (val) => {
            if (!val) return null
            if (val instanceof Date) return isNaN(val.getTime()) ? null : val
            const s = String(val)
            // ISO YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
                const d = new Date(s)
                return isNaN(d.getTime()) ? null : d
            }
            // DD/MM/YYYY
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
                const [dd, mm, yyyy] = s.split('/').map(Number)
                const d = new Date(yyyy, mm - 1, dd)
                return isNaN(d.getTime()) ? null : d
            }
            // timestamp
            const n = Number(s)
            if (!isNaN(n)) {
                const d = new Date(n)
                return isNaN(d.getTime()) ? null : d
            }
            const d = new Date(s)
            return isNaN(d.getTime()) ? null : d
        }
        const toStartOfDay = (d) => {
            const dt = parseDate(d)
            if (!dt) return null
            return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
        }
        const todayStart = toStartOfDay(new Date())
        const esAR = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

        return list.map((item) => {
            const tipoValue = item.new_tipodeoperacion ?? item.new_tipodeoperacion_value
            const tipoFormatted = item.tipoOperacion
                ?? item["new_tipodeoperacion@OData.Community.Display.V1.FormattedValue"]
                ?? item.new_tipodeoperacion
            const socio = item.socioParticipe
                ?? item["ad.name"]
                ?? item["new_socioparticipe@OData.Community.Display.V1.FormattedValue"]
                ?? item.new_socioparticipe
            const monto = Number(item.montoBruto ?? item.new_monto ?? 0)
            const fechaRaw = item.fechaVencimiento ?? item.new_fechadevencimiento
            const fechaValida = parseDate(fechaRaw)
            const fechaLabelISO = fechaValida ? `${fechaValida.getFullYear()}-${String(fechaValida.getMonth() + 1).padStart(2, '0')}-${String(fechaValida.getDate()).padStart(2, '0')}` : ''
            const startFecha = fechaValida ? toStartOfDay(fechaValida) : null
            const dias = startFecha && todayStart ? Math.max(0, Math.round((startFecha.getTime() - todayStart.getTime()) / 86400000)) : null
            return {
                id: item.id ?? item.new_garantiaid,
                tipoOperacion: tipoFormatted,
                tipoOperacionValue: tipoValue,
                socioParticipe: socio,
                fechaVencimiento: fechaLabelISO,
                montoBruto: monto,
                diasParaVencer: dias,
                nombre: item.new_name || item.nombre,
            }
        })
    }, [list])

    const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

    // Disponible General de Límites (hook nuevo)
    const { disponibles, loading: loadingLimites, error: errorLimites } = useGetDisponibleLimitesGeneral()
    const totalDisponibleGeneral = useMemo(() => {
        return (disponibles || []).reduce((acc, it) => acc + (Number(it?.new_montodisponiblegeneral) || 0), 0)
    }, [disponibles])
    const cantidadProductosLimite = useMemo(() => (disponibles || []).length, [disponibles])
    // Filtro por "vigencia hasta" para el gráfico de límites
    const [vigenciaHasta, setVigenciaHasta] = useState('') // YYYY-MM-DD
    const parseDDMMYYYY = useCallback((s) => {
        if (!s) return null
        const m = String(s).match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)
        if (!m) return null
        const dd = Number(m[1]); const mm = Number(m[2]); const yyyy = Number(m[3])
        const d = new Date(yyyy, mm - 1, dd)
        return isNaN(d.getTime()) ? null : d
    }, [])
    const parseISODate = useCallback((s) => {
        if (!s) return null
        const m = String(s).match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
        if (!m) return null
        const yyyy = Number(m[1]); const mm = Number(m[2]); const dd = Number(m[3])
        const d = new Date(yyyy, mm - 1, dd)
        return isNaN(d.getTime()) ? null : d
    }, [])
    const hoyISO = useMemo(() => {
        const d = new Date()
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }, [])
    const disponiblesFiltradosLimites = useMemo(() => {
        if (!vigenciaHasta) return disponibles || []
        const hasta = parseISODate(vigenciaHasta)
        if (!hasta) return disponibles || []
        return (disponibles || []).filter(d => {
            const dv = parseDDMMYYYY(d?.new_vigenciahasta)
            return dv ? dv.getTime() <= hasta.getTime() : false
        })
    }, [disponibles, vigenciaHasta, parseISODate, parseDDMMYYYY])
    const datosBarraLimites = useMemo(() => {
        return (disponiblesFiltradosLimites || []).map((d) => ({
            opcion: (d.new_cuenta.length > 18 ? `${d.new_cuenta?.substr(0, 18)}...` : d.new_cuenta) || d.new_name || 'Sin nombre',
            cantidad: Number(d.new_montodisponiblegeneral) || 0,
            filtro: 'Monto'
        }))
    }, [disponiblesFiltradosLimites])
    const fechaPorCuenta = useMemo(() => {
        const map = new Map()
            ; (disponiblesFiltradosLimites || []).forEach(d => {
                const key = String(d.new_cuenta || d.new_name || '')
                map.set(key, d.new_vigenciahasta || '')
            })
        return Object.fromEntries(map)
    }, [disponiblesFiltradosLimites])
    const opcionesBarraLimites = ['Monto']
    const totalDisponibleGeneralFiltrado = useMemo(() => {
        return (disponiblesFiltradosLimites || []).reduce((acc, it) => acc + (Number(it?.new_montodisponiblegeneral) || 0), 0)
    }, [disponiblesFiltradosLimites])
    const cantidadProductosLimiteFiltrado = useMemo(() => (disponiblesFiltradosLimites || []).length, [disponiblesFiltradosLimites])

    const { totalGarantias, montoTotal, criticosCantidad, criticosMonto } = useMemo(() => {
        const total = proximasList.length
        const monto = proximasList.reduce((acc, g) => acc + (Number(g.montoBruto) || 0), 0)
        const criticos = proximasList.filter(g => typeof g.diasParaVencer === 'number' && g.diasParaVencer <= 3)
        const critCant = criticos.length
        const critMonto = criticos.reduce((acc, g) => acc + (Number(g.montoBruto) || 0), 0)
        return { totalGarantias: total, montoTotal: monto, criticosCantidad: critCant, criticosMonto: critMonto }
    }, [proximasList])

    // Datos para gráfico de barras (cantidad/monto por día)
    const datosBarra = useMemo(() => {
        const esLabel = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })
        const parseDate = (s) => {
            if (!s) return null
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                const d = new Date(s)
                return isNaN(d.getTime()) ? null : d
            }
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
                const [dd, mm, yyyy] = s.split('/').map(Number)
                const d = new Date(yyyy, mm - 1, dd)
                return isNaN(d.getTime()) ? null : d
            }
            const d2 = new Date(s)
            return isNaN(d2.getTime()) ? null : d2
        }
        const agg = new Map() // key = ISO YYYY-MM-DD
        proximasList.forEach(g => {
            if (!g.fechaVencimiento) return
            const iso = g.fechaVencimiento
            const prev = agg.get(iso) || { cantidad: 0, monto: 0 }
            prev.cantidad += 1
            prev.monto += Number(g.montoBruto) || 0
            agg.set(iso, prev)
        })
        const sortedIso = Array.from(agg.keys()).sort()
        const arr = sortedIso.map(iso => {
            const v = agg.get(iso)
            const dt = parseDate(iso)
            const dia = dt ? esLabel.format(dt) : iso
            return { dia, ...v }
        })
        const cantidad = arr.map(d => ({ opcion: d.dia, cantidad: d.cantidad, filtro: 'Cantidad' }))
        const monto = arr.map(d => ({ opcion: d.dia, cantidad: d.monto, filtro: 'Monto' }))
        return [...cantidad, ...monto]
    }, [proximasList])

    // Detalles por día para tooltip (listado de nombres)
    const detallesBarra = useMemo(() => {
        const esLabel = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })
        const map = new Map()
        proximasList.forEach(g => {
            if (!g.fechaVencimiento) return
            const dt = new Date(g.fechaVencimiento)
            if (isNaN(dt.getTime())) return
            const key = esLabel.format(dt)
            const arr = map.get(key) || []
            arr.push(g.nombre || `Garantía ${g.id}`)
            map.set(key, arr)
        })
        return Object.fromEntries(map)
    }, [proximasList])

    // Datos para gráfico de dona (por tipo de operación)
    const datosDona = useMemo(() => {
        const counts = new Map()
        const montos = new Map()
        proximasList.forEach(g => {
            const key = g.tipoOperacion || 'Sin Tipo'
            counts.set(key, (counts.get(key) || 0) + 1)
            montos.set(key, (montos.get(key) || 0) + (Number(g.montoBruto) || 0))
        })
        const porCantidad = Array.from(counts.entries()).map(([op, val]) => ({ opcion: op, cantidad: val, filtro: 'Cantidad' }))
        const porMonto = Array.from(montos.entries()).map(([op, val]) => ({ opcion: op, cantidad: val, filtro: 'Monto' }))
        return [...porCantidad, ...porMonto]
    }, [proximasList])

    const opcionesBarra = ['Cantidad', 'Monto']
    const opcionesDona = ['Cantidad', 'Monto']

    const KPICard = ({ title, value, icon: IconComp, color = 'primary' }) => (
        // <Card
        //     sx={{
        //         borderRadius: 3,
        //         background: isDark
        //             ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.24)}, ${alpha(theme.palette.background.default, 0.18)})`
        //             : `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)}, ${alpha(theme.palette[color].main, 0.02)})`,
        //         border: isDark
        //             ? `1px solid ${alpha(theme.palette.common.white, 0.08)}`
        //             : `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        //         boxShadow: isDark ? `0 6px 14px ${alpha('#000', 0.6)}` : theme.shadows[2],
        //     }}
        // >
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                // backgroundColor: alpha(theme.palette[color].main, 0.15),
                backgroundColor: !isDark ? theme.palette.background.main : alpha(theme.palette[color].main, 0.15),
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`,
                },
                // "&::before": {
                //     content: '""',
                //     position: "absolute",
                //     top: 0,
                //     left: 0,
                //     right: 0,
                //     height: 3,
                //     backgroundColor: theme.palette[color].main,
                // },
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 48, height: 48, backgroundColor: alpha(theme.palette[color].main, isDark ? 0.12 : 0.40), color: theme.palette[color].main }}>
                        <IconComp />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{title}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette[color].main }}>{value}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )

    return (
        <>
            <Box sx={{ my: 4 }}>
                <Slide in direction="up" timeout={1000}>
                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", md: "1.2rem" },
                            color: alpha(theme.palette.primary.contrastText, 0.9),
                            textAlign: "center",
                            fontWeight: 500,
                            mb: { xs: 1, xl: 4 },
                            mt: { xs: 1, xl: 4 },
                        }}
                    >
                        Monto Disponible General
                    </Typography>
                </Slide>
                <Grid container spacing={2} sx={{ mb: { xs: 2, md: 3, xl: 4 } }}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                height: "100%",
                                p: 2,
                                // mb: 3,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                borderRadius: 2,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <FilterIcon
                                    sx={{
                                        mr: 1,
                                        color: theme.palette.primary.main,
                                        fontSize: 20,
                                    }}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        letterSpacing: "0.02em",
                                        // mb: 1
                                    }}
                                >
                                    Filtros de Búsqueda
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <TextField
                                    label="Vigencia hasta"
                                    type="date"
                                    size="small"
                                    value={vigenciaHasta}
                                    onChange={(e) => setVigenciaHasta(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                        sx: {
                                            fontWeight: 600,
                                            color: theme.palette.primary.main,
                                            fontSize: "0.875rem",
                                            letterSpacing: "0.025em",
                                            "&.Mui-focused": {
                                                color: theme.palette.primary.dark,
                                            },
                                        },
                                    }}
                                    inputProps={{
                                        min: hoyISO,
                                        style: {
                                            fontSize: "0.875rem",
                                            fontWeight: 500,
                                            cursor: "pointer",
                                        },
                                    }}
                                    sx={{
                                        minWidth: 220,
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 2,
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "& input[type='date']": {
                                                cursor: "pointer",
                                                "&::-webkit-calendar-picker-indicator": {
                                                    cursor: "pointer",
                                                    padding: "4px",
                                                    borderRadius: "4px",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                },
                                                "&::-webkit-datetime-edit": {
                                                    padding: "2px 0",
                                                },
                                                "&::-webkit-datetime-edit-fields-wrapper": {
                                                    padding: "0",
                                                },
                                                "&::-webkit-datetime-edit-text": {
                                                    color: theme.palette.text.secondary,
                                                    padding: "0 2px",
                                                },
                                                "&::-webkit-datetime-edit-month-field": {
                                                    color: theme.palette.text.primary,
                                                    fontWeight: 500,
                                                },
                                                "&::-webkit-datetime-edit-day-field": {
                                                    color: theme.palette.text.primary,
                                                    fontWeight: 500,
                                                },
                                                "&::-webkit-datetime-edit-year-field": {
                                                    color: theme.palette.text.primary,
                                                    fontWeight: 500,
                                                },
                                            },
                                            "&:hover": {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                transform: "translateY(-1px)",
                                                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.primary.main,
                                                    borderWidth: 1.5,
                                                },
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                                transform: "translateY(-2px)",
                                                boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.16)}, 0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.primary.main,
                                                    borderWidth: 2,
                                                },
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "12px 14px",
                                            fontWeight: 500,
                                            color: theme.palette.text.primary,
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: alpha(theme.palette.divider, 0.3),
                                            transition: "all 0.2s ease-in-out",
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <DateRangeIcon
                                                sx={{
                                                    mr: 1.5,
                                                    color: theme.palette.primary.main,
                                                    fontSize: 20,
                                                    transition: "color 0.2s ease-in-out",
                                                }}
                                            />
                                        ),
                                    }}
                                />

                                <Tooltip
                                    title={vigenciaHasta ? "Limpiar filtro de fecha" : "No hay filtros aplicados"}
                                    arrow
                                    TransitionComponent={Fade}
                                    TransitionProps={{ timeout: 200 }}
                                >
                                    <span>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
                                            onClick={() => setVigenciaHasta("")}
                                            disabled={!vigenciaHasta}
                                            sx={{
                                                minWidth: 100,
                                                height: 40,
                                                borderRadius: 1.5,
                                                textTransform: "none",
                                                fontWeight: 500,
                                                fontSize: "0.875rem",
                                                letterSpacing: "0.02em",
                                                border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
                                                color: theme.palette.text.secondary,
                                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                "&:hover": {
                                                    backgroundColor: alpha(theme.palette.error.main, 0.04),
                                                    borderColor: alpha(theme.palette.error.main, 0.3),
                                                    color: theme.palette.error.main,
                                                    transform: "translateY(-1px)",
                                                    boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.15)}`,
                                                },
                                                "&:active": {
                                                    transform: "translateY(0)",
                                                },
                                                "&.Mui-disabled": {
                                                    backgroundColor: alpha(theme.palette.action.disabled, 0.02),
                                                    borderColor: alpha(theme.palette.action.disabled, 0.1),
                                                    color: theme.palette.action.disabled,
                                                },
                                            }}
                                        >
                                            Limpiar
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <KPICard title="Total Disponible" value={currency.format(totalDisponibleGeneralFiltrado)} icon={AttachMoney} color="success" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <KPICard title="Productos (línea general)" value={cantidadProductosLimiteFiltrado?.toLocaleString()} icon={TrendingUp} color="warning" />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {datosBarraLimites.length > 0 ? (
                            <GraficoBarraApexDetalle
                                datos={datosBarraLimites}
                                opciones={opcionesBarraLimites}
                                titulo="Disponible por cuenta / producto"
                                usarTooltipNativo={!esMobile}
                                mostrarValoresEnBarra={false}
                                cortarEtiquetasCada={18}
                                tooltipValueFormatter={(v, { category }) => `${currency.format(v)} • Vigencia: ${fechaPorCuenta[category] || ''}`}
                            />
                        ) : (
                            <Card sx={{ borderRadius: 3, background: isDark ? alpha(theme.palette.background.paper, 0.2) : undefined, border: isDark ? `1px solid ${alpha(theme.palette.common.white, 0.08)}` : undefined }}>
                                <CardContent>
                                    <Box sx={{ p: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">No hay informacion para mostrar</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ my: 4 }}>
                <Slide in direction="up" timeout={1000}>
                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", md: "1.2rem" },
                            color: alpha(theme.palette.primary.contrastText, 0.9),
                            textAlign: "center",
                            fontWeight: 500,
                            mb: { xs: 1, xl: 4 },
                            mt: { xs: 1, xl: 4 },
                        }}
                    >
                        Garantías a Vencer en los próximos 7 días
                    </Typography>
                </Slide>
                <Grid container spacing={2} sx={{ mb: { xs: 2, md: 3, xl: 4 } }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <KPICard title="Total Garantías" value={totalGarantias?.toLocaleString()} icon={CheckCircle} color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <KPICard title="Monto Total" value={currency.format(montoTotal)} icon={AttachMoney} color="success" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <KPICard title="Vencimientos Críticos (3 días)" value={criticosCantidad?.toLocaleString()} icon={WarningAmber} color="warning" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <KPICard title="Monto en Riesgo (3 días)" value={currency.format(criticosMonto)} icon={TrendingUp} color="error" />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} xl={7}>
                        {datosBarra.length > 0 ? (
                            <GraficoBarraApexDetalle
                                detalles={detallesBarra}
                                datos={datosBarra}
                                opciones={opcionesBarra}
                                titulo="Garantías por día (Cantidad/Monto)"
                            />
                        ) : (
                            <Card sx={{ borderRadius: 3, background: isDark ? alpha(theme.palette.background.paper, 0.2) : undefined, border: isDark ? `1px solid ${alpha(theme.palette.common.white, 0.08)}` : undefined }}>
                                <CardContent>
                                    <Box sx={{ p: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">No hay informacion para mostrar</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                    <Grid item xs={12} xl={5}>
                        {datosDona.length > 0 ? (
                            <GraficoDonaApex
                                datos={datosDona}
                                opciones={opcionesDona}
                                titulo="Por tipo de operación"
                            />
                        ) : (
                            <Card sx={{ borderRadius: 3, background: isDark ? alpha(theme.palette.background.paper, 0.2) : undefined, border: isDark ? `1px solid ${alpha(theme.palette.common.white, 0.08)}` : undefined }}>
                                <CardContent>
                                    <Box sx={{ p: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">No hay informacion para mostrar</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
