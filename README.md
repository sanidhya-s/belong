# 🏠 Belong Clone — Community Management App

A full-featured clone of the [Belong App](https://www.belongapp.in/) built with **React Native + Expo**.  
Works on **Android**, **iOS**, and **Web**.

---

## 📱 Features

| Feature | Description |
|---|---|
| 🏠 **Home Dashboard** | Notices, quick actions, live stats, payment reminders |
| 📅 **Book Amenities** | Pool, Gym, Clubhouse, Badminton, Yoga + slot booking |
| 👥 **Visitor Management** | Add, approve, deny visitors with full history |
| 🛡️ **Security** | Society guards, SOS button, emergency numbers |
| 🎫 **Support Tickets** | Raise & track grievances with status timeline |
| 💳 **Payments** | View dues, pay bills, transaction history |
| 🏘️ **Community Board** | Post updates, announcements, lost & found |
| 📢 **Notices** | Society announcements, events, alerts |
| 🚪 **Gate Pass** | Generate QR codes for visitor entry |
| 👤 **Profile** | Resident info, settings, payment history |
| 🔐 **Login Screen** | OTP-based phone login (mock) + demo skip |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Install & Run

```bash
# 1. Install dependencies
cd belong-clone
npm install

# 2. Add app icons (optional)
# Place icon.png (1024x1024) and favicon.png in assets/ folder

# 3. Start the development server
npx expo start

# 4. Scan the QR code with Expo Go on your phone
```

### Run on specific platform
```bash
npx expo start --android   # Android emulator
npx expo start --ios       # iOS simulator (Mac only)
npx expo start --web       # Web browser
```

---

## 📁 Project Structure

```
belong-clone/
├── App.js                    # Entry: Splash → Login → Main app
├── app.json                  # Expo config
├── src/
│   ├── theme.js              # Colors, fonts, spacing, shadows
│   ├── data/
│   │   └── mockData.js       # All mock data (users, amenities, etc.)
│   ├── navigation/
│   │   └── AppNavigator.js   # Bottom tabs + stack navigation
│   └── screens/
│       ├── HomeScreen.js     # Dashboard with notices & quick actions
│       ├── AmenitiesScreen.js # Amenity listing + slot booking modal
│       ├── VisitorsScreen.js  # Visitor management with approve/deny
│       ├── SecurityScreen.js  # Security contacts + SOS
│       ├── SupportScreen.js   # Grievance tickets + timeline
│       ├── PaymentsScreen.js  # Bills, payments, transaction history
│       ├── CommunityScreen.js # Community posts, announcements
│       ├── NoticesScreen.js   # Society notices & announcements
│       ├── GatePassScreen.js  # QR gate pass generation
│       └── ProfileScreen.js   # User profile + settings
```

---

## 🎨 Design

- **Color**: Deep indigo (`#4F3EF5`) primary palette
- **Style**: Clean cards with colored accents, bottom sheet modals
- **Navigation**: Bottom tab bar + stack navigation
- **UX**: Status badges, real-time state updates, form validation

---

## 🔧 Extending the App

### Connect a real backend
Replace `mockData.js` with API calls (Axios / fetch):
```js
const amenities = await fetch('https://your-api.com/amenities').then(r => r.json());
```

### Add push notifications
```bash
npx expo install expo-notifications
```

### Add payments (Razorpay)
```bash
npm install react-native-razorpay
```

---

## 📦 Tech Stack

- **Expo** ~51
- **React Native** 0.74
- **React Navigation** v6 (Bottom Tabs + Stack)
- **@expo/vector-icons** (Ionicons)
- **expo-linear-gradient**

---

Built with ❤️ — Community management made easy!
