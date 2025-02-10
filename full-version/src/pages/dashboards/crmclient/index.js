import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import axios from 'axios' // You can use axios or fetch for API calls

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'
import AnalyticsWeeklyOverview from 'src/views/dashboards/analytics/AnalyticsWeeklyOverview'
import { useTranslation } from 'react-i18next'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const Dashboard = () => {
  const [totalMessages, setTotalMessages] = useState(null)
  const [totalConversations, setTotalConversations] = useState(null)
  const [conversationsByCountry, setConversationsByCountry] = useState(null)
  const [userRole, setUserRole] = useState(null)
  let { t } = useTranslation()

  // Fetch user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsedUserData = JSON.parse(userData)
      setUserRole(parsedUserData.role)
      console.log('User role set to:', parsedUserData.role)
    }
  }, [])

  // Fetch data from the APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          console.error('No access token found')

          return
        }

        // Fetch total messages
        const totalMessagesResponse = await axios.get('http://localhost:7000/api/messages/client/count', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        setTotalMessages(totalMessagesResponse.data.total_messages)

        // Fetch total conversations
        const totalConversationsResponse = await axios.get('http://localhost:7000/api/conversations/client/count', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        setTotalConversations(totalConversationsResponse.data.total_conversations)

        // Fetch conversations by country
        const conversationsByCountryResponse = await axios.get('http://localhost:7000/api/conversations/client/today', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        console.log('<<< to day', conversationsByCountryResponse)
        setConversationsByCountry(conversationsByCountryResponse.data.total_conversations)
      } catch (error) {
        console.error('Error fetching data:', error)
        if (error.response?.status === 401) {
          console.log('User is not authenticated')

          // Redirect to login page if necessary
        }
      }
    }

    if (userRole === 'client') {
      fetchData()
    }
  }, [userRole])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {userRole === 'client' && (
          <>
            {/* Total Messages Card */}
            <Grid item xs={12} md={4}>
              <CardStatisticsVerticalComponent
                stats={totalMessages !== null ? `${totalMessages}` : 'Loading...'}
                icon={<Icon icon='mdi:message' />}
                color='info'
                title={t('Total message')}
              />
            </Grid>

            {/* Total Conversations Card */}
            <Grid item xs={12} md={4}>
              <CardStatisticsVerticalComponent
                stats={totalConversations !== null ? `${totalConversations}` : 'Loading...'}
                icon={<Icon icon='mdi:chat' />}
                color='primary'
                title={t('Total Conversations')}
              />
            </Grid>

            {/* Conversations by Country Card */}
            <Grid item xs={12} md={4}>
              <CardStatisticsVerticalComponent
                stats={conversationsByCountry !== null ? `${conversationsByCountry}` : 'Loading...'}

                icon={<Icon icon='mdi:earth' />}
                color='success'
                title={t('Conversations')}
              />
            </Grid>

            {/* Weekly Overview Chart */}
            <Grid item xs={8} md={2} lg={12}>
              <AnalyticsWeeklyOverview />
            </Grid>
          </>
        )}
      </Grid>
    </ApexChartWrapper>
  )
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboardClient'
}

export default Dashboard
