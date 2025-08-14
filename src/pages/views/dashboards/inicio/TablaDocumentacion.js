// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import { columns_carperta_digital_inicio } from '@/columns/columnsCarpetaDigital'
import { DocumentacionPorCuenta } from '@/context/GetDocumentacionPorCuentaContex'
import { useContext } from 'react'
import { Box, useTheme } from '@mui/material'

const TablaDocumentacion = () => {
  const {carpetas} = useContext(DocumentacionPorCuenta)
  const theme = useTheme()

  return (
    <Box>
      <Table
        name={"Documentación Digital"} 
        data={carpetas?.length > 0 ? carpetas : []} 
        columns={columns_carperta_digital_inicio(theme)} />
    </Box>
  )
}

export default TablaDocumentacion
