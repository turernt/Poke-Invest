"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useToast, useConfirm } from "@/components/dashboard/DashboardContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const TAGLINES = [
  "Dresseur·se", "Investisseur·se", "Collectionneur·se",
  "Chasseur·se de PSA 10", "Top % mondial", "Shiny Hunter",
];

function strengthScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_COLORS = ["", "#dc2626", "#f59e0b", "#3b82f6", "#22c55e"];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const supabase = getSupabaseBrowser();

  const [identity, setIdentity] = useState({ displayName: "", username: "" });
  const [tagline, setTagline] = useState("Dresseur·se");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [strength, setStrength] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [savingId, setSavingId] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [savingTag, setSavingTag] = useState(false);

  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    setIdentity({ displayName: meta.full_name || "", username: meta.username || "" });
    setTagline(meta.tagline || "Dresseur·se");
    setAvatarUrl(meta.avatar_url || null);
  }, [user]);

  const initial = (identity.displayName || user?.email || "?").charAt(0).toUpperCase();
  const displayEmail = user?.email || "";

  const saveIdentity = useCallback(async () => {
    if (!identity.displayName.trim()) { showToast("Le nom est requis", "error"); return; }
    setSavingId(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: identity.displayName.trim(), username: identity.username.trim() } });
    if (error) showToast("Erreur lors de la sauvegarde", "error");
    else showToast("Profil mis à jour !");
    setSavingId(false);
  }, [identity, supabase, showToast]);

  const saveTaglineValue = useCallback(async (val: string) => {
    setTagline(val);
    setSavingTag(true);
    await supabase.auth.updateUser({ data: { tagline: val } });
    setSavingTag(false);
    showToast("Tagline mis à jour !");
  }, [supabase, showToast]);

  const savePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.next) { showToast("Saisissez un nouveau mot de passe", "error"); return; }
    if (passwords.next !== passwords.confirm) { showToast("Les mots de passe ne correspondent pas", "error"); return; }
    if (strength < 3) { showToast("Mot de passe trop faible", "error"); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.next });
    if (error) showToast("Erreur : " + error.message, "error");
    else { showToast("Mot de passe modifié !"); setPasswords({ current: "", next: "", confirm: "" }); setStrength(0); }
    setSavingPw(false);
  }, [passwords, strength, supabase, showToast]);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { showToast("Image trop volumineuse (max 2 Mo)", "error"); return; }
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { showToast("Erreur d'upload", "error"); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = data.publicUrl + "?t=" + Date.now();
    await supabase.auth.updateUser({ data: { avatar_url: url } });
    setAvatarUrl(url);
    showToast("Avatar mis à jour !");
  };

  const handleDeleteAccount = async () => {
    const ok = await confirm("Supprimer le compte", "Cette action supprimera définitivement votre compte et toutes vos données. Êtes-vous certain ?");
    if (!ok) return;
    showToast("Contactez contact@pokeinvest.fr pour supprimer votre compte.", "info");
  };

  if (loading) return null;

  const segColor = (i: number) => i < strength ? STRENGTH_COLORS[strength] : undefined;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mon Profil</h1>
          <p className="page-subtitle">Informations personnelles et sécurité</p>
        </div>
      </div>

      {/* Hero avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 0 28px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
        <label title="Changer la photo" style={{ cursor: "pointer", position: "relative", display: "inline-block" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "white", overflow: "hidden", border: "3px solid var(--card)", boxShadow: "0 4px 18px rgba(0,0,0,.14)" }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initial}
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,.45)", opacity: 0, transition: "opacity .2s", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseOver={e => (e.currentTarget.style.opacity = "1")}
            onMouseOut={e => (e.currentTarget.style.opacity = "0")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
        </label>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>Modifier</div>
      </div>

      {/* Tagline */}
      <div className="profile-section">
        <div className="profile-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          Tagline
          {savingTag && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>Sauvegarde…</span>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TAGLINES.map(t => (
            <button key={t} onClick={() => saveTaglineValue(t)}
              className={`tagline-chip${tagline === t ? " selected" : ""}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Identity */}
      <div className="profile-section">
        <div className="profile-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Identité
        </div>
        <div className="field-grid">
          <div className="field-group">
            <label className="field-label">Nom d&apos;affichage</label>
            <input className="field-input" value={identity.displayName} onChange={e => setIdentity(i => ({ ...i, displayName: e.target.value }))} placeholder="Votre nom" />
          </div>
          <div className="field-group">
            <label className="field-label">Nom d&apos;utilisateur</label>
            <input className="field-input" value={identity.username} onChange={e => setIdentity(i => ({ ...i, username: e.target.value }))} placeholder="@pseudo" />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" value={displayEmail} disabled style={{ opacity: .6, cursor: "not-allowed" }} />
            <div className="field-hint">L&apos;email ne peut pas être modifié ici.</div>
          </div>
        </div>
        <button className="save-btn" onClick={saveIdentity} disabled={savingId}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {savingId ? "Sauvegarde…" : "Enregistrer"}
        </button>
      </div>

      {/* Password */}
      <div className="profile-section">
        <div className="profile-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Mot de passe
        </div>
        <form onSubmit={savePassword} autoComplete="on">
          <div className="field-grid">
            <div className="field-group">
              <label className="field-label">Mot de passe actuel</label>
              <input type="password" className="field-input" autoComplete="current-password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
            </div>
            <div className="field-group">
              <label className="field-label">Nouveau mot de passe</label>
              <input type="password" className="field-input" autoComplete="new-password" value={passwords.next} onChange={e => { setPasswords(p => ({ ...p, next: e.target.value })); setStrength(strengthScore(e.target.value)); }} placeholder="••••••••" />
              <div className="strength-bar">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="strength-seg" style={{ background: segColor(i) }} />
                ))}
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Confirmer</label>
              <input type="password" className="field-input" autoComplete="new-password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="save-btn" disabled={savingPw}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {savingPw ? "Sauvegarde…" : "Modifier le mot de passe"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="danger-zone">
        <div className="danger-title">Zone dangereuse</div>
        <div className="danger-desc">La suppression de votre compte est irréversible. Toutes vos données seront perdues.</div>
        <button className="danger-btn" onClick={handleDeleteAccount}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Supprimer mon compte
        </button>
      </div>
    </>
  );
}
