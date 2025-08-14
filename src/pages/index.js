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
} from "@mui/icons-material"

import { useSettings } from "@/@core/hooks/useSettings";
import { useRouter } from "next/router";
import NotificationDropdown from "@/@core/layouts/components/shared-components/NotificationDropdown";
import NotificacionesReferidor from "./views/ui/inicio/NotificacionesReferidor";

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
const Header = ({ isDark, handleModeToggle, handleAddAccount, handleLogout }) => {
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
                        {/* <Tooltip title="Actualizar" arrow>
                            <IconButton
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
                                    color: theme.palette.primary.contrastText,
                                    backdropFilter: "blur(10px)",
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
                                        transform: 'rotate(180deg)',
                                    },
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip> */}
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

                        <Button
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
                        </Button>
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
const AccountCard = ({ account, index, viewMode, onSelect, getStatusConfig }) => {
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
                                {account.name}
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
                                        {account.emailaddress1}
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

    const { actualizarReferido, referidos, logout, loadingReferidos } = useContext(AuthContext);
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
            </Container>
        </Box>
    )
};

Index.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default Index;
