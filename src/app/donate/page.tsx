'use client';
import { useState } from 'react';
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from 'next/image';

export default function DonatePage() {
    const [donationAmount, setDonationAmount] = useState(50);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setDonationAmount(value);
        }
    };

    return (
        <main className="flex min-h-screen flex-col">
            <Nav />
            <div className="flex flex-col md:flex-row items-start mt-8">
                <div className="relative w-[451px] h-[316px] mt-[100px]">
                    <Image
                        src="/donate-guitar.png"
                        alt="Donate"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute left-1/2 top-[33%] transform -translate-x-1/2 -translate-y-1/2">
                    <p className="font-abril text-[42px] leading-[52px] tracking-[0.3px] text-center font-[400]">Almost There!</p>
                    <p className="font-inter text-[19px] leading-[24px] tracking-[0px] text-center font-normal mt-[30px]">Please complete payment details to make your donation</p>
                </div>
            </div>
            <div className="ml-[100px] h-[250px] mt-[80px]">
                <div className="w-[242px] h-[22px] font-inter text-[24px] leading-[22px] tracking-[0.1px] font-normal">
                    <p className="text-left text-[24px] w-[342px]">DONATION AMOUNT</p>
                    <div className="w-[584px] h-[82px] bg-[#FF0000] border border-[#B9B9B9] shadow-[0px_4px_4px_rgba(9,10,12,0.25)] mt-9">
                        <input 
                            type="number"
                            value={donationAmount}
                            onChange={handleAmountChange}
                            className="w-[350px] h-[40px] font-['Exo_2'] text-[36px] leading-[41.4px] text-center font-normal mx-auto mt-5 bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                            step="1"
                        />
                    </div>
                    <p className="text-left mt-[75px] text-[24px]">PAYMENT</p>
                </div>
            </div>

            <div 
                className="absolute left-[87px] top-[893px] w-[1538px] h-[1px] bg-[#C14E4E] rotate-0"
                style={{ borderTop: '1px solid #C14E4E' }}
            ></div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                
            </div>
            <Footer />
        </main>
    );
}