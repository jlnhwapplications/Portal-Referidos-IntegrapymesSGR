import { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Tooltip,
    IconButton,
    Card,
    CardContent,
    Tab,
    useTheme,
    CardHeader,
    Chip,
    Avatar,
    Stack,
    Paper,
    Fade,
    Grow,
    Skeleton,
    useMediaQuery,
    alpha,
    Badge,
} from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import PageHeader from "@/@core/components/page-header"
import Table from "@/@core/components/table/Table"
import { columns_adjuntos_garantias } from "@/columns/columnsGarantias"
import ModalAdjuntoGarantia from "./ModalAdjuntoGarantia"
import { Garantias } from "@/context/GetGarantiasContex"
import {
    ArrowBack as ArrowBackIcon,
    Info as InfoIcon,
    AttachFile as AttachFileIcon,
    AccountBalance as AccountBalanceIcon,
    Receipt as ReceiptIcon,
    AttachMoney as AttachMoneyIcon,
    Schedule as ScheduleIcon,
    Business as BusinessIcon,
    CreditCard as CreditCardIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarTodayIcon,
    Assignment as AssignmentIcon,
    Security as SecurityIcon,
    Person as PersonIcon,
    LocalAtm as LocalAtmIcon,
    DateRange as DateRangeIcon,
    Notes as NotesIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Pending as PendingIcon,
} from "@mui/icons-material"

// Componente de Card de información individual
const InfoCard = ({ icon: IconComponent, label, value, color = "primary", delay = 0, isImportant = false }) => {
    const theme = useTheme()
    const [isHovered, setIsHovered] = useState(false)

    const getDisplayValue = () => {
        if (value === null || value === undefined || value === "") return "Sin información"
        return value
    }

    const isEmpty = value === null || value === undefined || value === ""

    return (
        <Grow in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                    backgroundColor: isImportant ? alpha(theme.palette[color].main, 0.05) : theme.palette.background.paper,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: isHovered
                        ? `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`
                        : `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        backgroundColor: theme.palette[color].main,
                        opacity: isImportant ? 1 : 0.7,
                    },
                }}
            >
                <CardContent sx={{ p: 3, pb: "16px !important" }}>
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Avatar
                            sx={{
                                backgroundColor: alpha(theme.palette[color].main, 0.1),
                                color: theme.palette[color].main,
                                width: 40,
                                height: 40,
                                transition: "all 0.3s ease",
                                transform: isHovered ? "scale(1.1)" : "scale(1)",
                            }}
                        >
                            <IconComponent fontSize="small" />
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    fontSize: "0.75rem",
                                    mb: 0.5,
                                    display: "block",
                                }}
                            >
                                {label}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: isEmpty ? theme.palette.text.disabled : theme.palette.text.primary,
                                    fontWeight: isImportant ? 600 : 500,
                                    fontSize: isImportant ? "1.1rem" : "0.95rem",
                                    lineHeight: 1.4,
                                    wordBreak: "break-word",
                                    fontStyle: isEmpty ? "italic" : "normal",
                                }}
                            >
                                {getDisplayValue()}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Grow>
    )
}

// Componente de Card de sección
const SectionCard = ({ title, icon: IconComponent, children, color = "primary", delay = 0 }) => {
    const theme = useTheme()

    return (
        <Fade in timeout={800} style={{ transitionDelay: `${delay}ms` }}>
            <Card
                sx={{
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                    overflow: "hidden",
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                backgroundColor: theme.palette[color].main,
                                color: theme.palette.common.white,
                                width: 48,
                                height: 48,
                            }}
                        >
                            <IconComponent />
                        </Avatar>
                    }
                    title={
                        <Typography sx={{ fontSize: { xs: 18, xl: 20 }, fontWeight: 700, color: theme.palette.text.primary }}>
                            {title}
                        </Typography>
                    }
                    sx={{
                        pb: 2,
                        backgroundColor: alpha(theme.palette[color].main, 0.02),
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    }}
                />
                <CardContent sx={{ p: 3 }}>{children}</CardContent>
            </Card>
        </Fade>
    )
}

// Componente de estado con chip
const StatusChip = ({ status, value }) => {
    const theme = useTheme()

    const getStatusConfig = (status) => {
        const configs = {
            Activa: { color: "success", icon: CheckCircleIcon },
            Pendiente: { color: "warning", icon: PendingIcon },
            Vencida: { color: "error", icon: ErrorIcon },
            "En Proceso": { color: "info", icon: WarningIcon },
        }
        return configs[status] || { color: "default", icon: InfoIcon }
    }

    const config = getStatusConfig(value)
    const IconComponent = config.icon

    return (
        <Chip
            icon={<IconComponent fontSize="small" />}
            label={value || "Sin estado"}
            color={config.color}
            variant="outlined"
            sx={{
                fontWeight: 600,
                borderWidth: 2,
                "& .MuiChip-icon": {
                    fontSize: "1rem",
                },
            }}
        />
    )
}

// Componente de loading skeleton
const InfoCardSkeleton = () => {
    return (
        <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

const IdGarantia = () => {
    const { garantias, adjuntosGarantias } = useContext(Garantias)
    const router = useRouter()
    const paramID = router.query.id
    const [value, setValue] = useState("0")
    const [openNew, setOpenNew] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const isTablet = useMediaQuery(theme.breakpoints.down("lg"))

    const handleChangeTabs = (event, newValue) => {
        setValue(newValue)
    }

    const handleOpenNew = () => setOpenNew(true)
    const handleCloseNew = () => setOpenNew(false)

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // function formatDate(dateStr) {
    //     if (!dateStr || typeof dateStr !== "string") return null;

    //     const parts = dateStr.split("/");
    //     if (parts.length !== 3) return null;

    //     const [day, month, year] = parts.map(Number);

    //     // Validar que sean números y estén en rango
    //     if (
    //         isNaN(day) || isNaN(month) || isNaN(year) ||
    //         day < 1 || day > 31 ||
    //         month < 1 || month > 12 ||
    //         year < 1900
    //     ) {
    //         return null;
    //     }

    //     const date = new Date(year, month - 1, day);

    //     // Validar que coincida con lo que vino
    //     if (
    //         date.getDate() !== day ||
    //         date.getMonth() !== month - 1 ||
    //         date.getFullYear() !== year
    //     ) {
    //         return null;
    //     }

    //     return date;
    // }

    // Función para formatear moneda
    const formatAmount = (amount, currency = "ARS") => {
        if (!amount && amount !== 0) return null
        const numAmount = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^\d.-]/g, "")) : amount
        if (isNaN(numAmount)) return amount
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: currency === "USD" ? "USD" : "ARS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount)
    }

    // Optimizar la búsqueda de la garantía seleccionada
    const selectedGuarantee = useMemo(() => {
        return garantias?.find((item) => item.id === paramID)
    }, [garantias, paramID])

    // Filtrar adjuntos para la garantía actual
    const currentGuaranteeAttachments = useMemo(() => {
        return adjuntosGarantias?.filter((item) => item.new_garantia === paramID) || []
    }, [adjuntosGarantias, paramID])

    // Definición de los campos de la garantía organizados por importancia
    const guaranteeData = useMemo(() => {
        if (!selectedGuarantee) return null
        let data = []
        if (selectedGuarantee.new_tipodeoperacion_value === 11) {
            data = [
                {
                    title: "Información General",
                    icon: InfoIcon,
                    color: "primary",
                    fields: [
                        {
                            icon: BusinessIcon,
                            label: "Tipo de Operación",
                            value: selectedGuarantee.new_tipodeoperacion,
                        },
                        {
                            icon: SecurityIcon,
                            label: "Tipo de Garantía",
                            value: selectedGuarantee.new_tipodegarantias,
                        },
                        {
                            icon: AccountBalanceIcon,
                            label: "Acreedor",
                            value: selectedGuarantee.new_acreedor,
                        },
                        {
                            icon: LocalAtmIcon,
                            label: "Divisa",
                            value: selectedGuarantee.transactioncurrencyid,
                        },
                    ],
                },
                {
                    title: "Información Financiera",
                    icon: TrendingUpIcon,
                    color: "success",
                    fields: [
                        {
                            icon: TrendingUpIcon,
                            label: "Tasa",
                            value: selectedGuarantee.new_tasa,
                        },
                        {
                            icon: AccountBalanceIcon,
                            label: "Sistema de Amortización",
                            value: selectedGuarantee.new_sistemadeamortizacion,
                        },
                        {
                            icon: ScheduleIcon,
                            label: "Periodicidad de Pago",
                            value: selectedGuarantee.new_periodicidadpagos,
                        },
                    ],
                },
                {
                    title: "Fechas y Plazos",
                    icon: DateRangeIcon,
                    color: "warning",
                    fields: [
                        {
                            icon: CalendarTodayIcon,
                            label: "Fecha de Carga",
                            value: selectedGuarantee.createdon,
                        },
                        {
                            icon: ScheduleIcon,
                            label: "Plazo en Meses",
                            value: selectedGuarantee.new_plazodias,
                        },
                        {
                            icon: ScheduleIcon,
                            label: "Plazo de Gracia en Meses",
                            value: selectedGuarantee.new_periodogracia,
                        },
                    ],
                },
            ]
        }
        else {
            data = [
                {
                    title: "Información General",
                    icon: InfoIcon,
                    color: "primary",
                    fields: [
                        {
                            icon: BusinessIcon,
                            label: "Tipo de Operación",
                            value: selectedGuarantee.new_tipodeoperacion,
                        },
                        {
                            icon: SecurityIcon,
                            label: "Tipo de Garantía",
                            value: selectedGuarantee.new_tipodegarantias,
                        },
                        {
                            icon: AccountBalanceIcon,
                            label: "Acreedor",
                            value: selectedGuarantee.new_acreedor,
                        },
                        {
                            icon: LocalAtmIcon,
                            label: "Divisa",
                            value: selectedGuarantee.transactioncurrencyid,
                        },
                    ],
                },
                {
                    title: "Detalles del Cheque",
                    icon: CreditCardIcon,
                    color: "secondary",
                    fields: [
                        {
                            icon: ReceiptIcon,
                            label: "Formato del Cheque",
                            value: selectedGuarantee.new_formatodelcheque,
                        },
                        {
                            icon: CreditCardIcon,
                            label: "Nro de Cheque",
                            value: selectedGuarantee.new_numerodecheque,
                        },
                        {
                            icon: AssignmentIcon,
                            label: "Tipo CHPD",
                            value: selectedGuarantee.new_tipochpd,
                        },
                        {
                            icon: PersonIcon,
                            label: "Librador",
                            value: selectedGuarantee.new_librador,
                        },
                    ],
                },
                {
                    title: "Fechas y Plazos",
                    icon: DateRangeIcon,
                    color: "warning",
                    fields: [
                        {
                            icon: CalendarTodayIcon,
                            label: "Fecha de Carga",
                            value: selectedGuarantee.createdon,
                        },
                        {
                            icon: ScheduleIcon,
                            label: "Plazo en Meses",
                            value: selectedGuarantee.new_plazodias,
                        },
                        {
                            icon: ScheduleIcon,
                            label: "Plazo de Gracia en Meses",
                            value: selectedGuarantee.new_periodogracia,
                        },
                    ],
                },
            ]
        }

        return {
            // Información destacada (cards más grandes)
            highlights: [
                {
                    icon: AssignmentIcon,
                    label: "N° de Orden",
                    value: selectedGuarantee.new_ndeordendelagarantiaotorgada,
                    color: "primary",
                },
                {
                    icon: AttachMoneyIcon,
                    label: "Monto Bruto",
                    value: formatAmount(selectedGuarantee.new_monto),
                    color: "success",
                },
                {
                    icon: CalendarTodayIcon,
                    label: "Fecha de Vencimiento",
                    value: selectedGuarantee.new_fechadevencimiento,
                    color: "warning",
                },
                {
                    icon: SecurityIcon,
                    label: "Estado",
                    value: selectedGuarantee.statuscode_value,
                    color: "info",
                    isStatus: true,
                },
            ],
            // Secciones organizadas
            sections: data,
            // Observaciones (sección especial)
            observations: selectedGuarantee.new_observaciones,
        }
    }, [selectedGuarantee])

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Grid container spacing={4}>
                {/* Header y botón de regresar */}
                <Grid item xs={12} sx={{ display: "flex", alignItems: "center", pt: "0px !important" }}>
                    <Tooltip title="Regresar" arrow>
                        <IconButton
                            color="primary"
                            onClick={() => router.push("/garantias")}
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    transform: "scale(1.05)",
                                },
                                transition: "all 0.3s ease",
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <PageHeader
                        title={
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    ml: 2,
                                }}
                            >
                                {selectedGuarantee ? (
                                    selectedGuarantee.new_name
                                ) : (
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <CircularProgress size={24} color="inherit" />
                                        <Typography variant="body2" color="text.secondary">
                                            Cargando garantía...
                                        </Typography>
                                    </Stack>
                                )}
                            </Typography>
                        }
                    />
                </Grid>

                {/* Contenido principal */}
                <Grid item xs={12}>
                    {!selectedGuarantee ? (
                        <Box sx={{ py: 8 }}>
                            <Grid container spacing={3}>
                                {/* Skeletons para highlights */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                                        Información Destacada
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {[...Array(4)].map((_, index) => (
                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <InfoCardSkeleton />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>

                                {/* Skeletons para secciones */}
                                {[...Array(2)].map((_, sectionIndex) => (
                                    <Grid item xs={12} key={sectionIndex}>
                                        <Card sx={{ borderRadius: 4 }}>
                                            <CardHeader
                                                avatar={<Skeleton variant="circular" width={48} height={48} />}
                                                title={<Skeleton variant="text" width="30%" height={32} />}
                                            />
                                            <CardContent>
                                                <Grid container spacing={3}>
                                                    {[...Array(4)].map((_, fieldIndex) => (
                                                        <Grid item xs={12} sm={6} md={3} key={fieldIndex}>
                                                            <InfoCardSkeleton />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        <Card
                            sx={{
                                borderRadius: 4,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                                overflow: "hidden",
                            }}
                        >
                            <TabContext value={value}>
                                <Box
                                    sx={{
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                        px: 3,
                                    }}
                                >
                                    <TabList
                                        scrollButtons="auto"
                                        variant={isMobile ? "scrollable" : "standard"}
                                        onChange={handleChangeTabs}
                                        sx={{
                                            "& .MuiTab-root": {
                                                fontWeight: 600,
                                                fontSize: "0.95rem",
                                                textTransform: "none",
                                                minHeight: 56,
                                                color: theme.palette.text.secondary,
                                                transition: "all 0.3s ease",
                                                "&.Mui-selected": {
                                                    color: theme.palette.primary.main,
                                                },
                                                "&:hover": {
                                                    color: theme.palette.primary.main,
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                },
                                            },
                                            "& .MuiTabs-indicator": {
                                                backgroundColor: theme.palette.primary.main,
                                                height: 3,
                                                borderRadius: "3px 3px 0 0",
                                            },
                                        }}
                                    >
                                        <Tab
                                            label={
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <InfoIcon fontSize="small" />
                                                    <Typography variant="inherit">Información General</Typography>
                                                </Stack>
                                            }
                                            value="0"
                                        />
                                        <Tab
                                            label={
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                                    <AttachFileIcon fontSize="small" />
                                                    <Typography variant="inherit">Adjuntos</Typography>
                                                    {currentGuaranteeAttachments.length > 0 && (
                                                        <Badge badgeContent={currentGuaranteeAttachments.length} color="primary" sx={{ pl: 1, pb: 4 }} />
                                                    )}
                                                </Stack>
                                            }
                                            value="1"
                                        />
                                    </TabList>
                                </Box>

                                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                    <TabPanel value="0" sx={{ p: 0 }}>
                                        <Stack spacing={4}>
                                            {/* Información Destacada */}
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: 18, xl: 20 },
                                                        mb: 3,
                                                        fontWeight: 700,
                                                        color: theme.palette.text.primary,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <SecurityIcon color="primary" />
                                                    Información Destacada
                                                </Typography>

                                                <Grid container spacing={3}>
                                                    {guaranteeData.highlights.map((item, index) => (
                                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                                            {item.isStatus ? (
                                                                <Card
                                                                    sx={{
                                                                        height: "100%",
                                                                        borderRadius: 3,
                                                                        border: `1px solid ${alpha(theme.palette[item.color].main, 0.2)}`,
                                                                        backgroundColor: alpha(theme.palette[item.color].main, 0.05),
                                                                        transition: "all 0.3s ease",
                                                                        "&:hover": {
                                                                            transform: "translateY(-2px)",
                                                                            boxShadow: `0 8px 25px ${alpha(theme.palette[item.color].main, 0.15)}`,
                                                                        },
                                                                        "&::before": {
                                                                            content: '""',
                                                                            position: "absolute",
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            height: 3,
                                                                            backgroundColor: theme.palette[item.color].main,
                                                                        },
                                                                    }}
                                                                >
                                                                    <CardContent sx={{ p: 3 }}>
                                                                        <Stack direction="row" alignItems="flex-start" spacing={2}>
                                                                            <Avatar
                                                                                sx={{
                                                                                    backgroundColor: alpha(theme.palette[item.color].main, 0.1),
                                                                                    color: theme.palette[item.color].main,
                                                                                    width: 40,
                                                                                    height: 40,
                                                                                }}
                                                                            >
                                                                                <item.icon fontSize="small" />
                                                                            </Avatar>

                                                                            <Box sx={{ flex: 1 }}>
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    sx={{
                                                                                        color: theme.palette.text.secondary,
                                                                                        fontWeight: 600,
                                                                                        textTransform: "uppercase",
                                                                                        letterSpacing: 0.5,
                                                                                        fontSize: "0.75rem",
                                                                                        mb: 1,
                                                                                        display: "block",
                                                                                    }}
                                                                                >
                                                                                    {item.label}
                                                                                </Typography>

                                                                                <StatusChip status={item.label} value={item.value} />
                                                                            </Box>
                                                                        </Stack>
                                                                    </CardContent>
                                                                </Card>
                                                            ) : (
                                                                <InfoCard {...item} delay={index * 100} isImportant={true} />
                                                            )}
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>

                                            {/* Secciones Detalladas */}
                                            {guaranteeData.sections?.map((section, sectionIndex) => (
                                                <SectionCard
                                                    key={sectionIndex}
                                                    title={section.title}
                                                    icon={section.icon}
                                                    color={section.color}
                                                    delay={sectionIndex * 200}
                                                >
                                                    <Grid container spacing={3}>
                                                        {section.fields.map((field, fieldIndex) => (
                                                            <Grid item xs={12} sm={6} md={section.fields.length <= 2 ? 6 : 4} key={fieldIndex} sx={{ mt: 4 }}>
                                                                <InfoCard {...field} color={section.color} delay={fieldIndex * 50} />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </SectionCard>
                                            ))}

                                            {/* Observaciones */}
                                            {guaranteeData.observations && (
                                                <SectionCard title="Observaciones" icon={NotesIcon} color="info" delay={400}>
                                                    <Paper
                                                        sx={{
                                                            p: 3,
                                                            backgroundColor: alpha(theme.palette.info.main, 0.05),
                                                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{

                                                                color: theme.palette.text.primary,
                                                                lineHeight: 1.6,
                                                                fontStyle: "italic",
                                                            }}
                                                        >
                                                            {guaranteeData.observations}
                                                        </Typography>
                                                    </Paper>
                                                </SectionCard>
                                            )}
                                        </Stack>
                                    </TabPanel>

                                    <TabPanel value="1" sx={{ p: 0 }}>
                                        <Box>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    Archivos Adjuntos
                                                </Typography>
                                                <Chip
                                                    label={`${currentGuaranteeAttachments.length} archivo${currentGuaranteeAttachments.length !== 1 ? "s" : ""}`}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Stack>

                                            <Table
                                                data={currentGuaranteeAttachments}
                                                columns={columns_adjuntos_garantias}
                                                toggle={handleOpenNew}
                                                addRow={true}
                                            />
                                        </Box>
                                    </TabPanel>
                                </CardContent>
                            </TabContext>
                        </Card>
                    )}
                </Grid>
            </Grid>

            {/* Modal de subida de adjuntos */}
            <ModalAdjuntoGarantia open={openNew} handleClose={handleCloseNew} id={paramID} />
        </Box>
    )
}

export default IdGarantia
