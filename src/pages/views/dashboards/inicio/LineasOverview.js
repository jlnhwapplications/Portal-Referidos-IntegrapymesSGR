import { Card, CardContent, Typography, Box, Avatar, Chip, Divider, LinearProgress, useTheme } from "@mui/material"
import CustomAvatar from 'src/@core/components/mui/avatar'
import useGetLimites from '@/hooks/useGetLimites'
import {
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  Inventory as InventoryIcon,
  AccountBalanceWallet as WalletIcon,
} from "@mui/icons-material"

const LineasOverview = () => {
  const { limitesInicio } = useGetLimites()
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  // Formatear moneda
  const formatCurrency = (amount, currency = "ARS") => {
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

  // Función para obtener el ícono según el tipo de operación
  const getOperationIcon = (tipoOperacion) => {
    const tipo = tipoOperacion?.toString() || ""
    switch (tipo) {
      case "100000000": // Línea general
        return AccountBalanceIcon
      case "100000001": // Tarjeta de crédito
        return CreditCardIcon
      case "100000002": // Préstamo hipotecario
        return HomeIcon
      case "100000003": // Préstamo automotor
        return CarIcon
      case "100000004": // Préstamo comercial
        return BusinessIcon
      case "100000005": // Línea de inventario
        return InventoryIcon
      default:
        return WalletIcon
    }
  }

  // Función para obtener el color según el tipo de operación
  const getOperationColor = (tipoOperacion) => {
    const tipo = tipoOperacion?.toString() || ""
    switch (tipo) {
      case "100000000": // Línea general
        return {
          color: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "rgba(59, 130, 246, 0.3)",
        }
      case "100000001": // Tarjeta de crédito
        return {
          color: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderColor: "rgba(139, 92, 246, 0.3)",
        }
      case "100000002": // Préstamo hipotecario
        return {
          color: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.3)",
        }
      case "100000003": // Préstamo automotor
        return {
          color: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "rgba(245, 158, 11, 0.3)",
        }
      case "100000004": // Préstamo comercial
        return {
          color: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "rgba(239, 68, 68, 0.3)",
        }
      default:
        return {
          color: "#6B7280",
          backgroundColor: "rgba(107, 114, 128, 0.1)",
          borderColor: "rgba(107, 114, 128, 0.3)",
        }
    }
  }

  // Función para obtener el nombre legible del tipo de operación
  const getOperationName = (tipoOperacion) => {
    const tipo = tipoOperacion?.toString() || ""
    switch (tipo) {
      case "100000000":
        return "Línea General"
      case "100000001":
        return "Tarjeta de Crédito"
      case "100000002":
        return "Préstamo Hipotecario"
      case "100000003":
        return "Préstamo Automotor"
      case "100000004":
        return "Préstamo Comercial"
      case "100000005":
        return "Línea de Inventario"
      default:
        return "Línea de Crédito"
    }
  }

  // Función para obtener el estado de la línea (simulado)
  const getLineStatus = (disponible, limite = 100000) => {
    const percentage = (disponible / limite) * 100
    if (percentage > 70) return { status: "Excelente", color: "#10B981" }
    if (percentage > 40) return { status: "Bueno", color: "#F59E0B" }
    if (percentage > 10) return { status: "Limitado", color: "#F97316" }
    return { status: "Crítico", color: "#EF4444" }
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
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
            <CreditCardIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: 18, xl: 22 },
                color: theme.palette.text.primary,
                mb: 0.5,
                lineHeight: "1.2",
                letterSpacing: "0.31px",
              }}
            >
              Límites por línea
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: 12, xl: 14 }, }}>
              {limitesInicio?.length > 0
                ? `${limitesInicio?.length === 1 ? "Úlitma Línea" : `Últimas ${limitesInicio?.length} líneas`}`
                : "Sin líneas registradas"}
            </Typography>
          </Box>
        </Box>

        {/* Lista de líneas */}
        {limitesInicio?.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {limitesInicio?.map((item, index) => {
              const OperationIcon = getOperationIcon(item.new_lineatipodeoperacion)
              const operationColors = getOperationColor(item.new_lineatipodeoperacion)
              const operationName = getOperationName(item.new_lineatipodeoperacion)

              // Determinar el monto y etiqueta según el tipo
              const isGeneral = item.new_lineatipodeoperacion == 100000000
              const amount = isGeneral
                ? item.new_montodisponiblegeneral
                : item.new_montodisponibleporoperacion
              const amountLabel = isGeneral ? "Monto Disponible" : "Monto Disponible"

              // Simular estado de la línea
              const lineStatus = getLineStatus(amount)

              return (
                <Box key={`${item.new_lineatipodeoperacion}-${index}`}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 3,
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
                    {/* Avatar con ícono */}
                    <Avatar
                      sx={{
                        width: { xs: 36, xl: 46 },
                        height: { xs: 36, xl: 46 },
                        backgroundColor: operationColors.backgroundColor,
                        border: `2px solid ${operationColors.borderColor}`,
                        mr: 3,
                      }}
                    >
                      <OperationIcon sx={{ color: operationColors.color, fontSize: 28 }} />
                    </Avatar>

                    {/* Información principal */}
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: 14, xl: 16 },
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            letterSpacing: "0.25px",
                          }}
                        >
                          {item.new_lineatipodeoperacion} - {item.new_tipochpd || ""}
                        </Typography>
                        {/* <Chip
                          label={lineStatus.status}
                          size="small"
                          sx={{
                            backgroundColor: `${lineStatus.color}20`,
                            color: lineStatus.color,
                            border: `1px solid ${lineStatus.color}40`,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        /> */}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 600,
                          lineHeight: 1.5,
                          mb: 1,
                        }}
                      >
                        {item._transactioncurrencyid_value || "Moneda no especificada"}
                      </Typography>

                      {/* Barra de progreso simulada */}
                      {/* <LinearProgress
                        variant="determinate"
                        value={Math.min((amount / 100000) * 100, 100)} // Simulado
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: operationColors.color,
                            borderRadius: 2,
                          },
                        }}
                      /> */}
                    </Box>

                    {/* Monto disponible */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        minWidth: 160,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: operationColors.color,
                          fontSize: { xs: 12, xl: 14 },
                          lineHeight: 1.2,
                          letterSpacing: "0.22px",
                          mb: 0.5,
                          color: theme.palette.success.main,
                        }}
                      >
                        {formatCurrency(amount)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 600,
                          lineHeight: 1.2,
                          textAlign: "right",
                          fontSize: "0.75rem",
                        }}
                      >
                        {amountLabel}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <TrendingUpIcon
                          sx={{
                            color: operationColors.color,
                            fontSize: 16,
                            mr: 0.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: operationColors.color,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        >
                          Disponible
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Divider entre elementos (excepto el último) */}
                  {index < limitesInicio.length - 1 && (
                    <Divider
                      sx={{
                        my: 2,
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                      }}
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
              <CreditCardIcon
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
              No hay líneas registradas
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 300,
                mx: "auto",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              No hay registros para mostrar en este momento.
            </Typography>
          </Box>
        )}

        {/* Resumen inferior */}
        {/* {limites?.length > 0 && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Total de líneas activas
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                }}
              >
                {limites?.length}
              </Typography>
            </Box>
          </Box>
        )} */}
      </CardContent>
    </Card>
    // <Card>
    //   <CardHeader
    //     title='Lineas'
    //     titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
    //   />
    //   <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
    //     {
    //       limites?.length > 0 ? (
    //         limites.map((item, index) => {
    //           return (
    //             <Box
    //               key={item.title}
    //               sx={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 ...(index !== limites.length - 1 ? { mb: 6.25 } : {})
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
    //                     <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>{item.new_lineatipodeoperacion}</Typography>
    //                   </Box>
    //                   <Typography variant='body2' sx={{ lineHeight: 1.5, fontWeight: 600 }}>
    //                     {item._transactioncurrencyid_value}
    //                   </Typography>
    //                 </Box>
    //                 {
    //                   item.new_lineatipodeoperacion == 100000000 ?
    //                     <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
    //                       <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
    //                         {item.new_montodisponiblegeneral_value}
    //                       </Typography>
    //                       <Typography variant='caption' sx={{ lineHeight: 1.5, fontWeight: '600' }}>
    //                         Monto Disponible General
    //                       </Typography>
    //                     </Box>
    //                     :
    //                     <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
    //                       <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
    //                         {item.new_montodisponibleporoperacion_value}
    //                       </Typography>
    //                       <Typography variant='caption' sx={{ lineHeight: 1.5, fontWeight: '600' }}>
    //                         Monto Disp. por Operación
    //                       </Typography>
    //                     </Box>
    //                 }
    //               </Box>
    //             </Box>
    //           )
    //         })
    //       ) :
    //         <Typography variant='body2' sx={{ lineHeight: 1.5, fontWeight: '600' }}>
    //           No hay registros para mostrar
    //         </Typography>
    //     }
    //   </CardContent>
    // </Card>
  )
}

export default LineasOverview
