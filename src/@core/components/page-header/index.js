// ** MUI Imports
import Grid from '@mui/material/Grid'

// const PageHeader = props => {
//   // ** Props
//   const { title, subtitle } = props

//   return (
//     <Grid item xs={12} sx={{ m: 0, p: 0 }}>
//       {title}
//       {subtitle || null}
//     </Grid>
//   )
// }

// export default PageHeader


import { Box, Typography, Divider, Breadcrumbs, Link, useTheme, alpha } from "@mui/material"
import { NavigateNext } from "@mui/icons-material"
import NextLink from "next/link"

// Componente principal profesional y minimalista
export default function PageHeader({
  title,
  subtitle = null,
  breadcrumbs = null,
  action = null,
  variant = "default", // default, minimal, compact
  showDivider = true,
  sx = {},
  ...props
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  // Estilos base profesionales
  const getContainerStyles = () => {
    const baseStyles = {
      mb: { xs: 2, sm: 3, md: 4 },
      ...sx,
    }

    switch (variant) {
      case "minimal":
        return {
          ...baseStyles,
          mb: { xs: 1, sm: 1.5, md: 2 },
        }
      case "compact":
        return {
          ...baseStyles,
          mb: { xs: 0.80, sm: 1, md: 1.5 },
        }
      default:
        return baseStyles
    }
  }

  const getTitleStyles = () => {
    const baseStyles = {
      fontWeight: 600,
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
      color: "text.primary",
    }

    switch (variant) {
      case "minimal":
        return {
          ...baseStyles,
          variant: "h5",
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }
      case "compact":
        return {
          ...baseStyles,
          variant: "h6",
          fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
        }
      default:
        return {
          ...baseStyles,
          variant: "h4",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
        }
    }
  }

  const getSubtitleStyles = () => ({
    variant: variant === "compact" ? "body2" : "body1",
    color: "text.secondary",
    fontWeight: 400,
    lineHeight: 1.5,
    mt: variant === "compact" ? 0.5 : 1,
    maxWidth: { xs: "100%" },
  })

  return (
    <Box sx={getContainerStyles()} {...props}>
      {/* Breadcrumbs opcionales */}
      {breadcrumbs && (
        <Box >
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-separator": {
                color: "text.disabled",
              },
              "& .MuiBreadcrumbs-li": {
                fontSize: "0.875rem",
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1

              if (isLast) {
                return (
                  <Typography
                    key={crumb.label}
                    color="text.secondary"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {crumb.icon}
                    {crumb.label}
                  </Typography>
                )
              }

              return (
                <Link
                  key={crumb.label}
                  component={NextLink}
                  href={crumb.href}
                  underline="hover"
                  sx={{
                    color: "text.disabled",
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "text.secondary",
                    },
                  }}
                >
                  {crumb.icon}
                  {crumb.label}
                </Link>
              )
            })}
          </Breadcrumbs>
        </Box>
      )}

      {/* Header principal */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: variant === "compact" ? "flex-start" : "flex-start",
          flexDirection: { xs: "column", sm: action ? "row" : "column" },
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Contenido del título */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography {...getTitleStyles()}>{title}</Typography>
          {subtitle && <Typography {...getSubtitleStyles()}>{subtitle}</Typography>}
        </Box>

        {/* Acción opcional */}
        {action && (
          <Box
            sx={{
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: variant === "compact" ? "center" : "flex-start" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            {action}
          </Box>
        )}
      </Box>

      {/* Divider opcional */}
      {showDivider && (
        <Divider
          sx={{
            mt: variant === "compact" ? 1.5 : 2,
            borderColor: isDark ? alpha("#ffffff", 0.08) : alpha("#000000", 0.08),
          }}
        />
      )}
    </Box>
  )
}
