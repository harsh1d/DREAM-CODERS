# 📝 Contact Form Setup — Google Sheets Integration

Your Dream Coders website now saves all contact form submissions to **Google Sheets**, which you can download as Excel files anytime.

## 🎯 Quick Overview

**How it works:**
1. User fills out contact form on website
2. Data is sent to Google Sheets automatically
3. You can view, filter, and download data anytime
4. Export to Excel with one click

---

## ⚡ 5-Minute Setup (Recommended)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ New** → **Spreadsheet**
3. Name it: `Dream Coders Contact Submissions`
4. Create column headers in Row 1:
   ```
   A: timestamp
   B: name
   C: email
   D: type
   E: message
   F: source
   ```
5. Keep this sheet open (you'll need the ID)

### Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **+ New project**
3. Name it: `Dream Coders Form Handler`
4. **Delete any existing code** and paste this:

```javascript
// Dream Coders Contact Form Handler
// This script receives form data and saves to Google Sheets

const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your Sheet ID
const SHEET_NAME = 'Sheet1'; // Name of sheet tab

function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet and sheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Prepare the row to insert
    const row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.type || '',
      data.message || '',
      data.source || 'Dream Coders Website'
    ];
    
    // Add row to sheet
    sheet.appendRow(row);
    
    // Log the submission
    Logger.log('Form submission received: ' + data.email);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data received and saved'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (use for debugging)
function test() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    email: 'test@example.com',
    type: 'join',
    message: 'This is a test submission',
    source: 'Dream Coders Website'
  };
  
  doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
}
```

### Step 3: Find Your Sheet ID

1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
3. Copy the long string between `/d/` and `/edit`
4. Go back to Apps Script
5. Replace `'YOUR_SHEET_ID_HERE'` with your actual ID

Example:
```javascript
const SHEET_ID = '1BxiMVs0XRA5nFMKUVfIKcqsSJc1-WU28Y8-SjJuwNVU';
```

### Step 4: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Select **Type** → **Web app**
3. **Execute as**: Select your Google account
4. **Who has access**: `Anyone`
5. Click **Deploy**
6. **Copy the URL** that appears (it will start with `https://script.google.com/...`)

### Step 5: Update Website

1. Open [script.js](script.js) in your code editor
2. Find this line (around line 272):
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace with your URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/usercontent';
   ```
4. Save the file
5. Redeploy your website

✅ **Done!** Your form now saves to Google Sheets!

---

## 🧪 Test the Setup

1. Go to your website
2. Fill out the contact form
3. Click "Send Message"
4. Check your Google Sheet
5. New row should appear with your data!

---

## 📊 Viewing Your Data

### In Google Sheets
- Open your sheet anytime to see submissions
- You can:
  - Filter by type, date, etc.
  - Sort by newest first
  - Search for specific submissions
  - Add comments

### Export to Excel
1. **File** → **Download** → **Microsoft Excel**
2. Saves as `.xlsx` file
3. Open in Excel, Google Sheets, or any spreadsheet app

### Create Charts
1. Select data range
2. **Insert** → **Chart**
3. Customize chart type, colors, etc.

---

## 🔧 Advanced Setup Options

### Option 2: Save to Google Drive (Recommended for Organization)

If you want to organize submissions by month/year:

```javascript
// Modified script to create new sheets monthly
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Get current month (e.g., "2026-03")
    const date = new Date(data.timestamp);
    const monthKey = Utilities.formatDate(date, "GMT", "yyyy-MM");
    
    // Get or create sheet for this month
    let sheet = ss.getSheetByName(monthKey);
    if (!sheet) {
      sheet = ss.insertSheet(monthKey);
      // Add headers
      sheet.appendRow(['timestamp', 'name', 'email', 'type', 'message', 'source']);
    }
    
    // Add data
    const row = [
      data.timestamp,
      data.name || '',
      data.email || '',
      data.type || '',
      data.message || '',
      data.source || 'Dream Coders Website'
    ];
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Option 3: Send Email Notification

Add this to your Apps Script to email you on each submission:

```javascript
function sendNotificationEmail(data) {
  const recipient = 'your-email@example.com'; // Update this
  const subject = `New Dream Coders Form Submission from ${data.name}`;
  const message = `
New Contact Form Submission:

Name: ${data.name}
Email: ${data.email}
Type: ${data.type}
Message: ${data.message}

---
Submitted at: ${data.timestamp}
`;
  
  GmailApp.sendEmail(recipient, subject, message);
}

// Add this line in doPost() before the return statement:
sendNotificationEmail(data);
```

---

## 🛡️ Security & Privacy

### How Data is Protected
- ✅ Data stored in your Google account
- ✅ Only you can access submissions
- ✅ Google provides encryption
- ✅ No third-party access
- ✅ GDPR compliant

### Tips
- Don't share the Apps Script URL publicly
- Regularly backup your data (File → Download)
- Use Google Sheets' privacy settings as needed

---

## 📈 Analyzing Your Data

### In Google Sheets

**Add Filters:**
1. Select row 1
2. **Data** → **Create a filter**
3. Click filter icons to sort

**Create Pivot Table:**
1. **Data** → **Pivot table**
2. Choose dimensions and metrics
3. Analyze submissions by type, date, etc.

**Add Formula to Count:**
```
=COUNTA(A:A)-1  // Count total submissions
=COUNTIF(D:D,"join")  // Count by type
```

---

## ⚠️ Troubleshooting

### Form not saving?

**Check 1: Is the URL correct?**
- Go to Apps Script → Deployments
- Copy the URL again
- Paste into script.js
- Clear cache in browser (Ctrl+Shift+Delete)

**Check 2: Is the Sheet ID correct?**
- Open your Google Sheet
- Check URL has correct ID
- Update the Apps Script

**Check 3: Check the console**
- Open website
- Press F12 (DevTools)
- Go to Console tab
- Fill form and check for errors

**Check 4: Test the script**
```javascript
// In Apps Script editor:
// 1. Click "test" function
// 2. Click Run
// 3. Authorize when prompted
// 4. Check Google Sheet for test row
```

### Getting "Error" in browser?

**Solution:**
1. Check the Apps Script logs:
   - Open Apps Script
   - Click **Executions** tab
   - Look for errors
   
2. Common issues:
   - Wrong Sheet ID
   - Wrong Sheet name
   - Script not deployed as Web app
   - Permissions not granted

---

## 🔄 Updating the Script

### To make changes:

1. Open Apps Script
2. Edit the code
3. Click **Deploy** → **Manage deployments**
4. Select deployment → **Edit**
5. Change code → **Deploy**
6. Click **Replace deployment**
7. Confirm changes

---

## 💾 Backup Your Data

### Monthly Backup
1. Open your Google Sheet
2. **File** → **Download** → **Excel**
3. Save locally with date (e.g., `Submissions_2026-03.xlsx`)
4. Store in cloud (OneDrive, Dropbox, etc.)

### Automatic Backup
1. Go to **Tools** → **Notification rules**
2. Set email on changes (optional)
3. Or use Google Sheets API for automated backup

---

## 🚀 Advanced: Connect to Other Services

### Save to Airtable
```javascript
// Add to Apps Script
function saveToAirtable(data) {
  const airtableUrl = 'https://api.airtable.com/v0/YOUR_BASE_ID/TABLE_NAME';
  const api_token = 'YOUR_AIRTABLE_TOKEN';
  
  const options = {
    method: 'post',
    headers: { Authorization: 'Bearer ' + api_token },
    payload: JSON.stringify({
      records: [{
        fields: {
          'Name': data.name,
          'Email': data.email,
          'Type': data.type,
          'Message': data.message,
          'Timestamp': data.timestamp
        }
      }]
    })
  };
  
  UrlFetchApp.fetch(airtableUrl, options);
}
```

### Save to Zapier
1. Create Zap: Google Sheets → Action
2. Get webhook URL
3. Update script to POST to webhook
4. Connect to 1000+ apps (Slack, CRM, etc.)

---

## 📞 Quick Reference

| Action | Where |
|--------|-------|
| View submissions | Google Sheets |
| Edit script | Google Apps Script → Editor |
| Check logs | Google Apps Script → Executions |
| Update URL | script.js (line ~272) |
| Test submission | Apps Script → test() function |
| Backup data | Google Sheets → Download |

---

## 🎓 Learning Resources

- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Google Forms Alternative](https://www.google.com/forms/about/) (if you prefer)

---

## ✅ Checklist

- [ ] Created Google Sheet with headers
- [ ] Created Google Apps Script
- [ ] Set SHEET_ID in script
- [ ] Deployed as Web app
- [ ] Updated script.js with URL
- [ ] Tested form submission
- [ ] Data appears in Google Sheet
- [ ] Redeployed website

---

## 🎉 You're All Set!

Your Dream Coders website now **automatically saves all contact submissions to Google Sheets**. 

**Next steps:**
1. Test by filling out the form
2. Download data as Excel monthly
3. Share sheet with team members (optional)
4. Analyze submissions in Google Sheets

---

**Questions?** Check the troubleshooting section or review the setup steps.

**Need to modify the form fields?** Update both the contact form in index.html AND the Apps Script to match.
