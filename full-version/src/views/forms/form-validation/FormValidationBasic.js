// ** React Imports
import { useState } from 'react'
import axios from 'axios'

// ** MUI Imports
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useTranslation } from 'react-i18next'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

const defaultValues = {
  name: '',
  email: '',
  password: '',
  description: '',
  site: '',
  address: '',
  phone: '',
  questions: [{ question: '', answer: '' }]
}

const FormValidationBasic = () => {
  const [questions, setQuestions] = useState([{ question: '', answer: '' }])
  const [logoFile, setLogoFile] = useState(null) // État pour stocker le fichier logo
  const [chatbotLink, setChatbotLink] = useState(null) // Lien du chatbot après soumission réussie

  const [clientName, setClientName] = useState(null)
  let { t } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // Fonction de soumission du formulaire
  const onSubmit = async data => {
    try {
      // Créer un objet FormData
      const formData = new FormData()

      // Ajouter les champs du formulaire
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('description', data.description)
      formData.append('site', data.site)
      formData.append('address', data.address)
      formData.append('phone', data.phone)

      // Ajouter le fichier logo
      if (logoFile) {
        formData.append('logo', logoFile)
      }

      // Ajouter les questions
      questions.forEach((item, index) => {
        formData.append(`questions[${index}][question]`, item.question)
        formData.append(`questions[${index}][answer]`, item.answer)
      })

      // Envoyer les données au backend
      const response = await axios.post('http://127.0.0.1:5000/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Indiquer que le contenu est un formulaire multipart
        }
      })

      if (response.status === 201) {
        toast.success('Client created successfully!')
        setChatbotLink(response.data.chatbot_link) // Affiche le lien du chatbot
        setClientName(data.name)
      }
    } catch (error) {
      toast.error('Error creating client. Please try again.')
      console.error(error)
    }
  }

  // Fonction pour ajouter un nouveau formulaire de question-réponse
  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }])
  }

  // Fonction pour mettre à jour une question ou une réponse
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  const handleRemoveQuestion = indexToRemove => {
    setQuestions(prevQuestions => prevQuestions.filter((_, index) => index !== indexToRemove))
  }

  return (
    <Card>
      <CardHeader title={t('Add a business account')} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Champs existants */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Name')}
                      error={Boolean(errors.name)}
                      helperText={errors.name && errors.name.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Email'
                      error={Boolean(errors.email)}
                      helperText={errors.email && errors.email.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Description en Textarea */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: 'Description is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Description')}
                      multiline
                      rows={4}
                      error={Boolean(errors.description)}
                      helperText={errors.description && errors.description.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='address'
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Address')}
                      error={Boolean(errors.address)}
                      helperText={errors.address && errors.address.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='site'
                  control={control}
                  rules={{
                    required: 'Site is required',
                    validate: value => {
                      // Regex pour valider une URL
                      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                      if (!urlPattern.test(value)) {
                        return 'Please enter a valid URL (e.g., https://example.com)'
                      }
                      return true
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Web site')}
                      error={Boolean(errors.site)}
                      helperText={errors.site && errors.site.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: 'Phone is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Phone')}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone && errors.phone.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='password'
                      label={t('Password')}
                      error={Boolean(errors.password)}
                      helperText={errors.password && errors.password.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Champ pour téléverser le logo */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <input
                  accept='image/*'
                  style={{ display: 'none' }}
                  id='logo-upload'
                  type='file'
                  onChange={e => setLogoFile(e.target.files[0])}
                />
                <label htmlFor='logo-upload'>
                  <Button
                    variant='outlined'
                    component='span'
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      py: 3,
                      fontSize: '1rem',
                      width: '100%',
                      maxWidth: '465px'
                    }}
                  >
                    {t('Upload a logo')}
                  </Button>
                </label>
                {logoFile && (
                  <Typography variant='body2' sx={{ mt: 2 }}>
                    Fichier sélectionné : {logoFile.name}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                {t('Questions and Answers')}
              </Typography>
              <Grid item xs={12} container justifyContent='flex-end'>
                <Button variant='outlined' onClick={handleAddQuestion}>
                  {t('Add a question')}
                </Button>
              </Grid>
            </Grid>

            {/* Champs dynamiques pour les questions-réponses */}
            {questions.map((item, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                alignItems='center'
                style={{
                  marginTop: index === 0 ? '0px' : '10px'
                }}
              >
                <Grid item xs={12} sm={6} spacing={2}>
                  <TextField
                    fullWidth
                    label={`Question ${index + 1}`}
                    value={item.question}
                    onChange={e => handleQuestionChange(index, 'question', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Réponse ${index + 1}`}
                    value={item.answer}
                    onChange={e => handleQuestionChange(index, 'answer', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  <Button variant='outlined' color='error' onClick={() => handleRemoveQuestion(index)}>
                    {t('Delete')}
                  </Button>
                </Grid>
              </Grid>
            ))}

            {/* Bouton de soumission unique */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                {t('Submit')}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Lien du chatbot */}
        {chatbotLink && (
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant='h6' color='primary'>
              {t('The chatbot link for')}: <strong>{clientName}</strong> :{' '}
              <a href={chatbotLink} target='_blank' rel='noopener noreferrer'>
                {chatbotLink}
              </a>
            </Typography>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default FormValidationBasic
