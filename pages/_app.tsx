// pages/_app.js
import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

function YatoApp({ Component, pageProps }) {
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
