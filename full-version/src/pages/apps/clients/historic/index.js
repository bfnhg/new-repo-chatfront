import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { sendMsg, selectChat, fetchUserProfile, fetchChatsContacts, removeSelectedChat } from 'src/store/apps/chat'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'
import { formatDateToMonthShort } from 'src/@core/utils/format'

// ** Chat App Components Imports

import ChatContent from 'src/views/apps/chat/ChatContent'

const AppChat = () => {
  // ** States
  const [userStatus, setUserStatus] = useState('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector(state => state.chat)

  // ** Vars
  const { skin } = settings
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 370 : 300
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  const statusObj = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  // ** Fetch data on mount
  useEffect(() => {
    dispatch(fetchUserProfile())
    dispatch(fetchChatsContacts())
  }, [dispatch])

  useEffect(() => {
    // Sélectionner une conversation par défaut uniquement après que les données soient chargées
    if (!store.selectedChat && Array.isArray(store.chats) && store.chats.length > 0) {
      dispatch(selectChat(store.chats[0]?.id))
    }
  }, [store.chats, store.selectedChat, dispatch])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)

  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <ChatContent
        store={store}
        hidden={hidden}
        sendMsg={sendMsg}
        mdAbove={mdAbove}
        dispatch={dispatch}
        statusObj={statusObj}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        userProfileRightOpen={userProfileRightOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
      />
    </Box>
  )
}
AppChat.acl = {
  action: 'read',
  subject: 'conversationHistoric'
}

AppChat.contentHeightFixed = true

export default AppChat
