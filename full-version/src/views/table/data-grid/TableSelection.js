// ** React Import
import { useState, useEffect } from 'react'

// ** MUI Imports
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

// ** Axios Import
import axios from 'axios'

const TableSelection = () => {
  // ** State
  const [pageSize, setPageSize] = useState(7)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  let { t } = useTranslation()

  // ** Fetch clients from API
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
      setLoading(false)
    }
  }

  // ** Handle delete client
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      await axios.delete(`http://localhost:7000/api/clients/${clientToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setClients(clients.filter(client => client.id !== clientToDelete))
    } catch (error) {
      console.error('Error deleting client:', error)
    } finally {
      setOpenConfirm(false)
      setClientToDelete(null)
    }
  }

  // ** Open Edit Dialog
  const handleOpenEdit = client => {
    setSelectedClient(client)
    setOpen(true)
  }
  const handleOpenConfirm = id => {
    setClientToDelete(id)
    setOpenConfirm(true)
  }
  const handleCloseConfirm = () => {
    setOpenConfirm(false)
    setClientToDelete(null)
  }

  // ** Close Edit Dialog
  const handleClose = () => {
    setOpen(false)
    setSelectedClient(null)
  }

  // ** Handle Update Client
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      await axios.put(`http://localhost:7000/api/clients/${selectedClient.id}`, selectedClient, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      fetchClients()
      handleClose()
    } catch (error) {
      console.error('Error updating client:', error)
    }
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: t('Name'),
      renderCell: params => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ fontWeight: 600 }}>
            {params.row.name}
          </Typography>
          <Typography noWrap variant='caption'>
            {params.row.email}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Role'),
      field: 'role'
    },
    {
      flex: 0.15,
      minWidth: 140,
      headerName: t('Phone'),
      field: 'phone'
    },
    {
      flex: 0.15,
      minWidth: 140,
      headerName: t('Created at'),
      field: 'created_at'
    },
    {
      flex: 0.15,
      minWidth: 160,
      headerName: t('Number of messages'),
      field: 'message_count'
    },
    {
      flex: 0.2,
      minWidth: 180,
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
      <CardHeader title={t('Customer List')} />
      <DataGrid
        autoHeight
        rows={clients}
        columns={columns}
        checkboxSelection
        pageSize={pageSize}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        loading={loading}
      />

      {/* Update Client Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Update client')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin='dense'
            label={t('Name')}
            value={selectedClient?.name || ''}
            onChange={e => setSelectedClient({ ...selectedClient, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin='dense'
            label='Email'
            value={selectedClient?.email || ''}
            onChange={e => setSelectedClient({ ...selectedClient, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin='dense'
            label={t('Phone')}
            value={selectedClient?.phone || ''}
            onChange={e => setSelectedClient({ ...selectedClient, phone: e.target.value })}
          />
          <TextField
            fullWidth
            margin='dense'
            label={t('Role')}
            value={selectedClient?.role || ''}
            onChange={e => setSelectedClient({ ...selectedClient, role: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            {t('Cancel')}
          </Button>
          <Button onClick={handleUpdate} color='primary'>
            {t('Update')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>{t('Do you really want to delete this customer?')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color='secondary'>
            {t('Cancel')}
          </Button>
          <Button onClick={handleDelete} color='error'>
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default TableSelection
