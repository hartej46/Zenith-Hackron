
// import fetch from 'node-fetch'; // Global fetch

async function testCategoryAPI() {
    const url = 'http://localhost:4000/api/categories';

    console.log('--- Testing Create Category ---');
    let catId = '';
    const catData = {
        name: 'Test Category ' + Date.now(),
        description: 'Testing backend API'
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(catData)
        });
        const json = await res.json();
        if (res.ok) {
            console.log('✅ Created:', json);
            catId = json.id;
        } else {
            console.error('❌ Create Failed:', json);
        }
    } catch (err) { console.error('Create Err:', err); }

    console.log('\n--- Testing List Categories ---');
    try {
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok) {
            console.log(`✅ Fetched ${json.length} categories.`);
        } else {
            console.error('❌ Fetch Failed:', json);
        }
    } catch (err) { console.error('Fetch Err:', err); }

    if (catId) {
        console.log('\n--- Testing Delete Category ---');
        try {
            const res = await fetch(`${url}/${catId}`, { method: 'DELETE' });
            if (res.ok) {
                console.log('✅ Deleted Category');
            } else {
                console.error('❌ Delete Failed:', await res.text());
            }
        } catch (err) { console.error('Delete Err:', err); }
    }
}

testCategoryAPI();
