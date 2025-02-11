// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [clientData, setClientData] = useState(null) // État pour stocker les données du client

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  // Récupérer les données utilisateur depuis le localStorage
  const userData = JSON.parse(localStorage.getItem('userData')) // Assurez-vous que la clé est correcte
  const clientId = userData ? userData.id : null // Extraire l'ID du client

  // Récupérer les données du client
  useEffect(() => {
    if (clientId) {
      const fetchClientData = async () => {
        try {
          const token = localStorage.getItem('accessToken')

          const response = await axios.get(`http://localhost:7000/api/clients/${clientId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
          setClientData(response.data)
          console.log('clientData.logo ', clientData.logo)
        } catch (error) {
          console.error('Error fetching client data:', error)
        }
      }

      fetchClientData()
    }
  }, [clientId]) // Déclencher l'effet lorsque clientId change

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={clientData ? clientData.name : 'User'}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={clientData ? clientData.logo : '/images/avatars/1.png'} // Utiliser le logo du client
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt={clientData ? clientData.name : 'User'}
                src={clientData ? `${backendUrl}${clientData.logo}` : '/images/avatars/1.png'}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>
                {clientData ? clientData.name : 'Loading...'} {/* Afficher le nom du client */}
              </Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {clientData ? clientData.email : 'Loading...'} {/* Afficher l'email du client */}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Afficher les informations supplémentaires seulement si clientData est rempli */}
        {clientData && clientData.site && clientData.address && clientData.phone && (
          <Box sx={{ px: 4, py: 2 }}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              <strong>Site:</strong> {clientData.site}
            </Typography>
            <Typography variant='body2' sx={{ mb: 1 }}>
              <strong>Address:</strong> {clientData.address}
            </Typography>
            <Typography variant='body2' sx={{ mb: 1 }}>
              <strong>Phone:</strong> {clientData.phone}
            </Typography>
          </Box>
        )}

        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
