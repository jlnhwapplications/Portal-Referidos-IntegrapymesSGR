
// import { AuthContext } from '@/context/AuthContext';
// import ModalSociedadBolsa from '@/pages/perfil/ModalSociedadBolsa';
// import { inactivarSociedadBolsa, obtenerSociedadesXsocio } from '@/redux/Cuenta';
// import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
// import { useContext, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import Icon from 'src/@core/components/icon'
// import { readOnlyDatos } from '@/keys'
// import { SociedadesDeBolsa } from '@/context/GetSociedadesDeBolsaContext';
// export const COLUMNASSOCXBOLSA = [
//   {
//     accessorKey: 'id'
//   },
//   {
//     header: 'Sociedad De Bolsa',
//     accessorKey: '_new_sociedaddebolsa_value',
//     Cell: ({ cell }) => <strong>{cell.getValue()}</strong>,
//   },
//   {
//     header: 'Cuenta Comitente',
//     accessorKey: 'new_cuentacomitente',
//     Cell: ({ cell }) => <strong>{cell.getValue()}</strong>
//   },
// ]

// const RowOptions = ({ id }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const rowOptionsOpen = Boolean(anchorEl);
//   const dispatch = useDispatch();
//   const [openNew, setOpenNew] = useState(false)
//   const { token, referido } = useContext(AuthContext);
//   const { deleteSociedad } = useContext(SociedadesDeBolsa);

//   const handleOpenNew = () => {
//     setOpenNew(true)
//   }

//   const handleCloseNew = () => setOpenNew(false);

//   const handleRowOptionsClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleRowOptionsClose = () => {
//     setAnchorEl(null);
//   };

//   const deleteRow = () => {
//     deleteSociedad(id, token)
//     handleRowOptionsClose();
//   };

//   return (
//     <>
//       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//         {
//           readOnlyDatos ? null :
//             <Tooltip title='Eliminar'>
//               <IconButton size='small' onClick={handleRowOptionsClick}>
//                 <Icon icon='material-symbols:delete-outline' fontSize={24} />
//               </IconButton>
//             </Tooltip>
//         }
//         <Tooltip title='Ver'>
//           <IconButton size='small' onClick={() => handleOpenNew()}>
//             <Icon icon='mdi:eye-outline' fontSize={24} />
//           </IconButton>
//         </Tooltip>
//       </Box>
//       {
//         openNew &&
//         <ModalSociedadBolsa open={openNew} handleClose={handleCloseNew} modo={"editar"} id={id} />
//       }
//       <Menu
//         keepMounted
//         anchorEl={anchorEl}
//         open={rowOptionsOpen}
//         onClose={handleRowOptionsClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "center",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "center",
//         }}
//         PaperProps={{ style: { minWidth: "8rem" } }}
//       >
//         <MenuItem onClick={deleteRow} sx={{ "& svg": { mr: 2 } }}>
//           <Icon icon="mingcute:alert-fill" fontSize={20} style={{ color: "red" }} />
//           Desea eliminar este registro ?
//         </MenuItem>
//       </Menu>
//     </>
//   );
// };

// export const columns_sociedad_bolsa = [
//   {
//     flex: 0.1,
//     minWidth: 130,
//     sortable: false,
//     field: 'actions',
//     headerName: 'Acciones',
//     renderCell: ({ row }) => (
//       <RowOptions id={row.id} />
//     )
//   },
//   {
//     flex: 0.2,
//     minWidth: 120,
//     field: 'Sociedad De Bolsa',
//     headerName: 'Sociedad De Bolsa',
//     renderCell: ({ row }) => {
//       return (

//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Typography
//               sx={{
//                 mb: -0.5,
//                 fontWeight: 600,
//                 lineHeight: 1.72,
//                 fontSize: '0.875rem',
//                 letterSpacing: '0.22px'
//               }}
//             >
//               {row.new_sociedaddebolsa_value}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     flex: 0.2,
//     minWidth: 120,
//     field: 'Cuenta Comitente',
//     headerName: 'Cuenta Comitente',
//     renderCell: ({ row }) => {
//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Typography
//               sx={{
//                 mb: -0.5,
//                 fontWeight: 600,
//                 lineHeight: 1.72,
//                 fontSize: '0.875rem',
//                 letterSpacing: '0.22px'
//               }}
//             >
//               {row.new_cuentacomitente}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     }
//   },
// ]

import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Stack,
  Icon,
} from "@mui/material"
// import { Trash2, Eye, AlertCircle } from "lucide-react" // Using lucide-react for icons
import { useContext, useState } from "react"
import { readOnlyDatos } from "@/keys"
import { SociedadesDeBolsa } from "@/context/GetSociedadesDeBolsaContext"
import ModalSociedadBolsa from "@/pages/perfil/ModalSociedadBolsa" // Assuming this path is correct for the modal component
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Visibility as VisibilityIcon,
} from "@mui/icons-material"
import EditIcon from '@mui/icons-material/Edit';
import { useToast } from "@/@core/components/toast/ToastProvider"

const RowOptions = ({ id }) => {
  const [openNew, setOpenNew] = useState(false)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const { deleteSociedad } = useContext(SociedadesDeBolsa)
  const toast = useToast()

  const handleOpenNew = () => {
    setOpenNew(true)
  }

  const handleCloseNew = () => {
    setOpenNew(false)
  }

  const handleDeleteClick = () => {
    setOpenDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    debugger
    deleteSociedad(id, toast)
    setOpenDeleteConfirm(false)
  }

  // const handleRowOptionsClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };


  const handleDeleteCancel = () => {
    setOpenDeleteConfirm(false)
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {!readOnlyDatos && (
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={handleDeleteClick}>
              <DeleteIcon size={20} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Ver">
          <IconButton size="small" onClick={handleOpenNew}>
            <RemoveRedEyeIcon size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      {openNew && <ModalSociedadBolsa open={openNew} handleClose={handleCloseNew} modo={"editar"} id={id} />}

      <Dialog
        open={openDeleteConfirm}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon color="red" />
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            ¿Desea eliminar este registro de Sociedad de Bolsa? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// Componente para celdas de texto mejoradas
function EnhancedTextCell({ value, subtitle = null, icon = null, color = "text.primary", theme }) {

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

// Componente para acciones mejorado
const ActionCell = ({ row, onView, onEdit, onDelete, theme }) => {

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Ver detalles" arrow>
        <IconButton
          size="small"
          href={`/operaciones/${row.id}`}
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
          <VisibilityIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      {
        readOnlyDatos ? null :
          <Tooltip title='Eliminar'>
            <IconButton size='small' onClick={handleDeleteConfirm}>
              <Icon icon='material-symbols:delete-outline' fontSize={24} />
            </IconButton>
          </Tooltip>
      }
    </Stack>
  )
}

export const columns_sociedad_bolsa = (theme) => [
  {
    flex: 0.2,
    minWidth: 180,
    field: "new_sociedaddebolsa_value",
    headerName: "Sociedad De Bolsa",
    renderCell: ({ row }) => (
      <Typography
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: { xs: 12, xl: 14 },
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.new_sociedaddebolsa_value}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "new_cuentacomitente",
    headerName: "Cuenta Comitente",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_cuentacomitente}
        // subtitle="Número de identificación"
        // icon={<Security fontSize="small" />}
        color="primary.main"
        theme={theme}
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
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: "actions",
    headerName: "Acciones",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
]
