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
          <NavList text="Services" />
          <NavList text="Community" />

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
