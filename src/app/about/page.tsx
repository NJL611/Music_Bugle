import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { SITE_URL, METADATA } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about The Music Bugle - your source for the latest music news, reviews, and insights.",
  openGraph: {
    title: "About Us - The Music Bugle",
    description: "Learn about The Music Bugle - your source for the latest music news, reviews, and insights.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-12 2xl:px-64">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
            About The Music Bugle
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-graphiklight max-w-3xl mx-auto leading-relaxed">
            Your trusted source for the latest music news, reviews, interviews, and insights from the world of music.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Our Mission
            </h2>
            <div className="body-text">
              <p className="mb-4">
                Launched in 2019, The Music Bugle was formed behind the idea that music is more than just sound - it’s a universal language that connects people across cultures, generations and backgrounds. Our mission is to bring you the most compelling stories from the music and entertainment world, covering all from breaking news and album releases to in-depth artist interviews and thought-provoking reviews.
              </p>
              <p className="mb-4">
                We don’t cater to specific niches or genres - just as the music world is filled with countless styles and tastes, we welcome the importance of diversity while keeping you informed about artists, trends and movements that shape the industry today. Whether you’re a casual listener who pops on Top 40 every now and then or a dedicated fan pupil-glued to your phone, armed to receive tweets (or X’s?) from your favorite act at any given notice, you can bet The Music Bugle will be right there every step of the way.
              </p>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="mb-16">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
              What We Do
            </h2>
            <div className="body-text">
              <p className="mb-4">
                The Music Bugle covers a wide spectrum of music-related content:
              </p>
              <ul className="list-disc list-inside space-y-3 mb-4 ml-4">
                <li className="pl-2">
                  <strong className="font-graphiknormal">News & Updates:</strong> Stay informed with the latest breaking news, tour announcements, and industry developments.
                </li>
                <li className="pl-2">
                  <strong className="font-graphiknormal">Artist Interviews:</strong> Exclusive conversations with musicians, producers, and industry professionals.
                </li>
                <li className="pl-2">
                  <strong className="font-graphiknormal">Music Videos:</strong> Discover and explore the visual artistry behind your favorite songs.
                </li>
                <li className="pl-2">
                  <strong className="font-graphiknormal">Album Reviews:</strong> In-depth analysis and thoughtful critiques of new releases across all genres.
                </li>
                <li className="pl-2">
                  <strong className="font-graphiknormal">Upcoming Releases:</strong> Get a preview of what&apos;s coming next in the music world.
                </li>
                <li className="pl-2">
                  <strong className="font-graphiknormal">Tours & Live Events:</strong> Coverage of concerts, festivals, and live performances.
                </li>
              </ul>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="mb-16">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <h3 className="text-[24px] font-prata text-gray-900 mb-3">Integrity</h3>
                <p className="body-text">
                  We are committed to honest, unbiased reporting and reviews. Our editorial independence ensures that our content reflects our genuine opinions and insights.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[24px] font-prata text-gray-900 mb-3">Passion</h3>
                <p className="body-text">
                  Music is our passion, and we bring that enthusiasm to every article, review, and interview we publish. We believe in celebrating the art form we love.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[24px] font-prata text-gray-900 mb-3">Diversity</h3>
                <p className="body-text">
                  We celebrate music in all its forms—from mainstream hits to underground gems, across all genres and cultures. Every voice deserves to be heard.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[24px] font-prata text-gray-900 mb-3">Community</h3>
                <p className="body-text">
                  We&apos;re building a community of music lovers who share their thoughts, discoveries, and passion. Your engagement makes The Music Bugle what it is.
                </p>
              </div>
            </div>
          </section>

          {/* About Creator Section */}
          <section className="mb-16">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
              About Creator Nicholas Jason Lopez
            </h2>
            <div className="body-text">
              <p className="mb-4">
                Born and bred from Brooklyn, N.Y., Nicholas Jason Lopez, 33, has been a freelance journalist for more than 15 years, with experience that spans the likes of politics and sports to local news and professional wrestling/MMA. He has written for outlets such as BKLYNER, Home Reporter/Brooklyn Spectator, Review Fix and Brooklyn News Service.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-16 border-t border-gray-200 pt-12">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6">
              Get In Touch
            </h2>
            <div className="body-text">
              <p className="mb-4">
                We&apos;d love to hear from you! Whether you have a story tip, feedback, or just want to say hello, don&apos;t hesitate to reach out.
              </p>
              <p className="mb-6">
                <a
                  href="/contact"
                  className="text-theme-red hover:text-theme-button transition-colors underline font-graphiknormal"
                >
                  Contact us here
                </a>
              </p>
              <p className="text-sm text-gray-500 font-graphiklight">
                For press inquiries, please include &quot;Press Inquiry&quot; in your subject line.
              </p>
            </div>
          </section>

          {/* Support Section */}
          <section className="mb-16 border-t border-gray-200 pt-12">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6">
              Support The Music Bugle
            </h2>
            <div className="body-text">
              <p className="mb-4">
                If you enjoy our content and want to help us continue bringing you quality music journalism, consider supporting The Music Bugle.
              </p>
              <p className="mb-6">
                <a
                  href="/support"
                  className="inline-block bg-theme-button text-white px-6 py-3 rounded-md hover:bg-theme-red transition-colors font-graphiknormal"
                >
                  Support Us
                </a>
              </p>
              <p className="text-sm text-gray-500 font-graphiklight">
                Your support helps us maintain our independence and continue covering the music stories that matter.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

