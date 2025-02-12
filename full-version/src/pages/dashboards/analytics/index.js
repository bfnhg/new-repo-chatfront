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
import AnalyticsTable from 'src/views/dashboards/analytics/AnalyticsTable'
import AnalyticsWeeklyOverview from 'src/views/dashboards/analytics/AnalyticsWeeklyOverview'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {
  const [totalConversationsAdmin, setTotalConversationsAdmin] = useState(null)
  const [totalConversationsdays, setTotalConversationsdays] = useState([])
  const [totalmessage, setTotalmessage] = useState(null)
  const [totalAssistantMessages, setTotalAssistantMessages] = useState(null)
  const [totalUserMessages, setTotalUserMessages] = useState(null)
  const [totalAdminclientMessages, settotalAdminclientMessages] = useState(null)
  const [Average, setAverage] = useState(null)
  const [userRole, setUserRole] = useState(null)
  let { t } = useTranslation()

  const fetchTotalMessage = async () => {
    try {
      // Get the token from localStorage or wherever you store it after login
      const token = localStorage.getItem('accessToken') // Adjust this key based on how you store the token

      // Make the API request with the Authorization header
      const response = await axios.get('http://localhost:7000/api/messages/count', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Important if you're using cookies
      })

      console.log('response', response)
      setTotalmessage(response.data.total_messages)
      setTotalAssistantMessages(response.data?.total_assistant_messages || 0)
      setTotalUserMessages(response.data?.total_user_messages || 0)
    } catch (error) {
      console.error('Error fetching total messages:', error)

      // Handle unauthorized errors
      if (error.response?.status === 401) {
        // Redirect to login or handle token expiration
        console.log('User is not authenticated')

        // You might want to redirect to login page here
        // Example: router.push('/login')
      }
    }
  }

  const fetchAverage = async () => {
    try {
      // Get the token from localStorage or wherever you store it after login
      const token = localStorage.getItem('accessToken') // Adjust this key based on how you store the token

      // Make the API request with the Authorization header
      const response = await axios.get('http://localhost:7000/api/messages/admin/average', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      console.log('&', response)
      setAverage(response.data.average_messages_per_conversation)
    } catch (error) {
      console.error('Error fetching total messages:', error)

      // Handle unauthorized errors
      if (error.response?.status === 401) {
        // Redirect to login or handle token expiration
        console.log('User is not authenticated')

        // You might want to redirect to login page here
        // Example: router.push('/login')
      }
    }
  }

  const fetchTotalConversationsAdmin = async () => {
    try {
      // Récupérer le token d'accès depuis le localStorage
      const token = localStorage.getItem('accessToken')

      // Vérifier si l'utilisateur est un administrateur
      const userData = localStorage.getItem('userData')
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        if (parsedUserData.role !== 'admin') {
          console.log('Accès non autorisé : utilisateur non administrateur')

          return
        }
      }

      const response = await axios.get('http://localhost:7000/api/conversations/admin/count', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Important si vous utilisez des cookies
      })
      console.log('response', response)

      // Vérifier la réponse et mettre à jour l'état
      if (response.data && response.data.total_conversations !== undefined) {
        setTotalConversationsAdmin(response.data.total_conversations)
      } else {
        console.error("Réponse inattendue de l'API :", response.data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre total de conversations :', error)

      // Gérer les erreurs spécifiques
      if (error.response) {
        if (error.response.status === 403) {
          console.log('Accès refusé : utilisateur non administrateur')
        } else if (error.response.status === 401) {
          console.log('Utilisateur non authentifié')

          // Rediriger vers la page de connexion si nécessaire
        } else {
          console.log('Erreur serveur :', error.response.data)
        }
      }
    }
  }

  const fetchMessageCountsCliantsAdmin = async () => {
    try {
      // Récupérer le token d'accès depuis le localStorage
      const token = localStorage.getItem('accessToken')

      // Effectuer la requête GET vers l'API
      const response = await axios.get('http://localhost:7000/api/messages/admin/count', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Important si vous utilisez des cookies
      })

      // Vérifier la réponse et mettre à jour l'état
      if (response.data) {
        settotalAdminclientMessages(response.data.total_messages)
      } else {
        console.error("Réponse inattendue de l'API :", response.data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes de messages :', error)

      // Gérer les erreurs spécifiques
      if (error.response) {
        if (error.response.status === 404) {
          console.log('Aucun chatbot trouvé pour ce client')
        } else if (error.response.status === 401) {
          console.log('Utilisateur non authentifié')

          // Rediriger vers la page de connexion si nécessaire
        } else {
          console.log('Erreur serveur :', error.response.data)
        }
      }
    }
  }

  useEffect(() => {
    // Fetch user role from localStorage
    const userData = localStorage.getItem('userData') // Adjust the key if necessary

    if (userData) {
      const parsedUserData = JSON.parse(userData) // Parse the JSON string
      setUserRole(parsedUserData.role) // Set the role in state
    }
    console.log('userData', userData)
  }, [])

  useEffect(() => {
    fetchTotalMessage()
    fetchAverage()
    fetchTotalConversationsAdmin()
    fetchMessageCountsCliantsAdmin()

    console.log('total', totalConversationsdays)
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {userRole === 'admin' && (
          <>
            <Grid item xs={12} md={4}>
              {' '}
              <CardStatisticsVerticalComponentAdmin
                stats={totalConversationsAdmin !== null ? `${totalConversationsAdmin}` : 'Loading...'}
                icon={<Icon icon='mdi:account' />}
                color='success'
                title={t('Total Conversations')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {' '}
              <CardStatisticsVerticalComponentAdmin
                stats={totalAdminclientMessages !== null ? `${totalAdminclientMessages}` : 'Loading...'}
                icon={<Icon icon='mdi:account' />}
                color='success'
                title={t('Total message')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {' '}
              <CardStatisticsVerticalComponentAdmin
                stats={Average !== null ? `${Average}` : 'Loading...'}
                icon={<Icon icon='mdi:account' />}
                color='success'
                title={t('Average')}
              />
            </Grid>
            <Grid item xs={12}>
              <TableSelection />
            </Grid>
          </>
        )}

        {/* <Grid item xs={12} md={12} lg={8}>
          <AnalyticsTable />
        </Grid> */}
      </Grid>
    </ApexChartWrapper>
  )
}
Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
