import { alpha, Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from "@mui/material"
import Link from "next/link";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import React, { useContext, useState } from 'react'
import { AuthContext } from "@/context/AuthContext";
import DescargarNota from "@/@core/components/table/DescargarNota";
import { AttachMoney } from "@mui/icons-material";
let dollarUS = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Componente para mostrar montos formateados
function MoneyCell({ amount, currency = "USD", subtitle = null }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const formatCurrency = (amount, currency) => {
    if (!amount && amount !== 0) return "N/A"

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    return formatter.format(amount)
  }

  const getAmountColor = (amount) => {
    if (!amount || amount === 0) return "text.secondary"
    if (amount > 1000000) return isDark ? "#66bb6a" : "#2e7d32" // Verde para montos altos
    if (amount > 100000) return isDark ? "#64b5f6" : "#1976d2" // Azul para montos medios
    return "text.primary" // Color normal para montos bajos
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: "success.main",
        }}
      >
        <AttachMoney fontSize="small" />
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: getAmountColor(amount),
            lineHeight: 1.4,
            fontSize: "0.875rem",
            fontFamily: "monospace",
          }}
        >
          {formatCurrency(amount, currency)}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

// Componente para celdas de texto mejoradas
function EnhancedTextCell({ value, subtitle = null, icon = null, color = "text.primary" }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
      {icon && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          {icon}
        </Avatar>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: color,
            lineHeight: 1.4,
            fontSize: "0.875rem",
            letterSpacing: "0.1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "N/A"}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              lineHeight: 1.2,
              fontSize: "0.75rem",
              mt: 0.25,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export const columns_comprobante_venta = [
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Nro. de Comprobante',
    headerName: 'Nro. de Comprobante',
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_nrocomprobante}
        // subtitle="Número de identificación"
        // icon={<Security fontSize="small" />}
        color="primary.main"
      />
      // <Typography
      //   sx={{
      //     fontWeight: 600,
      //     color: theme.palette.text.primary,
      //     fontSize: { xs: 12, xl: 14 },
      //     lineHeight: 1.4,
      //     overflow: "hidden",
      //     textOverflow: "ellipsis",
      //     whiteSpace: "nowrap",
      //   }}
      // >
      //   {row.new_cuentacomitente}
      // </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Fecha',
    headerName: 'Fecha',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.createdon}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Tipo',
    headerName: 'Tipo',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.new_TipodeComprobante}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Importe Total',
    headerName: 'Importe Total',
    renderCell: ({ row }) => <MoneyCell amount={row.new_total} currency="USD" subtitle="Valor de la factura" />,
    // renderCell: ({ row }) => {

    //     return (
    //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //                 <Typography
    //                     sx={{

    //                         mb: -0.5,
    //                         fontWeight: 600,
    //                         lineHeight: 1.72,
    //                         fontSize: '0.875rem',
    //                         letterSpacing: '0.22px'
    //                     }}
    //                 >
    //                     {row.new_total > 0 ? dollarUS.format(row.new_total) : "$0"}
    //                 </Typography>
    //             </Box>
    //         </Box>
    //     )
    // }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Divisa',
    headerName: 'Divisa',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.transactioncurrency}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Acciones',
    headerName: 'Acciones',
    renderCell: ({ row }) => {
      return (
        <DescargarNota value={row.annotationid} />
      )
    }
  }
]


// // import { Download } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Button,  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mui/material"
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// // Assuming DescargarNota is a component that takes a 'value' prop (annotationId)
// // and handles the download logic.
// // If the original DescargarNota component is not compatible with shadcn/ui Button,
// // the user might need to adapt it or provide its source.
// // For the purpose of this response, I'll define a simple one.
// const DescargarNota = ({ value }) => {
//   const handleDownload = () => {
//     console.log(`Simulating download for annotation ID: ${value}`)
//     alert(`Descargando comprobante con ID: ${value}`)
//   }

//   return (
//     <Button variant="ghost" size="icon" onClick={handleDownload}>
//       <CloudDownloadIcon className="h-4 w-4" />
//       <span className="sr-only">Descargar</span>
//     </Button>
//   )
// }

// export const columns_comprobante_venta = [
//   {
//     accessorKey: "new_nrocomprobante",
//     header: "Nro. de Comprobante",
//     cell: ({ row }) => (
//       <div className="flex items-center">
//         <div className="flex flex-col">
//           <p className="font-semibold text-sm leading-tight tracking-wide">{row.original.new_nrocomprobante}</p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "createdon",
//     header: "Fecha",
//     cell: ({ row }) => {
//       const date = new Date(row.original.createdon)
//       const formattedDate = new Intl.DateTimeFormat("es-AR", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//       }).format(date)
//       return (
//         <div className="flex items-center">
//           <div className="flex flex-col">
//             <p className="font-semibold text-sm leading-tight tracking-wide">{formattedDate}</p>
//           </div>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "new_TipodeComprobante",
//     header: "Tipo",
//     cell: ({ row }) => (
//       <div className="flex items-center">
//         <div className="flex flex-col">
//           <p className="font-semibold text-sm leading-tight tracking-wide">{row.original.new_TipodeComprobante}</p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "new_total",
//     header: "Importe Total",
//     cell: ({ row }) => {
//       const amount = row.original.new_total
//       const currencyCode = row.original.transactioncurrency || "USD"
//       const formattedAmount = new Intl.NumberFormat("es-AR", {
//         style: "currency",
//         currency: currencyCode,
//       }).format(amount)
//       return (
//         <div className="flex items-center">
//           <div className="flex flex-col">
//             <p className="font-semibold text-sm leading-tight tracking-wide">
//               {amount > 0
//                 ? formattedAmount
//                 : new Intl.NumberFormat("es-AR", { style: "currency", currency: currencyCode }).format(0)}
//             </p>
//           </div>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "transactioncurrency",
//     header: "Divisa",
//     cell: ({ row }) => (
//       <div className="flex items-center">
//         <div className="flex flex-col">
//           <p className="font-semibold text-sm leading-tight tracking-wide">{row.original.transactioncurrency}</p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "annotationid",
//     header: "Acciones",
//     enableSorting: false,
//     cell: ({ row }) => (
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <DescargarNota value={row.original.annotationid} />
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>Descargar Comprobante</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//     ),
//   },
// ]
