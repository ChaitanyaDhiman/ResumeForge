const fs = require('fs');
const path = require('path');

async function main() {
    console.log('🚀 Starting Parsing Logic Integration Test...');

    try {
        // 1. Test Flask Parser Service (Directly)
        console.log('🐍 Testing Flask Parser Service (http://localhost:5001)...');

        // Create a dummy PDF file (minimal valid PDF structure)
        const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
        const dummyPdfContent = `%PDF-1.4
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
<< /Length 21 >>
stream
BT /F1 24 Tf (Hello World) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000224 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
294
%%EOF`;

        fs.writeFileSync(dummyPdfPath, dummyPdfContent);

        const formData = new FormData();
        const fileBlob = new Blob([fs.readFileSync(dummyPdfPath)], { type: 'application/pdf' });
        formData.append('file', fileBlob, 'dummy.pdf');

        const flaskRes = await fetch('http://localhost:5001/extract-text', {
            method: 'POST',
            body: formData,
        });

        if (!flaskRes.ok) {
            const err = await flaskRes.text();
            throw new Error(`Flask Parser failed: ${flaskRes.status} ${err}`);
        }

        const flaskData = await flaskRes.json();
        if (flaskData.status !== 'success') {
            throw new Error(`Flask Parser returned status: ${flaskData.status}`);
        }

        // Note: The dummy PDF might not extract clean text perfectly with pypdf if it's too minimal,
        // but we check if the service processed it without error.
        console.log('✅ Flask Parser Service processed PDF successfully');
        console.log(`   Extracted Text Length: ${flaskData.clean_text ? flaskData.clean_text.length : 0}`);

        // Clean up dummy file
        fs.unlinkSync(dummyPdfPath);


        // 2. Test Next.js API Auth Protection
        console.log('🛡️  Testing Next.js API Auth Protection (http://localhost:3000/api/parse-resume)...');

        const nextRes = await fetch('http://localhost:3000/api/parse-resume', {
            method: 'POST',
            // No headers or cookies = Unauthenticated
        });

        if (nextRes.status === 401) {
            console.log('✅ Next.js API correctly rejected unauthenticated request (401)');
        } else {
            throw new Error(`Next.js API should return 401 for unauthenticated request, got ${nextRes.status}`);
        }

        console.log('🎉 Parsing Logic & Validation Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        // Clean up if error occurred before unlink
        try {
            if (fs.existsSync(path.join(__dirname, 'dummy.pdf'))) {
                fs.unlinkSync(path.join(__dirname, 'dummy.pdf'));
            }
        } catch (e) { }

        process.exit(1);
    }
}

main();
