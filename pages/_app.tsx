// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import '../styles/globals.css';

function YatoApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <div className="p-4 flex flex-col items-center">
        <Component {...pageProps} />
      </div>
    </NextUIProvider>
  );
}

export default YatoApp;
