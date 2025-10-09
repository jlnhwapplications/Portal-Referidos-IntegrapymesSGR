// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import {
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material"
// ** Icon Imports
import Icon from '@/@core/components/icon'
import { Button, Tooltip, Typography, useTheme } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const QuickSearchToolbar = ({ value, onChange, clearSearch, canExport, addRow, toggle, name, description, exportFileName, exportColumnFields }) => {
  // const { toggle, canExport, name, description } = props
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* <Box
          sx={{
            backgroundColor: theme.palette.primary.main + "20",
            borderRadius: 2,
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DocumentIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
        </Box> */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {description}
          </Typography>
        </Box>
      </Box>

      <GridToolbarContainer sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {addRow && (
          <Tooltip title="Agregar">
            <IconButton
              onClick={toggle}
              sx={{
                backgroundColor: theme.palette.primary.main + "20",
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main + "30",
                },
              }}
            > 
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
        {
          canExport && (
            <GridToolbarExport
              disabled={!canExport}
              csvOptions={{
                utf8WithBom: true,
                allColumns: false,
                shouldCellBeExported: (params) => params.field !== "__check__",
                ...(exportFileName ? { fileName: exportFileName } : {}),
                ...(exportColumnFields?.length ? { fields: exportColumnFields } : {})
              }}
              printOptions={{
                disableToolbarButton: true
              }}
            />
          )
        }

        {/* Cuadro de búsqueda */}
        <TextField
          size="small"
          value={value}
          onChange={onChange}
          placeholder="Buscar…"
          sx={{
            minWidth: 220,
            "& .MuiInputBase-root": {
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              borderRadius: 2,
              px: 1,
            },
            "& input": { color: theme.palette.text.primary },
          }}
        />
        {value && (
          <Tooltip title="Borrar búsqueda">
            <IconButton size="small" onClick={clearSearch}>
              ✕
            </IconButton>
          </Tooltip>
        )}
      </GridToolbarContainer>
    </Box>
    // <Box
    //   sx={{
    //     gap: 2,
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     p: theme => theme.spacing(2, 5, 4, 5)
    //   }}
    // >
    //   {/* <GridToolbarColumnsButton />*/}
    //   <GridToolbarFilterButton />
    //   {canExport ? <GridToolbarExport /> : null}
    //   <TextField
    //     size='small'
    //     value={props.value}
    //     onChange={props.onChange}
    //     placeholder='Buscar..'
    //     InputProps={{
    //       startAdornment: (
    //         <Box sx={{ mr: 2, display: 'flex' }}>
    //           <Icon icon='mdi:magnify' fontSize={20} />
    //         </Box>
    //       ),
    //       endAdornment: (
    //         <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
    //           <Icon icon='mdi:close' fontSize={20} />
    //         </IconButton>
    //       )
    //     }}
    //     sx={{
    //       width: {
    //         xs: 1,
    //         sm: 'auto'
    //       },
    //       '& .MuiInputBase-root > svg': {
    //         mr: 2
    //       }
    //     }}
    //   />
    //   {props.addRow && (
    //     <Button variant="outlined" onClick={toggle} size="small" color="success">
    //       Nuevo
    //     </Button>
    //   )}
    // </Box>
  )
}

export default QuickSearchToolbar
