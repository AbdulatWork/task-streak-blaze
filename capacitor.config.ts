
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a4afed4bd5c34bb094adda38f894cffa',
  appName: 'task-streak-blaze',
  webDir: 'dist',
  server: {
    url: "https://a4afed4b-d5c3-4bb0-94ad-da38f894cffa.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  // Add any other configurations you might need for your app
  android: {
    buildOptions: {
      minSdkVersion: 21,
    }
  }
};

export default config;
