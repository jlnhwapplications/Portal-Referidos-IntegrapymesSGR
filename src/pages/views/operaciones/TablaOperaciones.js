// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import useGetOperaciones from '@/hooks/useGetOperaciones'
import { columns_operaciones } from '@/columns/columnsOperaciones'
import { CircularProgress, Grid, LinearProgress } from '@mui/material'

const TablaOperaciones = () => {
    const { operaciones, loadingOperaciones } = useGetOperaciones()

    return (
        loadingOperaciones ? (
            <Box>
                <Table
                    data={operaciones?.length > 0 ? operaciones : []}
                    columns={columns_operaciones}
                    canExport={false}
                />
            </Box>
        )
            : (
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                </Grid>
            )
    )
}

export default TablaOperaciones