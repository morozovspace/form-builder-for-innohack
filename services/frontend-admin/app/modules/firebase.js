export default {
    lazy: false,
    config: {
      apiKey: "AIzaSyBoQumd6X4SUN0AY4AsAl8PlJU0XG8ks8o",
      authDomain: "fb-form-builder.firebaseapp.com",
      projectId: "fb-form-builder",
      storageBucket: "fb-form-builder.appspot.com",
      messagingSenderId: "792700851513",
      appId: "1:792700851513:web:848695ff6e9d0bb716c4e8",
      measurementId: "G-8Q40T5NE97"
    },
    onFirebaseHosting: process.env.NODE_ENV === "production",
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: "auth/onAuthStateChanged",
        },
        ssr: false,
        emulatorPort: 9099, // process.env.NODE_ENV === "development" ? process.env.AUTH_EMULATOR_PORT : undefined,
        disableEmulatorWarnings: true,
      },
      firestore: {
        memoryOnly: false,
        emulatorHost: process.browser ? "frontend" : "localhost",
        emulatorPort: 8080, // process.env.NODE_ENV === "development" ? process.env.FIRESTORE_EMULATOR_PORT : undefined,
        ssl: false,
        ssr: false,
      },
      functions: false,
      storage: false,
      performance: false,
      analytics: false,
    },
  }