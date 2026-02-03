"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to subscribe');
            }

            setStatus('success');
            setMessage('Thanks for subscribing!');
            setEmail('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex w-full">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full px-4 py-3 bg-white text-black text-sm rounded-sm focus:outline-none placeholder-gray-500"
                        disabled={status === 'loading' || status === 'success'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-black text-white px-4 py-3 text-sm rounded-sm hover:bg-gray-900 transition-colors border border-white/20 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                    {status === 'loading' ? (
                        'Subscribing...'
                    ) : status === 'success' ? (
                        'Subscribed!'
                    ) : (
                        <>
                            I want in <span className="text-lg">→</span>
                        </>
                    )}
                </button>

                <div className="flex items-start gap-2 mt-1">
                    <input type="checkbox" required className="mt-1 accent-white" aria-label="Privacy Policy" />
                    <span className="text-[13px] text-gray-400">
                        I&apos;ve read and accept the <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                    </span>
                </div>

                {message && (
                    <p
                        className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
