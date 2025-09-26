motoplan mobile (Expo)

Quick start

1. Install the Expo CLI: `npm install -g expo-cli`
2. From the `mobile/` folder: `npm install`
3. Start the dev server: `npm start` or `npm run android` / `npm run ios`

Notes
- The app fetches a sample plan from the API at `http://localhost:4000/api/plans`. If using Expo on a phone, use your machine's LAN IP or Expo tunnel mode.
- The Map view uses `react-native-maps`. On iOS/Android you may need to configure native map providers.
