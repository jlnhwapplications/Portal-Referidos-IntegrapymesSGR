// import { Box, CircularProgress, Grid, LinearProgress, Tab, Typography, useTheme } from "@mui/material";
import { Box, useTheme, Container, Grid, Typography, IconButton, Button, Chip, Skeleton, Fade, Card, CardContent, Avatar, alpha } from "@mui/material"
import {
  Security,
  CheckCircle,
  AccountBalance,
  Build,
  Warning,
  Shield,
  CloudUpload,
  Assignment,
  FilterList,
  Add,
  CreditCard,
  TrendingDown,
} from "@mui/icons-material"
import React, { useContext, useMemo, useState } from "react";
import TablaGarantia from "../views/garantias/TablaGarantia";
import GraficoBarraApex from "@/@core/components/graficos/GraficoBarraApex";
import GraficoDonaApex from "@/@core/components/graficos/GraficoDonaApex";
import PageHeader from "@/@core/components/page-header";
import { columns_garantias, columns_garantias_mejoradas, columns_garantias_mejoradas_estado } from "@/columns/columnsGarantias";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Garantias } from "@/context/GetGarantiasContex";
import TablaCargaMasiva from "../views/garantias/TablaCargaMasiva";
import GarantiasTabs, { GarantiasStatsBar, TabPanel } from "./GarantiasTabs";
import GarantiasStatsCards from "./GarantiasStatsCards";

const GarantiaIndex = () => {
  const { garantias, estadoGarantias, loadingGarantias } = useContext(Garantias);
  
  const [value, setValue] = useState("0");
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleChangeTabs = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleCardClick = (cardId) => {
    console.log(`Card clicked: ${cardId}`)
    // Aquí puedes implementar la lógica para filtrar o navegar
    switch (cardId) {
      case "total":
        setActiveTab("0")
        break
      case "vigentes":
        setActiveTab("3")
        break
      case "vencidas":
        setActiveTab("4")
        break
      default:
        break
    }
  }

  const total = garantias?.reduce((acumulador, garantia) => {
    // aseguramos que new_monto sea número
    const monto = Number(garantia.new_monto) || 0;
    return acumulador + monto;
  }, 0);
  
  // Filtrar garantías por estado para cada pestaña
  const filteredGarantias = useMemo(() => {
    switch (activeTab) {
      case 0: // Todas las garantías
        return garantias
      case 3: // Vigentes (statuscode == 100000001)
        return garantias?.filter((item) => item.statuscode === 100000001)
      case 1: // En Cartera (statuscode == 100000004)
        return garantias?.filter((item) => item.statuscode === 100000004)
      case 2: // En Gestión (statuscode == 1)
        return garantias?.filter((item) => item.statuscode === 1)
      case 4: // Vencidas (statuscode == 100000000)
        return garantias?.filter((item) => item.statuscode === 100000000)
      case 5: // Afrontadas (statuscode == 100000002)
        return garantias?.filter((item) => item.statuscode === 100000002)
      default:
        return garantias
    }
  }, [garantias, activeTab])

  // Datos de ejemplo para contadores
  const garantiasCounts = {
    total: garantias?.length,
    vigentes: garantias?.filter((item) => item.statuscode === 100000001)?.length,
    cartera: garantias?.filter((item) => item.statuscode === 100000004)?.length,
    gestion: garantias?.filter((item) => item.statuscode === 1)?.length,
    vencidas: garantias?.filter((item) => item.statuscode === 100000000)?.length,
    afrontadas: garantias?.filter((item) => item.statuscode === 100000002)?.length,
    cargaMasiva: 0,
  }

  // Datos de ejemplo para estadísticas
  const statsData = {
    total: garantias?.length,
    montoTotal: total,
    vigentes: garantias?.filter((item) => item.statuscode === 100000001)?.length,
    vencidas: garantias?.filter((item) => item.statuscode === 100000000)?.length,
  }

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
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" flexDirection={"row"} gap={2} height="100%">
          <Box>
            <Avatar
              sx={{
                backgroundColor: alpha(theme.palette[color].main, 0.1),
                color: theme.palette[color].main,
                width: {xs: 40, xl: 56},
                height: {xs: 40, xl: 56},
              }}
            >
              <Icon sx={{ fontSize: {xs: 18, xl: 28}  }} />
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
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center" sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: {xs: 22, xl: 26},
                fontWeight: 700,
                color: theme.palette[color].main,
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                fontSize: {xs: 18, xl: 20},
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                sx={{
                  fontSize: {xs: 12, xl: 14},
                  color: theme.palette.text.secondary,
                  lineHeight: 1.4,
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

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Mís Garantías"
        subtitle="Administración completa del portafolio de garantías"
        variant="compact"
      />
      <Box sx={{ py: 3 }}>
        {/* <GarantiasStatsCards stats={statsData} loading={loading} onCardClick={handleCardClick} /> */}
        <Fade in timeout={600}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Total Garantías"
                value={statsData.total || 0}
                subtitle="Garantías registradas"
                icon={CreditCard}
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Monto Total"
                value={statsData.montoTotal ? `$${(statsData.montoTotal / 1000000).toFixed(1)}M` : "$0"}
                subtitle="Valor total en garantías"
                icon={AccountBalance}
                color="success"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Vigentes"
                value={statsData.vigentes || 0}
                subtitle="Garantías activas y válidas"
                icon={CheckCircle}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Vencidas"
                value={statsData.vencidas || 0}
                subtitle="Garantías fuera de vigencia"
                icon={Security}
                color="info"
              />
            </Grid>
          </Grid>
        </Fade>
        <GarantiasTabs
          activeTab={activeTab}
          handleChangeTabs={handleChangeTabs}
          garantiasCounts={garantiasCounts}
        >
          {/* Contenido de cada tab */}
          <TabPanel value={activeTab} index={0}>
            {/* Contenido para "Todas las Garantías" */}
            <Box sx={{ borderRadius: 4, }}>
              <Grid container spacing={4} sx={{ borderRadius: 10, }}>
                <Grid item xs={12} sx={{ borderRadius: 10, }}>
                  <TablaGarantia garantias={garantias}
                    columnas={columns_garantias_mejoradas}
                    loadingGarantias={loadingGarantias} />
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            {/* Contenido para "Vigentes" */}
            <Box>
              <TablaGarantia
                garantias={filteredGarantias}
                columnas={columns_garantias_mejoradas_estado}
                loadingGarantias={loadingGarantias}
              />
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            {/* Contenido para "En Cartera" */}
            <Box>
              <TablaGarantia
                garantias={filteredGarantias}
                columnas={columns_garantias_mejoradas_estado}
                loadingGarantias={loadingGarantias}
              />
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            {/* Contenido para "En Gestión" */}
            <Box>
              <TablaGarantia
                garantias={filteredGarantias}
                columnas={columns_garantias_mejoradas_estado}
                loadingGarantias={loadingGarantias}
              />
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={4}>
            {/* Contenido para "Vencidas" */}
            <Box>
              <TablaGarantia
                garantias={filteredGarantias}
                columnas={columns_garantias_mejoradas_estado}
                loadingGarantias={loadingGarantias}
              />
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={5}>
            {/* Contenido para "Afrontadas" */}
            <Box>
              <TablaGarantia
                garantias={filteredGarantias}
                columnas={columns_garantias_mejoradas_estado}
                loadingGarantias={loadingGarantias}
              />
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={6}>
            {/* Contenido para "Carga Masiva" */}
            <Box>
              <TablaCargaMasiva />
              {/* <TablaGarantia
                garantias={filteredGarantias}
                columnas={columns_garantias_mejoradas_estado}
              /> */}
            </Box>
          </TabPanel>
        </GarantiasTabs>
        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} md={12} xl={6}>
            {
              !loadingGarantias ?
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {/* <CircularProgress /> */}
                    <Skeleton variant="rounded" animation="wave" width="100%" height={180} />
                  </Box>
                </Grid> : <GraficoBarraApex datos={estadoGarantias} titulo="Estadios de las Garantías" />
            }
          </Grid>
          <Grid item xs={12} md={12} xl={6}>
            {
              !loadingGarantias ?
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {/* <CircularProgress /> */}
                    <Skeleton variant="rounded" animation="wave" width="100%" height={180} />
                  </Box>
                </Grid> : <GraficoDonaApex datos={estadoGarantias} titulo="Estadios de las Garantías" />
            }
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GarantiaIndex;
