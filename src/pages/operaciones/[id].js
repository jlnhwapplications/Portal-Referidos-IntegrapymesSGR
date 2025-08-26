import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import {
  Box,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Skeleton,
  Breadcrumbs,
  Link,
  Fade,
  Collapse,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon,
  CreditCard as CreditCardIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
} from "@mui/icons-material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Tab } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Table from "@/@core/components/table/Table"
import useGetOperaciones from "@/hooks/useGetOperaciones"
import { COLUMNSGOPERACIONES, columns_adjuntos_operaciones } from "@/columns/columnsOperaciones"

const IdOperacion = () => {
  const theme = useTheme()
  const router = useRouter()
  const paramID = router.query.id
  const { operaciones, garantiasOP, documentosOP } = useGetOperaciones()

  const [activeTab, setActiveTab] = useState("0")
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    kpi: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))

  // Datos calculados
  const currentOperation = useMemo(() => {
    return operaciones?.find((item) => item.id == paramID)
  }, [operaciones, paramID])

  const filteredGarantias = useMemo(() => {
    return garantiasOP?.filter((item) => item.new_operacionid == paramID) || []
  }, [garantiasOP, paramID])

  const filteredDocumentos = useMemo(() => {
    return documentosOP?.filter((item) => item.new_operacionid == paramID) || []
  }, [documentosOP, paramID])

  const montoTotalGarantias = useMemo(() => {
    return filteredGarantias.reduce((total, item) => {
      return total + (item.new_monto || 0)
    }, 0)
  }, [filteredGarantias])

  const dollarFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  })

  useEffect(() => {
    if (operaciones && garantiasOP && documentosOP) {
      setIsLoading(false)
    }
  }, [operaciones, garantiasOP, documentosOP])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const InfoCard = ({ title, value, icon: Icon, color = "primary", subtitle }) => (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.02)}, ${alpha(theme.palette[color].main, 0.01)})`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              width: { xs: 30, xl: 40 },
              height: { xs: 30, xl: 40 },
            }}
          >
            <Icon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 14, xl: 16 },
                fontWeight: 500,
                color: theme.palette.text.secondary,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, xl: 16 },
                fontWeight: 600,
                color: theme.palette.text.primary,
                wordBreak: "break-word",
                lineHeight: 1.3,
              }}
            >
              {value || "-"}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                  display: "block",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  const SectionHeader = ({ title, isExpanded, onToggle, icon: Icon }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        cursor: "pointer",
        borderRadius: 2,
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
        transition: "background-color 0.2s ease-in-out",
      }}
      onClick={onToggle}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <Icon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <IconButton
        sx={{
          transition: "transform 0.3s ease-in-out",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <ExpandMoreIcon />
      </IconButton>
    </Box>
  )

  const StatsCard = ({ title, value, subtitle, color = "primary", icon: Icon }) => (
    <Card
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].main, 0.05)})`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        textAlign: "center",
        p: 3,
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
          mx: "auto",
          mb: 2,
          backgroundColor: alpha(theme.palette[color].main, 0.1),
          color: theme.palette[color].main,
        }}
      >
        <Icon sx={{ fontSize: 28 }} />
      </Avatar>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette[color].main, mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Card>
  )

  if (isLoading) {
    return <OperationSkeleton />
  }

  if (!currentOperation) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" textAlign="center">
          Operación no encontrada
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs y Header */}
      <Box sx={{ mb: 4 }}>
        {/* <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/operaciones"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <HomeIcon fontSize="small" />
            Operaciones
          </Link>
          <Typography color="text.primary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AssignmentIcon fontSize="small" />
            {currentOperation.new_name}
          </Typography>
        </Breadcrumbs> */}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Tooltip title="Volver a operaciones" arrow>
            <IconButton
              onClick={() => router.push("/operaciones")}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {currentOperation.new_name}
            </Typography>
            {/* <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={currentOperation.statuscode || "Pendiente"}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip label={`ID: ${currentOperation.id}`} variant="outlined" size="small" />
            </Stack> */}
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <TabList
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minHeight: 64,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon />
                  {!isMobile && "Información General"}
                </Box>
              }
              value="0"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SecurityIcon />
                  {!isMobile && `Garantías (${filteredGarantias.length})`}
                </Box>
              }
              value="1"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DescriptionIcon />
                  {!isMobile && `Documentos (${filteredDocumentos.length})`}
                </Box>
              }
              value="2"
            />
          </TabList>
        </Box>

        {/* Panel 1: Información General */}
        <TabPanel value="0" sx={{ p: 0 }}>
          <Fade in={activeTab === "0"} timeout={300}>
            <Box>
              {/* Datos Generales */}
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <SectionHeader
                  title="Datos Generales"
                  icon={BusinessIcon}
                  isExpanded={expandedSections.general}
                  onToggle={() => toggleSection("general")}
                />
                <Collapse in={expandedSections.general}>
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="N° de Operación"
                          value={currentOperation.new_nrooperacion}
                          icon={AssignmentIcon}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Acreedor"
                          value={currentOperation.new_acreedor}
                          icon={PersonIcon}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Referido"
                          value={currentOperation.new_referido}
                          icon={PersonIcon}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Socio Protector"
                          value={currentOperation.new_socioprotector}
                          icon={SecurityIcon}
                          color="warning"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Destino de Fondos"
                          value={currentOperation.new_destinodefondo}
                          icon={TrendingUpIcon}
                          color="success"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Tipo de Operación"
                          value={currentOperation.new_tipooperacin}
                          icon={CreditCardIcon}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Tipo de Cheque"
                          value={currentOperation.new_tipodecheque}
                          icon={AccountBalanceIcon}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Producto Comercial"
                          value={currentOperation.new_productocomercial}
                          icon={BusinessIcon}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Tipo de Garantía"
                          value={currentOperation.new_tipogarantia}
                          icon={SecurityIcon}
                          color="warning"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <InfoCard
                          title="Monto de la Operación"
                          value={dollarFormatter.format(currentOperation.new_montodelaoperacion || 0)}
                          icon={AttachMoneyIcon}
                          color="success"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>

              {/* KPI Fechas */}
              <Card sx={{ borderRadius: 3 }}>
                <SectionHeader
                  title="KPI Fechas"
                  icon={CalendarTodayIcon}
                  isExpanded={expandedSections.kpi}
                  onToggle={() => toggleSection("kpi")}
                />
                <Collapse in={expandedSections.kpi}>
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          title="Fecha de Creación"
                          value={currentOperation.fechaCreacion_str ? currentOperation.fechaCreacion_str : ''}
                          icon={CalendarTodayIcon}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          title="Fecha de Instrumentación"
                          value={currentOperation.new_fechadeinstrumentacion ? currentOperation.new_fechadeinstrumentacion : ''}
                          icon={ScheduleIcon}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          title="Fecha de Envío"
                          value={currentOperation.new_fechadeenvio ? currentOperation.new_fechadeenvio : ''}
                          icon={CalendarTodayIcon}
                          color="success"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>
            </Box>
          </Fade>
        </TabPanel>

        {/* Panel 2: Garantías */}
        <TabPanel value="1" sx={{ p: 0 }}>
          <Fade in={activeTab === "1"} timeout={300}>
            <Box>
              {/* Stats de Garantías */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <StatsCard
                    title="Monto Total"
                    value={dollarFormatter.format(montoTotalGarantias)}
                    subtitle="Suma de todas las garantías"
                    color="success"
                    icon={AttachMoneyIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatsCard
                    title="Cantidad de Garantías"
                    value={filteredGarantias.length}
                    subtitle="Total de garantías registradas"
                    color="primary"
                    icon={SecurityIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatsCard
                    title="Promedio por Garantía"
                    value={
                      filteredGarantias.length > 0
                        ? dollarFormatter.format(montoTotalGarantias / filteredGarantias.length)
                        : "$0"
                    }
                    subtitle="Monto promedio"
                    color="info"
                    icon={TrendingUpIcon}
                  />
                </Grid>
              </Grid>

              {/* Tabla de Garantías */}
              {/* <Card sx={{ borderRadius: 3 }}> */}
              {/* <CardContent> */}
              <Box>
                <Table data={filteredGarantias} columns={COLUMNSGOPERACIONES} />
              </Box>

              {/* </CardContent> */}
              {/* </Card> */}
            </Box>
          </Fade>
        </TabPanel>

        {/* Panel 3: Documentos */}
        <TabPanel value="2" sx={{ p: 0 }}>
          <Fade in={activeTab === "2"} timeout={300}>
            {/* <Card sx={{ borderRadius: 3 }}>
              <CardContent> */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <DescriptionIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Documentación de la Operación
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredDocumentos.length} documentos encontrados
                  </Typography>
                </Box>
              </Box>
              <Table data={filteredDocumentos} columns={columns_adjuntos_operaciones} />
            </Box>
            {/* </CardContent>
            </Card> */}
          </Fade>
        </TabPanel>
      </TabContext>
    </Container>
  )
}

// Componente de skeleton para loading
const OperationSkeleton = () => (
  <Container maxWidth="xl" sx={{ py: 3 }}>
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>
      </Box>
    </Box>

    <Skeleton variant="rectangular" height={64} sx={{ mb: 3, borderRadius: 1 }} />

    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
  </Container>
)

export default IdOperacion
