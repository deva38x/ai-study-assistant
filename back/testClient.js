const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  try {
    console.log('Registering user...');
    const reg = await request(
      { hostname: 'localhost', port: 5000, path: '/api/users/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { name: 'AutoUser', email: 'autouser2@example.com', password: 'password123' }
    );
    console.log('Register response:', reg.status, reg.body);

    const token = reg.body.token;
    if (!token) {
      console.error('No token returned; aborting');
      return;
    }

    console.log('Creating note...');
    const create = await request(
      { hostname: 'localhost', port: 5000, path: '/api/notes', method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } },
      { title: 'Auto Note', subject: 'Science', pdfUrl: 'http://example.com/doc.pdf' }
    );
    console.log('Create response:', create.status, create.body);

    console.log('Fetching notes...');
    const list = await request(
      { hostname: 'localhost', port: 5000, path: '/api/notes', method: 'GET', headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('List response:', list.status, list.body);
  } catch (e) {
    console.error('Error during requests:', e);
  }
})();
