import express from 'express'
import cors from 'cors'
import { PrismaClient } from '../node_modules/@prisma/client/default.js'

const app = express()
const prisma = new PrismaClient()
const PORT = 4000

// Middleware
app.use(cors())
app.use(express.json())

// Stock Items Routes
app.get('/api/stock-items', async (req, res) => {
    try {
        const items = await prisma.stockItem.findMany({
            orderBy: { createdAt: 'desc' }
        })
        res.json(items)
    } catch (error) {
        console.error('Error fetching stock items:', error)
        res.status(500).json({ error: 'Failed to fetch stock items' })
    }
})

app.post('/api/stock-items', async (req, res) => {
    try {
        const item = await prisma.stockItem.create({
            data: req.body
        })
        res.json(item)
    } catch (error) {
        console.error('Error creating stock item:', error)
        res.status(500).json({ error: 'Failed to create stock item' })
    }
})

app.put('/api/stock-items/:id', async (req, res) => {
    try {
        const item = await prisma.stockItem.update({
            where: { id: req.params.id },
            data: req.body
        })
        res.json(item)
    } catch (error) {
        console.error('Error updating stock item:', error)
        res.status(500).json({ error: 'Failed to update stock item' })
    }
})

app.delete('/api/stock-items/:id', async (req, res) => {
    try {
        await prisma.stockItem.delete({
            where: { id: req.params.id }
        })
        res.json({ message: 'Stock item deleted' })
    } catch (error) {
        console.error('Error deleting stock item:', error)
        res.status(500).json({ error: 'Failed to delete stock item' })
    }
})

// Orders Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        stockItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        res.status(500).json({ error: 'Failed to fetch orders' })
    }
})

app.post('/api/orders', async (req, res) => {
    const { customerName, contactInfo, priority, status, deadline, notes, items } = req.body

    console.log('📦 Creating order for:', customerName)
    console.log('📝 Order items:', JSON.stringify(items))

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Build the data object carefully to avoid undefined fields
            const orderData = {
                customerName,
                contactInfo,
                notes,
                priority: priority || 'MEDIUM',
                status: status || 'PENDING',
                items: {
                    create: items?.map(item => ({
                        stockItemId: item.stockItemId,
                        quantity: parseInt(item.quantity)
                    }))
                }
            }

            // Only add deadline if it's a valid date string
            if (deadline) {
                const date = new Date(deadline)
                if (!isNaN(date.getTime())) {
                    orderData.deadline = date
                }
            }

            // 1. Create the Order
            const order = await tx.order.create({
                data: orderData,
                include: {
                    items: true
                }
            })

            // 2. Reduce Stock for each item
            if (items && items.length > 0) {
                for (const item of items) {
                    const qty = parseInt(item.quantity)
                    if (isNaN(qty)) throw new Error(`Invalid quantity for item ${item.stockItemId}`)

                    await tx.stockItem.update({
                        where: { id: item.stockItemId },
                        data: {
                            currentStock: {
                                decrement: qty
                            }
                        }
                    })
                }
            }

            return order
        })

        // Fetch complete order with included items for response
        const fullOrder = await prisma.order.findUnique({
            where: { id: result.id },
            include: {
                items: {
                    include: {
                        stockItem: true
                    }
                }
            }
        })

        console.log('✅ Order created successfully:', fullOrder.id)
        res.json(fullOrder)
    } catch (error) {
        console.error('❌ Error creating order with stock reduction:')
        console.error(error)
        res.status(500).json({
            error: 'Failed to create order and update inventory',
            details: error.message
        })
    }
})

app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: req.body.status }
        })
        res.json(order)
    } catch (error) {
        console.error('Error updating order status:', error)
        res.status(500).json({ error: 'Failed to update order status' })
    }
})

// Alerts Routes
app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await prisma.urgencyAlert.findMany({
            include: {
                stockItem: true
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(alerts)
    } catch (error) {
        console.error('Error fetching alerts:', error)
        res.status(500).json({ error: 'Failed to fetch alerts' })
    }
})

app.patch('/api/alerts/:id/resolve', async (req, res) => {
    try {
        const alert = await prisma.urgencyAlert.update({
            where: { id: req.params.id },
            data: {
                isResolved: true,
                resolvedAt: new Date()
            }
        })
        res.json(alert)
    } catch (error) {
        console.error('Error resolving alert:', error)
        res.status(500).json({ error: 'Failed to resolve alert' })
    }
})

// Tasks Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                order: true
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        res.status(500).json({ error: 'Failed to fetch tasks' })
    }
})

app.post('/api/tasks', async (req, res) => {
    try {
        const task = await prisma.task.create({
            data: req.body
        })
        res.json(task)
    } catch (error) {
        console.error('Error creating task:', error)
        res.status(500).json({ error: 'Failed to create task' })
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`)
    console.log(`📊 Ready to handle requests from frontend`)
})

// Cleanup on shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit()
})
