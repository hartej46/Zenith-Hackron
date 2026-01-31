
// import fetch from 'node-fetch'; // Using global fetch

async function testNewFeatures() {
    const url = 'http://localhost:4000/api/stock-items';

    // 1. Test Custom Category
    console.log('--- Testing Custom Category ---');
    const customCatData = {
        name: 'Custom Cat Item ' + Date.now(),
        description: 'Testing Custom Category',
        currentStock: 10,
        minimumStock: 5,
        lastMinuteStock: 2,
        expiryDate: new Date().toISOString(),
        unit: 'units',
        category: 'MyUniqueCategory_' + Date.now(), // Custom Category
        isArchived: false
    };

    try {
        const res1 = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customCatData)
        });
        const json1 = await res1.json();
        if (res1.ok && json1.category === customCatData.category) {
            console.log('✅ Custom Category Success:', json1.category);
        } else {
            console.error('❌ Custom Category Failed:', json1);
        }
    } catch (err) { console.error(err); }

    // 2. Test Archived Item
    console.log('\n--- Testing Archived Item ---');
    const archivedData = {
        name: 'Archived Item ' + Date.now(),
        description: 'Testing Archive',
        currentStock: 50,
        minimumStock: 5,
        lastMinuteStock: 2,
        expiryDate: new Date().toISOString(),
        unit: 'units',
        category: 'General',
        isArchived: true // Archived
    };

    try {
        const res2 = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(archivedData)
        });
        const json2 = await res2.json();
        if (res2.ok && json2.isArchived === true) {
            console.log('✅ Archive Success. isArchived:', json2.isArchived);
        } else {
            console.error('❌ Archive Failed:', json2);
        }
    } catch (err) { console.error(err); }
}

testNewFeatures();
