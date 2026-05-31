// backend/utils/jsonDb.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

const defaultDb = {
  users: [],
  notes: []
};

const readDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local JSON database:', error);
    return defaultDb;
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving to local JSON database:', error);
  }
};

module.exports = { readDb, writeDb };
