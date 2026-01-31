import { useState, useEffect } from 'react'
import { AlertTriangle, Bell, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import './UrgencyPanel.css'

function UrgencyPanel({ alerts, stockItems }) {
    const [showCriticalPopup, setShowCriticalPopup] = useState(false)

    useEffect(() => {
        // Show popup if there are critical unresolved alerts
        const criticalAlerts = alerts.filter(
            alert => !alert.isResolved && alert.severity === 'CRITICAL'
        )
        if (criticalAlerts.length > 0) {
            setShowCriticalPopup(true)
        }
    }, [alerts])

    const getDaysUntilExpiry = (expiryDate) => {
        if (!expiryDate) return null
        const now = new Date()
        const expiry = new Date(expiryDate)
        const diffTime = expiry - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const getExpiringItems = () => {
        return stockItems
            .filter(item => item.expiryDate)
            .map(item => ({
                ...item,
                daysUntilExpiry: getDaysUntilExpiry(item.expiryDate)
            }))
            .filter(item => item.daysUntilExpiry !== null && item.daysUntilExpiry <= 30)
            .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
    }

    const getUrgencyColor = (alert) => {
        switch (alert.severity) {
            case 'CRITICAL':
                return 'danger'
            case 'HIGH':
                return 'warning'
            case 'MEDIUM':
                return 'info'
            default:
                return 'secondary'
        }
    }

    const getExpiryUrgency = (days) => {
        if (days <= 2) return { color: 'danger', label: 'CRITICAL', icon: <AlertCircle size={20} /> }
        if (days <= 7) return { color: 'danger', label: 'HIGH', icon: <AlertTriangle size={20} /> }
        if (days <= 14) return { color: 'warning', label: 'MEDIUM', icon: <Clock size={20} /> }
        return { color: 'info', label: 'LOW', icon: <Calendar size={20} /> }
    }

    const expiringItems = getExpiringItems()
    const unresolvedAlerts = alerts.filter(alert => !alert.isResolved)

    return (
        <div className="urgency-panel">
            <div className="card h-full">
                <div className="card-header">
                    <div className="flex items-center gap-md">
                        <AlertTriangle size={22} className="text-danger" />
                        <h2 className="card-title text-xl m-0">Urgent Tracking</h2>
                    </div>
                    <div className="urgency-stats">
                        <span className={`badge ${unresolvedAlerts.length > 0 ? 'badge-danger' : 'badge-success'}`}>
                            {unresolvedAlerts.length} Active Alert{unresolvedAlerts.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="card-body">
                    {/* Critical Alerts Section */}
                    {unresolvedAlerts.length > 0 && (
                        <div className="alerts-section mb-xl">
                            <h3 className="section-title flex items-center gap-sm text-sm font-bold uppercase tracking-wider text-tertiary mb-md">
                                <Bell size={16} className="text-secondary" />
                                Active System Alerts
                            </h3>
                            <div className="alerts-list space-y-md">
                                {unresolvedAlerts.map((alert) => {
                                    const color = getUrgencyColor(alert)
                                    return (
                                        <div key={alert.id} className={`alert-item alert-${color} p-md rounded-lg border-l-4`}>
                                            <div className="alert-header flex justify-between items-center mb-xs">
                                                <span className={`badge badge-${color} text-xs`}>
                                                    {alert.severity}
                                                </span>
                                                <span className="alert-time text-xs text-tertiary">
                                                    {new Date(alert.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="alert-content">
                                                <p className="alert-message font-medium text-sm mb-xs">{alert.message}</p>
                                                {alert.stockItem && (
                                                    <p className="alert-item-name text-xs text-tertiary">
                                                        Linked Item: <strong className="text-secondary">{alert.stockItem.name}</strong>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="alert-type mt-sm">
                                                <span className="type-badge bg-bg-tertiary/50 text-[10px] uppercase font-bold px-sm py-1 rounded">
                                                    {alert.alertType.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Expiring Items Section */}
                    {expiringItems.length > 0 && (
                        <div className="expiry-section">
                            <h3 className="section-title flex items-center gap-sm text-sm font-bold uppercase tracking-wider text-tertiary mb-md">
                                <Clock size={16} className="text-warning" />
                                Items Expiring Soon
                            </h3>
                            <div className="expiry-timeline space-y-md">
                                {expiringItems.map((item) => {
                                    const urgency = getExpiryUrgency(item.daysUntilExpiry)
                                    return (
                                        <div key={item.id} className={`expiry-item expiry-${urgency.color} card p-md transition-all`}>
                                            <div className="flex gap-md">
                                                <div className={`expiry-urgency-badge p-sm rounded-lg flex items-center justify-center bg-${urgency.color}/10 text-${urgency.color}`}>
                                                    {urgency.icon}
                                                </div>
                                                <div className="expiry-content flex-1">
                                                    <div className="expiry-header flex justify-between items-start mb-sm">
                                                        <h4 className="expiry-item-name font-bold text-sm m-0">{item.name}</h4>
                                                        <span className={`badge badge-${urgency.color} text-[10px]`}>
                                                            {urgency.label}
                                                        </span>
                                                    </div>
                                                    <div className="expiry-details flex justify-between items-end">
                                                        <div className="expiry-countdown">
                                                            <span className={`countdown-value text-lg font-black text-${urgency.color}`}>{item.daysUntilExpiry}</span>
                                                            <span className="countdown-label text-[10px] text-tertiary ml-1 uppercase">
                                                                day{item.daysUntilExpiry !== 1 ? 's' : ''} left
                                                            </span>
                                                        </div>
                                                        <div className="expiry-date text-[10px] text-tertiary font-mono">
                                                            {new Date(item.expiryDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="expiry-stock-info mt-sm pt-sm border-t border-border/20 text-[10px] text-tertiary">
                                                        Current: <strong className="text-secondary">{item.currentStock} {item.unit}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {unresolvedAlerts.length === 0 && expiringItems.length === 0 && (
                        <div className="empty-state py-xl text-center">
                            <CheckCircle size={48} className="text-success mx-auto mb-md opacity-20" />
                            <p className="empty-message font-bold text-success mb-xs">Dashboard Healthy!</p>
                            <p className="empty-submessage text-xs text-tertiary">No critical items or alerts tracked right now.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Critical Alert Popup */}
            {showCriticalPopup && (
                <div className="critical-popup modal-overlay">
                    <div className="popup-content card animate-slideUp max-w-sm text-center">
                        <div className="popup-icon mb-md mx-auto w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="popup-title text-xl font-black mb-sm">Immediate Attention!</h3>
                        <p className="popup-message text-tertiary text-sm mb-lg">
                            You have {alerts.filter(a => !a.isResolved && a.severity === 'CRITICAL').length} critical alert(s) on your dashboard requiring immediate intervention.
                        </p>
                        <button
                            className="btn btn-danger w-full hover-glow shadow-lg"
                            onClick={() => setShowCriticalPopup(false)}
                        >
                            Acknowledge & Inspect
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UrgencyPanel
