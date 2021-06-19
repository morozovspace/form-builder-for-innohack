export default {
    lazy: false,
    config: {
      apiKey: "AIzaSyDMMRld6GJFBfBJVBaUjCnnBMV-ckeAs-o",
      authDomain: "http://localhost:9099",
      projectId: "morozov-st",
      storageBucket: "morozov-st.appspot.com",
      messagingSenderId: "925528804050",
      appId: "1:925528804050:web:4ad6713351c83d46efbb0b",
      measurementId: "G-370FZTMJEM"
    },
    onFirebaseHosting: process.env.NODE_ENV === "production",
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: "auth/onAuthStateChanged",
        },
        ssr: true,
        emulatorPort: process.env.NODE_ENV === "development" ? process.env.AUTH_EMULATOR_PORT : undefined,
        disableEmulatorWarnings: true,
      },
      firestore: {
        memoryOnly: false,
        emulatorHost: process.client ? "localhost" : "firebase",
        emulatorPort: process.env.NODE_ENV === "development" ? process.env.FIRESTORE_EMULATOR_PORT : undefined,
        ssl: false,
      },
      functions: {
        emulatorPort: process.env.NODE_ENV === "development" ? process.env.FUNCTIONS_EMULATOR_PORT : undefined,
      },
      storage: true,
      performance: true,
      analytics: true,
    },
  }