// ** React Imports
import { useState } from 'react'
import axios from 'axios'

// ** MUI Imports
import Divider from '@mui/material/Divider'
import { Visibility, VisibilityOff } from '@mui/icons-material'
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
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

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
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [clientName, setClientName] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  let { t } = useTranslation()

  // Fonction pour évaluer la force du mot de passe
  const evaluatePasswordStrength = value => {
    let strength = 0
    if (value.length >= 8) strength += 25
    if (/[A-Z]/.test(value)) strength += 25
    if (/[a-z]/.test(value)) strength += 25
    if (/[0-9]/.test(value) && /[@$!%*?&]/.test(value)) strength += 25

    return strength
  }

  // Fonction pour définir la couleur en fonction de la force
  const getProgressColor = strength => {
    if (strength < 50) return 'error' // Rouge (faible)
    if (strength < 75) return 'warning' // Orange (moyen)

    return 'success' // Vert (fort)
  }

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
        toast.success(t('Client created_successfully'))
        setChatbotLink(response.data.chatbot_link) // Affiche le lien du chatbot
        setClientName(data.name)
      }
    } catch (error) {
      toast.error(t('Error_creating_client'))
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
                  rules={{ required: { value: true, message: t('Name is required') || 'Le nom est requis' } }}
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
                  rules={{ required: { value: true, message: t('Email is required') || 'L email est requis' } }}
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
                  rules={{
                    required: { value: true, message: t('Description is required') || 'La description est requise' }
                  }}
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
                  rules={{ required: { value: true, message: t('Address is required') || 'L adresse est requise' } }}
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
                    required: { value: true, message: t('Site is required') || 'Le site est requis' },
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
                  rules={{ required: { value: true, message: t('Phone is required') || 'Le téléphone est requis' } }}
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
                  rules={{
                    required: { value: true, message: t('Password is required') || 'Le mot de passe est requis' },
                    minLength: { value: 8, message: t('At least 8 characters') || 'Au moins 8 caractères' }
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        label={t('Password')}
                        error={Boolean(errors.password)}
                        helperText={errors.password && errors.password.message}
                        onChange={e => {
                          field.onChange(e) // Met à jour le champ
                          const newPassword = e.target.value
                          setPassword(newPassword)
                          setPasswordStrength(evaluatePasswordStrength(newPassword))
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      {/* Indicateur de force */}
                      {password && (
                        <Box mt={1}>
                          <LinearProgress
                            variant='determinate'
                            value={passwordStrength}
                            color={getProgressColor(passwordStrength)}
                          />
                          <Typography
                            variant='body2'
                            sx={{ mt: 1, textAlign: 'center', color: getProgressColor(passwordStrength) }}
                          >
                            {passwordStrength < 50 ? 'Faible' : passwordStrength < 75 ? 'Moyen' : 'Fort'}
                          </Typography>
                        </Box>
                      )}
                    </>
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
                    {t('Selected file')}: {logoFile.name}
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
                    label={`${t('Question')} ${index + 1}`}
                    value={item.question}
                    onChange={e => handleQuestionChange(index, 'question', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`${t('Response')} ${index + 1}`}
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
        {/* {chatbotLink && (
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant='h6' color='primary'>
              {t('The chatbot link for')}: <strong>{clientName}</strong> :{' '}
              <a href={chatbotLink} target='_blank' rel='noopener noreferrer'>
                {chatbotLink}
              </a>
            </Typography>
          </Grid>
        )} */}
      </CardContent>
    </Card>
  )
}

export default FormValidationBasic
