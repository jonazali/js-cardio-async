const fs = require('fs').promises;

/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/

function log(value) {
  return fs.appendFile('log.txt', `${value} ${Date.now()}\n`);
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */

async function get(file, key) {
  /* Async/await approach */
  try {
    // 1. read file
    // 2. handle promise -> data
    const data = await fs.readFile(file, 'utf8');
    // 3. parse data from string -> JSON
    const parsed = JSON.parse(data);
    // 4. use the key to get the value at object[key]
    const value = parsed[key];
    // 5. append the log file with the above value
    if (!value) return log(`ERROR ${key} invalid key on ${file}`);
    return log(value);
  } catch (err) {
    log(`ERROR no such file or directory ${file}`);
  }
  /* Promise-based approach
  return fs
    .readFile(file, 'utf8')
    .then(data => {
      const parsed = JSON.parse(data);
      const value = parsed[key];
      if (!value) return log(`ERROR ${key} invalid key on ${file}`);
      return log(value);
    })
    .catch(err => log(`ERROR no such file or directory ${file}`));
    */
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
async function set(file, key, value) {
  try {
    // 1. Read File
    const data = await fs.readFile(file, 'utf8');
    // 2. Get Data
    const parsed = JSON.parse(data);
    // 3. Assign new Value to Key
    parsed[key] = value;
    // 4. Write to File Again
    await fs.writeFile(file, JSON.stringify(parsed));
  } catch (err) {
    log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
async function remove(file, key) {
  try {
    // 1. Read File
    const data = await fs.readFile(file, 'utf8');
    // 2. Get Data
    const parsed = JSON.parse(data);
    // 3. Delete Key
    delete parsed[key];
    // 4. Write to File Again
    await fs.writeFile(file, JSON.stringify(parsed));
  } catch (err) {
    log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
async function deleteFile(file) {
  try {
    await fs.unlink(`${file}`);
  } catch (err) {
    log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
async function createFile(file) {
  try {
    await fs.writeFile(`${file}`, '{}');
  } catch (err) {
    log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
async function mergeData() {
  try {
    const megaObj = {};
    const files = await fs.readdir('.');
    const filteredFiles = files.filter(
      file => file.includes('.json') && !file.includes('package')
    );
    for await (const file of filteredFiles) {
      const trimmedFileName = file.slice(0, file.indexOf('.'));
      megaObj[trimmedFileName] = JSON.parse(await fs.readFile(file, 'utf8'));
    }
    return log(JSON.stringify(megaObj));
  } catch (err) {
    return log(`ERROR ${err}`);
  }
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
function union(fileA, fileB) {}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
function intersect(fileA, fileB) {}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
function difference(fileA, fileB) {}

const PORT = 5000;

module.exports = {
  PORT,
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference
};
