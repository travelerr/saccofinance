import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaDiscord,
} from "react-icons/fa";
import { SiThreads, SiX } from "react-icons/si";
import Image from "next/image";

export default function SocialLandingPage() {
  return (
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-gray-900/5" />

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
          📈 Investing & Market Education
          <br />
          💡Strategies, Insights & News
          <br />
          🎓15 years exp
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {/* Discord -> Bridge page */}
          <SocialLink
            href="/discord"
            icon={<FaDiscord />}
            platform="Trading Discord"
            bgColor="#5865f2"
            isExternal={false}
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
  );
}

function SocialLink({
  href,
  icon,
  platform,
  bgColor,
  isExternal,
}: {
  href: string;
  icon: React.ReactNode;
  platform: string;
  bgColor?: string;
  isExternal: boolean;
}) {
  const className =
    "flex items-center justify-center w-full px-4 py-3 text-white rounded-md transition-colors duration-300 text-lg font-medium shadow-md";
  const style = { backgroundColor: bgColor || "#000", color: "#fff" };

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