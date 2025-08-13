// Web shim for @react-native-firebase/auth to prevent bundling native RN code into web builds.
// This module should never be executed at runtime on web because phoneAuth.ts guards by Platform.OS.

type AuthShim = () => {
  signInWithPhoneNumber: (phone: string) => Promise<never>;
};

const authShim: AuthShim = () => ({
  // If somehow called on web, fail clearly.
  async signInWithPhoneNumber() {
    throw new Error('Native phone auth is not available on web build');
  },
});

export default authShim;

