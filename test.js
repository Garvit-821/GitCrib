import assert from 'assert';

async function runTests() {
  const PORT = 3000;
  console.log('Running GitCrib Edge Route integration tests...\n');

  // Test Case: Custom parameters
  {
    console.log('Test Case 1: Custom username, dev class, stars, reviews');
    const res = await fetch(`http://localhost:${PORT}/?username=devguru&devClass=kernel%20hacker&stars=8450&reviews=1290`);
    
    assert.strictEqual(res.status, 200, 'Expected HTTP 200');
    assert.strictEqual(res.headers.get('Content-Type'), 'image/svg+xml', 'Expected SVG content type');
    assert.strictEqual(res.headers.get('Cache-Control'), 'max-age=0, no-cache, no-store, must-revalidate');
    assert.strictEqual(res.headers.get('Pragma'), 'no-cache');
    assert.strictEqual(res.headers.get('Expires'), '0');

    const svg = await res.text();
    assert.ok(svg.includes('viewBox="0 0 1200 1600"'), 'SVG should have 1200x1600 aspect ratio');
    assert.ok(!svg.includes('&display=swap'), 'Should not contain raw unescaped ampersand in font URL');
    assert.ok(svg.includes('&amp;display=swap'), 'Should contain escaped ampersand in font URL');
    assert.ok(svg.includes('DEVGURU'), 'Username should be rendered in uppercase');
    assert.ok(svg.includes('KERNEL HACKER'), 'Dev class should be rendered in uppercase');
    assert.ok(svg.includes('8,450'), 'Stars should be formatted with thousands separator');
    assert.ok(svg.includes('1,290'), 'Reviews should be formatted with thousands separator');

    // Structural elements check
    assert.ok(svg.includes('id="header-block"'), 'Should render header block');
    assert.ok(svg.includes('id="central-radial-heatmap"'), 'Should render radial heatmap');
    assert.ok(svg.includes('id="metrics-grid"'), 'Should render metrics grid');
    assert.ok(svg.includes('id="language-spectrogram"'), 'Should render language spectrogram');
    
    // Animation classes check
    assert.ok(svg.includes('class="radar-beam"'), 'Should contain radar sweep element');
    assert.ok(svg.includes('attributeName="height"'), 'Should contain SMIL height animation');
    assert.ok(svg.includes('attributeName="y"'), 'Should contain SMIL y animation');
    assert.ok(svg.includes('class="data-node"'), 'Should contain heatmap node pulse class');

    console.log('✔ Passed Test Case 1\n');
  }

  console.log('All GitCrib integration tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
