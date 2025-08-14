// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'
import useGetRelaciones from '@/hooks/useGetRelaciones'
import { useTheme } from '@emotion/react'
import {
  AccountTree as AccountTreeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Link as LinkIcon,
  Percent as PercentIcon,
} from "@mui/icons-material"
import { Avatar, Chip, Pagination } from '@mui/material'
import { useMemo, useState } from 'react'

const RelacionesOverview = () => {
  const { relaciones } = useGetRelaciones()
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [page, setPage] = useState(1)
  const rowsPerPage = 4 // Mostrar 4 relaciones por página

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const paginatedRelaciones = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return relaciones?.slice(startIndex, endIndex)
  }, [relaciones, page, rowsPerPage])

  const totalPages = Math.ceil(relaciones?.length / rowsPerPage)


  // Función para obtener el ícono según el tipo de relación
  const getRelationIcon = (tipoRelacion) => {
    const tipo = tipoRelacion?.toLowerCase() || ""
    if (tipo.includes("socio") || tipo.includes("accionista")) {
      return BusinessIcon
    }
    if (tipo.includes("representante") || tipo.includes("apoderado")) {
      return PersonIcon
    }
    if (tipo.includes("grupo") || tipo.includes("holding")) {
      return GroupIcon
    }
    return LinkIcon
  }

  // Función para obtener el color según el tipo de relación
  const getRelationColor = (tipoRelacion) => {
    const tipo = tipoRelacion?.toLowerCase() || ""
    if (tipo.includes("socio") || tipo.includes("accionista")) {
      return {
        color: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
      }
    }
    if (tipo.includes("representante") || tipo.includes("apoderado")) {
      return {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
      }
    }
    if (tipo.includes("grupo") || tipo.includes("holding")) {
      return {
        color: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderColor: "rgba(139, 92, 246, 0.3)",
      }
    }
    return {
      color: "#F59E0B",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.3)",
    }
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
            <AccountTreeIcon sx={{ color: theme.palette.primary.main, fontSize: { xs: 18, xl: 28 }, }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 18, xl: 22 },
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Relaciones de Vinculación
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: 14, xl: 16 }, }}>
              {relaciones?.length} {relaciones?.length === 1 ? "relación registrada" : "relaciones registradas"}
            </Typography>
          </Box>
        </Box>

        {/* Lista de relaciones */}
        {paginatedRelaciones?.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {paginatedRelaciones.map((item, index) => {
              const RelationIcon = getRelationIcon(item.new_tipoderelacion_value)
              const relationColors = getRelationColor(item.new_tipoderelacion_value)

              return (
                <Box
                  key={`${item._new_cuentacontactovinculado_value}-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: { xs: 2, xl: 3 },
                    py: { xs: 2, xl: 3 },
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
                      width: { xs: 30, xl: 38 },
                      height: { xs: 30, xl: 38 },
                      backgroundColor: relationColors.backgroundColor,
                      border: `2px solid ${relationColors.borderColor}`,
                      mr: 3,
                    }}
                  >
                    <RelationIcon sx={{ color: relationColors.color, fontSize: { xs: 18, xl: 22 } }} />
                  </Avatar>

                  {/* Información principal */}
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                        fontSize: { xs: 14, xl: 18 }
                      }}
                    >
                      {item._new_cuentacontactovinculado_value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        icon={<RelationIcon sx={{ fontSize: "16px !important" }} />}
                        label={item.new_tipoderelacion_value}
                        size="small"
                        sx={{
                          backgroundColor: relationColors.backgroundColor,
                          color: relationColors.color,
                          border: `1px solid ${relationColors.borderColor}`,
                          fontWeight: 600,
                          fontSize: { xs: 14, xl: 18 },
                          "& .MuiChip-icon": {
                            color: relationColors.color,
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Porcentaje de participación (si existe) */}
                  {item.new_porcentajedeparticipacion && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 80,
                      }}
                    >
                      {/* <Box
                        sx={{
                          backgroundColor: theme.palette.primary.main + "20",
                          borderRadius: 2,
                          p: 1,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PercentIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </Box> */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          fontSize: "1.1rem",
                        }}
                      >
                        {item.new_porcentajedeparticipacion}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.7rem",
                          textAlign: "center",
                        }}
                      >
                        Participación
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, p: 0, mx: 0 }}>
                <Pagination
                  count={totalPages} page={page} onChange={handleChangePage} color="primary" size="large" />
              </Box>
            )}
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
              <AccountTreeIcon
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
              Sin Relaciones Registradas
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 300,
                mx: "auto",
              }}
            >
              {relaciones?.length === 0
                ? "No hay relaciones de vinculación registradas para esta cuenta en este momento."
                : "No hay más relaciones en esta página."}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RelacionesOverview
