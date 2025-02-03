import React, { useState } from 'react'
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

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import TableSelectionAssistanceAssocier from 'src/views/table/data-grid/TableSelectionAssistanceAssocier'

const DataGrid = () => {
  // 🔹 State for Modal
  const [openModal, setOpenModal] = useState(false)
  const [selectedAssistantId, setSelectedAssistantId] = useState(null)
  const [customTitle, setCustomTitle] = useState('')
  const [customColor, setCustomColor] = useState('#007bff') // Default color

  // 🔹 Dummy Assistant Data (Replace with API Data)
  const rows = [
    { id: 1, assistant_id: 4, name: 'Support Bot' },
    { id: 2, assistant_id: 10, name: 'Sales Assistant' }
  ]

  // 🔹 Open the modal before downloading
  const handleOpenModal = (assistant_id) => {
    setSelectedAssistantId(assistant_id)
    setCustomTitle('')
    setCustomColor('#007bff') // Reset to default color
    setOpenModal(true)
  }

  // 🔹 Handles Downloading the JavaScript File
  const handleDownloadJS = () => {
    if (!selectedAssistantId) return

    const url = `http://localhost:5000/generate_chat_js/${selectedAssistantId}?title=${encodeURIComponent(
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

  // 🔹 Handles Delete Action (Implement API Call)
  const handleDelete = (id) => {
    console.log(`Delete assistant with ID: ${id}`)
    // TODO: Add API Call to delete assistant
  }

  // 🔹 Handles Update Action (Implement API Call)
  const handleUpdate = (id) => {
    console.log(`Update assistant with ID: ${id}`)
    // TODO: Add API Call to update assistant
  }

  // 🔹 Table Columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Assistant Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <div>
          {/* Delete Button */}
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>

          {/* Update Button */}
          <IconButton color="primary" onClick={() => handleUpdate(params.row.id)}>
            <EditIcon />
          </IconButton>

          {/* Download JS Button (Opens Modal) */}
          <IconButton color="success" onClick={() => handleOpenModal(params.row.assistant_id)}>
            <DownloadIcon />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <PageHeader title={<Typography variant='h5'>Assistants Management</Typography>} subtitle={<Typography variant='body2'>Manage AI Assistants</Typography>} />

      <Grid item xs={12}>
        <MuiDataGrid rows={rows} columns={columns} autoHeight pageSize={5} />
      </Grid>

      {/* 🔹 Modal for Custom Title & Color */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Customize Assistant Settings</DialogTitle>
        <DialogContent>
          <TextField
            label="Assistant Title"
            fullWidth
            variant="outlined"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Theme Color"
            type="color"
            fullWidth
            variant="outlined"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDownloadJS} color="primary">
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
