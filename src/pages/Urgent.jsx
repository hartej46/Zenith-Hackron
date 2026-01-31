import { useState, useEffect } from 'react'
import { AlertTriangle, AlertCircle, Info, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'
import './Urgent.css'

function Urgent() {
    const [alerts, setAlerts] = useState([])
    const [stockItems, setStockItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUrgentData()
    }, [])

    const fetchUrgentData = async () => {
        try {
            setLoading(true)
            const [alertsData, stockData] = await Promise.all([
                api.getUnresolvedAlerts(),
                api.getStockItems()
            ])
            setAlerts(alertsData)
            setStockItems(stockData)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching urgent data:', error)
            setLoading(false)
        }
    }

    // Logic to calculate expiring items
    const getExpiringItems = () => {
        const now = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(now.getDate() + 30)

        return stockItems
            .filter(item => item.expiryDate && new Date(item.expiryDate) <= thirtyDaysFromNow)
            .map(item => {
                const expiryDate = new Date(item.expiryDate)
                const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))

                let urgency = 'info'
                if (diffDays <= 7) urgency = 'danger'
                else if (diffDays <= 14) urgency = 'warning'

                return { ...item, diffDays, urgency }
            })
            .sort((a, b) => a.diffDays - b.diffDays)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    const expiringItems = getExpiringItems()

    return (
        <div className="urgent-page p-xl animate-fadeIn">
            <header className="page-header mb-xl">
                <h1 className="text-3xl font-black m-0 mb-xs underline decoration-danger decoration-4 underline-offset-8">Urgent Alerts</h1>
                <p className="text-tertiary mt-md">Immediate actions required for inventory stability</p>
            </header>

            <div className="urgent-grid grid grid-cols-1 lg:grid-cols-2 gap-2xl">
                {/* System Alerts Section */}
                <section className="alert-section">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-lg flex items-center gap-sm">
                        <AlertCircle size={18} /> System Level Alerts
                    </h2>
                    <div className="flex flex-col gap-md">
                        {alerts.length > 0 ? alerts.map((alert) => (
                            <div key={alert.id} className={`urgent-item alert-${alert.type.toLowerCase()}`}>
                                <div className="flex items-start gap-md">
                                    <div className="icon-wrapper mt-[2px]">
                                        {alert.type === 'CRITICAL' ? <AlertCircle size={20} /> : <AlertTriangle size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold m-0">{alert.message}</h3>
                                            <span className="text-[10px] font-bold uppercase opacity-60">Live</span>
                                        </div>
                                        <p className="text-xs mt-xs opacity-80">Action required immediately to prevent production downtime.</p>
                                        <div className="mt-md flex justify-end">
                                            <button className="text-[10px] font-bold uppercase tracking-wider bg-black/5 hover:bg-black/10 px-sm py-[4px] rounded transition-all">
                                                Resolve Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-state text-center py-2xl bg-white rounded-lg shadow-sm border border-border-subtle">
                                <CheckCircle2 size={40} className="mx-auto text-success mb-md" />
                                <p className="text-sm font-medium">All system systems are stable</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Expiries Section */}
                <section className="expiry-section">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-lg flex items-center gap-sm">
                        <Clock size={18} /> Expiring Soon
                    </h2>
                    <div className="grid grid-cols-1 gap-md">
                        {expiringItems.length > 0 ? expiringItems.map((item) => (
                            <div key={item.id} className={`urgent-item expiry-${item.urgency}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-md">
                                        <div className="icon-wrapper mt-[2px]">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold m-0">{item.name}</h3>
                                            <p className="text-xs mt-xs opacity-70">Category: {item.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black italic">{item.diffDays} Days</div>
                                        <div className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Remaining</div>
                                    </div>
                                </div>
                                <div className="mt-md bg-white/40 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-current opacity-60"
                                        style={{ width: `${Math.max(0, 100 - (item.diffDays * 3))}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-state text-center py-2xl bg-white rounded-lg shadow-sm border border-border-subtle">
                                <CheckCircle2 size={40} className="mx-auto text-success mb-md" />
                                <p className="text-sm font-medium">No items expiring within 30 days</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Urgent
