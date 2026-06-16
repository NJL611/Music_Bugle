import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-24 2xl:px-64 text-center">
        <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-4 leading-tight">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 font-graphiklight max-w-xl mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-theme-red text-white px-8 py-3 rounded-sm hover:bg-[#a03b3c] transition-colors font-graphiknormal"
          >
            Return to Home
          </Link>
          <Link
            href="/contact"
            className="bg-white border-2 border-theme-red text-theme-red px-8 py-3 rounded-sm hover:bg-theme-red hover:text-white transition-colors font-graphiknormal"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
