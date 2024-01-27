// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

function YatoApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <div className="p-4 flex flex-col items-center">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </NextUIProvider>
  );
}

export default YatoApp;
