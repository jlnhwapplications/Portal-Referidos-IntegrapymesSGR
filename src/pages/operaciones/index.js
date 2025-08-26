import { useState, useMemo, useEffect } from "react"
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  useTheme,
  alpha,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Skeleton,
} from "@mui/material"
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import TablaOperaciones from "../views/operaciones/TablaOperaciones"
import useGetOperaciones from "@/hooks/useGetOperaciones"
import ApexChartWrapper from '@/@core/styles/libs/react-apexcharts' // Import ApexChartWrapper
import PageHeader from "@/@core/components/page-header"

// Registrar componentes de Chart.js

const Operaciones = () => {
  const theme = useTheme()
  const { operaciones, garantiasOP, documentosOP, loadingOperaciones } = useGetOperaciones()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (operaciones && garantiasOP && documentosOP) {
      setIsLoading(false)
    }
  }, [operaciones, garantiasOP, documentosOP])

  // Cálculos de KPIs
  const kpis = useMemo(() => {
    if (!operaciones?.length) return null

    const totalOperaciones = operaciones.length
    const operacionesEnviadas = operaciones.filter((op) => op.statuscode === "Enviada").length
    const operacionesPendientes = operaciones.filter((op) => op.statuscode === "Pendiente").length
    const operacionesInstrumentadas = operaciones.filter((op) => op.statuscode === "Instrumentada").length
    const operacionesMonetizadas = operaciones.filter((op) => op.statuscode === "Monetizada").length

    const montoTotal = operaciones.reduce((sum, op) => sum + (op.new_montodelaoperacion || 0), 0)
    const montoPromedio = totalOperaciones > 0 ? montoTotal / totalOperaciones : 0

    // Operaciones por mes (últimos 6 meses)
    const operacionesPorMes = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString("es-AR", { month: "short", year: "numeric" })
      operacionesPorMes[key] = 0
    }

    operaciones.forEach((op) => {
      if (op.fechaCreacion_str) {
        const opDate = new Date(op.fechaCreacion_str)
        const key = opDate.toLocaleDateString("es-AR", { month: "short", year: "numeric" })
        if (operacionesPorMes.hasOwnProperty(key)) {
          operacionesPorMes[key]++
        }
      }
    })

    return {
      totalOperaciones,
      operacionesEnviadas,
      operacionesPendientes,
      operacionesInstrumentadas,
      operacionesMonetizadas,
      montoTotal,
      montoPromedio,
      operacionesPorMes,
      tasaExito:
        totalOperaciones > 0
          ? (((operacionesEnviadas + operacionesMonetizadas) / totalOperaciones) * 100).toFixed(1)
          : 0,
    }
  }, [operaciones])

  const dollarFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
  })

  // Datos para gráficos ApexCharts
  const chartData = useMemo(() => {
    if (!kpis) return null

    // Configuración para gráfico de estados (Donut)
    const statusChartOptions = {
      chart: {
        type: "donut",
        height: 300,
        fontFamily: theme.typography.fontFamily,
        toolbar: {
          show: false,
        },
      },
      colors: [
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.primary.main,
      ],
      labels: ["Enviadas", "Pendientes", "Instrumentadas", "Monetizadas"],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        fontWeight: 500,
        markers: {
          width: 8,
          height: 8,
          radius: 4,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 8,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "16px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              },
              value: {
                show: true,
                fontSize: "24px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              },
              total: {
                show: true,
                label: "Total",
                fontSize: "14px",
                fontWeight: 500,
                color: theme.palette.text.secondary,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: [theme.palette.background.paper],
      },
      tooltip: {
        theme: theme.palette.mode,
        style: {
          fontSize: "14px",
        },
      },
    }

    const statusSeries = [
      kpis.operacionesEnviadas,
      kpis.operacionesPendientes,
      kpis.operacionesInstrumentadas,
      kpis.operacionesMonetizadas,
    ]

    // Configuración para gráfico de tendencia (Area)
    const trendChartOptions = {
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
      colors: [theme.palette.primary.main],
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
        categories: Object.keys(kpis.operacionesPorMes),
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
          formatter: (value) => `${value} operaciones`,
        },
        style: {
          fontSize: "14px",
        },
      },
      markers: {
        size: 6,
        colors: [theme.palette.primary.main],
        strokeColors: theme.palette.background.paper,
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
    }

    const trendSeries = [
      {
        name: "Operaciones",
        data: Object.values(kpis.operacionesPorMes),
      },
    ]

    return {
      statusChartOptions,
      statusSeries,
      trendChartOptions,
      trendSeries,
    }
  }, [kpis, theme])

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

  // if (loadingOperaciones) {
  //   return <OperacionesSkeleton />
  // }

  return (
    <ApexChartWrapper>
      <Box sx={{ p: 3 }}>

        <PageHeader
          title="Mis Operaciones"
          subtitle={"Administración completa del portafolio de operaciones."}
          variant="compact"
        />

        {
          loadingOperaciones ?
            <OperacionesSkeleton /> : <Fade in timeout={600}>
              <Box sx={{ borderRadius: 3 }}>
                <TablaOperaciones searchTerm={searchTerm} statusFilter={statusFilter} dateRange={dateRange} />
              </Box>
            </Fade>
        }
        {/* <Box>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: 22, xl: 28 }
            }}
          >
            Mis Operaciones
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 600, fontSize: { xs: 18, xl: 20 } }}>
            
          </Typography>
        </Box> */}
        {/* Header */}
        {/* <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: {xs: 22, xl: 28}
                }}
              >
                Mis Operaciones
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 600, fontSize: {xs: 18, xl: 20} }}>
                Administración completa del portafolio de operaciones.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Tooltip title="Actualizar datos" arrow>
                <IconButton
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                Nueva Operación
              </Button>
            </Stack>
          </Box>
        </Box> */}

        {/* KPIs */}
        {/* {kpis && (
          <Fade in timeout={600}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Total Operaciones"
                  value={kpis.totalOperaciones}
                  subtitle="Operaciones registradas"
                  icon={AssignmentIcon}
                  color="primary"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Monto Total"
                  value={dollarFormatter.format(kpis.montoTotal)}
                  subtitle="Valor total del portafolio"
                  icon={AttachMoneyIcon}
                  color="success"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Promedio por Operación"
                  value={dollarFormatter.format(kpis.montoPromedio)}
                  subtitle="Valor promedio"
                  icon={TrendingUpIcon}
                  color="info"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <KPICard
                  title="Tasa de Éxito"
                  value={`${kpis.tasaExito}%`}
                  subtitle="Operaciones exitosas"
                  icon={CheckCircleIcon}
                  color="warning"
                />
              </Grid>
            </Grid>
          </Fade>
        )} */}

        {/* Gráficos */}
        {/* {chartData && (
          <Fade in timeout={800}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <ChartCard
                  title="Tendencia de Operaciones"
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
                      options={chartData.trendChartOptions}
                      series={chartData.trendSeries}
                      type="area"
                      height="100%"
                    />
                  </Box>
                </ChartCard>
              </Grid>

              <Grid item xs={12} md={4}>
                <ChartCard title="Estados de Operaciones">
                  <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Chart
                      options={chartData.statusChartOptions}
                      series={chartData.statusSeries}
                      type="donut"
                      height="100%"
                    />
                  </Box>
                </ChartCard>
              </Grid>
            </Grid>
          </Fade>
        )} */}

        {/* Filtros */}
        {/* <Fade in timeout={1000}>
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Buscar operaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Estado"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">Todos los estados</MenuItem>
                      <MenuItem value="Enviada">Enviadas</MenuItem>
                      <MenuItem value="Pendiente">Pendientes</MenuItem>
                      <MenuItem value="Instrumentada">Instrumentadas</MenuItem>
                      <MenuItem value="Monetizada">Monetizadas</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Período</InputLabel>
                    <Select
                      value={dateRange}
                      label="Período"
                      onChange={(e) => setDateRange(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">Todo el tiempo</MenuItem>
                      <MenuItem value="today">Hoy</MenuItem>
                      <MenuItem value="week">Esta semana</MenuItem>
                      <MenuItem value="month">Este mes</MenuItem>
                      <MenuItem value="quarter">Este trimestre</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Aplicar filtros" arrow>
                      <IconButton
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Exportar datos" arrow>
                      <IconButton
                        sx={{
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.success.main, 0.2),
                          },
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade> */}

        {/* Tabla de Operaciones */}
        {/* <Fade in timeout={1200}>
          <Box sx={{ borderRadius: 3 }}>
            <TablaOperaciones searchTerm={searchTerm} statusFilter={statusFilter} dateRange={dateRange} />
          </Box>
        </Fade> */}
      </Box>
    </ApexChartWrapper>
  )
}

// Componente de skeleton para loading
const OperacionesSkeleton = () => (
  <Box sx={{ p: 3 }}>
    {/* Header Skeleton */}
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

    {/* Charts Skeleton */}
    {/* <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8}>
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
      </Grid>
    </Grid> */}

    {/* Filters Skeleton */}
    {/* <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 3 }} /> */}

    {/* Table Skeleton */}
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
  </Box>
)

export default Operaciones
