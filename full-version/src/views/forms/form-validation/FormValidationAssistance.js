import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'

// Material-UI imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'

const defaultValues = {
  model: 'gpt-3.5-turbo',
  assistant_prompt: '',
  temprature: '',
  client_id: ''
}

const SimpleFormValidationAssistant = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState([])
  const [isLoadingClients, setIsLoadingClients] = useState(true)

  let { t } = useTranslation()
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      const response = await axios.get('http://localhost:7000/api/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      if (response.data && response.data.clients) {
        setClients(response.data.clients)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setIsLoadingClients(false)
    }
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = async formData => {
    setIsSubmitting(true)
    try {
      const requestBody = {
        client_id: parseInt(formData.client_id),
        model: formData.model,
        assistant_prompt: formData.assistant_prompt,
        temprature: formData.temprature
      }

      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assistants`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Indicating that the request body is multipart
        },
        withCredentials: true
      });

      if (response.status === 201) {
        toast.success('Assistant created successfully!')
        reset()
      }
    } catch (error) {
      console.error('Error details:', error)
      toast.error(error.response?.data?.message || 'Error creating assistant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingClients) {
    return (
      <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title={t('Create assistant')} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Client Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(errors.client_id)}>
                <InputLabel>{t('Select client')}</InputLabel>
                <Controller
                  name='client_id'
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('Client selection is required') || 'La sélection du client est requise'
                    }
                  }}
                  render={({ field }) => (
                    <Select {...field} label={t('Select client')} disabled={isSubmitting}>
                      {clients.map(client => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.client_id && <FormControl error>{errors.client_id.message}</FormControl>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='model'
                  control={control}
                  rules={{ required: 'Model is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Model')}
                      defaultValue='gpt-3.5-turbo'
                      error={Boolean(errors.model)}
                      helperText={errors.model?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='assistant_prompt'
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('Assistant prompt is required') || 'Le prompt d assistant est requis'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Assistant Prompt')}
                      multiline
                      rows={4}
                      error={Boolean(errors.assistant_prompt)}
                      helperText={errors.assistant_prompt?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='temprature'
                  control={control}
                  rules={{
                    required: t('Temperature is required') || 'Le prompt d assistant est requis',
                    min: {
                      value: 0,
                      message:
                        t('Temperature must be between 0 and 1') || 'La température doit être comprise entre 0 et 1'
                    },
                    max: {
                      value: 1,
                      message:
                        t('Temperature must be between 0 and 1') || 'La température doit être comprise entre 0 et 1'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='number'
                      label='Temperature'
                      inputProps={{ step: '0.1' }}
                      error={Boolean(errors.temprature)}
                      helperText={errors.temprature?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' disabled={isSubmitting || clients.length === 0}>
                {isSubmitting ? t('Creating Assistant...') : t('Create Assistant')}{' '}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default SimpleFormValidationAssistant
