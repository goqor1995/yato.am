import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import '../styles/globals.css';
import { useRouter } from 'next/router';

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  if (status === 'loading') {
    return <div>Loading ...</div>;
  }
  return children;
}

function YatoApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <div className="p-4 flex flex-col items-center">
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </SessionProvider>
    </NextUIProvider>
  );
}

export default YatoApp;
