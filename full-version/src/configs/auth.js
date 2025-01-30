import process from 'process'

export default {
  meEndpoint: process.env.NEXT_PUBLIC_BACKEND_URL + '/verify-token',
  loginEndpoint: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
