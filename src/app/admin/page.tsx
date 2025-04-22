// src/app/admin/page.tsx

'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Validation
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required');
      return;
    }

    try {
      // Send login request to the server
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Login failed');
        return;
      }

      // Successful login, redirect to dashboard
      const data = await res.json();
      router.push('/admin/dashboard');
      // Store username in session state
      sessionStorage.setItem('username', data.username);
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-2">Welcome Back Admin!</h1>
      <p className="text-gray-400 mb-6">The transactions awaiting for you.</p>

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none text-white"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none text-white"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
