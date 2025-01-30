// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports

import TableSelection from 'src/views/table/data-grid/TableSelection'

const DataGrid = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>
            <Link href='https://mui.com/x/react-data-grid/' target='_blank'>
              Data Grid
            </Link>
          </Typography>
        }
        subtitle={
          <Typography variant='body2'>
            Data Grid is a fast and extendable react data table and react data grid.
          </Typography>
        }
      />

      <Grid item xs={12}>
        <TableSelection />
      </Grid>
    </Grid>
  )
}

export default DataGrid
