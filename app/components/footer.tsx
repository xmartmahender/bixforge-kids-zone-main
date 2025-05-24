import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font bg-gradient-to-r from-pink-500 to-purple-500 py-6">
      <div className="container px-5 mx-auto flex flex-col items-center">
        <div className="text-center text-gray-900 mb-4">
          <Link href="/" className="flex flex-col items-center">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="w-28 h-18 mx-auto"
            />
            <span className="block mt-2 text-5xl text-yellow-200 hover:text-yellow-300 font-bold">
              Stormiz
            </span>
          </Link>
        </div>
        <nav className="flex flex-wrap justify-center space-x-6 text-white font-medium text-lg mb-4">
          <a href="/about" className="hover:text-yellow-300">
            About Us
          </a>
          <a href="/contact" className="hover:text-yellow-300">
            Contact Us
          </a>
          <a href="/privacy-policy" className="hover:text-yellow-300">
            Privacy Policy
          </a>
          <Link href="/blog" className="hover:text-yellow-300">
            Blog
          </Link>
          <a href="/poems" className="hover:text-yellow-300">
            Poems for Kids
          </a>
        </nav>
        <div className="text-center text-white text-sm mb-4">
          © 2025 Stormiz —
          <a
            href="https://twitter.com/knyttneve"
            className="text-white ml-2 hover:text-yellow-300 font-bold"
            rel="noopener noreferrer"
            target="_blank"
          >
            @ByteForge
          </a>
        </div>
        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-yellow-300"
          >
            <FaFacebookF className="w-7 h-7" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-yellow-300"
          >
            <FaTwitter className="w-7 h-7" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-yellow-300"
          >
            <FaInstagram className="w-7 h-7" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-yellow-300"
          >
            <FaLinkedinIn className="w-7 h-7" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
