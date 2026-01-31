
// import fetch from 'node-fetch'; // Using global fetch

async function testCreateProductSuccess() {
    const url = 'http://localhost:4000/api/stock-items';
    // Payload mimicking CORRECT CreateProduct.jsx (WITH lastMinuteStock)
    const data = {
        name: 'Test Success Product ' + Date.now(),
        description: 'Test Description',
        currentStock: 100,
        minimumStock: 5,
        lastMinuteStock: 2, // Required field now included
        expiryDate: new Date().toISOString(),
        unit: 'units',
        category: 'General'
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
        } else {
            const text = await response.json();
            console.error('Error Body:', text);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testCreateProductSuccess();
