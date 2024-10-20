const fs = require('fs');

function readFile() {
  fs.readFile('images/bullet.png',  (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File content:', data);
});
}

readFileAsync();