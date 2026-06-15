"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useTheme } from "./DashboardContext";

const NAV = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
  },
  {
    href: "/dashboard/cartes_unite",
    label: "Cartes à l'unité",
    icon: <><rect x="2" y="4" width="14" height="18" rx="2"/><path d="M10 4h6a2 2 0 0 1 2 2v12"/><path d="M6 8h4M6 12h4"/></>,
  },
  {
    href: "/dashboard/cartes_pca",
    label: "Cartes Gradées",
    icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  },
  {
    href: "/dashboard/items_scelles",
    label: "Items Scellés",
    icon: <><path d="M21 8V21H3V8"/><path d="M23 3H1v5h22V3z"/><path d="M10 12h4"/></>,
  },
  {
    href: "/dashboard/mastersets",
    label: "Mastersets",
    icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  },
];

const SUN = <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>;
const MOON = <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>;

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="nav-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Investisseur";
  const tagline = user?.user_metadata?.tagline || "Dresseur·se";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-ball" />
          <div className="logo-text">PokéInvest<span>Portfolio Tracker</span></div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-section">Navigation</div>
        {NAV.map(({ href, label, icon }) => {
          const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={isActive ? "active" : ""}>
              <NavIcon>{icon}</NavIcon>{label}
            </Link>
          );
        })}

        <div className="nav-section" style={{ marginTop: 4 }}>Outils</div>
        <Link href="/dashboard/referentiel" className={pathname.startsWith("/dashboard/referentiel") ? "active" : ""}>
          <NavIcon>
            <><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>
          </NavIcon>
          Référentiel Séries
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link href="/dashboard/profile" className="user-pill" style={{ textDecoration: "none" }}>
          <div className="user-avatar" style={avatarUrl ? { padding: 0 } : {}}>
            {avatarUrl
              ? <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : initial}
          </div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-role">{tagline}</div>
          </div>
        </Link>

        <button
          onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 11, padding: "6px 4px", borderRadius: 8, transition: "color .2s", width: "100%", marginBottom: 4 }}
          onMouseOver={e => (e.currentTarget.style.color = "var(--red)")}
          onMouseOut={e => (e.currentTarget.style.color = "var(--muted)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Se déconnecter
        </button>

        <button className="theme-toggle" onClick={toggle} aria-label="Basculer le thème">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {dark ? SUN : MOON}
          </svg>
          <span className="tt-label">{dark ? "Mode clair" : "Mode sombre"}</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const { toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu quand la route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <div className="mobile-header">
        <div className="logo-mark">
          <div className="logo-ball" />
          <div className="logo-text">PokéInvest</div>
        </div>
        <button
          className="mobile-theme-toggle"
          onClick={toggle}
          aria-label="Basculer le thème"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </button>
      </div>

      <nav className="mobile-bottom-nav">
        {NAV.map(({ href, label, icon }) => {
          const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={isActive ? "active" : ""}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              <span>{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Need useState and useEffect imports for MobileHeader
import { useState, useEffect } from "react";
