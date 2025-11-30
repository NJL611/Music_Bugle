import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Optimized inline SVG - simplified path for better performance
// Using a more efficient path definition
const CHECK_ICON_SVG = (
  <svg 
    className="w-10 h-10 text-white" 
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    width="40"
    height="40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={3} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const formattedAmount = amount || '0';

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main 
        className="flex-grow flex items-center justify-center px-4 py-16"
        aria-labelledby="success-heading"
      >
        <article className="max-w-2xl w-full bg-white border border-[#B9B9B9] shadow-[0px_4px_4px_rgba(9,10,12,0.25)] rounded-md p-8 md:p-12 text-center">
          {/* Success Icon - Decorative, properly labeled */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-16 h-16 bg-[#C14E4E] rounded-full flex items-center justify-center"
              role="img"
              aria-label="Payment successful checkmark icon"
            >
              {CHECK_ICON_SVG}
            </div>
          </div>

          {/* Heading */}
          <h1 id="success-heading" className="text-4xl md:text-5xl mb-4">
            Thank You!
          </h1>
          
          {/* Message */}
          <p className="text-lg md:text-xl text-gray-700 mb-8 font-graphiknormal">
            Your donation was successful
          </p>

          {/* Amount Display */}
          <section 
            className="bg-[#DC2626] border border-[#B9B9B9] shadow-[0px_4px_4px_rgba(9,10,12,0.25)] rounded-md py-6 px-8 mb-6"
            aria-labelledby="amount-label"
          >
            <p 
              id="amount-label"
              className="text-sm md:text-base text-white mb-2 font-graphiknormal tracking-wide uppercase"
            >
              Donation Amount
            </p>
            <p 
              className="text-4xl md:text-5xl font-bold text-white"
              aria-label={`Donation amount: $${formattedAmount}`}
            >
              ${formattedAmount}
            </p>
          </section>

          {/* Additional Message */}
          <p className="text-base text-gray-600 font-graphiknormal">
            Your support helps us continue bringing you the latest music news and supporting local artists.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
