import http from 'http';
import handler from './dist/api/index.js';

const server = http.createServer(async (req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(404);
    res.end();
    return;
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  const fullUrl = `${protocol}://${host}${req.url}`;
  
  const edgeReq = new Request(fullUrl, {
    method: req.method,
    headers: req.headers
  });
  
  try {
    const edgeRes = await handler(edgeReq);
    
    const resHeaders = {};
    edgeRes.headers.forEach((val, key) => {
      resHeaders[key] = val;
    });
    
    res.writeHead(edgeRes.status, resHeaders);
    const body = await edgeRes.text();
    res.end(body);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Internal Server Error: ${err.message}\n${err.stack}`);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`GitCrib test server running at http://localhost:${PORT}`);
});
