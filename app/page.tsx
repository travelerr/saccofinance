import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  //FaLinkedin,
  FaFacebook,
  FaFilePdf,
  FaDiscord
} from "react-icons/fa";
import { SiThreads, SiX } from "react-icons/si";
import Head from "next/head";
import Image from 'next/image';
import { GiTakeMyMoney } from "react-icons/gi";

export default function SocialLandingPage() {
  return (
    <>
      <Head>
        <title>Justin Sacco – Sacco Financial | Finance Tips & Strategies</title>
        <meta 
          name="description" 
          content="Justin Sacco shares 15 years of experience in tech & finance. Get finance tips, strategies, and insights with no gatekeeping – just results." 
        />
        <meta name="keywords" content="Justin Sacco, Sacco Financial, finance tips, investing, personal finance, financial strategies" />
        <meta name="author" content="Justin Sacco" />

        {/* Open Graph Meta Tags (Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content="Justin Sacco – Sacco Financial" />
        <meta property="og:description" content="Learn finance strategies & money tips from Justin Sacco, a tech & finance professional with 15 years of experience." />
        <meta property="og:image" content="/headshot.jpeg" />
        <meta property="og:url" content="https://justinsacco.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Justin Sacco – Sacco Financial" />
        <meta name="twitter:description" content="Finance tips & strategies from Justin Sacco – No gatekeeping, just results." />
        <meta name="twitter:image" content="/headshot.jpeg" />

        {/* JSON-LD Schema Markup for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Justin Sacco",
            "url": "https://justinsacco.com",
            "image": "https://justinsacco.com/headshot.jpeg",
            "description": "Finance expert sharing personal finance tips, investing insights, and money strategies.",
            "sameAs": [
              "https://www.instagram.com/saccofinancial",
              "https://www.threads.net/@saccofinancial",
              "https://www.tiktok.com/@saccofinancial",
              "https://x.com/justin_sacco",
              "https://www.youtube.com/@saccofinancial",
              "https://www.linkedin.com/in/jmsacco",
              "https://www.facebook.com/people/Sacco-Financial/61573912254568"
            ]
          })}
        </script>
      </Head>
      <main
        className="min-h-screen flex items-center justify-center p-6 bg-cover bg-left bg-no-repeat relative"
        style={{
          backgroundImage: "url('/headshot.jpeg')",
          backgroundSize: "contain",
          backgroundPosition: "left",
        }}
      >
        {/* Background Image Hidden for SEO */}
        <Image
          src="/headshot.jpeg"
          alt="Justin Sacco - Finance Expert"
          width={500}
          height={500}
          className="absolute opacity-0 w-0 h-0"
          priority
        />
        {/* Gradient Overlay for Smooth Blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-gray-900/5"></div>
        {/* Content Container */}
        <div className="relative max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden text-center p-8">
          <div className="flex justify-center">
            <Image
              src="/profile.jpg"
              alt="Justin Sacco - Profile Picture"
              width={120}
              height={120}
              className="rounded-full border-4 border-gray-300 shadow-md"
              priority
            />
          </div>
        <h1 className="mt-4 text-4xl font-bold text-gray-800">
          Sacco Financial
        </h1>          
        <p className="mt-2 text-gray-600">
          📈 Investing & Market Education<br/>
          💡Strategies, Insights & News<br/>
          🎓15 years exp
          </p>
          <div className="mt-6 flex flex-col gap-4">
            <SocialLink
              href="https://discord.gg/uX6Vqakbhk"
              icon={<FaDiscord />}
              platform="Trading Discord"
              bgColor="#5865f2"
            />
            <SocialLink
              href="https://www.digistore24.com/redir/475469/SOfinancial/"
              icon={<GiTakeMyMoney />}
              platform="Master the Market"
              bgColor="red"
            />
            {/* <SocialLink
              href="https://join.justinsacco.com/investing-kit"
              icon={<FaFilePdf />}
              platform="$4 Investing Guide"
              bgColor="green"
            /> */}
            <SocialLink
              href="https://join.justinsacco.com/free-investing-pdf"
              icon={<FaFilePdf />}
              platform="Free Investing PDF"
              bgColor="#0E3AF6"
            />
            <SocialLink
              href="https://www.instagram.com/saccofinancial"
              icon={<FaInstagram />}
              platform="Instagram"
            />
            <SocialLink
              href="https://www.threads.net/@saccofinancial"
              icon={<SiThreads />}
              platform="Threads"
            />
            <SocialLink
              href="https://www.tiktok.com/@saccofinancial"
              icon={<FaTiktok />}
              platform="TikTok"
            />
            <SocialLink
              href="https://x.com/justin_sacco"
              icon={<SiX />}
              platform="X (Twitter)"
            />
            <SocialLink
              href="https://www.youtube.com/@saccofinancial"
              icon={<FaYoutube />}
              platform="YouTube"
            />
            {/* <SocialLink
              href="https://www.linkedin.com/in/jmsacco"
              icon={<FaLinkedin />}
              platform="LinkedIn"
            /> */}
            <SocialLink
              href="https://www.facebook.com/people/Sacco-Financial/61573912254568"
              icon={<FaFacebook />}
              platform="Facebook"
            />
          </div>
        </div>
      </main>
    </>
  );
}

function SocialLink({
  href,
  icon,
  platform,
  bgColor
}: {
  href: string;
  icon: React.ReactNode;
  platform: string;
  bgColor?: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-full px-4 py-3 text-white rounded-md transition-colors duration-300 text-lg font-medium shadow-md`}
      style={{ backgroundColor: bgColor || "#000", color: bgColor ? "#fff" : undefined }}
    >
      <span className="mr-2 text-2xl">{icon}</span>
      {platform}
    </Link>
  );
}