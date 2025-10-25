import http from 'http';
import url from 'url';
import QRCode from 'qrcode';

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Mock endpoint: /v1/create-qr-code/
  if (pathname === '/v1/create-qr-code/' && req.method === 'GET') {
    const data = query.data;
    const size = query.size || '200x200';

    if (!data) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing data parameter' }));
      return;
    }

    try {
      // Parse size (e.g., "200x200")
      const [width, height] = size.split('x').map(Number);

      console.log("WH:", width, height)
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || !width || !height) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid size parameter' }));
        return;
      }

      if (width > 10000 || height > 10000) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Size too large' }));
        return;
      }

      // Generate QR code as PNG buffer
      const pngBuffer = await QRCode.toBuffer(data, {
        width,
        height,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

	  console.log(`GENERATED[${new Date()}]:`, data);

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': pngBuffer.length,
      });
      res.end(pngBuffer);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`QR Code API mock server running at http://localhost:${PORT}`);
  console.log(`Endpoint: GET /v1/create-qr-code/?size=200x200&data=YOUR_DATA`);
});
