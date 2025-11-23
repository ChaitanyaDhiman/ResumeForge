const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const testDir = path.join(__dirname); // Current directory (tests/)

function findTestFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findTestFiles(filePath, fileList);
        } else if (file.endsWith('.test.js')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

async function runTests() {
    const testFiles = findTestFiles(testDir);
    console.log(`Found ${testFiles.length} test files.`);

    let failed = false;

    for (const file of testFiles) {
        console.log(`\n---------------------------------------------------`);
        console.log(`🏃 Running ${path.relative(process.cwd(), file)}...`);
        console.log(`---------------------------------------------------`);

        await new Promise((resolve) => {
            const child = spawn('node', [file], { stdio: 'inherit' });
            child.on('close', (code) => {
                if (code !== 0) {
                    failed = true;
                    console.error(`❌ Test failed: ${path.relative(process.cwd(), file)}`);
                }
                resolve();
            });
        });
    }

    console.log(`\n===================================================`);
    if (failed) {
        console.error('❌ Some tests failed.');
        process.exit(1);
    } else {
        console.log('✅ All tests passed!');
    }
    console.log(`===================================================`);
}

runTests();
