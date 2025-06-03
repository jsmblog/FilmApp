import axios from 'axios'

const URL = 'http://192.168.0.143:3000/api'
const stored = sessionStorage.getItem('user')
const user = stored ? JSON.parse(stored) : null
const token = user?.token || ''

export const connectionToBackend = axios.create({
  baseURL: URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` })
  }
})
