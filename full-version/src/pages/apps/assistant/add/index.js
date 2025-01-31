// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import SimpleFormValidationAssistant from 'src/views/forms/form-validation/FormValidationAssistance'

const FormValidationAssistance = () => {
  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h5'></Typography>} />
        <Grid item xs={12}>
          <SimpleFormValidationAssistant />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

FormValidationAssistance.acl = {
  action: 'read',
  subject: 'gestionchatbotassistant'
}

export default FormValidationAssistance
