const cron = require('node-cron');
const axios = require('axios');
// const Orders = require('./models/orders'); // Import your Orders model
import Orders from '../ecommerce-website/src/admin/pages/Orders';

const DELHIVERY_API_KEY = '173be55420d7d898834b8df53c1bc73ddde4a45f';
const DELHIVERY_URL = 'https://track.delhivery.com/api/v1/packages/json/';

// Schedule a cron job to run every hour (adjust timing as needed)
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled task to update shipment statuses');

    try {
        const pendingOrders = await Orders.findAll({ where: { status: 'shipped' } });

        for (const order of pendingOrders) {
            try {
                const response = await axios.get(DELHIVERY_URL, {
                    params: { waybill: order.tracking_id },
                    headers: {
                        Authorization: `Bearer ${DELHIVERY_API_KEY}`,
                    },
                });

                // Update order status in the database based on API response
                await Orders.update(
                    { status: response.data.status },
                    { where: { id: order.id } }
                );
                console.log(`Order ${order.id} updated to status: ${response.data.status}`);
            } catch (error) {
                console.error(`Failed to fetch status for order ${order.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error fetching pending orders:', error.message);
    }
});
