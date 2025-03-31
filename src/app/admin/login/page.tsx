// src/app/admin/login/page.tsx

'use client';

import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative mb-4">
          <input
            type={showUsername ? 'text' : 'password'}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none text-white pr-10"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            onClick={() => setShowUsername(!showUsername)}
          >
            {showUsername ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none text-white pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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
