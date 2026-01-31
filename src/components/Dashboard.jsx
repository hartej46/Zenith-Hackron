import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/clerk-react'
import { BarChart3, Package, AlertTriangle, ClipboardList, AlertCircle, Plus, X, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import InventoryPanel from './InventoryPanel'
import UrgencyPanel from './UrgencyPanel'
import PriorityPanel from './PriorityPanel'
import StockInputForm from './StockInputForm'
import { api } from '../services/api'
import './Dashboard.css'

function Dashboard() {
    const [stockItems, setStockItems] = useState([])
    const [orders, setOrders] = useState([])
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddStock, setShowAddStock] = useState(false)
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockCount: 0,
        activeOrders: 0,
        urgentAlerts: 0,
        totalStockValue: 0
    })

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            // Fetch all data in parallel
            const [stockData, ordersData, alertsData] = await Promise.all([
                api.getStockItems(),
                api.getOrders(),
                api.getAlerts()
            ])

            // Filter out archived items
            const activeStockItems = stockData.filter(item => !item.isArchived)
            setStockItems(activeStockItems)
            setOrders(ordersData)
            setAlerts(alertsData)

            // Calculate stats
            const lowStock = stockData.filter(item => item.currentStock <= item.minimumStock).length
            const activeOrds = ordersData.filter(order => order.status !== 'COMPLETED' && order.status !== 'CANCELLED').length
            const urgent = alertsData.filter(alert => !alert.isResolved && alert.severity === 'CRITICAL').length

            setStats({
                totalItems: activeStockItems.length,
                lowStockCount: lowStock,
                activeOrders: activeOrds,
                urgentAlerts: urgent,
                totalStockValue: activeStockItems.reduce((acc, item) => acc + (item.currentStock || 0), 0)
            })

            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
            // Use mock data for demo purposes if API fails
            loadMockData()
        }
    }

    const loadMockData = () => {
        // Mock data for demo purposes
        const mockStock = [
            {
                id: '1',
                name: 'Steel Rods',
                category: 'Raw Materials',
                minimumStock: 50,
                currentStock: 25,
                lastMinuteStock: 10,
                unit: 'units',
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '2',
                name: 'Packaging Boxes',
                category: 'Supplies',
                minimumStock: 100,
                currentStock: 150,
                lastMinuteStock: 20,
                unit: 'boxes',
                expiryDate: null
            },
            {
                id: '3',
                name: 'Adhesive Glue',
                category: 'Chemicals',
                minimumStock: 30,
                currentStock: 8,
                lastMinuteStock: 5,
                unit: 'liters',
                expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '4',
                name: 'Paint - Blue',
                category: 'Finishing',
                minimumStock: 20,
                currentStock: 45,
                lastMinuteStock: 5,
                unit: 'liters',
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]

        const mockOrders = [
            {
                id: 'o1',
                customerName: 'ABC Manufacturing',
                priority: 'URGENT',
                status: 'IN_PROGRESS',
                urgencyLevel: 'HIGH',
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                items: [{ stockItem: { name: 'Steel Rods' }, quantity: 50 }]
            },
            {
                id: 'o2',
                customerName: 'XYZ Enterprises',
                priority: 'HIGH',
                status: 'PENDING',
                urgencyLevel: 'MEDIUM',
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                items: [{ stockItem: { name: 'Packaging Boxes' }, quantity: 200 }]
            },
            {
                id: 'o3',
                customerName: 'Local Retailer',
                priority: 'MEDIUM',
                status: 'PENDING',
                urgencyLevel: 'NORMAL',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                items: [{ stockItem: { name: 'Paint - Blue' }, quantity: 10 }]
            }
        ]

        const mockAlerts = [
            {
                id: 'a1',
                alertType: 'CRITICAL_STOCK',
                message: 'Adhesive Glue stock critically low!',
                severity: 'CRITICAL',
                isResolved: false,
                stockItem: { name: 'Adhesive Glue' },
                createdAt: new Date().toISOString()
            },
            {
                id: 'a2',
                alertType: 'EXPIRY_SOON',
                message: 'Adhesive Glue expires in 2 days',
                severity: 'HIGH',
                isResolved: false,
                stockItem: { name: 'Adhesive Glue' },
                createdAt: new Date().toISOString()
            },
            {
                id: 'a3',
                alertType: 'LOW_STOCK',
                message: 'Steel Rods below minimum stock level',
                severity: 'MEDIUM',
                isResolved: false,
                stockItem: { name: 'Steel Rods' },
                createdAt: new Date().toISOString()
            }
        ]

        setStockItems(mockStock)
        setOrders(mockOrders)
        setAlerts(mockAlerts)

        setStats({
            totalItems: mockStock.length,
            lowStockCount: 2,
            activeOrders: 3,
            urgentAlerts: 2,
            totalStockValue: 228
        })
    }

    const handleStockAdded = () => {
        setShowAddStock(false)
        fetchDashboardData()
    }

    // Prepare data for stock overview graph
    const prepareChartData = () => {
        return stockItems.map(item => {
            let status = 'Normal'
            if (item.currentStock <= item.lastMinuteStock) {
                status = 'Critical'
            } else if (item.currentStock <= item.minimumStock) {
                status = 'Low'
            }

            return {
                name: item.name.length > 15 ? item.name.substring(0, 12) + '...' : item.name,
                fullName: item.name,
                current: item.currentStock,
                minimum: item.minimumStock,
                critical: item.lastMinuteStock,
                status: status,
                unit: item.unit
            }
        })
    }

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="custom-tooltip card shadow-lg p-md">
                    <p className="tooltip-title font-bold mb-sm">{data.fullName}</p>
                    <div className="tooltip-details text-sm">
                        <p className="flex justify-between gap-lg mb-xs">
                            <span className="text-tertiary">Current:</span>
                            <span className="font-semibold text-primary">{data.current} {data.unit}</span>
                        </p>
                        <p className="flex justify-between gap-lg mb-xs">
                            <span className="text-tertiary">Minimum:</span>
                            <span>{data.minimum} {data.unit}</span>
                        </p>
                        <p className={`mt-md badge badge-${data.status.toLowerCase()}`}>
                            {data.status} Stock
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    // Get color based on status
    const getBarColor = (status) => {
        switch (status) {
            case 'Critical':
                return 'var(--color-danger)'
            case 'Low':
                return 'var(--color-warning)'
            default:
                return 'var(--color-success)'
        }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading Dashboard...</p>
            </div>
        )
    }

    return (
        <div className="dashboard animate-fadeIn">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">
                            <BarChart3 className="title-icon-svg" />
                            Zenith Operations
                        </h1>
                        <div className="flex items-center gap-md">
                            <p className="dashboard-subtitle">MSME Smart Inventory Dashboard</p>
                            <span className="badge badge-primary">AI Powered</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="btn btn-primary hover-glow" onClick={() => setShowAddStock(true)}>
                            <Plus size={18} /> Add Stock
                        </button>
                        <div className="user-action ml-md">
                            <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10 border-2 border-primary/20' } }} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid grid grid-cols-4">
                <div className="stat-card card hover-lift">
                    <div className="stat-icon stat-icon-primary">
                        <Package size={28} className="text-primary-light" />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Stock Items</div>
                        <div className="stat-value">{stats.totalItems}</div>
                        <div className="stat-footer text-xs text-tertiary mt-xs">
                            <TrendingUp size={12} className="inline mr-xs" /> Total: {stats.totalStockValue} units
                        </div>
                    </div>
                </div>

                <div className="stat-card card hover-lift">
                    <div className="stat-icon stat-icon-warning">
                        <AlertTriangle size={28} className="text-warning" />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Low Stock</div>
                        <div className="stat-value">{stats.lowStockCount}</div>
                        <div className="stat-footer text-xs text-tertiary mt-xs">Items below minimum</div>
                    </div>
                </div>

                <div className="stat-card card hover-lift">
                    <div className="stat-icon stat-icon-info">
                        <ClipboardList size={28} className="text-info" />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Active Orders</div>
                        <div className="stat-value">{stats.activeOrders}</div>
                        <div className="stat-footer text-xs text-tertiary mt-xs">Currently processing</div>
                    </div>
                </div>

                <div className="stat-card card hover-lift">
                    <div className="stat-icon stat-icon-danger">
                        <AlertCircle size={28} className="text-danger" />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Urgent Alerts</div>
                        <div className="stat-value">{stats.urgentAlerts}</div>
                        <div className="stat-footer text-xs text-tertiary mt-xs">Immediate action required</div>
                    </div>
                </div>
            </div>

            {/* Stock Overview Graph - NEW */}
            <div className="dashboard-section mb-xl">
                <div className="card stock-graph-container">
                    <div className="card-header pb-md border-b mb-xl">
                        <div className="flex items-center gap-md">
                            <TrendingUp size={20} className="text-primary" />
                            <h3 className="card-title text-lg m-0">Stock Inventory Overview</h3>
                        </div>
                        <div className="header-actions text-sm text-tertiary">
                            Real-time Levels
                        </div>
                    </div>
                    <div className="graph-content h-[300px] w-full mt-xl">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prepareChartData()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
                                    axisLine={{ stroke: 'var(--color-border)' }}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
                                    axisLine={{ stroke: 'var(--color-border)' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="current" radius={[4, 4, 0, 0]} barSize={40}>
                                    {prepareChartData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                    {/* Inventory Panel */}
                    <div className="dashboard-section inventory-section">
                        <InventoryPanel stockItems={stockItems} />
                    </div>

                    <div className="flex flex-col gap-xl">
                        {/* Urgency Panel */}
                        <div className="dashboard-section urgency-section">
                            <UrgencyPanel alerts={alerts} stockItems={stockItems} />
                        </div>

                        {/* Priority Panel */}
                        <div className="dashboard-section priority-section">
                            <PriorityPanel orders={orders} onUpdate={fetchDashboardData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Stock Modal */}
            {showAddStock && (
                <div className="modal-overlay" onClick={() => setShowAddStock(false)}>
                    <div className="modal-content animate-slideUp" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="flex items-center gap-md m-0">
                                <Package className="text-primary" />
                                Add New Stock Item
                            </h2>
                            <button className="modal-close" onClick={() => setShowAddStock(false)} aria-label="Close modal">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-xl">
                            <StockInputForm onSuccess={handleStockAdded} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
