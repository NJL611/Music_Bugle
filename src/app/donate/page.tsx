'use client';
import { useState } from 'react';
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from 'next/image';

// STRIPE IMPORTS
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


export default function DonatePage() {
    const [donationAmount, setDonationAmount] = useState<number | ''>(1);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setDonationAmount('');
        } else {
            // Check if the input has more than 2 decimal places
            if (value.includes('.') && value.split('.')[1]?.length > 2) {
                return; // Don't update if more than 2 decimal places
            }
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0) {
                setDonationAmount(numValue);
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col">
            <Nav />
            <div className="flex flex-col md:flex-row items-start mt-8">
                <div className="relative w-full md:w-[451px] aspect-[451/316] mt-[100px]">
                    <Image
                        src="/donate-guitar.png"
                        alt="Donate"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="absolute left-1/2 top-[33%] transform -translate-x-1/2 -translate-y-1/2">
                    <p className="font-abril text-[42px] leading-[52px] tracking-[0.3px] text-center font-[400]">Almost There!</p>
                    <p className="font-inter text-[19px] leading-[24px] tracking-[0px] text-center font-normal mt-[30px]">Please complete payment details to make your donation</p>
                </div>
            </div>
            <div className="px-4 md:ml-[100px] h-[250px] mt-[80px]">
                <div className="w-full md:w-[242px] h-[22px] font-inter text-[24px] leading-[22px] tracking-[0.1px] font-normal">
                    <p className="text-left text-[24px] w-full md:w-[342px]">DONATION AMOUNT</p>
                    <div className="w-full md:w-[584px] h-[82px] bg-[#FF0000] border border-[#B9B9B9] shadow-[0px_4px_4px_rgba(9,10,12,0.25)] mt-9">
                        <input
                            type="number"
                            value={donationAmount}
                            onChange={handleAmountChange}
                            placeholder="1"
                            className="w-full h-[40px] font-['Exo_2'] text-[24px] md:text-[36px] leading-[41.4px] text-center font-normal mx-auto mt-5 bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[24px] md:placeholder:text-[36px] placeholder:leading-[41.4px] placeholder:font-['Exo_2']"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <p className="text-left mt-[75px] text-[24px]">PAYMENT</p>
                </div>
            </div>

            <div
                className="absolute left-0 right-0 top-[893px] h-[1px] bg-[#C14E4E] rotate-0"
                style={{ borderTop: '1px solid #C14E4E' }}
            ></div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">

            </div>      <Elements
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    amount: donationAmount === '' || donationAmount === 0 ? convertToSubcurrency(1) : convertToSubcurrency(donationAmount),
                    currency: "usd",
                    appearance: {
                        theme: 'flat',
                        variables: { colorPrimaryText: '#262626' }
                    },
                }}
            >
                <CheckoutPage amount={donationAmount === '' ? 0 : donationAmount} />
            </Elements>
            <Footer />
        </main>
    );
}