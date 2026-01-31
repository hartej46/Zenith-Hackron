
// import fetch from 'node-fetch'; // Using global fetch

async function testCreateProduct() {
    const url = 'http://localhost:4000/api/stock-items';
    const data = {
        name: 'Test Product ' + Date.now(),
        category: 'Test Category',
        description: 'Test Description',
        minimumStock: 10,
        currentStock: 100,
        lastMinuteStock: 5,
        unit: 'units',
        expiryDate: new Date().toISOString()
    };

    try {
        console.log('Sending request to:', url);
        console.log('Payload:', JSON.stringify(data, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log('Response Status:', response.status);


        if (response.ok) {
            const json = await response.json();
            console.log('Success:', json);

            // Verify GET
            console.log('Verifying GET /api/stock-items...');
            const getRes = await fetch('http://localhost:4000/api/stock-items');
            if (getRes.ok) {
                const items = await getRes.json();
                console.log('GET Success. Items count:', items.length);
                console.log('Items:', JSON.stringify(items, null, 2));
            } else {
                console.error('GET Failed:', getRes.status);
            }
        } else {
            const text = await response.text();
            console.error('Error:', text);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testCreateProduct();
