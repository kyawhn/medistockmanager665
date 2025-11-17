# MediTrack - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### **Step 1: Google Cloud Setup (2 minutes)**

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (any name)
3. Search "Google Sheets API" and click Enable
4. Go to Credentials → Create API Key
5. **Copy the API Key** (save it)

### **Step 2: Google Sheets Setup (2 minutes)**

1. Go to [Google Sheets](https://sheets.google.com) and create new sheet
2. Create 6 sheet tabs named exactly:
   - `Medicines`
   - `MainStore_Stock`
   - `SubStores_Stock`
   - `Transactions`
   - `Users`
   - `Stores`

3. Add headers to each sheet (copy-paste these):

**Medicines (A1:O1):**
```
ID	Name	Category	Strength	Brand	Supplier	Batch No	Expiry Date	Unit Cost	Selling Price	Safety Stock Level	Image URL	Status	Created At	Updated At
```

**MainStore_Stock (A1:D1):**
```
ID	Medicine ID	Quantity	Last Updated
```

**SubStores_Stock (A1:E1):**
```
ID	Medicine ID	Store ID	Quantity	Last Updated
```

**Transactions (A1:H1):**
```
ID	Type	Medicine ID	Entity	Old Values	New Values	User ID	Description	Created At
```

**Users (A1:G1):**
```
ID	Email	Name	Role	Phone	Store ID	Created At
```

**Stores (A1:E1):**
```
ID	Name	Type	Location	Created At
```

4. **Copy Sheet ID** from URL: `https://docs.google.com/spreadsheets/d/[COPY_THIS]/edit`

### **Step 3: Launch App & Configure**

1. **Open the app**
2. Click **"Setup"** tab on login screen
3. Paste:
   - Google API Key
   - Google Sheet ID
4. Click "Save Configuration"
5. Go to **"Login"** tab

### **Step 4: Add Sample Data**

Add these rows to your Google Sheet to test:

**Medicines Sheet - Row 2:**
```
med-1	Aspirin	Pain Relief	500mg	Bayer	PharmaCo	B001	2026-12-31	5	10	50		active	2025-01-15T10:00:00Z	2025-01-15T10:00:00Z
```

**Stores Sheet - Row 2-4:**
```
main	Main Warehouse	main	123 Main Street	2025-01-01T00:00:00Z
store-1	Downtown Clinic	sub	Downtown	2025-01-01T00:00:00Z
store-2	Uptown Pharmacy	sub	Uptown	2025-01-01T00:00:00Z
```

**Users Sheet - Row 2:**
```
user-1	admin@example.com	Admin	admin	+1234567890		2025-01-01T00:00:00Z
```

### **Step 5: Test the App**

1. **Login** with: `admin@example.com` / any password
2. **Dashboard**: Should show 1 medicine, 0 low stock, etc.
3. **Medicines**: Click to see Aspirin card
4. **Transfer**: Select Aspirin → transfer from main to store-1
5. **Transactions**: See all activities
6. **Settings**: Toggle dark mode, see profile

## 📱 Quick Features Overview

| Screen | What It Does |
|--------|-------------|
| **Dashboard** | Shows metrics, alerts, quick actions |
| **Medicines** | Search/filter medicines, view stock |
| **Transfer** | Move medicine between stores (4 steps) |
| **Transactions** | See audit log of all changes |
| **Settings** | User profile, theme, logout |

## 🎨 Color Guide

- 🟢 **Green**: Normal / Safe
- 🟠 **Orange**: Warning / Expiring Soon / Low Stock
- 🔴 **Red**: Critical / Expired / Stock Out

## 🔑 Key APIs

All communication uses Google Sheets API v4:
- Read: `GET /v4/spreadsheets/{SHEET_ID}/values/{RANGE}`
- Write: `PUT /v4/spreadsheets/{SHEET_ID}/values/{RANGE}`

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "API key not configured" | Go to Settings, re-paste API key & Sheet ID |
| Nothing loads | Check internet, verify Sheet ID copied correctly |
| Slow performance | Pull down to refresh, clear browser cache |
| Permission denied | Make sure API key is unrestricted in Cloud Console |

## 💡 Pro Tips

1. **Search Fast**: Type medicine name in Medicines screen
2. **Filter Smart**: Filter by expiry status on Medicines
3. **Transfer Safe**: App prevents transferring more than available
4. **Track Everything**: All changes logged in Transactions
5. **Go Dark**: Toggle dark mode in Settings for night use

## 📊 Understanding Dates

- **Expiry Tracking**: Auto-marks medicines as expired when date passes
- **30 Days**: Orange warning when expiring within 30 days
- **60 Days**: Yellow caution when expiring within 60 days
- **Safety Level**: Low stock warning based on custom safety level per medicine

## 🎯 Next Steps

After testing:

1. Add real medicines to your sheet
2. Set realistic safety stock levels
3. Create sub-stores for your locations
4. Add team members as users
5. Start managing inventory!

## 📖 Full Documentation

- See **SETUP_GUIDE.md** for complete setup
- See **IMPLEMENTATION_SUMMARY.md** for full feature list
- Check **types/index.ts** for all data structures

---

**You're ready to go! 🎉 Enjoy MediTrack!**