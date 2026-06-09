// ═══════════════════════════════════════════════════════════════════
// GERAK — Jubah Booking Google Apps Script
// ═══════════════════════════════════════════════════════════════════
//
// HOW TO DEPLOY:
//   1. Create a new Google Sheet (sheets.new)
//   2. Click Extensions → Apps Script
//   3. Delete existing code, paste this entire file
//   4. Click Deploy → New deployment
//      Type: Web app | Execute as: Me | Access: Anyone
//   5. Copy the Web app URL
//   6. Paste into: src/lib/sheetsService.ts → SHEETS_WEBAPP_URL
//
// SHEETS CREATED AUTOMATICALLY:
//   • UMPSA  → Universiti Malaysia Pahang Al-Sultan Abdullah
//   • UIA    → Universiti Islam Antarabangsa Malaysia
//   • UITM   → Universiti Teknologi MARA (UiTM)
//   • Others → any unknown university (safety fallback)
//
// ═══════════════════════════════════════════════════════════════════

// Maps the university full name sent from the app to a sheet tab name
var UNIVERSITY_SHEET_MAP = {
  'Universiti Malaysia Pahang Al-Sultan Abdullah': 'UMPSA',
  'Universiti Islam Antarabangsa Malaysia':        'UIA',
  'Universiti Teknologi MARA (UiTM)':              'UITM',
};

var HEADERS = [
  'Timestamp (MYT)',
  'Full Name',
  'IC Number',
  'HP Number',
  'University',
  'Faculty',
  'Matric ID',
  'Payment Mode',
  'Amount (RM)',
  'Remark',
  'Combined File',
];

// Tab colours per university
var SHEET_COLORS = {
  'UMPSA':  '#1D4ED8', // blue
  'UIA':    '#065F46', // green
  'UITM':   '#7C2D12', // maroon
  'Others': '#6B7280', // grey
};

var HEADER_COLORS = {
  'UMPSA':  '#1D4ED8',
  'UIA':    '#065F46',
  'UITM':   '#9B2335', // UiTM maroon
  'Others': '#6B7280',
};

function getOrCreateSheet(sheetName) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // Colour the tab
    if (SHEET_COLORS[sheetName]) {
      sheet.setTabColor(SHEET_COLORS[sheetName]);
    }

    // Header row
    sheet.appendRow(HEADERS);
    var headerColor = HEADER_COLORS[sheetName] || '#1D4ED8';
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange
      .setFontWeight('bold')
      .setBackground(headerColor)
      .setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    // Column widths
    sheet.setColumnWidth(1,  160); // Timestamp
    sheet.setColumnWidth(2,  220); // Full Name
    sheet.setColumnWidth(3,  140); // IC Number
    sheet.setColumnWidth(4,  130); // HP Number
    sheet.setColumnWidth(5,  280); // University
    sheet.setColumnWidth(6,  80);  // Faculty
    sheet.setColumnWidth(7,  100); // Matric ID
    sheet.setColumnWidth(8,  160); // Payment Mode
    sheet.setColumnWidth(9,  90);  // Amount
    sheet.setColumnWidth(10, 90);  // Remark
    sheet.setColumnWidth(11, 220); // Combined File
  }

  return sheet;
}

// ── Run this ONCE manually after pasting the script ──────────────────────────
// In the Apps Script editor: select "initializeSheets" from the dropdown → ▶ Run
function initializeSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var names = ['UMPSA', 'UIA', 'UITM'];

  for (var i = 0; i < names.length; i++) {
    var name  = names[i];
    var sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
    }

    // Always re-apply header if row 1 is empty
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
      sheet.clearContents();
      sheet.appendRow(HEADERS);
      var color  = HEADER_COLORS[name] || '#1D4ED8';
      var hRange = sheet.getRange(1, 1, 1, HEADERS.length);
      hRange.setFontWeight('bold').setBackground(color).setFontColor('#FFFFFF').setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
      if (SHEET_COLORS[name]) sheet.setTabColor(SHEET_COLORS[name]);
      sheet.setColumnWidth(1,  160);
      sheet.setColumnWidth(2,  220);
      sheet.setColumnWidth(3,  140);
      sheet.setColumnWidth(4,  130);
      sheet.setColumnWidth(5,  280);
      sheet.setColumnWidth(6,  80);
      sheet.setColumnWidth(7,  100);
      sheet.setColumnWidth(8,  160);
      sheet.setColumnWidth(9,  90);
      sheet.setColumnWidth(10, 90);
      sheet.setColumnWidth(11, 220);
    }

    Logger.log('✅ Sheet ready: ' + name);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data       = JSON.parse(e.postData.contents);
    var university = data.university || '';

    // Resolve which sheet to write into
    var sheetName  = UNIVERSITY_SHEET_MAP[university] || 'Others';
    var sheet      = getOrCreateSheet(sheetName);

    var timestamp  = Utilities.formatDate(
      new Date(), 'Asia/Kuala_Lumpur', 'dd/MM/yyyy HH:mm:ss'
    );

    sheet.appendRow([
      timestamp,
      data.fullName         || '',
      data.icNumber         || '',
      data.hpNumber         || '',
      university,
      data.faculty          || '',
      data.matricId         || '',
      data.paymentMode === 'postage' ? 'Postage — RM80' : 'Pickup — RM55',
      data.cost             || '',
      data.remark           || '',
      data.combinedFileName || '',
    ]);

    // Alternate row shading for readability
    var lastRow = sheet.getLastRow();
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, HEADERS.length).setBackground('#F0F7FF');
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, sheet: sheetName, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check — open the web app URL in a browser to confirm it's live
function doGet() {
  return ContentService
    .createTextOutput('GERAK Jubah Booking API — Running ✓\nSheets: UMPSA | UIA | UITM')
    .setMimeType(ContentService.MimeType.TEXT);
}
