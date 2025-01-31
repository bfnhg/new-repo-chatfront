import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports

import TableSelectionAssistanceAssocier from 'src/views/table/data-grid/TableSelectionAssistanceAssocier'

const DataGrid = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader title={<Typography variant='h5'></Typography>} subtitle={<Typography variant='body2'></Typography>} />

      <Grid item xs={12}>
        <TableSelectionAssistanceAssocier />
      </Grid>
    </Grid>
  )
}
DataGrid.acl = {
  action: 'read',
  subject: 'Assistanceassocier'
}

export default DataGrid
