import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Spinner, Button } from '@nextui-org/react';

export default function Login() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setLoading(true);
    if (!name || !username || !password) {
      setError('All fields are necessary');
      return;
    }

    const signInResponse = await signIn('credentials', {
      name: name,
      username: username,
      password: password,
      redirect: false,
    });

    if (signInResponse?.error) {
      setError('Wrong username or password');
    } else {
      // Check the session after signing in
      const session = await getSession();
      if (session) {
        router.push('/');
      } else {
        setError('Wrong username or password');
      }
    }
    setLoading(false);
  };

  const handleUsernameInput = (e: any) => {
    setName(e.target.value);
    setUsername(e.target.value);
  };

  const handlePasswordInput = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
            <div className="flex-auto px-10 py-10 pt-0">
              <div className="text-slate-400 text-center mb-3 font-bold">
                <small>Sign in with credentials</small>
              </div>
              <form onSubmit={handleSignIn}>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
                    Username
                  </label>
                  <input
                    type="text"
                    onChange={handleUsernameInput}
                    className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Username"
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label className="block uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={handlePasswordInput}
                    className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                  />
                </div>
                <div className="text-center mt-6">
                  <Button
                    className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit">
                    Sign In
                  </Button>
                </div>
                {error && <div className="text-red-500 w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size="lg" color="default" />
        </div>
      )}
    </div>
  );
}
