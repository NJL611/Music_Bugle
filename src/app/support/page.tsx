'use client';
import { useState } from 'react';
import Nav from "@/components/layout/Nav";
import Image from 'next/image';
import dynamic from "next/dynamic";

// STRIPE IMPORTS
import CheckoutForm from "@/components/sections/CheckoutForm";
import { convertToSubcurrency } from "@/lib/utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Footer = dynamic(() => import("@/components/layout/Footer"), {
    ssr: false,
    loading: () => (
        <div className="w-full py-12 text-center text-xs text-gray-400" />
    ),
});

export default function SupportPage() {
    const [supportAmount, setSupportAmount] = useState<number | ''>(5);
    const [selectedTier, setSelectedTier] = useState<'one-time' | 'monthly'>('one-time');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setSupportAmount('');
        } else {
            // Check if the input has more than 2 decimal places
            if (value.includes('.') && value.split('.')[1]?.length > 2) {
                return; // Don't update if more than 2 decimal places
            }
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0) {
                setSupportAmount(numValue);
            }
        }
    };

    const supportImpact = [
        "Helps maintain independent music journalism",
        "Keeps content accessible and ad-light",
        "Supports quality reporting and in-depth coverage",
        "Enables editorial independence",
        "Sustains our mission to deliver unbiased music news",
    ];

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Nav />

            <div className="w-full mx-auto px-8 py-12 2xl:px-64">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
                        Support Independent Music Journalism
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-graphiklight max-w-3xl mx-auto leading-relaxed">
                        Your support helps us deliver quality music coverage, maintain editorial independence, and keep The Music Bugle ad-light. Every contribution directly supports independent music journalism.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        {/* Impact Section */}
                        <div className="flex flex-col">
                            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
                                Your Support Makes a Difference
                            </h2>
                            <ul className="space-y-4">
                                {supportImpact.map((impact, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-theme-red text-xl mt-1">✓</span>
                                        <span className="body-text">{impact}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 p-6 bg-gray-50 rounded-sm border border-gray-200">
                                <p className="text-sm text-gray-600 font-graphiklight leading-relaxed">
                                    <strong className="font-graphiknormal text-gray-900">Note:</strong> Your support payment helps us maintain our independent music journalism platform. By supporting us, you're helping to keep quality music news accessible and ad-light. This is a support payment for content and services, not a charitable donation.
                                </p>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="flex flex-col">
                            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
                                Support Amount
                            </h2>

                            {/* Support Type Toggle */}
                            <div className="mb-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTier('one-time')}
                                    className={`flex-1 px-6 py-3 rounded-sm font-graphiknormal transition-colors ${selectedTier === 'one-time'
                                        ? 'bg-theme-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    One-time Support
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTier('monthly')}
                                    className={`flex-1 px-6 py-3 rounded-sm font-graphiknormal transition-colors ${selectedTier === 'monthly'
                                        ? 'bg-theme-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Monthly Support
                                </button>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[5, 10, 25].map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setSupportAmount(amount)}
                                        className={`px-4 py-3 rounded-sm font-graphiknormal transition-colors ${supportAmount === amount
                                            ? 'bg-theme-red text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount Input */}
                            <div className="mb-6">
                                <label htmlFor="supportAmount" className="block text-sm font-graphiknormal text-gray-700 mb-2">
                                    Custom Amount (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-graphiknormal">$</span>
                                    <input
                                        type="number"
                                        id="supportAmount"
                                        value={supportAmount}
                                        onChange={handleAmountChange}
                                        placeholder="5.00"
                                        min="1"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-sm text-lg focus:outline-none focus:border-theme-red bg-white font-graphiknormal"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 font-graphiklight">
                                    Minimum: $1.00
                                </p>
                            </div>

                            {/* Payment Form */}
                            {supportAmount && supportAmount >= 1 && (
                                <div className="border-t border-gray-200 pt-6">
                                    <p className="text-sm font-graphiknormal text-gray-700 mb-4">
                                        {selectedTier === 'one-time'
                                            ? `One-time support payment of $${supportAmount}`
                                            : `Monthly recurring support payment of $${supportAmount} per month`
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4 font-graphiklight">
                                        By proceeding, you agree to our <a href="/terms" className="text-theme-red hover:underline">Terms of Service</a> and <a href="/privacy" className="text-theme-red hover:underline">Privacy Policy</a>. See our <a href="/refund" className="text-theme-red hover:underline">Refund Policy</a> for cancellation details.
                                    </p>
                                    <Elements
                                        stripe={stripePromise}
                                        options={{
                                            mode: selectedTier === 'monthly' ? "subscription" : "payment",
                                            amount: convertToSubcurrency(supportAmount),
                                            currency: "usd",
                                            appearance: {
                                                theme: 'flat',
                                                variables: { colorPrimaryText: '#262626' }
                                            },
                                        }}
                                    >
                                        <CheckoutForm
                                            amount={supportAmount}
                                            isSubscription={selectedTier === 'monthly'}
                                        />
                                    </Elements>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-200 pt-8 mt-12">
                        <h3 className="text-[24px] font-prata text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[20px] font-prata text-gray-900 mb-2">What am I paying for?</h4>
                                <p className="body-text">
                                    Your support payment helps us maintain independent music journalism, provide ad-light content, and deliver quality reporting on the music industry. Your contribution directly funds our editorial operations and keeps our content accessible.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[20px] font-prata text-gray-900 mb-2">Is this a donation?</h4>
                                <p className="body-text">
                                    No, this is a support payment for content and services. Your support helps us maintain our independent music journalism platform and deliver quality content. This is a payment for services, not a charitable donation.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[20px] font-prata text-gray-900 mb-2">Can I cancel my monthly support?</h4>
                                <p className="body-text">
                                    Yes, you can cancel your monthly recurring support at any time. Simply contact us or manage your recurring support through your payment method. Your support will continue until the end of your current billing period.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
