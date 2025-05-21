await sheets.spreadsheets.values.append({
  spreadsheetId: SPREADSHEET_ID,
  range: 'Sheet1!A1',
  valueInputOption: 'RAW',
  requestBody: {
    values: [
      ['Test Deal', 'Sydney Deal', '25.99', '50.00', '2025-06-01', 'Sydney', '100', 'Electronics', 'http://img.url']
    ]
  },
});

const readRes = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: 'Sheet1'
});

console.log('Read values:', readRes.data.values);
