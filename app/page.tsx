import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { SiThreads, SiX } from "react-icons/si";

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
      {/* Gradient Overlay for Smooth Blending */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-gray-900/5"></div>
      {/* Content Container */}
      <div className="relative max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden text-center p-8">
        <h1 className="mt-4 text-3xl font-bold text-gray-800">Sacco Finance</h1>
        <p className="mt-2 text-gray-600">
          💻📈 15 years of experience in tech & finance<br />
          🚀 Sharing insights, strategies<br />
          💡💰 No gatekeeping, just results
        </p>

        <div className="mt-6 flex flex-col gap-4">
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
          <SocialLink
            href="https://www.linkedin.com/in/jmsacco"
            icon={<FaLinkedin />}
            platform="LinkedIn"
          />
          <SocialLink
            href="https://www.facebook.com/people/Sacco-Financial/61573912254568"
            icon={<FaFacebook />}
            platform="Facebook"
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
}: {
  href: string;
  icon: React.ReactNode;
  platform: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center w-full px-4 py-3 text-white bg-black rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium shadow-md"
    >
      <span className="mr-2 text-2xl">{icon}</span>
      {platform}
    </Link>
  );
}
