import { useEffect, useState, useMemo } from "react"
import {
    Card,
    CardContent,
    Typography,
    Box,
    Tabs,
    Tab,
    Chip,
    Grid,
    Avatar,
    Paper,
    Stack,
    Skeleton,
    Container,
    useTheme,
    alpha,
    Fade,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material"
import {
    CreditCard,
    TrendingDown,
    TrendingUp,
    Security,
    CheckCircle,
    Download as DownloadIcon,
} from "@mui/icons-material"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import PageHeader from "@/@core/components/page-header"
import useGetLimites from "@/hooks/useGetLimites"
import LimitCard from "./LimitCard"
import ApexChartWrapper from '@/@core/styles/libs/react-apexcharts'// Asegúrate de que esta ruta sea correcta
import moment from "moment"
import useGetDisponibleLimitesGeneral from "@/hooks/useGetDisponibleLimitesGeneral"
// import { Icon } from "@iconify/react"

let xlsxLibPromise

const getXlsxLib = () => {
    if (!xlsxLibPromise) {
        xlsxLibPromise = import("xlsx").then((module) => module.default || module)
    }
    return xlsxLibPromise
}

const sanitizeFileName = (baseName) =>
    (baseName || "export")
        .toString()
        .trim()
        .replace(/[\s]+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")

const Index = () => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const { loadingLimites, limiteGral, limites, dataLimite } = useGetLimites()
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    // Cálculos de KPIs para Líneas
    const kpis = useMemo(() => {
        // if (loadingLimites || !limiteGral || !limites) return null
        if (loadingLimites) return null

        const totalLimiteAprobado = limiteGral?.reduce((sum, line) => sum + (line.montoTotal || 0), 0)
        const totalLimiteUtilizado = limiteGral?.reduce((sum, line) => sum + (line.montoUtilizado || 0), 0)
        const totalLimiteDisponible = totalLimiteAprobado - totalLimiteUtilizado
        const porcentajeUtilizacion =
            totalLimiteAprobado > 0 ? ((totalLimiteUtilizado / totalLimiteAprobado) * 100).toFixed(1) : 0

        const lineasActivas = limiteGral?.filter((line) => line.estado === "Activa").length
        const operacionesActivas = limites?.filter((op) => op.estado === "Activa").length

        // Simulación de datos históricos para el gráfico de tendencia
        const trendData = []
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthYear = date.toLocaleDateString("es-AR", { month: "short", year: "numeric" })
            // Simular un uso de límite que varía
            const simulatedUsage = totalLimiteUtilizado * (1 - 0.05 * i + Math.random() * 0.1)
            trendData.push({ x: monthYear, y: Math.max(0, simulatedUsage) })
        }

        return {
            totalLimiteAprobado,
            totalLimiteUtilizado,
            totalLimiteDisponible,
            porcentajeUtilizacion,
            lineasActivas,
            operacionesActivas,
            trendData,
        }
    }, [loadingLimites, limiteGral, limites])

    const dollarFormatter = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    })

    // Función profesional para formatear moneda
    const formatCurrency = (amount, currency = "ARS") => {
        if (currency === "Dolares Americanos" || currency === "USD") {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
                .format(amount)
                .replace("$", "U$S");
        }
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    };

    const getOperationName = (tipoOperacion) => {
        const tipo = tipoOperacion?.toString() || ""
        switch (tipo) {
            case "100000000":
                return "Linea General"
            case "100000001":
                return "Tarjeta de Credito"
            case "100000002":
                return "Prestamo Hipotecario"
            case "100000003":
                return "Prestamo Automotor"
            case "100000004":
                return "Prestamo Comercial"
            case "100000005":
                return "Linea de Inventario"
            default:
                return "Linea de Credito"
        }
    }

    const exportRowsToExcel = async (rows, baseName) => {
        if (!rows?.length || typeof window === "undefined") return

        try {
            const XLSX = await getXlsxLib()
            const headers = rows.reduce((acc, row) => {
                Object.keys(row || {}).forEach((key) => {
                    if (!acc.includes(key)) acc.push(key)
                })
                return acc
            }, [])

            const normalizedRows = rows.map((row) => {
                return headers.reduce((acc, key) => {
                    const value = row?.[key]
                    if (value === undefined || value === null) {
                        acc[key] = ""
                    } else if (value instanceof Date) {
                        acc[key] = moment(value).format("DD/MM/YYYY")
                    } else if (typeof value === "object") {
                        acc[key] = JSON.stringify(value)
                    } else {
                        acc[key] = value
                    }
                    return acc
                }, {})
            })

            const worksheet = XLSX.utils.json_to_sheet(normalizedRows.length ? normalizedRows : [{}], {
                header: headers,
            })
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Datos")

            const sanitizedBaseName = sanitizeFileName(baseName)
            const timestamp = moment(new Date()).format("DD/MM/YYYY")
            const fileName = `${sanitizedBaseName || "export"}_${timestamp}.xlsx`

            XLSX.writeFile(workbook, fileName, { compression: true })
        } catch (error) {
            console.error("Error al exportar a Excel", error)
        }
    }

    const generalActiveLimits = useMemo(
        () => limiteGral?.filter((item) => item?.statecode === 0 && item?.statuscode_value === 100000001) || [],
        [limiteGral]
    )

    const generalExpiredLimits = useMemo(
        () => limiteGral?.filter((item) => item?.statecode === 1 && item?.statuscode_value === 2) || [],
        [limiteGral]
    )

    const activeOperations = useMemo(
        () => limites?.filter((item) => item?.statecode === 0 && item?.statuscode_value === 100000001) || [],
        [limites]
    )

    const expiredOperations = useMemo(
        () => limites?.filter((item) => item?.statecode === 1 && item?.statuscode_value === 2) || [],
        [limites]
    )

    const handleExportGeneralLimits = () => {
        if (!limiteGral.length) return
        let cuenta = ''
        if (limiteGral?.length > 0 && limiteGral[0]?.new_cuenta) [
            cuenta = limiteGral[0]?.new_cuenta
        ]
        const rows = limiteGral.map((limite) => {
            const currencyLabel = limite?._transactioncurrencyid_value || "Pesos Argentinos"
            // const currencyCode = currencyLabel?.toUpperCase().includes("USD") ? "USD" : "ARS"

            return {
                "Tipo de linea": getOperationName(limite?.new_lineatipodeoperacion_value),
                Producto: limite?.new_tipochpd || "",
                "Tope general": formatCurrency(limite?.new_topeporlineacomercial, currencyLabel),
                "Monto disponible": formatCurrency(limite?.new_montodisponiblegeneral, currencyLabel),
                "Monto utilizado": formatCurrency(limite?.new_montoutilizadogeneral, currencyLabel),
                Moneda: currencyLabel,
                "Vigencia hasta": limite?.new_vigenciahasta || "",
                Estado: limite?.statuscode || "",
            }
        })

        exportRowsToExcel(rows, `limites_generales ${cuenta}`)
    }

    const handleExportOperacionesActivas = () => {
        if (!limites.length) return
        let cuenta = ''
        if (limites?.length > 0 && limites[0]?.new_cuenta) [
            cuenta = limites[0]?.new_cuenta
        ]
        const rows = limites.map((operacion) => {
            const currencyLabel = operacion?._transactioncurrencyid_value || "Pesos Argentinos"
            // const currencyCode = currencyLabel?.toUpperCase().includes("USD") ? "USD" : "ARS"

            return {
                "Tipo de operacion": getOperationName(operacion?.new_lineatipodeoperacion_value),
                Producto: operacion?.new_tipochpd || "",
                "Tope por operacion": formatCurrency(operacion?.new_topeporlineacomercial, currencyLabel),
                "Monto disponible": formatCurrency(operacion?.new_montodisponibleporoperacion, currencyLabel),
                "Monto utilizado": formatCurrency(operacion?.new_montoutilizadoporoperacion, currencyLabel),
                Moneda: currencyLabel,
                "Vigencia hasta": operacion?.new_vigenciahasta || "",
                Estado: operacion?.statuscode || "",
            }
        })

        exportRowsToExcel(rows, `limites_por_operacion ${cuenta}`)
    }

    // Configuración de gráficos ApexCharts
    const chartOptions = useMemo(() => {
        if (!kpis) return null

        // Gráfico de Utilización de Límite (RadialBar)
        const radialBarOptions = {
            chart: {
                type: "radialBar",
                height: 280,
                fontFamily: theme.typography.fontFamily,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: "70%",
                        background: theme.palette.background.paper,
                    },
                    track: {
                        background: alpha(theme.palette.primary.main, 0.1),
                        strokeWidth: "97%",
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: "16px",
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                        },
                        value: {
                            show: true,
                            fontSize: "28px",
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            formatter: (val) => `${val}%`,
                        },
                    },
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "horizontal",
                    shadeIntensity: 0.5,
                    gradientToColors: [theme.palette.primary.light],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100],
                },
            },
            stroke: {
                lineCap: "round",
            },
            labels: ["Utilización"],
            colors: [theme.palette.primary.main],
            tooltip: {
                theme: theme.palette.mode,
                style: {
                    fontSize: "14px",
                },
                y: {
                    formatter: (val) => `${val}% utilizado`,
                },
            },
        }

        // Gráfico de Tendencia de Utilización (Area Chart)
        const areaChartOptions = {
            chart: {
                type: "area",
                height: 300,
                fontFamily: theme.typography.fontFamily,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: [theme.palette.info.main],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                width: 3,
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.3,
                    opacityTo: 0.1,
                    stops: [0, 90, 100],
                },
            },
            grid: {
                borderColor: alpha(theme.palette.divider, 0.1),
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            xaxis: {
                type: "category",
                categories: kpis?.trendData.map((d) => d.x),
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: theme.palette.text.secondary,
                        fontSize: "12px",
                        fontWeight: 500,
                    },
                },
            },
            yaxis: {
                min: 0,
                labels: {
                    formatter: (value) => dollarFormatter.format(value),
                    style: {
                        colors: theme.palette.text.secondary,
                        fontSize: "12px",
                        fontWeight: 500,
                    },
                },
            },
            tooltip: {
                theme: theme.palette.mode,
                x: {
                    format: "MMM yyyy",
                },
                y: {
                    formatter: (value) => dollarFormatter.format(value),
                },
                style: {
                    fontSize: "14px",
                },
            },
            markers: {
                size: 6,
                colors: [theme.palette.info.main],
                strokeColors: theme.palette.background.paper,
                strokeWidth: 2,
                hover: {
                    size: 8,
                },
            },
        }

        const areaSeries = [
            {
                name: "Monto Utilizado",
                data: kpis?.trendData.map((d) => d.y),
            },
        ]

        return {
            radialBarOptions,
            radialBarSeries: [Number.parseFloat(kpis?.porcentajeUtilizacion)],
            areaChartOptions,
            areaSeries,
        }
    }, [kpis, theme])

    // Componente para las tarjetas de KPI
    const KPICard = ({ title, value, subtitle, icon: Icon, color = "primary", trend }) => (
        <Card
            sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)}, ${alpha(theme.palette[color].main, 0.02)})`,
                border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 30px ${alpha(theme.palette[color].main, 0.2)}`,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                    <Avatar
                        sx={{
                            backgroundColor: alpha(theme.palette[color].main, 0.1),
                            color: theme.palette[color].main,
                            width: 56,
                            height: 56,
                        }}
                    >
                        <Icon sx={{ fontSize: 28 }} />
                    </Avatar>
                    {trend && (
                        <Chip
                            label={`${trend > 0 ? "+" : ""}${trend}%`}
                            size="small"
                            color={trend > 0 ? "success" : "error"}
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                </Box>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette[color].main,
                        mb: 1,
                        lineHeight: 1.2,
                    }}
                >
                    {value}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.4,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )

    // Componente para las tarjetas de gráficos
    const ChartCard = ({ title, children, actions }) => (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                    {actions && (
                        <Stack direction="row" spacing={1}>
                            {actions}
                        </Stack>
                    )}
                </Box>
                {children}
            </CardContent>
        </Card>
    )

    // Componente para animaciones de entrada
    function AnimatedGrid({ children, delay = 0 }) {
        const [isVisible, setIsVisible] = useState(false)
        useEffect(() => {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, delay)
            return () => clearTimeout(timer)
        }, [delay])
        return (
            <Box
                sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                {children}
            </Box>
        )
    }

    // Skeleton de carga
    function LoadingSkeleton() {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                {/* <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={500} height={32} />
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid> */}

                {/* <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={8}>
                        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
                    </Grid>
                </Grid> */}

                <Skeleton variant="rectangular" height={72} sx={{ mb: 3, borderRadius: 3 }} />
                {/* <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} /> */}
            </Container>
        )
    }

    // TabPanel con animaciones
    function CustomTabPanel({ children, value, index, ...other }) {
        const [isVisible, setIsVisible] = useState(false)
        useEffect(() => {
            if (value === index) {
                const timer = setTimeout(() => {
                    setIsVisible(true)
                }, 100)
                return () => clearTimeout(timer)
            } else {
                setIsVisible(false)
            }
        }, [value, index])
        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(20px)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    m: 0,
                    p: 0
                }}
                {...other}
            >
                {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
            </Box>
        )
    }


    return (
        <ApexChartWrapper>
            <Container maxWidth="xl" sx={{ py: { xl: 2 } }}>
                <Stack spacing={3}>
                    <PageHeader
                        title="Mís Líneas"
                        subtitle="Administración completa de mis líneas crediticias"
                        variant="compact"
                    />

                    {/* KPIs */}
                    {/* <Fade in timeout={600}>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <KPICard
                                    title="Límite Aprobado"
                                    value={dollarFormatter.format(kpis?.totalLimiteAprobado)}
                                    subtitle="Total de líneas aprobadas"
                                    icon={CreditCard}
                                    color="primary"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <KPICard
                                    title="Límite Utilizado"
                                    value={dollarFormatter.format(kpis?.totalLimiteUtilizado)}
                                    subtitle="Monto en uso actualmente"
                                    icon={TrendingDown}
                                    color="error"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <KPICard
                                    title="Límite Disponible"
                                    value={dollarFormatter.format(kpis?.totalLimiteDisponible)}
                                    subtitle="Monto disponible para uso"
                                    icon={CheckCircle}
                                    color="success"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <KPICard
                                    title="Líneas Activas"
                                    value={kpis?.lineasActivas}
                                    subtitle="Número de líneas activas"
                                    icon={Security}
                                    color="info"
                                />
                            </Grid>
                        </Grid>
                    </Fade> */}

                    {/* Gráficos */}
                    {/* <Fade in timeout={800}>
                        <Grid container spacing={3} sx={{ mb: 4 }}> */}
                    {/* <Grid item xs={12} md={4}>
                                <ChartCard title="Utilización del Límite">
                                    <Box sx={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Chart
                                            options={chartOptions?.radialBarOptions}
                                            series={chartOptions?.radialBarSeries}
                                            type="radialBar"
                                            height="100%"
                                        />
                                    </Box>
                                </ChartCard>
                            </Grid> */}

                    {/* <Grid item xs={12} md={8}> */}
                    {/* <ChartCard
                                    title="Tendencia de Utilización"
                                    actions={[
                                        <Tooltip key="export" title="Exportar gráfico" arrow>
                                            <IconButton size="small">
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>,
                                    ]}
                                >
                                    <Box sx={{ height: 300 }}>
                                        <Chart
                                            options={chartOptions?.areaChartOptions}
                                            series={chartOptions?.areaSeries}
                                            type="area"
                                            height="100%"
                                        />
                                    </Box>
                                </ChartCard> */}
                    {/* </Grid>
                        </Grid>
                    </Fade> */}

                    {/* Tabs mejorados con diseño responsive y animaciones */}
                    {
                        !loadingLimites ?
                            <LoadingSkeleton /> :
                            <>
                                <Paper
                                    elevation={isDark ? 6 : 4}
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        background: isDark
                                            ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                                            : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                    }}
                                >
                                    <Tabs
                                        value={activeTab}
                                        onChange={handleTabChange}
                                        variant="fullWidth"
                                        sx={{
                                            minHeight: { xs: 50, sm: 64, md: 72 },
                                            "& .MuiTabs-flexContainer": {
                                                height: "100%",
                                            },
                                            "& .MuiTab-root": {
                                                fontWeight: "bold",
                                                textTransform: "none",
                                                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                                                minHeight: { xs: 56, sm: 64, md: 72 },
                                                px: { xs: 2, sm: 3, md: 4 },
                                                py: { xs: 1, sm: 2, md: 2.5 },
                                                color: isDark ? "#b0b0b0" : "text.secondary",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                position: "relative",
                                                overflow: "hidden",
                                                "&::before": {
                                                    content: '""',
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: isDark
                                                        ? "linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)"
                                                        : "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)",
                                                    opacity: 0,
                                                    transition: "opacity 0.3s ease",
                                                },
                                                "&:hover": {
                                                    color: isDark ? "#90caf9" : "primary.main",
                                                    transform: "translateY(-2px)",
                                                    "&::before": {
                                                        opacity: 1,
                                                    },
                                                },
                                                "&.Mui-selected": {
                                                    color: isDark ? "#64b5f6" : "primary.main",
                                                    fontWeight: 900,
                                                    background: isDark
                                                        ? "linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(66, 165, 245, 0.1) 100%)"
                                                        : "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)",
                                                    boxShadow: isDark
                                                        ? "inset 0 2px 8px rgba(100, 181, 246, 0.2)"
                                                        : "inset 0 2px 8px rgba(25, 118, 210, 0.1)",
                                                    "&::before": {
                                                        opacity: 1,
                                                    },
                                                },
                                            },
                                            "& .MuiTabs-indicator": {
                                                backgroundColor: isDark ? "#64b5f6" : "primary.main",
                                                height: 4,
                                                borderRadius: "2px 2px 0 0",
                                                background: isDark
                                                    ? "linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%)"
                                                    : "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
                                                boxShadow: isDark ? "0 0 12px rgba(100, 181, 246, 0.6)" : "0 0 12px rgba(25, 118, 210, 0.4)",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            },
                                        }}
                                    >
                                        <Tab
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <CreditCard fontSize="small" />
                                                    <Box>
                                                        <Typography variant="inherit" fontWeight="inherit">
                                                            Límites Generales
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.7, display: { xs: "none", sm: "block" } }}>
                                                            {limiteGral?.length} líneas
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                        <Tab
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <TrendingUp fontSize="small" />
                                                    <Box>
                                                        <Typography variant="inherit" fontWeight="inherit">
                                                            Operaciones Activas
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.7, display: { xs: "none", sm: "block" } }}>
                                                            {limites.filter(item => item.statuscode_value  == 100000001).length} operaciones
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </Tabs>
                                </Paper>

                                {/* Tab Panels con animaciones */}
                                <CustomTabPanel value={activeTab} index={0}>
                                    {/* <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}> */}
                                    {
                                        // generalActiveLimits.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                        Límites Activos
                                                    </Typography>
                                                    {/* <Typography variant="body2" color="text.secondary">
                                                            {limiteGral?.filter(item => item?.statecode === 0 && item?.statuscode_value === 100000001).length} límite{limiteGral?.filter(item => item?.statecode === 0 && item?.statuscode_value === 100000001).length !== 1 ? "s" : ""} instrumentado
                                                            {limiteGral?.filter(item => item?.statecode === 0 && item?.statuscode_value === 100000001).length !== 1 ? "s" : ""} y disponible{limiteGral?.filter(item => item?.statecode === 0 && item?.statuscode_value === 100000001).length !== 1 ? "s" : ""}
                                                        </Typography> */}
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DownloadIcon fontSize="small" />}
                                                    onClick={handleExportGeneralLimits}
                                                    disabled={limiteGral?.length == 0}
                                                    sx={{
                                                        borderRadius: 999,
                                                        textTransform: "none",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Exportar límites Generales
                                                </Button>
                                            </Box>
                                            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                                                {
                                                    generalActiveLimits?.length > 0 ?
                                                        generalActiveLimits?.map((limite, index) => (
                                                            <Grid item xs={12} sm={6} lg={4} key={limite?.id || limite?.new_productosid || index}>
                                                                <AnimatedGrid delay={index * 150}>
                                                                    <LimitCard data={limite} limiteGeneral={dataLimite} />
                                                                </AnimatedGrid>
                                                            </Grid>
                                                        )) : <Grid item xs={12}>
                                                            <Typography>No hay límite general activo</Typography>
                                                        </Grid>
                                                }
                                            </Grid>
                                        </Box>
                                    }
                                    {
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                        Límites Vencidos
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                                                {
                                                    generalExpiredLimits?.length > 0 ?
                                                        generalExpiredLimits?.map((limite, index) => (
                                                            <Grid item xs={12} sm={6} lg={4} key={limite?.id || limite?.new_productosid || index}>
                                                                <AnimatedGrid delay={index * 150}>
                                                                    <LimitCard data={limite} limiteGeneral={dataLimite} />
                                                                </AnimatedGrid>
                                                            </Grid>
                                                        ))
                                                        : <Grid item xs={12}>
                                                            <Typography>No hay límites generales vencidos</Typography>
                                                        </Grid>
                                                }
                                            </Grid>
                                        </Box>
                                    }
                                </CustomTabPanel>
                                <CustomTabPanel value={activeTab} index={1}>
                                    {
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                        Límites por operación activos
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DownloadIcon fontSize="small" />}
                                                    onClick={handleExportOperacionesActivas}
                                                    disabled={limites?.length == 0}
                                                    sx={{
                                                        borderRadius: 999,
                                                        textTransform: "none",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Exportar límites por operación
                                                </Button>
                                            </Box>
                                            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                                                {
                                                    activeOperations?.length > 0 ?
                                                        activeOperations?.map((limite, index) => (
                                                            <Grid item xs={12} sm={6} lg={4} key={limite?.id || limite?.new_productosid || index}>
                                                                <AnimatedGrid delay={index * 150}>
                                                                    <LimitCard data={limite} limiteGeneral={dataLimite}/>
                                                                </AnimatedGrid>
                                                            </Grid>
                                                        )) :
                                                        <Grid item xs={12}>
                                                            <Typography>No hay límites por operación activos</Typography>
                                                        </Grid>
                                                }
                                            </Grid>
                                        </Box>
                                        // )
                                    }
                                    {
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                        Límites  por operación vencidos
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                                                {
                                                    expiredOperations?.length > 0 ?
                                                        expiredOperations?.map((limite, index) => (
                                                            <Grid item xs={12} sm={6} lg={4} key={limite?.id || limite?.new_productosid || index}>
                                                                <AnimatedGrid delay={index * 150}>
                                                                    <LimitCard data={limite} limiteGeneral={dataLimite} />
                                                                </AnimatedGrid>
                                                            </Grid>
                                                        )) :
                                                        <Grid item xs={12}>
                                                            <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                                No hay límites por operación vencidos
                                                            </Typography>
                                                        </Grid>
                                                }
                                            </Grid>
                                        </Box>
                                    }
                                </CustomTabPanel>
                            </>
                    }
                </Stack>
            </Container>
        </ApexChartWrapper>
    )
}

export default Index
