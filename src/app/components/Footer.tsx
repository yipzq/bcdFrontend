// app/components/Footer.tsx
'use client';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/*Contact */}
          <div className="max-w-sm">
            <h2 className="text-2xl font-bold text-white">Gengchow Blockchain Developer</h2>
            <p className="mt-2 text-sm text-gray-400">
              We are the most <span className="italic text-white">gengchow</span> blockchain developer in Malaysia — building secure, scalable, and impactful financial tech.
            </p>

            <div className="mt-6 text-sm text-gray-400 space-y-1">
              <h3 className="mt-6 text-lg font-semibold text-white">Contact Us</h3>
              <p><span className="text-white font-semibold">Email:</span> admin@apu.edu.my</p>
              <p><span className="text-white font-semibold">Phone:</span> +603 8996 1000</p>
              <p><span className="text-white font-semibold">Address:</span> Asia Pacific University, Kuala Lumpur</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Our Features</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="/deposit" className="hover:text-white">Deposit</a></li>
                <li><a href="/convert" className="hover:text-white">Convert</a></li>
                <li><a href="/sendtoken" className="hover:text-white">Send Token</a></li>
                <li><a href="/withdraw" className="hover:text-white">Withdraw</a></li>
                <li><a href="/transaction" className="hover:text-white">Transactions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="/#about-us" className="hover:text-white">About Us</a></li>
                <li>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Asia+Pacific+University+of+Technology+and+Innovation+(APU)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Our Location
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © 2025 CT124-3-3-BCD - Group 10 - Gengchow Blockchain Developer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}