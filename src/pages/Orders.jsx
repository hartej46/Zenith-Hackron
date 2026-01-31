import { useState, useEffect } from 'react'
import { ClipboardList, Search, MoreHorizontal, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import './Orders.css'

function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const data = await api.getOrders()
            setOrders(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching orders:', error)
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <span className="order-badge status-success">Completed</span>
            case 'IN_PROGRESS':
                return <span className="order-badge status-warning">In Progress</span>
            case 'CANCELLED':
                return <span className="order-badge status-danger">Cancelled</span>
            default:
                return <span className="order-badge status-info">Pending</span>
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return 'text-danger'
            case 'HIGH': return 'text-warning'
            default: return 'text-secondary'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="orders-page p-xl animate-fadeIn">
            <header className="page-header flex justify-between items-start mb-xl">
                <div>
                    <h1 className="text-3xl font-black m-0 mb-xs">Orders ({filteredOrders.length})</h1>
                    <p className="text-tertiary">Track customer requests and stock distribution</p>
                </div>
            </header>

            <div className="search-container mb-xl">
                <div className="search-wrapper flex items-center bg-white rounded-md px-md py-sm shadow-sm">
                    <Search size={18} className="text-tertiary mr-md" />
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        className="bg-transparent border-none focus:ring-0 flex-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container bg-white rounded-lg shadow-sm overflow-hidden mb-xl">
                <table className="orders-table w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-subtle bg-tertiary/5">
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Customer</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Items & Usage</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Priority</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Status</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Deadline</th>
                            <th className="p-lg w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b border-border-subtle hover:bg-tertiary/5 transition-colors">
                                <td className="p-lg">
                                    <div className="font-semibold text-primary">{order.customerName}</div>
                                    <div className="text-xs text-tertiary">ID: {order.id.substring(0, 8)}</div>
                                </td>
                                <td className="p-lg">
                                    <div className="flex flex-col gap-xs">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="text-sm flex items-center gap-sm">
                                                <span className="font-medium">{item.stockItem?.name}</span>
                                                <span className="bg-tertiary/20 px-xs py-[2px] rounded text-[10px] font-bold">
                                                    -{item.quantity} {item.stockItem?.unit || 'units'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-lg">
                                    <div className={`text-xs font-bold uppercase flex items-center gap-xs ${getPriorityColor(order.priority)}`}>
                                        {order.priority === 'URGENT' && <AlertCircle size={14} />}
                                        {order.priority}
                                    </div>
                                </td>
                                <td className="p-lg">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="p-lg">
                                    <div className="flex items-center gap-sm text-sm text-secondary">
                                        <Clock size={14} className="text-tertiary" />
                                        {new Date(order.deadline).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-lg">
                                    <button className="text-tertiary hover:text-primary bg-transparent border-none p-xs cursor-pointer">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-2xl text-center text-tertiary">
                                    No orders found matching your search
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders
