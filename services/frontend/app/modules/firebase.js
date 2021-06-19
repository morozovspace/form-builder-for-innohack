export default {
    lazy: false,
    config: {
      apiKey: "AIzaSyBoQumd6X4SUN0AY4AsAl8PlJU0XG8ks8o",
      authDomain: "fb-form-builder.firebaseapp.com",
      projectId: "fb-form-builder",
      storageBucket: "fb-form-builder.appspot.com",
      messagingSenderId: "792700851513",
      appId: "1:792700851513:web:5756a17e4f44e0f116c4e8",
      measurementId: "G-9007BVW8K1"
    },
    onFirebaseHosting: process.env.NODE_ENV === "production",
    services: {
      auth: false,
      firestore: {
        memoryOnly: false,
        emulatorHost: process.browser ? "frontend" : "localhost",
        emulatorPort: 8080, // process.env.NODE_ENV === "development" ? process.env.FIRESTORE_EMULATOR_PORT : undefined,
        ssl: false,
      },
      functions: false,
      storage: true,
      performance: true,
      analytics: true,
    },
  }