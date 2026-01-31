import { NavLink } from 'react-router-dom'
import { LayoutDashboard, LayoutGrid, Package, Truck, MessageSquare, BarChart3, ClipboardList, AlertTriangle, Users, PlusCircle } from 'lucide-react'
import './Sidebar.css'

function Sidebar() {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Overview' },
        { path: '/products', icon: Package, label: 'Products' },
        { path: '/orders', icon: ClipboardList, label: 'Orders' },
        { path: '/urgent', icon: AlertTriangle, label: 'Urgent' },
        { path: '/categories', icon: LayoutGrid, label: 'Categories' },
        { path: '/suppliers', icon: Users, label: 'Suppliers' },
        { path: '/create-order', icon: PlusCircle, label: 'Create Order' },
        { path: '/ai-chat', icon: MessageSquare, label: 'AI Chatbot' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="flex items-center gap-md">
                    <BarChart3 className="logo-icon" size={24} />
                    <span className="logo-text font-black text-xl tracking-tight">ZENITH</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="p-md bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-xs">Status</p>
                    <div className="flex items-center gap-sm">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        <span className="text-xs font-semibold text-secondary">System Online</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
