import { useState, useEffect, useContext } from "react"
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  Paper,
  Stack,
  CircularProgress,
  Container,
  alpha,
} from "@mui/material"
import MuiTabList from "@mui/lab/TabList"
import Tab from "@mui/material/Tab"
import TabPanel from "@mui/lab/TabPanel"
import TabContext from "@mui/lab/TabContext"
import {
  AccountCircle as AccountCircleIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material"
import PerfilHeader from "./PerfilHeader"
import PerfilInfo from "./PerfilInfo"
import TablaRelaciones from "./TablaRelaciones"
import TablaSociedadBolsa from "./TablaSociedadBolsa"
import TablaComprobanteDeVenta from "./TablaComprobanteDeVenta"
import TablaCertificadosPymes from "./TablaCertificadosPymes"
import { AuthContext } from "@/context/AuthContext" // Asegúrate de que esta ruta sea correcta
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const StyledTabList = styled(MuiTabList)(({ theme }) => ({
  minHeight: { xs: 56, sm: 64, md: 72 },
  "& .MuiTabs-flexContainer": {
    height: "100%",
  },
  "& .MuiTab-root": {
    fontWeight: "bold",
    textTransform: "none",
    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
    minHeight: { xs: 56, sm: 64, md: 72 },
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 1.5, sm: 2, md: 2.5 },
    color: theme.palette.mode === "dark" ? "#b0b0b0" : "text.secondary",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius, // Bordes redondeados para cada tab
    margin: theme.spacing(0.5), // Espacio entre tabs
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover": {
      color: theme.palette.mode === "dark" ? "#90caf9" : "primary.main",
      transform: "translateY(-2px)",
      "&::before": {
        opacity: 1,
      },
    },
    "&.Mui-selected": {
      color: theme.palette.mode === "dark" ? "#64b5f6" : "primary.main",
      fontWeight: "black",
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(66, 165, 245, 0.1) 100%)"
          : "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "inset 0 2px 8px rgba(100, 181, 246, 0.2)"
          : "inset 0 2px 8px rgba(25, 118, 210, 0.1)",
      "&::before": {
        opacity: 1,
      },
    },
  },
  "& .MuiTabs-indicator": {
    display: "none", // Oculta el indicador por defecto
  },
}))

const AnimatedTabPanel = ({ children, value, index, ...other }) => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    if (value === index) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100) // Pequeño retraso para la animación
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [value, index])

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(20px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        pt: 3, // Padding top para el contenido del panel
      }}
      {...other}
    >
      {value === index && children}
    </Box>
  )
}

const Perfil = () => {
  const { referido, loadingCuenta } = useContext(AuthContext) // Asumiendo que AuthContext provee loadingCuenta
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const hideText = useMediaQuery(theme.breakpoints.down("sm"))

  const [activeTab, setActiveTab] = useState("general")

  const tabContentList = {
    general: <PerfilInfo data={referido} loadingCuenta={loadingCuenta} />,
    relaciones: <TablaRelaciones />,
    certificadosPymes: <TablaCertificadosPymes />,
    sociedadBolsa: <TablaSociedadBolsa />,
    comprobanteVenta: <TablaComprobanteDeVenta />,
  }

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Grid item xs={12}>
          <PerfilHeader />
        </Grid>

        {loadingCuenta ? (
          <Box sx={{ mt: 6, display: "flex", alignItems: "center", flexDirection: "column" }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography variant="h6" color="text.secondary">
              Cargando perfil...
            </Typography>
          </Box>
        ) : (
          <Grid item xs={12}>
            <TabContext value={activeTab}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* <Paper
                    elevation={isDark ? 6 : 4}
                    sx={{
                      bgcolor: isDark ? "#1a1a1a" : "background.paper",
                      border: isDark ? "1px solid #333333" : "none",
                      borderRadius: 3,
                      overflow: "hidden",
                      background: isDark
                        ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    }}
                  > */}
                  <Box>


                    <StyledTabList
                      variant="scrollable"
                      scrollButtons="auto"
                      onChange={handleChange}
                      aria-label="profile tabs"
                    >
                      <Tab
                        value="general"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountCircleIcon fontSize="small" />
                            {!hideText && "General"}
                          </Box>
                        }
                      />
                      <Tab
                        value="relaciones"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupIcon fontSize="small" />
                            {!hideText && "Vinculaciones"}
                          </Box>
                        }
                      />
                      <Tab
                        value="certificadosPymes"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <WorkspacePremiumIcon fontSize="small" />
                            {!hideText && "Certificados Pymes"}
                          </Box>
                        }
                      />
                      <Tab
                        value="sociedadBolsa"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <BusinessIcon fontSize="small" />
                            {!hideText && "Sociedad de Bolsa"}
                          </Box>
                        }
                      />
                      <Tab
                        value="comprobanteVenta"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ReceiptIcon fontSize="small" />
                            {!hideText && "Comprobante de Venta"}
                          </Box>
                        }
                      />
                    </StyledTabList>
                  </Box>
                  {/* </Paper> */}
                </Grid>
                <Grid item xs={12}>
                  <AnimatedTabPanel value={activeTab} index="general">
                    {tabContentList.general}
                  </AnimatedTabPanel>
                  <AnimatedTabPanel value={activeTab} index="relaciones">
                    {tabContentList.relaciones}
                  </AnimatedTabPanel>
                  <AnimatedTabPanel value={activeTab} index="certificadosPymes">
                    {tabContentList.certificadosPymes}
                  </AnimatedTabPanel>
                  <AnimatedTabPanel value={activeTab} index="sociedadBolsa">
                    {tabContentList.sociedadBolsa}
                  </AnimatedTabPanel>
                  <AnimatedTabPanel value={activeTab} index="comprobanteVenta">
                    {tabContentList.comprobanteVenta}
                  </AnimatedTabPanel>
                </Grid>
              </Grid>
            </TabContext>
          </Grid>
        )}
      </Stack>
    </Container>
  )
}

export default Perfil
