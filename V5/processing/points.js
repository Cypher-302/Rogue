const fs = require('fs');

function jsonReader(filePath, callback) { // credit for this function: https://heynode.com/tutorial/readwrite-json-files-nodejs/
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            return callback && callback(err);
        }
        try {
            const object = JSON.parse(fileData);
            return callback && callback(null, object);
        } catch (err) {
            return callback && callback(err);
        }
    });
}

jsonReader('../user-data/cypher_302.json', (err, user) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(user.username, user.points);
})