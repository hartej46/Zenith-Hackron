import { useState } from 'react'
import { Package, BarChart, Scale, AlertCircle, Clock, Filter } from 'lucide-react'
import './InventoryPanel.css'

function InventoryPanel({ stockItems }) {
    const [filterCategory, setFilterCategory] = useState('all')

    const categories = ['all', ...new Set(stockItems.map(item => item.category))]

    const filteredItems = filterCategory === 'all'
        ? stockItems
        : stockItems.filter(item => item.category === filterCategory)

    const getStockStatus = (item) => {
        const { currentStock, minimumStock, lastMinuteStock } = item

        if (currentStock <= lastMinuteStock) {
            return { status: 'critical', label: 'Critical', color: 'danger' }
        } else if (currentStock <= minimumStock) {
            return { status: 'low', label: 'Low Stock', color: 'warning' }
        } else {
            return { status: 'normal', label: 'Normal', color: 'success' }
        }
    }

    const getStockPercentage = (item) => {
        // Calculate percentage based on minimum stock as baseline
        const target = item.minimumStock * 2 // Assume 2x minimum is optimal
        return Math.min((item.currentStock / target) * 100, 100)
    }

    return (
        <div className="inventory-panel">
            <div className="card h-full">
                <div className="card-header">
                    <div className="flex items-center gap-md">
                        <Package size={22} className="text-primary" />
                        <h2 className="card-title text-xl m-0">Inventory Items</h2>
                    </div>
                    <div className="inventory-filters flex items-center gap-sm">
                        <Filter size={16} className="text-tertiary" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="filter-select text-sm py-xs"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="card-body">
                    {filteredItems.length === 0 ? (
                        <div className="empty-state py-xl text-center">
                            <Package size={48} className="text-tertiary mx-auto mb-md opacity-20" />
                            <p className="text-tertiary">No stock items found.</p>
                        </div>
                    ) : (
                        <div className="inventory-grid">
                            {filteredItems.map((item) => {
                                const status = getStockStatus(item)
                                const percentage = getStockPercentage(item)

                                return (
                                    <div key={item.id} className="inventory-item card hover-lift mb-lg">
                                        <div className="inventory-item-header flex justify-between items-start mb-md">
                                            <div>
                                                <h3 className="item-name text-lg font-bold mb-xs">{item.name}</h3>
                                                <span className="item-category badge badge-secondary text-xs">{item.category}</span>
                                            </div>
                                            <span className={`badge badge-${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="inventory-metrics space-y-sm mb-lg">
                                            {/* Current Stock */}
                                            <div className="metric-row flex justify-between items-center py-xs border-b border-border/50">
                                                <div className="metric-label flex items-center gap-sm text-sm text-tertiary">
                                                    <BarChart size={14} className="text-info" />
                                                    Current Stock
                                                </div>
                                                <div className="metric-value font-semibold">
                                                    {item.currentStock} <span className="text-xs text-tertiary font-normal">{item.unit}</span>
                                                </div>
                                            </div>

                                            {/* Minimum Stock */}
                                            <div className="metric-row flex justify-between items-center py-xs border-b border-border/50">
                                                <div className="metric-label flex items-center gap-sm text-sm text-tertiary">
                                                    <Scale size={14} className="text-warning" />
                                                    Min. Threshold
                                                </div>
                                                <div className="metric-value font-semibold">
                                                    {item.minimumStock} <span className="text-xs text-tertiary font-normal">{item.unit}</span>
                                                </div>
                                            </div>

                                            {/* Last Minute Stock */}
                                            <div className="metric-row flex justify-between items-center py-xs">
                                                <div className="metric-label flex items-center gap-sm text-sm text-tertiary">
                                                    <AlertCircle size={14} className="text-danger" />
                                                    Critical limit
                                                </div>
                                                <div className="metric-value font-semibold text-danger">
                                                    {item.lastMinuteStock} <span className="text-xs text-tertiary font-normal">{item.unit}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stock Level Bar */}
                                        <div className="stock-level-bar mt-md">
                                            <div className="level-indicators flex justify-between mb-xs">
                                                <span className="level-label text-xs text-tertiary font-semibold uppercase tracking-wider">Health</span>
                                                <span className="level-percentage text-xs font-bold">{Math.round(percentage)}%</span>
                                            </div>
                                            <div className="progress h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                                <div
                                                    className={`progress-bar progress-${status.color} h-full transition-all duration-500`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Expiry Info */}
                                        {item.expiryDate && (
                                            <div className="expiry-info flex items-center gap-sm mt-md p-sm bg-bg-tertiary/50 rounded-lg">
                                                <Clock size={14} className="text-warning" />
                                                <span className="expiry-text text-xs text-tertiary">
                                                    Expires: <span className="text-secondary font-medium">{new Date(item.expiryDate).toLocaleDateString()}</span>
                                                </span>
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

export default InventoryPanel
