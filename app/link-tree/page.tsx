import type { Metadata } from "next";
import Link from "next/link";
import {
  FaBookOpen,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";
import { SiThreads, SiX } from "react-icons/si";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sacco Financial Link Tree | Justin Sacco Socials & Resources",
  description:
    "Browse the official Sacco Financial link tree for Justin Sacco's investing guide, YouTube, Instagram, TikTok, X, Threads, and more stock market education resources.",
  keywords: [
    "Sacco Financial link tree",
    "sacco financial",
    "Justin Sacco links",
    "Sacco Financial social media",
    "investing guide",
    "stock market education",
  ],
  alternates: {
    canonical: "/link-tree",
  },
  openGraph: {
    title: "Sacco Financial Link Tree | Justin Sacco Socials & Resources",
    description:
      "Find the official Sacco Financial links, investing guide, and social channels from Justin Sacco.",
    url: "https://saccofinancial.com/link-tree",
    images: [
      {
        url: "/headshot.jpeg",
        width: 1200,
        height: 630,
        alt: "Sacco Financial Link Tree",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacco Financial Link Tree | Justin Sacco Socials & Resources",
    description:
      "Find the official Sacco Financial links, investing guide, and social channels from Justin Sacco.",
    images: [
      {
        url: "/headshot.jpeg",
        width: 1200,
        height: 630,
        alt: "Sacco Financial Link Tree",
      },
    ],
  },
};

export default function SocialLandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sacco Financial Link Tree",
    url: "https://saccofinancial.com/link-tree",
    description:
      "Official Sacco Financial resource hub with social links and investing education from Justin Sacco.",
    about: {
      "@type": "Organization",
      name: "Sacco Financial",
      url: "https://saccofinancial.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main
        className="min-h-screen flex items-center justify-center p-6 bg-cover bg-left bg-no-repeat relative bg-black"
        style={{
          backgroundImage: "url('/headshot.jpeg')",
          backgroundSize: "contain",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-gray-900/5" />

        {/* Content Container */}
        <div className="relative max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden text-center p-8">
          <div className="flex justify-center">
            <Image
              src="/images/profile.jpg"
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
            📈 Stock market education for everyday investors
            <br />
            💰 Stocks • Options • Passive income
            <br />
            🧠 15+ years of market experience
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <SocialLink
              href="https://join.saccofinancial.com/free-investing-pdf"
              icon={<FaBookOpen />}
              platform="Free Investing Guide"
              bgColor="#4CE1E6"
              textColor="#000000"
              isExternal
            />
            <SocialLink
              href="https://www.instagram.com/saccofinancial"
              icon={<FaInstagram />}
              platform="Instagram"
              isExternal
            />
            <SocialLink
              href="https://www.threads.net/@saccofinancial"
              icon={<SiThreads />}
              platform="Threads"
              isExternal
            />
            <SocialLink
              href="https://www.tiktok.com/@saccofinancial"
              icon={<FaTiktok />}
              platform="TikTok"
              isExternal
            />
            <SocialLink
              href="https://x.com/justin_sacco"
              icon={<SiX />}
              platform="X (Twitter)"
              isExternal
            />
            <SocialLink
              href="https://www.youtube.com/@saccofinancial"
              icon={<FaYoutube />}
              platform="YouTube"
              isExternal
            />
            <SocialLink
              href="https://www.facebook.com/people/Sacco-Financial/61573912254568"
              icon={<FaFacebook />}
              platform="Facebook"
              isExternal
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
  bgColor,
  textColor,
  isExternal,
}: {
  href: string;
  icon: React.ReactNode;
  platform: string;
  bgColor?: string;
  textColor?: string;
  isExternal: boolean;
}) {
  const className =
    "flex items-center justify-center w-full px-4 py-3 text-white rounded-md transition-colors duration-300 text-lg font-medium shadow-md";
  const style = {
    backgroundColor: bgColor || "#000",
    color: textColor || "#fff",
  };

  // External links as <a> for max compatibility inside in-app browsers
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        <span className="mr-2 text-2xl">{icon}</span>
        {platform}
      </a>
    );
  }

  // Internal route (bridge page)
  return (
    <Link href={href} className={className} style={style}>
      <span className="mr-2 text-2xl">{icon}</span>
      {platform}
    </Link>
  );
}
