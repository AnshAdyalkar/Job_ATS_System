const fs = require('fs');
const http = require('http');

// Create a dummy PDF file content (minimal valid PDF structure)
const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 24 Tf
100 700 Td
(Hello World) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000157 00000 n 
0000000302 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
400
%%EOF`;

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const createMultipartBody = (email, fileContent, boundary) => {
    let body = '';
    // Email field
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="email"\r\n\r\n`;
    body += `${email}\r\n`;

    // File field
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="resume"; filename="test.pdf"\r\n`;
    body += `Content-Type: application/pdf\r\n\r\n`;
    return Buffer.concat([
        Buffer.from(body),
        Buffer.from(fileContent),
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
};

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/upload',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(createMultipartBody('test@example.com', pdfContent, boundary));
req.end();
