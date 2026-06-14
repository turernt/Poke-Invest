"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/dashboard/DashboardContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

interface StatRow { prix_achat: number | string; cote: number | string; }

interface CategoryStat { label: string; invest: number; cote: number; }

interface Performer { nom: string; cat: string; benef: number; }

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const supabase = getSupabaseBrowser();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  const [stats, setStats] = useState({
    invest: 0, value: 0, virtual: 0, items: 0,
  });
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: cartes }, { data: pca }, { data: items }, { data: sets }] =
        await Promise.all([
          supabase.from("cartes_unite").select("prix_achat,cote,carte,numero,serie"),
          supabase.from("cartes_pca").select("prix_achat,cote,carte,numero,serie"),
          supabase.from("items_scelles").select("prix_achat,cote,produit,serie"),
          supabase.from("mastersets").select("prix_achat,cote,nom,serie"),
        ]);

      const sum = (arr: StatRow[]) => ({
        invest: arr.reduce((s, r) => s + (parseFloat(String(r.prix_achat)) || 0), 0),
        cote: arr.reduce((s, r) => s + (parseFloat(String(r.cote)) || 0), 0),
      });

      const c = sum(cartes ?? []);
      const p = sum(pca ?? []);
      const i = sum(items ?? []);
      const s = sum(sets ?? []);

      const totalInvest = c.invest + p.invest + i.invest + s.invest;
      const totalCote = c.cote + p.cote + i.cote + s.cote;
      const totalItems = (cartes?.length ?? 0) + (pca?.length ?? 0) + (items?.length ?? 0) + (sets?.length ?? 0);

      setStats({ invest: totalInvest, value: totalCote, virtual: totalCote - totalInvest, items: totalItems });

      setCategories([
        { label: "À l'unité", ...c },
        { label: "Gradées", ...p },
        { label: "Scellés", ...i },
        { label: "Mastersets", ...s },
      ].filter(cat => cat.invest > 0 || cat.cote > 0));

      const allPerfs: Performer[] = [
        ...(cartes ?? []).map((r: { carte: string; numero: string; serie: string; prix_achat: number | string; cote: number | string }) => ({ nom: `${r.carte} ${r.numero}`, cat: `Unité · ${r.serie || ""}`, benef: (parseFloat(String(r.cote)) || 0) - (parseFloat(String(r.prix_achat)) || 0) })),
        ...(pca ?? []).map((r: { carte: string; numero: string; serie: string; prix_achat: number | string; cote: number | string }) => ({ nom: `${r.carte} ${r.numero}`, cat: `Gradée · ${r.serie || ""}`, benef: (parseFloat(String(r.cote)) || 0) - (parseFloat(String(r.prix_achat)) || 0) })),
        ...(items ?? []).map((r: { produit: string; serie: string; prix_achat: number | string; cote: number | string }) => ({ nom: r.produit, cat: `Scellé · ${r.serie || ""}`, benef: (parseFloat(String(r.cote)) || 0) - (parseFloat(String(r.prix_achat)) || 0) })),
        ...(sets ?? []).map((r: { nom: string; serie: string; prix_achat: number | string; cote: number | string }) => ({ nom: r.nom, cat: `Masterset · ${r.serie || ""}`, benef: (parseFloat(String(r.cote)) || 0) - (parseFloat(String(r.prix_achat)) || 0) })),
      ].sort((a, b) => b.benef - a.benef).slice(0, 5);

      setPerformers(allPerfs);
      setLoaded(true);
    })();
  }, [user, supabase]);

  // Chart.js
  useEffect(() => {
    if (!loaded || categories.length === 0 || !chartRef.current) return;
    import("chart.js/auto").then(({ default: Chart }) => {
      if (chartInstance.current) (chartInstance.current as { destroy: () => void }).destroy();
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const tickColor = isDark ? "#8b95a3" : "#6B7280";
      const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
      chartInstance.current = new Chart(chartRef.current!, {
        type: "bar",
        data: {
          labels: categories.map(c => c.label),
          datasets: [
            { label: "Investi", data: categories.map(c => c.invest), backgroundColor: "rgba(37,87,199,0.18)", borderColor: "#2557C7", borderWidth: 1.5, borderRadius: 6 },
            { label: "Valeur actuelle", data: categories.map(c => c.cote), backgroundColor: "rgba(245,184,0,0.22)", borderColor: "#d49c00", borderWidth: 1.5, borderRadius: 6 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top", labels: { font: { family: "Manrope", size: 11 }, color: tickColor, boxWidth: 10, padding: 14 } },
            tooltip: {
              backgroundColor: "#0B1623", titleColor: "rgba(255,255,255,0.5)", bodyColor: "#F5B800",
              bodyFont: { family: "Manrope", size: 13, weight: "bold" }, padding: 12, cornerRadius: 10,
              callbacks: { label: (c) => ` ${fmt(c.parsed.y ?? 0)}` },
            },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { font: { family: "Manrope", size: 11 }, color: tickColor, callback: (v) => `${Number(v) >= 1000 ? (Number(v) / 1000).toFixed(0) + "k" : v} €` } },
            x: { grid: { display: false }, border: { display: false }, ticks: { font: { family: "Manrope", size: 11 }, color: tickColor } },
          },
        },
      });
    });
    return () => { if (chartInstance.current) (chartInstance.current as { destroy: () => void }).destroy(); };
  }, [loaded, categories]);

  if (loading) return null;

  const isEmpty = stats.items === 0 && loaded;
  const roi = stats.invest > 0 ? (stats.value / stats.invest).toFixed(1) : null;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vue d&apos;ensemble</h1>
          <p className="page-subtitle">Toutes catégories · Données en temps réel</p>
        </div>
        <div className="date-badge">{today}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card c-blue">
          <div className="stat-card-top">
            <div className="stat-label">Total investi</div>
            <div className="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          </div>
          <div className="stat-value">{loaded ? fmt(stats.invest) : "—"}</div>
          <div className="stat-footer">Capital de départ</div>
        </div>
        <div className="stat-card c-gold">
          <div className="stat-card-top">
            <div className="stat-label">Valeur estimée</div>
            <div className="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
          </div>
          <div className="stat-value warning">{loaded ? fmt(stats.value) : "—"}</div>
          <div className="stat-footer">Prix de marché actuel</div>
        </div>
        <div className="stat-card c-green">
          <div className="stat-card-top">
            <div className="stat-label">Plus-value virtuelle</div>
            <div className="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
          </div>
          <div className={`stat-value ${loaded ? (stats.virtual >= 0 ? "positive" : "negative") : ""}`}>
            {loaded ? `${stats.virtual >= 0 ? "+" : ""}${fmt(stats.virtual)}` : "—"}
          </div>
          <div className="stat-footer">Si vente totale aujourd&apos;hui</div>
        </div>
        <div className="stat-card c-red">
          <div className="stat-card-top">
            <div className="stat-label">Articles suivis</div>
            <div className="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h2v-4z"/></svg></div>
          </div>
          <div className="stat-value">{loaded ? stats.items : "—"}</div>
          <div className="stat-footer">Dans votre collection</div>
        </div>
      </div>

      {isEmpty ? (
        <div style={{ textAlign: "center", padding: "64px 20px 40px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--gold-dim)", border: "1.5px solid rgba(245,184,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b08a00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Votre collection est vide</h2>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 360, margin: "0 auto 28px", lineHeight: 1.65 }}>
            Commencez par ajouter vos premières cartes, items scellés ou mastersets pour voir votre portfolio prendre vie.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/dashboard/cartes_unite" className="btn-add" style={{ textDecoration: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Ajouter des cartes
            </a>
            <a href="/dashboard/items_scelles" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: "var(--text-2)", border: "1.5px solid var(--border)", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Ajouter des scellés
            </a>
          </div>
        </div>
      ) : loaded && (
        <div className="charts-row">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Répartition par catégorie</span>
              <span className="panel-badge">{roi ? `× ${roi} depuis l'entrée` : `${stats.items} articles`}</span>
            </div>
            <div className="chart-wrap"><canvas ref={chartRef} /></div>
          </div>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Top Performers</span></div>
            <ul className="performer-list">
              {performers.map((p, i) => (
                <li key={i} className="performer-item">
                  <span className={`performer-rank${i < 2 ? " top" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                  <div className="performer-info">
                    <div className="performer-name">{p.nom}</div>
                    <div className="performer-cat">{p.cat}</div>
                  </div>
                  <span className={`performer-gain${p.benef < 0 ? " negative-gain" : ""}`}>
                    {p.benef >= 0 ? "+" : ""}{fmt(p.benef)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
