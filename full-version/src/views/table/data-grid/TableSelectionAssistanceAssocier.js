import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios'

const AssistantTable = () => {
  const [pageSize, setPageSize] = useState(7)
  const [assistants, setAssistants] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [assistantToDelete, setAssistantToDelete] = useState(null)
  const [selectedAssistant, setSelectedAssistant] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const userDataString = localStorage.getItem('userData') // Assurez-vous que c'est 'userData' et non 'id'
      const userData = JSON.parse(userDataString)
      const clientId = userData?.id // Extraire l'id de l'objet userData

      console.log('clientId', clientId) // Devrait afficher 3

      if (!clientId) {
        console.error('No client ID found')
        return
      }

      const response = await axios.get(`http://localhost:5000/api/admin/getAssistantByClientID/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      console.log('Response:', response)

      if (response.data && response.data.assistant) {
        const assistantData = Array.isArray(response.data.assistant)
          ? response.data.assistant
          : [response.data.assistant]
        setAssistants(assistantData)
      }
    } catch (error) {
      console.error('Error fetching assistants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenEdit = assistant => {
    setSelectedAssistant(assistant)
    setOpen(true)
  }

  const handleOpenConfirm = id => {
    setAssistantToDelete(id)
    setOpenConfirm(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedAssistant(null)
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 150,
      field: 'model',
      headerName: t('Model'),
      renderCell: params => (
        <Typography noWrap variant='body2'>
          {params.row.model}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'assistant_prompt',
      headerName: t('Prompt'),
      renderCell: params => (
        <Typography noWrap variant='body2'>
          {params.row.assistant_prompt}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'temperature',
      headerName: t('Temperature'),
      renderCell: params => (
        <Typography noWrap variant='body2'>
          {params.row.temperature}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'created_at',
      headerName: t('Created at'),
      renderCell: params => (
        <Typography noWrap variant='body2'>
          {params.row.created_at}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Actions'),
      field: 'actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color='primary' onClick={() => handleOpenEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color='error' onClick={() => handleOpenConfirm(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t('Assistant List')} />
      <DataGrid
        autoHeight
        rows={assistants}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        loading={loading}
      />

      <Dialog open={open} onClose={handleClose}>
        {/* <DialogTitle>{t('Update Assistant')}</DialogTitle> */}
        <DialogContent>
          <TextField
            fullWidth
            margin='dense'
            label={t('Model')}
            value={selectedAssistant?.model || ''}
            onChange={e => setSelectedAssistant({ ...selectedAssistant, model: e.target.value })}
          />
          <TextField
            fullWidth
            margin='dense'
            label={t('Prompt')}
            multiline
            rows={4}
            value={selectedAssistant?.assistant_prompt || ''}
            onChange={e => setSelectedAssistant({ ...selectedAssistant, assistant_prompt: e.target.value })}
          />
          <TextField
            fullWidth
            margin='dense'
            label={t('Temperature')}
            type='number'
            inputProps={{ step: 0.1, min: 0, max: 1 }}
            value={selectedAssistant?.temperature || ''}
            onChange={e => setSelectedAssistant({ ...selectedAssistant, temperature: e.target.value })}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default AssistantTable
