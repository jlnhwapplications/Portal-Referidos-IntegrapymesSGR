// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import { CircularProgress, Grid, LinearProgress } from '@mui/material'
import useGetComprobantesDeVenta from '@/hooks/useGetComprobantesDeVenta'
import { columns_comprobante_venta } from '@/columns/columnsComprobanteDeVenta'

const TablaComprobanteDeVenta = () => {
  const { comprobantes, loadingComprobantes } = useGetComprobantesDeVenta()

  return (
    <>
      {
        !loadingComprobantes ?
          <Grid item xs={12} >
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          </Grid> :
          <Box>
            <Table
              data={comprobantes?.length > 0 ? comprobantes : []}
              columns={columns_comprobante_venta} />
          </Box>
      }
    </>
  )
}

export default TablaComprobanteDeVenta