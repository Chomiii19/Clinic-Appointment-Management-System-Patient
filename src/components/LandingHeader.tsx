import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="lg:border-b-zinc-300 bg-off-white/70 backdrop-blur-md lg:border-b fixed w-full h-auto flex justify-center z-1000">
      <div className=" h-16 flex justify-between items-center px-5 w-full lg:px-10  py-2 lg:w-custom">
        <div className="flex gap-8 w-auto h-full items-center">
          <div className="cursor-pointer flex gap-8">
            <Logo />
          </div>
        </div>

        <nav className="flex gap-5 items-center">
          <NavList text="About" />
          <NavList text="Services" />
          <NavList text="Community" />
          <NavList text="Contact" />
          <SocialMedia />
          <Profile />
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 cursor-pointer">
      <img className="w-12" src="/assets/icons/logo.png" alt="logo" />
      <span className="text-z-800 font-semibold text-lg font-sans">OMDL</span>
    </a>
  );
}

function NavList({ text }: { text: string }) {
  return (
    <a
      href={`#${text.toLowerCase()}`}
      className="text-zinc-700 text-base font-semibold hover:text-primary transition-colors duration-150 hidden lg:flex"
    >
      {text}
    </a>
  );
}

function SocialMedia() {
  const style: string =
    "text-zinc-700 w-5 h-5 cursor-pointer hover:text-primary transition-colors duration-300";

  return (
    <div className="pl-5 border-zinc-400 lg:border-l flex items-center gap-2">
      <Facebook className={style} />
      <Twitter className={style} />
      <Instagram className={style} />
    </div>
  );
}

function Profile() {
  return (
    <Link
      to="/login"
      className="bg-primary px-3 py-0.5 text-sm rounded-md text-white font-bold"
    >
      Login
    </Link>
  );
}
