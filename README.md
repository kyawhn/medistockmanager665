# MediTrack 💊

**Professional Medicine Inventory Management App** - Mobile-first React Native application with Google Sheets backend.

A fully-featured inventory management system designed for pharmacies, clinics, and hospitals with real-time stock tracking, multi-store support, and comprehensive audit logging.

## ✨ Key Features

### 🏥 Core Functionality
- **Smart Inventory Management** - Track medicines across main store + multiple sub-stores
- **Stock Transfers** - Seamless transfer between locations with validation
- **Expiry Tracking** - Automatic alerts for expired and expiring medicines
- **Low Stock Alerts** - Warnings based on customable safety levels
- **Transaction Logging** - Complete audit trail of all operations
- **Search & Filter** - Find medicines instantly by name, brand, category, or expiry

### 📱 Mobile-First Design  
- Bottom tab navigation (Dashboard, Medicines, Transfer, Transactions, Settings)
- Touch-friendly UI optimized for all screen sizes
- **Light & Dark Mode** support
- Floating action button (FAB) for quick actions
- Pull-to-refresh on all screens
- Responsive card-based layouts

### 🔄 Real-Time Data Sync
- **Google Sheets Integration** - Direct API integration, no server needed
- Automatic data caching
- Instant sync across devices
- Works offline with local cache

### 👥 User Management
- Role-based access (Admin / Storekeeper)
- User authentication
- Session persistence
- Configurable user permissions

## 📊 Dashboard at a Glance

```
┌─────────────────────────────┐
│          MediTrack          │
├─────────────────────────────┤
│ 📦 Medicines: 150           │
│ ⚠️  Low Stock: 12           │
│ ⏰ Expiring Soon: 8         │
│ 🚫 Expired: 2              │
├─────────────────────────────┤
│ 🔔 Critical Alerts (3)      │
│  • Aspirin (20/50)          │
│  • Ibuprofen (5/30)         │
│  • Paracetamol (0/20)       │
└─────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Google Cloud Account (free)
- Google Sheets
- Modern smartphone or emulator

### Setup (5 minutes)

1. **Get Google API Key**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sheets API
   - Create API Key

2. **Create Google Sheet**
   - Create new Google Sheet
   - Add sheet tabs: Medicines, MainStore_Stock, SubStores_Stock, Transactions, Users, Stores
   - Add appropriate headers (see SETUP_GUIDE.md)

3. **Configure App**
   - Launch MediTrack
   - Go to Setup tab
   - Paste API Key and Sheet ID
   - Done! 🎉

👉 **See [QUICK_START.md](./QUICK_START.md) for detailed setup**

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | 5-min setup guide |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Complete documentation |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | What was built |

## 🏗️ Architecture

```
MediTrack App
├── Navigation Layer (Bottom Tabs)
├── Screen Layers (5 screens)
├── Context Providers
│   ├── AuthContext (User management)
│   ├── GoogleSheetsContext (Data caching)
│   └── ThemeContext (Light/Dark mode)
└── Google Sheets Backend (API)
```

## 📋 Core Features

### Dashboard
- 4 key metrics (total, low stock, expired, expiring)
- Critical alerts with quick actions
- Pull-to-refresh data sync
- Last sync timestamp

### Medicines Management
- Browse all medicines with card layout
- Real-time search (name, brand, category)
- Filter by expiry status or stock level
- View detailed info (batch, pricing, stock)
- Color-coded status badges

### Stock Transfer
- 4-step wizard interface
- Choose source & destination stores
- Validation (prevents over-transfer)
- Review before confirming
- Auto-logged transactions

### Transaction Log
- Complete audit trail
- Color-coded by type
- Timestamp + user tracking
- Searchable descriptions
- Export capable

### Settings
- User profile management
- Theme toggle (light/dark)
- Google Sheets configuration
- Data backup & export
- App preferences
- Logout

## 🎨 Design System

### Colors
| Color | Usage | Hex |
|-------|-------|-----|
| Primary Blue | Actions | #2563EB |
| Success Green | Normal/Good | #16A34A |
| Warning Orange | Caution | #EA580C |
| Error Red | Critical | #DC2626 |

### Typography
- **Display**: 28px (largest)
- **Headlines**: 24-18px (section titles)
- **Titles**: 16-12px (cards, dialogs)
- **Body**: 16-12px (content)
- **Labels**: 14-11px (hints, metadata)

## 🔐 Security

- ✅ API keys stored locally (AsyncStorage)
- ✅ Session persistence with token
- ✅ Role-based access control
- ✅ Complete transaction audit log
- ✅ Automatic logout option
- ⚠️ Implement OAuth2 for production

## 📦 Tech Stack

**Frontend:**
- React Native
- Expo SDK 52.x
- TypeScript
- React Navigation
- Material Design Icons

**Backend:**
- Google Sheets API v4
- REST API (read/write)

**State Management:**
- React Context API
- AsyncStorage (local persistence)

**Zero Dependencies** on third-party database services - uses Google Sheets! 🎉

## 📱 Supported Platforms

- ✅ iOS 13+
- ✅ Android 8+
- ✅ Web (Expo Web)
- ✅ All screen sizes

## 🎯 Use Cases

- 🏥 **Hospitals** - Multi-ward inventory management
- 💊 **Pharmacies** - Multiple location stock tracking
- 🏪 **Clinics** - Medicine procurement & expiry management
- 🚑 **Ambulance Services** - Mobile medicine inventory
- 📦 **Warehouses** - Bulk medicine storage

## 📊 Data Structure

### Medicines (13 fields)
- ID, Name, Category, Strength, Brand
- Supplier, Batch No, Expiry Date
- Unit Cost, Selling Price
- Safety Stock Level, Image URL, Status

### Stock Tracking
- Main Store Stock
- Sub Store Stock (unlimited stores)
- Real-time quantity updates

### Audit Log
- All CRUD operations logged
- User tracking
- Timestamps
- Change history

## 🚀 Deploy & Scale

### Development
```bash
# Already ready to use in Expo
# No build needed for testing
```

### Production
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Deploy to stores
eas submit --platform ios
eas submit --platform android
```

## 🐛 Known Limitations

- No real-time sync (manual refresh)
- Google Sheets API rate limiting (500 req/100s)
- Image URLs must be external
- No offline editing (cache read-only)

## 🎉 Future Roadmap

- [ ] Barcode/QR code scanning
- [ ] Email notifications
- [ ] Advanced analytics & reports
- [ ] Receipt printing
- [ ] Batch import/export
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Web dashboard
- [ ] POS system integration

## 💡 Tips & Tricks

1. **Speed Up Search**: Type 3+ characters for instant filter
2. **Dark Mode**: Toggle in Settings for night operations
3. **Batch Operations**: Prepare medicines in Google Sheets, app imports automatically
4. **Safety Levels**: Set based on average usage for optimal alerts
5. **Expiry Management**: Schedule weekly expiry reviews

## 🤝 Contributing

To enhance MediTrack:
1. Fork the repository
2. Create feature branch
3. Make improvements
4. Submit pull request

## 📞 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting
2. Review code comments in respective files
3. Check TypeScript types in `types/index.ts`
4. Enable debug logging in development

## 📄 License

Built with React Native, Expo, and TypeScript.
See `package.json` for dependencies and their licenses.

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.io)
- [Google Sheets API Guide](https://developers.google.com/sheets/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🚀 Get Started Now!

1. Read [QUICK_START.md](./QUICK_START.md) (5 min)
2. Configure Google Sheets (5 min)
3. Launch the app (1 min)
4. Start managing inventory! ✨

---

**MediTrack** - Smart Medicine Inventory Management
*Built for pharmacists, by engineers*

**Version 1.0.0** • 2025