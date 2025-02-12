import Link from 'next/link'
import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'

const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // Stack elements vertically
  alignItems: 'center', // Center items horizontally
  justifyContent: 'space-between', // Space between elements
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out',
  textAlign: 'center', // Centrer le texte horizontalement
  width: '100%' // Prendre toute la largeur disponible
}))

const StyledLink = styled(Link)({
  display: 'flex',
  justifyContent: 'center', // Centrer horizontalement
  alignItems: 'center', // Centrer verticalement (optionnel)
  textDecoration: 'none',
  width: '100%' // Prendre toute la largeur disponible
})

const VerticalNavHeader = props => {
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon
  } = props

  const theme = useTheme()
  const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }
  const [clientData, setClientData] = useState(null)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const backendHead = backendUrl.replace(/\/api$/, '');
  console.log(backendHead)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const clientId = userData ? userData.id : null

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
          
          const cleanedData = {
            ...response.data,
            logo: response.data.logo.replace(/\\/g, '/') // Fix backslashes in logo path
          }
          setClientData(cleanedData)
          console.log('Client Data:', cleanedData)
        } catch (error) {
          console.error('Error fetching client data:', error)
        }
      }
      fetchClientData()
    }
  }, [clientId])




  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8
      }
    } else {
      return 6
    }
  }

  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon='mdi:radiobox-marked' />
  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon='mdi:radiobox-blank' />

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            {hidden ? (
              <IconButton
                disableRipple
                disableFocusRipple
                onClick={toggleNavVisibility}
                sx={{ p: 0, backgroundColor: 'transparent !important', marginLeft: 'auto' }}
              >
                <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
            ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
              <IconButton
                disableRipple
                disableFocusRipple
                onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
                sx={{
                  p: 0,
                  color: 'text.primary',
                  backgroundColor: 'transparent !important',
                  '& svg': {
                    fontSize: '1.25rem',
                    ...menuCollapsedStyles,
                    transition: 'opacity .25s ease-in-out'
                  }
                }}
              >
                {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
              </IconButton>
            )}
          </Box>
          <HeaderTitle
            variant='h6'
            sx={{
              ...menuCollapsedStyles,
              mb: 2, // Marge en bas pour l'espacement
              textAlign: 'center', // Centrer le texte horizontalement
              width: '100%' // Prendre toute la largeur disponible
            }}
          >
            {clientData?.name}
          </HeaderTitle>
          <StyledLink href='/dashboards/analytics/'>
            <img
              src={
                userData?.role === 'admin'
                  ? '/images/alidantek/logo.png'
                  : clientData?.logo
                  ? `${backendHead}${clientData.logo.startsWith('/') ? '' : '/'}${clientData.logo}`
                  : '/images/alidantek/logo.png'
              }

              onError={e => (e.target.src = '/images/alidantek/logo.png')}
              style={{ width: 150, height: 150, marginBottom: theme.spacing(2) }}
            />
          </StyledLink>
        </>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
