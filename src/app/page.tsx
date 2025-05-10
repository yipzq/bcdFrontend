//src/app/page.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import ExchangeRates from '@/app/components/ExchangeRates';

const features = [
  {
    title: 'Deposit',
    description:
      'Easily deposit USD into your account using Stripe. Your funds are secured and ready to convert anytime.',
    image: '/images/deposit.svg',
    bg: 'bg-purple-100',
  },
  {
    title: 'Convert',
    description:
      'Convert USD to platform tokens, enabling instant blockchain-ready currency.',
    image: '/images/convert.svg',
    bg: 'bg-blue-100',
  },
  {
    title: 'Send Token',
    description:
      "Send tokens instantly by entering the recipient's wallet address and desired amount.",
    image: '/images/transfer.svg',
    bg: 'bg-green-100',
  },
  {
    title: 'Withdraw',
    description:
      'Easily withdraw your USD back to your bank account when you’re ready.',
    image: '/images/withdraw.svg',
    bg: 'bg-yellow-100',
  },
  {
    title: 'Transactions',
    description:
      'Track your entire transaction history using just your wallet address. Stay transparent and in control.',
    image: '/images/transactions.svg',
    bg: 'bg-pink-100',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full bg-gray-50">
      {/* Hero Section */}
      <section className="bg-purple-600 text-white py-16 px-6 text-center w-full">
        <h1 className="text-5xl font-extrabold">
          Welcome to Remittance Token Platform
        </h1>
        <p className="mt-4 text-xl max-w-3xl mx-auto">
          Blockchain-powered currency exchange — deposit funds, convert tokens,
          send globally, and manage your entire transaction history
          effortlessly.
        </p>
      </section>

      {/* About Us Section */}
      <section className="py-12 px-6 w-full">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            About Us
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            We are a passionate team of blockchain enthusiasts and financial
            technology experts committed to transforming the way people send,
            receive, and manage money globally. Our platform leverages the power
            of blockchain to create a seamless remittance experience that's
            fast, affordable, and secure.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="pt-12 pb-4 px-6 w-full">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-700 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            To empower users with a modern remittance solution that bridges
            traditional finance with the future of decentralized technology —
            enabling fair, borderless access to currency exchange and financial
            inclusion for everyone.
          </p>
        </div>
      </section>

      {/* Exchange Rates Section */}
      <section className="pt-4 px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <ExchangeRates />
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-12 px-6 w-full">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
            Our Platform Features
          </h2>
          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`${feature.bg} rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 transition-transform duration-300 transform hover:scale-105`}
              >
                <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full shadow">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-lg text-gray-700 max-w-3xl">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
