"use client"

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Chip,
  useTheme,
  alpha,
} from "@mui/material"
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Mail as MailIcon,
  CreditCard as CreditCardIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
} from "@mui/icons-material"
import { useEffect } from "react"

const RelationshipCard = ({ relationship, onEdit, onDelete, onView, index }) => {
  const theme = useTheme()

  const getRelationshipIcon = (type) => {
    switch (type) {
      case "Socio":
      case "Director":
      case "Apoderado":
        return PersonIcon
      case "Empresa Vinculada":
        return BusinessIcon
      default:
        return LinkIcon
    }
  }

  const IconComponent = getRelationshipIcon(relationship.new_tipoderelacion_value)

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        },
        opacity: 0,
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
        "@keyframes fadeInUp": {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 48,
              height: 48,
            }}
          >
            <IconComponent sx={{ fontSize: 24 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.3 }}>
              {relationship._new_cuentacontactovinculado_value || "N/A"}
            </Typography>
            <Chip
              label={relationship.new_tipoderelacion_value || "Relación Desconocida"}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5, fontWeight: 500 }}
            />
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 2, flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CreditCardIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            {
              relationship.accountid ?
                (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      CUIT/CUIL:{" "}
                      <Typography component="span" variant="body2" color="text.primary" fontWeight={500}>
                        {relationship.cuenta_new_nmerodedocumento || "N/A"}
                      </Typography>
                    </Typography>
                  </>
                ) :
                (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      CUIT/CUIL:{" "}
                      <Typography component="span" variant="body2" color="text.primary" fontWeight={500}>
                        {relationship.new_cuitcuil || "N/A"}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      DNI:{" "}
                      <Typography component="span" variant="body2" color="text.primary" fontWeight={500}>
                        {relationship.new_nrodedocumento || "N/A"}
                      </Typography>
                    </Typography>
                  </>
                )
            }
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MailIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            {
              relationship.accountid ?
                (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Email:{" "}
                      <Typography component="span" variant="body2" color="text.primary" fontWeight={500}>
                        {relationship.cuenta_email || "N/A"}
                      </Typography>
                    </Typography>
                  </>
                ) :
                (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Email:{" "}
                      <Typography component="span" variant="body2" color="text.primary" fontWeight={500}>
                        {relationship.emailaddress1 || "N/A"}
                      </Typography>
                    </Typography>
                  </>
                )
            }
          </Box>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          {/* <Tooltip title="Ver detalles" arrow>
            <IconButton
              size="small"
              onClick={() => onView?.(relationship)}
              sx={{
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.info.main, 0.2),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Editar relación" arrow>
            <IconButton
              size="small"
              onClick={() => onEdit?.(relationship)}
              sx={{
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.warning.main, 0.2),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar relación" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete?.(relationship)}
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RelationshipCard
