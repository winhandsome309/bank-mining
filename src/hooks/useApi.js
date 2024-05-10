import axios from 'axios'

var csrf_token
const client = axios.create({
  // baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'X-XSRF-Token': csrf_token,
  },
})
// Set withCredentials to true for all requests
// Credit: https://www.dhiwise.com/post/managing-secure-cookies-via-axios-interceptors

client.defaults.withCredentials = true

client
  .get(process.env.REACT_APP_API_ENDPOINT + '/login', {
    data: null,
    headers: { 'Content-Type': 'application/json' },
  })
  .then(function (resp) {
    csrf_token = resp.data['response']['csrf_token']
  })

client.interceptors.request.use(
  function (config) {
    if (['post', 'delete', 'patch', 'put'].includes(config['method'])) {
      if (csrf_token !== '') {
        config.headers['X-XSRF-Token'] = csrf_token
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default client
