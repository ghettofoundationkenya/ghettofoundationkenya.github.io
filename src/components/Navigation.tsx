import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { sections } from "@/content/site";

// The menu is built from src/content/site.ts: new pages there appear here automatically.
const menu = [
  ...sections.map((s) => ({
    label: s.menuLabel,
    to: s.path,
    children: [
      { to: s.path, label: "Overview" },
      ...s.pages.map((p) => ({ to: s.path + "/" + p.slug, label: p.title })),
    ],
  })),
  { label: "Publications & Media", to: "/publications", children: [] as { to: string; label: string }[] },
  { label: "About Us", to: "/about", children: [] as { to: string; label: string }[] },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setOpenMobile(null);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMobileMenu}>
            <img src={logo} alt="Ghetto Foundation Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            {menu.map((item) =>
              item.children.length ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDesktop(item.label)}
                  onMouseLeave={() => setOpenDesktop(null)}
                >
                  <Link to={item.to} className={"nav-link flex items-center space-x-1 " + (isActive(item.to) ? "nav-link-active" : "")}>
                    <span>{item.label}</span>
                    <ChevronDown className={"w-4 h-4 transition-transform duration-200 " + (openDesktop === item.label ? "rotate-180" : "")} />
                  </Link>
                  {openDesktop === item.label && (
                    <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg border z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setOpenDesktop(null)}
                          className={"block px-4 py-3 nav-link hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg " + (location.pathname === c.to ? "nav-link-active bg-gray-50" : "")}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} to={item.to} className={"nav-link " + (isActive(item.to) ? "nav-link-active" : "")}>
                  {item.label}
                </Link>
              )
            )}
            <Link to="/donate">
              <Button className="btn-hero">Donate</Button>
            </Link>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-community-warm transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile */}
        <div className={"lg:hidden overflow-hidden transition-all duration-300 ease-in-out " + (isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0")}>
          <div className="py-4 border-t space-y-1">
            {menu.map((item) =>
              item.children.length ? (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenMobile(openMobile === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 nav-link"
                  >
                    <span className="font-medium">{item.label}</span>
                    <ChevronDown className={"w-4 h-4 transition-transform duration-300 " + (openMobile === item.label ? "rotate-180" : "")} />
                  </button>
                  {openMobile === item.label && (
                    <div className="pl-4 py-1 space-y-1">
                      {item.children.map((c) => (
                        <Link key={c.to} to={c.to} onClick={closeMobileMenu} className={"block px-3 py-2 nav-link text-sm " + (location.pathname === c.to ? "nav-link-active" : "")}>
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} to={item.to} onClick={closeMobileMenu} className={"block px-3 py-2.5 nav-link " + (isActive(item.to) ? "nav-link-active" : "")}>
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 pb-1">
              <Link to="/donate" onClick={closeMobileMenu}>
                <Button className="btn-hero w-full">Donate</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
