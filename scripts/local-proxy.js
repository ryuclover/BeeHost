import http from 'http';
import net from 'net';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Proxy alive\n');
});

server.on('connect', (req, clientSocket, head) => {
  const [host, port] = req.url.split(':');
  const serverSocket = net.connect(port || 443, host, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    clientSocket.end('HTTP/1.1 500 Connection Error\r\n\r\n');
  });

  clientSocket.on('error', () => {
    serverSocket.end();
  });
});

server.listen(8088, '127.0.0.1', () => {
  console.log('Local forward proxy listening on 127.0.0.1:8088');
});
