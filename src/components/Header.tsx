import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import Logo from './Logo';
import { navLinks, contactInfo } from '@/data/content';
import { useScrollPosition } from '@/hooks/useScroll';
import { useRouter } from '@/context/RouterContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const scrolled = useScrollPosition(30);
  const [menuOpen, setMenuOpen] = useState(false);
  const { navigate } = useRouter();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      navigate({ name: 'home' });
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleMatricula = () => {
    setMenuOpen(false);
    navigate({ name: 'home' });
    setTimeout(() => {
      document.querySelector('#cursos')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-400 ${
          scrolled
            ? 'border-b border-white/10 bg-noir/90 backdrop-blur-lg'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <button
            onClick={() => handleNavClick('#inicio')}
            className="transition-transform duration-300 hover:scale-[1.02]"
            aria-label="PHAROS — Página inicial"
          >
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="group relative rounded-md px-3 py-2 text-sm font-medium text-steel transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-pharos-red transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Cart icon */}
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-md text-steel transition-colors hover:text-white"
              aria-label={`Carrinho com ${itemCount} item(ns)`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pharos-red px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={handleMatricula}
              className="hidden rounded-md bg-pharos-red px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-pharos-red-dark hover:shadow-[0_0_20px_-4px_rgba(225,6,0,0.6)] active:scale-95 sm:inline-flex"
            >
              Matricule-se
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[110] lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-noir/80 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l border-white/10 bg-graphite transition-transform duration-400 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-white"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {navLinks.map((link, idx) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="rounded-lg px-4 py-3.5 text-left text-base font-medium text-steel transition-colors hover:bg-white/5 hover:text-white"
                style={{
                  animation: menuOpen ? `slide-up 0.3s ${idx * 0.05}s both` : undefined,
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleMatricula}
              className="flex w-full items-center justify-center rounded-md bg-pharos-red px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-pharos-red-dark"
            >
              Matricule-se
            </button>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center rounded-md border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-pharos-red"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
