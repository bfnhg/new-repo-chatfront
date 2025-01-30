// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import axios from 'axios' // You can use axios or fetch for API calls

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'
import CardStatisticsVerticalComponentAdmin from 'src/@core/components/card-statistics/card-stats-verticaladmin'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import TableSelection from 'src/views/table/data-grid/TableSelection'

// ** Demo Components Imports
import AnalyticsWeeklyOverview from 'src/views/dashboards/analytics/AnalyticsWeeklyOverview'

const Dashboard = () => {
  const [totalConversationsAdmin, setTotalConversationsAdmin] = useState(null)
  const [totalAssistantMessages, setTotalAssistantMessages] = useState(null)
  const [totalAdminclientMessages, settotalAdminclientMessages] = useState(null)
  const [totalUserMessagesbyday, setTotalmessagebyday] = useState(null)
  const [Totalclient, setTotalclient] = useState(null)
  const [userRole, setUserRole] = useState(null)

  // Fetch user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsedUserData = JSON.parse(userData)
      setUserRole(parsedUserData.role)
      console.log('User role set to:', parsedUserData.role)
    }
  }, [])

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')

        // Fetch admin-specific data if user is admin
        if (userRole === 'admin') {
          const totalClients = await axios.get('http://localhost:5000/api/admin/clients/count-only-clients', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
          console.log('<<<<', totalClients)
          setTotalclient(totalClients.data.total_clients)

          const totalAdminMessagesResponse = await axios.get('http://localhost:5000/api/admin/messages/count', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
          settotalAdminclientMessages(totalAdminMessagesResponse.data.total_messages)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        if (error.response?.status === 401) {
          console.log('User is not authenticated')

          // Redirect to login page if necessary
        }
      }
    }

    if (userRole) {
      fetchData()
    }
  }, [userRole])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {userRole === 'admin' && (
          <>
            <Grid item xs={12} md={4}>
              <CardStatisticsVerticalComponentAdmin
                stats={Totalclient !== null ? `${Totalclient}` : 'Loading...'}
                icon={<Icon icon='mdi:account' />}
                color='success'
                title='Total de client'
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CardStatisticsVerticalComponentAdmin
                stats={totalAdminclientMessages !== null ? `${totalAdminclientMessages}` : 'Loading...'}
                icon={<Icon icon='mdi:account' />}
                color='success'
                title='Total Messages'
              />
            </Grid>
            <Grid item xs={12}>
              <TableSelection />
            </Grid>
          </>
        )}
      </Grid>
    </ApexChartWrapper>
  )
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
