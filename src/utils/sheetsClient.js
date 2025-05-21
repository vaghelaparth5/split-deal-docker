// src/utils/sheetsClient.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const KEYFILEPATH = path.join(__dirname, '../config/service-account.json'); 
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

async function getSheetsClient() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  return sheets;
}

module.exports = getSheetsClient;
