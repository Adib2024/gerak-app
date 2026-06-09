// ─────────────────────────────────────────────────────────────────────────────
// After deploying your Google Apps Script web app, paste the URL below.
// Leave the placeholder if not yet deployed — submissions will be skipped silently.
// ─────────────────────────────────────────────────────────────────────────────
const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyadRSW0NO4fdPFf4nlSHGhePFBHn5BUyIF1grngwpTcYy1PXiE6W56Ix_Rrif8I3bd/exec';

export interface JubahSheetRow {
  fullName: string;
  icNumber: string;
  hpNumber: string;
  university: string;
  faculty: string;
  matricId: string;
  paymentMode: 'pickup' | 'postage';
  remark: string;
  combinedFileName: string;
  cost: number;
}

export async function submitJubahToSheets(data: JubahSheetRow): Promise<void> {
  try {
    // no-cors because Google Apps Script doesn't handle CORS preflight.
    // Content-Type text/plain avoids triggering a preflight OPTIONS request.
    // The data still arrives and is written to the sheet.
    await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('[GERAK] Google Sheets sync failed:', err);
  }
}
