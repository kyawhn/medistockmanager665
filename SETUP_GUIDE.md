# MediTrack - Medicine Inventory Management App

A fully-featured, mobile-first medicine inventory management app built with React Native, Expo, and Google Sheets as the backend database.

## Features

### Core Features
✅ **Complete CRUD Operations**: Add, edit, delete, and manage medicines
✅ **Stock Management**: Track stock levels across main store and multiple sub-stores
✅ **Stock Transfers**: Transfer medicines between stores with validation
✅ **Expiry Tracking**: Automatic alerts for expired and expiring medicines
✅ **Low Stock Alerts**: Automatic warnings when stock falls below safety levels
✅ **Transaction Logging**: Complete audit trail of all system activities
✅ **Search & Filters**: Find medicines by name, brand, category, or expiry status
✅ **Dashboard**: Real-time overview of inventory metrics and critical alerts
✅ **User Roles**: Role-based access (Admin vs Storekeeper)

### Advanced Features
🚀 **Google Sheets Integration**: Direct sync with Google Sheets API
🚀 **Multi-Store Management**: Support for main store + multiple sub-stores
🚀 **Real-time Sync**: Automatic data syncing with backend
🚀 **Mobile-First Design**: Optimized for all screen sizes
🚀 **Dark Mode Support**: Easy on the eyes with theme toggle
🚀 **Offline Support**: Local caching for offline access

## Architecture

### Directory Structure
```
├── App.tsx                          # Main entry point with navigation setup
├── screens/                         # Screen components
│   ├── auth/LoginScreen.tsx        # Authentication & Google Sheets setup
│   ├── DashboardScreen.tsx         # Dashboard with metrics
│   ├── MedicinesScreen.tsx         # Medicine inventory management
│   ├── StockTransferScreen.tsx     # Inter-store stock transfers
│   ├── TransactionsScreen.tsx      # Audit log viewer
│   └── SettingsScreen.tsx          # App & user settings
├── context/                         # React Context providers
│   ├── AuthContext.tsx             # User authentication
│   ├── GoogleSheetsContext.tsx     # Data management & caching
│   └── ThemeContext.tsx            # Theme management
├── lib/                             # Utilities & helpers
│   ├── googleSheets.ts             # Google Sheets API integration
│   ├── utils.ts                    # Helper functions
│   └── theme.ts                    # Design system & colors
├── types/                           # TypeScript definitions
│   └── index.ts                    # All data types
└── components/                      # Reusable UI components (expandable)
```

### Data Flow
```
App.tsx (Root)
    ├── ThemeProvider (Light/Dark mode)
    ├── AuthProvider (User session)
    ├── GoogleSheetsProvider (Data cache)
    └── Navigation (Tab bars + screens)
```

## Google Sheets Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name: "MediTrack" or similar)
3. Enable the Google Sheets API:
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create API Key

1. Go to "Credentials" in Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the API key (you'll need this)

### Step 3: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet (name: "MediTrack Inventory" or similar)
3. Create the following sheet tabs:
   - **Medicines**: Main medicine catalogue
   - **MainStore_Stock**: Stock levels for main store
   - **SubStores_Stock**: Stock levels for sub-stores
   - **Transactions**: Audit log of all operations
   - **Users**: User accounts and permissions
   - **Stores**: Store information

### Step 4: Set Up Sheet Headers

#### Medicines Sheet (A1:O1)
```
ID | Name | Category | Strength | Brand | Supplier | Batch No | Expiry Date | Unit Cost | Selling Price | Safety Stock Level | Image URL | Status | Created At | Updated At
```

#### MainStore_Stock Sheet (A1:D1)
```
ID | Medicine ID | Quantity | Last Updated
```

#### SubStores_Stock Sheet (A1:E1)
```
ID | Medicine ID | Store ID | Quantity | Last Updated
```

#### Transactions Sheet (A1:I1)
```
ID | Type | Medicine ID | Entity | Old Values | New Values | User ID | Description | Created At
```

#### Users Sheet (A1:G1)
```
ID | Email | Name | Role | Phone | Store ID | Created At
```

#### Stores Sheet (A1:E1)
```
ID | Name | Type | Location | Created At
```

### Step 5: Get Sheet ID

1. Open your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

## App Setup & Configuration

### 1. Install Dependencies

The app uses the following key dependencies:
- `react-native` - Core framework
- `@react-navigation/*` - Navigation
- `@react-native-async-storage/async-storage` - Local storage
- `@expo/vector-icons` - Icons
- No npm install needed in this environment

### 2. Configure Google Sheets

When you first launch the app:

1. **Login Screen** appears with two tabs:
   - **Login Tab**: For existing users
   - **Setup Tab**: For initial configuration

2. **Setup Configuration**:
   - Paste your Google API Key
   - Paste your Google Sheet ID
   - Click "Save Configuration"

3. The app will validate and save the credentials locally

### 3. Add Initial Users

In your Google Sheet, add users to the "Users" sheet:
```
user-1 | admin@example.com | Admin User | admin | +1234567890 | | 2025-01-01T00:00:00Z
user-2 | store@example.com | Store Manager | storekeeper | +0987654321 | store-1 | 2025-01-01T00:00:00Z
```

### 4. Add Sample Data

Add sample data to your sheets to test:

**Medicines Sheet**:
```
med-1 | Aspirin | Pain Relief | 500mg | Bayer | Pharma Co | B123 | 2026-12-31 | 5 | 10 | 50 | | active | 2025-01-01T00:00:00Z | 2025-01-01T00:00:00Z
```

**Stores Sheet**:
```
store-main | Main Warehouse | main | 123 Main St | 2025-01-01T00:00:00Z
store-1 | Downtown Clinic | sub | Downtown | 2025-01-01T00:00:00Z
store-2 | Uptown Pharmacy | sub | Uptown | 2025-01-01T00:00:00Z
```

## How to Use

### Dashboard
- View key metrics (total medicines, low stock, expired items)
- See critical alerts
- Quick access to main features
- Last sync timestamp

### Medicines
- Browse all medicines with search
- Filter by expiry status
- View stock levels
- Edit medicine details
- Track batches and pricing

### Stock Transfer
- Select medicine to transfer
- Choose source and destination stores
- Enter quantity
- Review and confirm transfer
- Automatic transaction logging

### Transactions
- Full audit trail of all activities
- Filter by type
- View timestamps
- Complete change history

### Settings
- User profile management
- Theme toggle (light/dark)
- Google Sheets configuration
- Data export/backup options
- Logout

## User Roles & Permissions

### Admin
- Full access to all features
- Can manage other users
- Can modify safety stock levels
- Can access all stores' data

### Storekeeper
- Can view and manage their assigned store's inventory
- Can perform stock transfers to/from their store
- Can view transaction logs for their store
- Cannot modify other stores' data

## Key Features in Detail

### Expiry Tracking
- **Red (Expired)**: Past expiry date
- **Orange (Expiring)**: Expiring in < 30 days
- **Yellow (Warning)**: Expiring in 30-60 days
- **Green (Normal)**: Safe for use

### Stock Status
- **Red (Critical)**: Stock = 0 or < 50% of safety level
- **Orange (Low)**: Stock < Safety Level
- **Green (Normal)**: Stock >= Safety Level

### Automatic Alerts
- Low stock warnings based on safety levels
- Expiry alerts for medicines expiring soon
- Transaction logging for all operations

## API Integration

### Google Sheets API Calls

The app uses the following Google Sheets API endpoints:
- `GET /v4/spreadsheets/{SHEET_ID}/values/{RANGE}` - Read data
- `PUT /v4/spreadsheets/{SHEET_ID}/values/{RANGE}` - Write/update data

All requests are made with:
- Your API Key in the URL
- RAW value format for simplicity
- Error handling and retry logic

### Rate Limits
- Google Sheets API: 500 requests per 100 seconds
- The app batches operations to stay under limits
- Automatic retry on failure

## Performance Optimization

- **Local Caching**: Data cached in React Context
- **Lazy Loading**: Lists rendered on demand
- **Pagination**: Large datasets paginated
- **Search Optimization**: Client-side filtering
- **Async Operations**: Non-blocking database calls

## Security Considerations

⚠️ **Important for Production**:
1. **API Key**: Restrict to Google Sheets API only in Cloud Console
2. **Sheet Access**: Use Google Sheets sharing settings to control access
3. **User Authentication**: Integrate with Firebase Auth or OAuth2
4. **Data Encryption**: Enable HTTPS only communication
5. **Audit Logs**: Review transaction logs regularly

## Troubleshooting

### Issue: "Google Sheets API key not configured"
**Solution**: 
- Go to Settings > Google Sheets
- Re-enter your API key and Sheet ID
- Make sure keys are copied correctly without spaces

### Issue: "Permission denied" errors
**Solution**:
- Verify Sheet ID is correct
- Check API key restrictions in Google Cloud Console
- Make sure user account has access to the Sheet

### Issue: Data not syncing
**Solution**:
- Pull down to refresh on any screen
- Check internet connection
- Verify Google Sheets sheet format matches
- Check browser console for error messages

### Issue: Slow performance
**Solution**:
- Clear local storage (Settings > App Data)
- Reduce number of medicines in test
- Check Google Sheets for large images
- Enable offline mode if needed

## Future Enhancements

Planned features:
- [ ] Barcode/QR code scanning
- [ ] Receipt printing
- [ ] Email notifications
- [ ] Advanced analytics & reports
- [ ] Batch import/export
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Offline barcode database
- [ ] Integration with pharmacy POS systems
- [ ] Real-time web dashboard

## Support & Documentation

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Sheets API documentation
3. Check React Native documentation
4. Review TypeScript types in `types/index.ts`

## License

This app is built with React Native, Expo, and TypeScript. See respective licenses for third-party libraries.

---

**MediTrack © 2025** - Medicine Inventory Management System