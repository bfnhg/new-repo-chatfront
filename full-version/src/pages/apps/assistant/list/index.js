import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

const DataGrid = () => {
  // 🔹 State Managementss
  const [assistants, setAssistants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedAssistantId, setSelectedAssistantId] = useState(null)
  const [customTitle, setCustomTitle] = useState('')
  const [customColor, setCustomColor] = useState('#007bff') // Default color
  let { t } = useTranslation()
  // 🔹 Fetch Assistants from API
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const token = localStorage.getItem('accessToken')

        const response = await axios.get('http://localhost:7000/api/assistants/client', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // ✅ Extract `assistants` array from the response and format it properly
        const formattedData = response.data.assistants.map(assistant => ({
          id: assistant.id,
          client_id: assistant.client_id,
          assistant_prompt: assistant.assistant_prompt,
          temperature: parseFloat(assistant.temperature), // Ensure temperature is a number
          model: assistant.model,
          openai_assistant_id: assistant.openai_assistant_id,
          created_at: assistant.created_at // Already formatted in API response
        }))

        setAssistants(formattedData)
      } catch (err) {
        setError('Failed to load assistants')
      } finally {
        setLoading(false)
      }
    }
    fetchAssistants()
  }, [])

  // 🔹 Open the modal before downloading
  const handleOpenModal = assistant_id => {
    setSelectedAssistantId(assistant_id)
    setCustomTitle('')
    setCustomColor('#007bff') // Reset to default color
    setOpenModal(true)
  }

  // 🔹 Handles Downloading the JavaScript File
  const handleDownloadJS = () => {
    if (!selectedAssistantId) return

    const url = `http://localhost:7000/api/assistants/generate_chat_js/${selectedAssistantId}?title=${encodeURIComponent(
      customTitle
    )}&color=${encodeURIComponent(customColor)}`

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `assistant_${selectedAssistantId}.js`) // Set download filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setOpenModal(false) // Close modal after download
  }

  // 🔹 Handles Delete Action (API Call)
  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:7000/deleteAssistant/${id}`)
      setAssistants(assistants.filter(assistant => assistant.id !== id))
    } catch (error) {
      console.error('Error deleting assistant:', error)
    }
  }

  // 🔹 Handles Update Action (API Call)
  const handleUpdate = async id => {
    console.log(`Update assistant with ID: ${id}`)
    // TODO: Implement API Call to update assistant
  }

  // 🔹 Table Columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },

    // { field: 'client_id', headerName: 'Client ID', width: 120 },

    { field: 'assistant_prompt', headerName: t('Assistant Prompt'), flex: 1 },
    { field: 'temperature', headerName: 'Temperature', width: 120 },
    { field: 'model', headerName: t('Model'), width: 150 },

    // { field: 'openai_assistant_id', headerName: 'OpenAI ID', width: 250 },

    { field: 'created_at', headerName: t('Created at'), width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: params => (
        <div>
          {/* Delete Button */}

          {/* <IconButton color='error' onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton> */}

          {/* Update Button */}

          {/* <IconButton color='primary' onClick={() => handleUpdate(params.row.id)}>
            <EditIcon />
          </IconButton> */}

          {/* Download JS Button (Opens Modal) */}
          <IconButton color='success' onClick={() => handleOpenModal(params.row.id)}>
            <DownloadIcon />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>{t('Assistant List')}</Typography>}

        // subtitle={<Typography variant='body2'>Manage AI Assistants</Typography>}
      />

      <Grid item xs={12}>
        {loading ? (
          <Typography variant='h6'>Loading assistants...</Typography>
        ) : error ? (
          <Typography variant='h6' color='error'>
            {error}
          </Typography>
        ) : (
          <MuiDataGrid rows={assistants} columns={columns} autoHeight pageSize={5} />
        )}
      </Grid>

      {/* 🔹 Modal for Custom Title & Color */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Customize Assistant Settings</DialogTitle>
        <DialogContent>
          <TextField
            label='Assistant Title'
            fullWidth
            variant='outlined'
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label='Theme Color'
            type='color'
            fullWidth
            variant='outlined'
            value={customColor}
            onChange={e => setCustomColor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDownloadJS} color='primary'>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

DataGrid.acl = {
  action: 'read',
  subject: 'Assistanceassocier'
}

export default DataGrid
