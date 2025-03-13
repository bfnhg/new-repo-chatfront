import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'

// ** Axios Import
import axios from 'axios'

const VisitTable = () => {
  // ** State
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState(7)
  let { t } = useTranslation()

  // ** Récupérer userData depuis localStorage
  const userData = JSON.parse(localStorage.getItem('userData'))
  const clientId = userData?.id // Récupérer l'id de l'utilisateur

  // ** Fetch visits for a specific client
  useEffect(() => {
    const fetchVisits = async () => {
      if (!clientId) {
        console.error('clientId is not defined')
        return
      }

      setLoading(true)
      try {
        const token = localStorage.getItem('accessToken')

        const response = await axios.get(`http://localhost:7000/api/visits/get-visits?client_id=${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })

        console.log('API Response:', response.data)

        if (response.data && response.data.visit_details) {
          const visitsWithId = response.data.visit_details.map((visit, index) => ({
            ...visit,
            id: visit.visitor_id + '_' + index
          }))
          setVisits(visitsWithId)
        }
      } catch (error) {
        console.error('Error fetching visits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [clientId]) // Déclencher l'effet lorsque clientId change

  // ** Columns for the visits table
  const visitColumns = [
    {
      flex: 0.3,
      minWidth: 200,
      field: 'visitor_id',
      headerName: t('Visitor ID')
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'visit_time',
      headerName: t('Visit Time'),
      valueFormatter: params => (params.value ? new Date(params.value).toLocaleString() : 'N/A')
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'page_url',
      headerName: t('Page URL')
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'city',
      headerName: t('City'),
      valueFormatter: params => params.value || 'N/A'
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'country',
      headerName: t('Country'),
      valueFormatter: params => params.value || 'N/A'
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'duration',
      headerName: t('Duration'),
      valueFormatter: params => params.value || 'N/A'
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'industry',
      headerName: t('Industry'),
      valueFormatter: params => params.value || 'N/A'
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'staff_size',
      headerName: t('Staff Size'),
      valueFormatter: params => params.value || 'N/A'
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'website',
      headerName: t('Website'),
      valueFormatter: params => params.value || 'N/A'
    }
  ]

  return (
    <Card>
      <CardHeader title={t('Visit Details')} />
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={visits}
          columns={visitColumns}
          pageSize={pageSize}
          rowsPerPageOptions={[7, 10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          loading={loading}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default VisitTable
