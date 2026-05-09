import { ExpoRoot } from 'expo-router';
import { Head } from 'expo-router/build/head';

// This is a bridge to satisfy Expo's default entry point (AppEntry.js)
// while still using Expo Router.
export default function App() {
  // @ts-ignore: require.context is provided by the expo-router/babel plugin
  const ctx = require.context('./app');
  return (
    <>
      <Head>
        <title>SpiceCart</title>
      </Head>
      <ExpoRoot context={ctx} />
    </>
  );
}
