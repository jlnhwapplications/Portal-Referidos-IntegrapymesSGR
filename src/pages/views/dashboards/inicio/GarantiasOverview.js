import { Card, CardContent, Typography, Box, Avatar, Button, Chip, Divider } from "@mui/material"
import { Garantias } from '@/context/GetGarantiasContex'
import { useContext } from 'react'
import { useTheme } from '@mui/material'
import {
  Security as SecurityIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"


const GarantiasOverview = () => {
  const { garantias } = useContext(Garantias);
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  // Función para obtener el ícono según el tipo de operación
  const getOperationIcon = (tipoOperacion) => {
    const tipo = tipoOperacion?.toLowerCase() || ""
    if (tipo.includes("hipoteca") || tipo.includes("inmueble")) {
      return "🏠"
    }
    if (tipo.includes("vehiculo") || tipo.includes("auto")) {
      return "🚗"
    }
    if (tipo.includes("maquinaria") || tipo.includes("equipo")) {
      return "⚙️"
    }
    if (tipo.includes("deposito") || tipo.includes("plazo")) {
      return "💰"
    }
    if (tipo.includes("aval") || tipo.includes("fianza")) {
      return "🤝"
    }
    return "📋"
  }

  // Función para obtener el color según el tipo de operación
  const getOperationColor = (tipoOperacion) => {
    const tipo = tipoOperacion?.toLowerCase() || ""
    if (tipo.includes("hipoteca") || tipo.includes("inmueble")) {
      return {
        color: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderColor: "rgba(139, 92, 246, 0.3)",
      }
    }
    if (tipo.includes("vehiculo") || tipo.includes("auto")) {
      return {
        color: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
      }
    }
    if (tipo.includes("maquinaria") || tipo.includes("equipo")) {
      return {
        color: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
      }
    }
    if (tipo.includes("deposito") || tipo.includes("plazo")) {
      return {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
      }
    }
    return {
      color: "#6B7280",
      backgroundColor: "rgba(107, 114, 128, 0.1)",
      borderColor: "rgba(107, 114, 128, 0.3)",
    }
  }

  // Función para formatear el monto
  const formatAmount = (amount) => {
    if (!amount) return "Sin especificar"
    // Asumiendo que el monto viene como número o string
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^\d.-]/g, "")) : amount
    if (isNaN(numAmount)) return amount
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount)
  }

  // Handler para ver más información
  const handleViewMore = (garantia) => {
    console.log("Ver más información de garantía:", garantia)
    // Aquí iría la lógica para abrir modal o navegar a detalle
  }

  // Handler para ver todas las garantías
  const handleViewAll = () => {
    console.log("Ver todas las garantías")
    // Aquí iría la lógica para navegar a la lista completa
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        width: "100%",
        background: isDark
          ? "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
        boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark ? "0 12px 40px rgba(0, 0, 0, 0.4)" : "0 12px 40px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main + "20",
                borderRadius: 3,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecurityIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                Garantías
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {garantias?.length > 0
                  ? `${Math.min(garantias?.length, 5)} de ${garantias?.length} garantías`
                  : "Sin garantías registradas"}
              </Typography>
            </Box>
          </Box>

          {/* {garantias?.length > 5 && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewAll}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: theme.palette.primary.main + "40",
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main + "10",
                  borderColor: theme.palette.primary.main + "60",
                },
              }}
            >
              Ver todas
            </Button>
          )} */}
        </Box>

        {/* Lista de garantías */}
        {garantias?.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {garantias.slice(0, 5).map((item, index) => {
              const operationEmoji = getOperationIcon(item.new_tipodeoperacion)
              const operationColors = getOperationColor(item.new_tipodeoperacion)

              return (
                <Box key={`${item.new_name}-${index}`}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {/* Avatar con emoji */}
                    <Avatar
                      sx={{
                        width: { xs: 30, xl: 40 },
                        height: { xs: 30, xl: 40 },
                        backgroundColor: operationColors.backgroundColor,
                        border: `2px solid ${operationColors.borderColor}`,
                        mr: 3,
                        fontSize: "1.3rem",
                      }}
                    >
                      {operationEmoji}
                    </Avatar>

                    {/* Información principal */}
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: 18, xl: 22 },
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: "1rem",
                          }}
                        >
                          {item.new_tipodeoperacion}
                        </Typography>
                        {/* <Chip
                          label="Activa"
                          size="small"
                          sx={{
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "#10B981",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        /> */}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <BusinessIcon sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: 12, xl: 14 },
                            fontWeight: 500,
                          }}
                        >
                          {item.new_acreedor}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* <MoneyIcon sx={{ color: theme.palette.success.main, fontSize: 16 }} /> */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.success.main,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {formatAmount(item.new_monto)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Botón de acción */}
                    {/* <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewMore(item)}
                      startIcon={<ViewIcon />}
                      sx={{
                        minWidth: 120,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Ver más
                    </Button> */}
                  </Box>

                  {/* Divider entre elementos (excepto el último) */}
                  {index < Math.min(garantias?.length, 5) - 1 && (
                    <Divider
                      sx={{ my: 2, borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" }}
                    />
                  )}
                </Box>
              )
            })}
          </Box>
        ) : (
          // Estado vacío
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 3,
            }}
          >
            <Box
              sx={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                borderRadius: "50%",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <SecurityIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.text.secondary,
                  opacity: 0.5,
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                mb: 1,
              }}
            >
              Sin Garantías Registradas
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 300,
                mx: "auto",
              }}
            >
              No tienes garantías registradas en este momento.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
    // <Card>
    //   <CardHeader
    //     title='Garantias'
    //     titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
    //   />
    //   <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
    //     {
    //       garantias?.length > 0 ? (
    //         garantias.slice(0, 5).map((item, index) => {
    //           return (
    //             <Box
    //               key={item.new_name}
    //               sx={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 ...(index !== garantias.slice(0, 5).length - 1 ? { mb: 6.25 } : {})
    //               }}
    //             >
    //               <Box
    //                 sx={{
    //                   width: '100%',
    //                   display: 'flex',
    //                   flexWrap: 'wrap',
    //                   alignItems: 'center',
    //                   justifyContent: 'space-between'
    //                 }}
    //               >
    //                 <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column' }}>
    //                   <Box sx={{ display: 'flex' }}>
    //                     <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}> {item.new_tipodeoperacion}</Typography>
    //                   </Box>
    //                   <Typography variant='body2' sx={{ lineHeight: 1.5, fontWeight: '600' }}>
    //                     {item.new_acreedor}
    //                   </Typography>
    //                 </Box>

    //                 <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
    //                   <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px', color: 'success' }}>
    //                     {item.new_monto_value}
    //                   </Typography>
    //                   <Typography variant='body2' sx={{ lineHeight: 1.5, fontWeight: '600' }}>
    //                     Monto
    //                   </Typography>
    //                 </Box>
    //               </Box>
    //             </Box>
    //           )
    //         })
    //       ) : (
    //         <Typography variant='body2' sx={{ lineHeight: 1.5, fontWeight: '600' }}>
    //           No hay registros para mostrar
    //         </Typography>
    //       )
    //     }
    //   </CardContent>
    // </Card>
  )
}

export default GarantiasOverview
