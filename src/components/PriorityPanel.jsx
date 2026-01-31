import { useState } from 'react'
import { Target, Flame, Zap, Pin, Clipboard, User, Package, Hash, Calendar, Play, Check, Filter } from 'lucide-react'
import './PriorityPanel.css'

function PriorityPanel({ orders, onUpdate }) {
    const [filterPriority, setFilterPriority] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [updatingId, setUpdatingId] = useState(null)

    const priorities = ['all', 'URGENT', 'HIGH', 'MEDIUM', 'LOW']
    const statuses = ['all', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setUpdatingId(id)
            await api.updateOrderStatus(id, newStatus)
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    const getPriorityConfig = (priority) => {
        switch (priority) {
            case 'URGENT':
                return { color: 'danger', icon: <Flame size={14} />, label: 'Urgent' }
            case 'HIGH':
                return { color: 'warning', icon: <Zap size={14} />, label: 'High' }
            case 'MEDIUM':
                return { color: 'info', icon: <Pin size={14} />, label: 'Medium' }
            case 'LOW':
                return { color: 'secondary', icon: <Clipboard size={14} />, label: 'Low' }
            default:
                return { color: 'secondary', icon: <Clipboard size={14} />, label: priority }
        }
    }

    const getStatusConfig = (status) => {
        switch (status) {
            case 'PENDING':
                return { color: 'warning', icon: <Calendar size={14} />, label: 'Pending' }
            case 'IN_PROGRESS':
                return { color: 'info', icon: <Zap size={14} />, label: 'In Progress' }
            case 'COMPLETED':
                return { color: 'success', icon: <Check size={14} />, label: 'Completed' }
            case 'CANCELLED':
                return { color: 'secondary', icon: <Pin size={14} />, label: 'Cancelled' }
            default:
                return { color: 'secondary', icon: <Clipboard size={14} />, label: status }
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesPriority = filterPriority === 'all' || order.priority === filterPriority
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus
        return matchesPriority && matchesStatus
    })

    const getDeadlineUrgency = (deadline) => {
        if (!deadline) return null
        const now = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { color: 'danger', label: 'OVERDUE', days: Math.abs(diffDays) }
        if (diffDays === 0) return { color: 'danger', label: 'TODAY', days: 0 }
        if (diffDays === 1) return { color: 'danger', label: 'TOMORROW', days: 1 }
        if (diffDays <= 3) return { color: 'warning', label: `${diffDays} days`, days: diffDays }
        return { color: 'info', label: `${diffDays} days`, days: diffDays }
    }

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        const aPriority = priorityOrder[a.priority] ?? 4
        const bPriority = priorityOrder[b.priority] ?? 4
        if (aPriority !== bPriority) return aPriority - bPriority
        if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline)
        if (a.deadline) return -1
        if (b.deadline) return 1
        return 0
    })

    return (
        <div className="priority-panel">
            <div className="card h-full">
                <div className="card-header">
                    <div className="flex items-center gap-md">
                        <Target size={22} className="text-secondary" />
                        <h2 className="card-title text-xl m-0">Orders</h2>
                    </div>
                    <div className="priority-filters flex gap-sm">
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="filter-select text-xs"
                        >
                            {priorities.map(p => (
                                <option key={p} value={p}>
                                    {p === 'all' ? 'Priority' : p}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select text-xs"
                        >
                            {statuses.map(s => (
                                <option key={s} value={s}>
                                    {s === 'all' ? 'Status' : s.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="card-body">
                    {sortedOrders.length === 0 ? (
                        <div className="empty-state py-xl text-center">
                            <Target size={48} className="text-tertiary mx-auto mb-md opacity-20" />
                            <p className="empty-message text-tertiary">No orders found.</p>
                        </div>
                    ) : (
                        <div className="orders-list space-y-lg">
                            {sortedOrders.map((order) => {
                                const priorityConfig = getPriorityConfig(order.priority)
                                const statusConfig = getStatusConfig(order.status)
                                const deadlineUrgency = getDeadlineUrgency(order.deadline)

                                return (
                                    <div
                                        key={order.id}
                                        className={`order-card priority-${priorityConfig.color} card p-0 border-l-4 overflow-hidden relative transition-all`}
                                        style={{ borderLeftColor: `var(--color-${priorityConfig.color})` }}
                                    >
                                        <div className="order-header p-md pb-xs flex justify-between items-start">
                                            <div className="order-customer flex items-center gap-sm">
                                                <div className="p-xs bg-bg-tertiary rounded-full">
                                                    <User size={16} className="text-tertiary" />
                                                </div>
                                                <div>
                                                    <h3 className="customer-name text-sm font-bold m-0">{order.customerName}</h3>
                                                    {order.contactInfo && (
                                                        <p className="customer-contact text-[10px] text-tertiary m-0">{order.contactInfo}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="order-badges flex flex-col gap-xs items-end">
                                                <span className={`badge badge-${priorityConfig.color} text-[10px] flex items-center gap-xs`}>
                                                    {priorityConfig.icon}
                                                    {priorityConfig.label}
                                                </span>
                                                <span className={`badge badge-${statusConfig.color} text-[10px] flex items-center gap-xs`}>
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>

                                        {order.items && order.items.length > 0 && (
                                            <div className="order-items px-md py-sm">
                                                <div className="items-header flex items-center gap-sm text-[10px] font-bold text-tertiary uppercase tracking-widest mb-xs">
                                                    <Package size={12} />
                                                    Items
                                                </div>
                                                <ul className="items-list space-y-1">
                                                    {order.items.map((item, index) => (
                                                        <li key={index} className="item-row flex justify-between text-xs py-1 border-b border-border/10 last:border-0">
                                                            <span className="item-name font-medium">
                                                                {item.stockItem?.name || 'Unknown Item'}
                                                            </span>
                                                            <span className="item-quantity text-tertiary">
                                                                ×{item.quantity}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="order-footer p-md pt-sm bg-bg-tertiary/20 flex justify-between items-center">
                                            <div className="order-meta flex flex-col gap-1">
                                                <div className="meta-item flex items-center gap-xs text-[10px] text-tertiary">
                                                    <Hash size={10} />
                                                    {order.id.substring(0, 8)}
                                                </div>
                                                {deadlineUrgency && (
                                                    <div className={`meta-item flex items-center gap-xs text-[10px] font-bold text-${deadlineUrgency.color}`}>
                                                        <Calendar size={10} />
                                                        {deadlineUrgency.label === 'OVERDUE'
                                                            ? `${deadlineUrgency.days}d Overdue`
                                                            : deadlineUrgency.label
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                                <div className="order-actions">
                                                    {order.status === 'PENDING' && (
                                                        <button
                                                            className="btn btn-primary p-xs text-[10px] rounded hover-glow h-auto"
                                                            disabled={updatingId === order.id}
                                                            onClick={() => handleStatusUpdate(order.id, 'IN_PROGRESS')}
                                                        >
                                                            {updatingId === order.id ? '...' : <><Play size={12} /> Start</>}
                                                        </button>
                                                    )}
                                                    {order.status === 'IN_PROGRESS' && (
                                                        <button
                                                            className="btn btn-success p-xs text-[10px] rounded hover-glow h-auto"
                                                            disabled={updatingId === order.id}
                                                            onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                                        >
                                                            {updatingId === order.id ? '...' : <><Check size={12} /> Done</>}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        {order.notes && (
                                            <div className="order-notes px-md py-sm bg-secondary/5 text-[10px] italic text-tertiary">
                                                "{order.notes}"
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PriorityPanel
