"use client";

import React from "react";

export default function SubscribeForm() {
    return (
        <div className="p-6 bg-white">
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-3 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                />
                <button
                    type="submit"
                    className="w-full bg-[#E93F33] text-white text-xs font-bold py-3 uppercase tracking-widest hover:bg-[#d63025] transition-colors"
                >
                    I WANT IN {'>'}
                </button>
                <div className="flex items-start gap-2 mt-1">
                    <input type="checkbox" id="privacy" className="mt-1" />
                    <label htmlFor="privacy" className="text-[10px] leading-tight text-gray-500">
                        I&apos;ve read and accept the <a href="#" className="underline decoration-1 underline-offset-2">Privacy Policy</a>
                    </label>
                </div>
            </form>
        </div>
    );
}

