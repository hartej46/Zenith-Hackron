import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    async (config) => {
        if (window.Clerk?.session) {
            try {
                const token = await window.Clerk.session.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            } catch (error) {
                console.error('Error getting auth token:', error)
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export const stockItemsAPI = {
    getAll: async () => {
        const response = await apiClient.get('/stock-items')
        return response.data
    },

    getById: async (id) => {
        const response = await apiClient.get(`/stock-items/${id}`)
        return response.data
    },

    create: async (data) => {
        const response = await apiClient.post('/stock-items', data)
        return response.data
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/stock-items/${id}`, data)
        return response.data
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/stock-items/${id}`)
        return response.data
    },
}

// Orders API
export const ordersAPI = {
    getAll: async () => {
        const response = await apiClient.get('/orders')
        return response.data
    },

    getById: async (id) => {
        const response = await apiClient.get(`/orders/${id}`)
        return response.data
    },

    create: async (data) => {
        const response = await apiClient.post('/orders', data)
        return response.data
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/orders/${id}`, data)
        return response.data
    },

    updateStatus: async (id, status) => {
        const response = await apiClient.patch(`/orders/${id}/status`, { status })
        return response.data
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/orders/${id}`)
        return response.data
    },
}

// Alerts API
export const alertsAPI = {
    getAll: async () => {
        const response = await apiClient.get('/alerts')
        return response.data
    },

    getUnresolved: async () => {
        const response = await apiClient.get('/alerts?isResolved=false')
        return response.data
    },

    resolve: async (id) => {
        const response = await apiClient.patch(`/alerts/${id}/resolve`)
        return response.data
    },
}

// Tasks API
export const tasksAPI = {
    getAll: async () => {
        const response = await apiClient.get('/tasks')
        return response.data
    },

    getById: async (id) => {
        const response = await apiClient.get(`/tasks/${id}`)
        return response.data
    },

    create: async (data) => {
        const response = await apiClient.post('/tasks', data)
        return response.data
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/tasks/${id}`, data)
        return response.data
    },

    updateStatus: async (id, status) => {
        const response = await apiClient.patch(`/tasks/${id}/status`, { status })
        return response.data
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/tasks/${id}`)
        return response.data
    },
}

// AI API (Python Backend)
const AI_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'

export const aiAPI = {
    chat: async (message) => {
        const response = await axios.post(`${AI_BASE_URL}/api/ai/chat`, { message })
        return response.data
    },
    index: async () => {
        const response = await axios.post(`${AI_BASE_URL}/api/ai/index`)
        return response.data
    }
}

// Convenience wrapper
export const api = {
    // Stock Items
    getStockItems: stockItemsAPI.getAll,
    getStockItem: stockItemsAPI.getById,
    createStockItem: stockItemsAPI.create,
    updateStockItem: stockItemsAPI.update,
    deleteStockItem: stockItemsAPI.delete,

    // Orders
    getOrders: ordersAPI.getAll,
    getOrder: ordersAPI.getById,
    createOrder: ordersAPI.create,
    updateOrder: ordersAPI.update,
    updateOrderStatus: ordersAPI.updateStatus,
    deleteOrder: ordersAPI.delete,

    // Alerts
    getAlerts: alertsAPI.getAll,
    getUnresolvedAlerts: alertsAPI.getUnresolved,
    resolveAlert: alertsAPI.resolve,

    // Tasks
    getTasks: tasksAPI.getAll,
    getTask: tasksAPI.getById,
    createTask: tasksAPI.create,
    updateTask: tasksAPI.update,
    updateTaskStatus: tasksAPI.updateStatus,
    deleteTask: tasksAPI.delete,

    // AI
    chatAI: aiAPI.chat,
    indexAIData: aiAPI.index,
}

export default api
