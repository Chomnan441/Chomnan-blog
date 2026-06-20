import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b border-stone-200 bg-blog-page">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8 lg:px-16"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="text-2xl font-bold tracking-tight text-stone-950"
        >
          hh.
        </a>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="h-11 rounded-full border-stone-950 bg-white px-6 text-base font-medium text-stone-950 hover:bg-stone-100"
            asChild
          >
            <a href="#">Log in</a>
          </Button>
          <Button
            className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
            asChild
          >
            <a href="#">Sign up</a>
          </Button>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-md text-stone-800 hover:bg-stone-200/60 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-stone-300/60 bg-blog-page px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-stone-950 bg-white text-base font-medium text-stone-950 hover:bg-stone-100"
              asChild
            >
              <a href="#" onClick={closeMenu}>
                Log in
              </a>
            </Button>
            <Button
              className="h-11 w-full rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
              asChild
            >
              <a href="#" onClick={closeMenu}>
                Sign up
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
