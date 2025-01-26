'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
          const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
          });
            if(error) {
               setError(error.message);
            }else {
                router.push('/')
            }

        } catch (error : any) {
            setError(error.message);
        }
      };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign in
                  </button>
                </div>
                <div className='flex justify-center'>
                    <a
                     href="/signup"
                     className="font-medium text-blue-600 hover:text-blue-500"
                     >
                         Don't have an account? Sign up
                    </a>
                </div>
          </form>
        </div>
      </div>
    );
};

export default LoginPage;