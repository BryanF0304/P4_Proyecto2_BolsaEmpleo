import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────── CONSTANTES ─────────────── */
const API = "http://localhost:8080/api";

const getToken = () => localStorage.getItem("token");
const getUser  = () => JSON.parse(localStorage.getItem("user") || "null");

function authHeaders(extra = {}) {
    const t = getToken();
    return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}), ...extra };
}

/* ─────────────── ESTILOS GLOBALES ─────────────── */
const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0d0f14;
  --surface: #161920;
  --surface2: #1e2330;
  --border: #2a2f3e;
  --accent: #4f8ef7;
  --accent2: #7c5cfc;
  --success: #34d399;
  --danger: #f87171;
  --warn: #fbbf24;
  --text: #e8eaf0;
  --muted: #7a8098;
  --radius: 12px;
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
}

/* scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

.fade-up { animation: fadeUp 0.4s ease both; }

/* Shared components */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 20px; border-radius: 8px; border: none;
  font-family: var(--font-body); font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #3a7be0; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(79,142,247,.35); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: #ef4444; }
.btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--muted); }
.btn-sm { padding: 6px 14px; font-size: 13px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px;
}
.card-hover {
  transition: all 0.25s;
}
.card-hover:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 40px rgba(79,142,247,.12);
  transform: translateY(-2px);
}

.input-field {
  width: 100%; padding: 10px 14px; border-radius: 8px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-family: var(--font-body); font-size: 14px;
  transition: border-color 0.2s;
}
.input-field:focus { outline: none; border-color: var(--accent); }
.input-field::placeholder { color: var(--muted); }

label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 6px; font-weight: 500; letter-spacing: .02em; }

.form-group { margin-bottom: 16px; }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
}
.badge-blue  { background: rgba(79,142,247,.15); color: var(--accent); }
.badge-purple{ background: rgba(124,92,252,.15); color: var(--accent2); }
.badge-green { background: rgba(52,211,153,.15); color: var(--success); }
.badge-red   { background: rgba(248,113,113,.15); color: var(--danger); }
.badge-yellow{ background: rgba(251,191,36,.15); color: var(--warn); }

.alert {
  padding: 12px 16px; border-radius: 8px; font-size: 14px;
  margin-bottom: 16px;
}
.alert-error   { background: rgba(248,113,113,.12); border: 1px solid rgba(248,113,113,.3); color: var(--danger); }
.alert-success { background: rgba(52,211,153,.12); border: 1px solid rgba(52,211,153,.3); color: var(--success); }
.alert-info    { background: rgba(79,142,247,.12); border: 1px solid rgba(79,142,247,.3); color: var(--accent); }

.spinner {
  width: 20px; height: 20px; border: 2px solid var(--border);
  border-top-color: var(--accent); border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

/* Nav */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(13,15,20,.92); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 64px;
}
.nav-logo {
  font-family: var(--font-head); font-size: 22px; font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  cursor: pointer;
}
.nav-links { display: flex; align-items: center; gap: 6px; }
.nav-link {
  padding: 6px 14px; border-radius: 6px; font-size: 14px;
  color: var(--muted); cursor: pointer; transition: all 0.2s;
  font-weight: 500;
}
.nav-link:hover { color: var(--text); background: var(--surface2); }
.nav-link.active { color: var(--accent); background: rgba(79,142,247,.1); }
.nav-user {
  display: flex; align-items: center; gap: 10px;
}
.nav-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff;
}

/* Page containers */
.page { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
.page-narrow { max-width: 520px; margin: 0 auto; padding: 60px 24px; }

/* Section titles */
.section-title {
  font-family: var(--font-head); font-size: 28px; font-weight: 800;
  margin-bottom: 8px;
}
.section-sub { color: var(--muted); font-size: 15px; margin-bottom: 32px; }

/* Grid */
.grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }

/* Puesto Card */
.puesto-card {
  position: relative; overflow: visible;
}
.puesto-tooltip {
  position: absolute; top: 0; left: calc(100% + 10px);
  z-index: 50; width: 260px;
  background: var(--surface2); border: 1px solid var(--accent);
  border-radius: var(--radius); padding: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,.5);
  pointer-events: none;
  opacity: 0; transition: opacity 0.2s;
}
.puesto-card:hover .puesto-tooltip { opacity: 1; }

/* Árbol de características */
.tree-node { user-select: none; }
.tree-toggle {
  background: none; border: none; color: var(--accent);
  cursor: pointer; font-size: 13px; padding: 2px 6px;
}
.tree-children { margin-left: 20px; border-left: 1px solid var(--border); padding-left: 12px; }
.tree-leaf { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
.tree-check { accent-color: var(--accent); width: 14px; height: 14px; }

/* Dashboard header */
.dash-header {
  background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: 28px 32px; margin-bottom: 32px;
  display: flex; align-items: center; justify-content: space-between;
}
.dash-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; }
.dash-sub { color: var(--muted); font-size: 14px; margin-top: 4px; }

/* Tabs */
.tabs { display: flex; gap: 4px; margin-bottom: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; width: fit-content; }
.tab { padding: 8px 18px; border-radius: 7px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.tab.active { background: var(--accent); color: #fff; }

/* Login modal overlay */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,.75); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}
.modal { width: 100%; max-width: 420px; }

/* Hero */
.hero {
  padding: 80px 24px 60px;
  text-align: center;
}
.hero-title {
  font-family: var(--font-head); font-size: clamp(36px, 5vw, 64px); font-weight: 800;
  line-height: 1.1; margin-bottom: 20px;
}
.hero-title span {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-sub { color: var(--muted); font-size: 18px; max-width: 540px; margin: 0 auto 36px; }
.hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* Table */
.table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
table { width: 100%; border-collapse: collapse; }
thead { background: var(--surface2); }
th { padding: 12px 16px; text-align: left; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
td { padding: 12px 16px; border-top: 1px solid var(--border); font-size: 14px; }
tr:hover td { background: rgba(255,255,255,.02); }

/* Level selector */
.level-dots { display: flex; gap: 4px; }
.level-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--border); cursor: pointer; transition: background 0.15s;
}
.level-dot.filled { background: var(--accent); }

/* Footer */
.footer {
  border-top: 1px solid var(--border); padding: 24px 40px;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: var(--muted);
}
.footer a { color: var(--accent); text-decoration: none; }

/* Search sidebar layout */
.search-layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
.search-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; position: sticky; top: 80px; }
.search-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; margin-bottom: 16px; }

@media (max-width: 768px) {
  .nav { padding: 0 16px; }
  .page { padding: 24px 16px; }
  .search-layout { grid-template-columns: 1fr; }
  .search-panel { position: static; }
  .dash-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .hero-title { font-size: 32px; }
}
`;

/* ─────────────── HELPERS ─────────────── */
function useFetch(url, options, deps = []) {
    const [data, setData]   = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!url) { setLoading(false); return; }
        setLoading(true);
        fetch(url, options)
            .then(r => r.ok ? r.json() : r.text().then(t => Promise.reject(t)))
            .then(d => { setData(d); setLoading(false); })
            .catch(e => { setError(String(e)); setLoading(false); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return { data, error, loading, setData };
}

function Spinner() { return <div className="spinner" />; }

function Alert({ type = "error", children }) {
    return <div className={`alert alert-${type}`}>{children}</div>;
}

/* ─────────────── ÁRBOL DE CARACTERÍSTICAS ─────────────── */
function TreeNode({ node, selected, onToggle, showLevels, levels, onLevelChange }) {
    const [open, setOpen] = useState(true);
    const hasChildren = node.hijos?.length > 0;

    return (
        <div className="tree-node">
            <div className="tree-leaf">
                {hasChildren ? (
                    <button className="tree-toggle" onClick={() => setOpen(o => !o)}>
                        {open ? "▼" : "▶"}
                    </button>
                ) : (
                    <>
                        <input
                            type="checkbox"
                            className="tree-check"
                            checked={selected.includes(node.id)}
                            onChange={() => onToggle(node.id)}
                        />
                        {showLevels && selected.includes(node.id) && (
                            <LevelPicker
                                value={levels[node.id] ?? 1}
                                onChange={v => onLevelChange(node.id, v)}
                            />
                        )}
                    </>
                )}
                <span style={{ fontSize: 14, color: hasChildren ? "var(--text)" : "var(--muted)" }}>
          {node.nombre}
        </span>
            </div>
            {hasChildren && open && (
                <div className="tree-children">
                    {node.hijos.map(h => (
                        <TreeNode
                            key={h.id} node={h}
                            selected={selected} onToggle={onToggle}
                            showLevels={showLevels} levels={levels} onLevelChange={onLevelChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function LevelPicker({ value, onChange }) {
    return (
        <div className="level-dots">
            {[1,2,3,4,5].map(n => (
                <div
                    key={n}
                    className={`level-dot ${value >= n ? "filled" : ""}`}
                    onClick={() => onChange(n)}
                    title={`Nivel ${n}`}
                />
            ))}
        </div>
    );
}

/* ─────────────── PUESTO CARD ─────────────── */
function PuestoCard({ p, actions }) {
    return (
        <div className={`card card-hover puesto-card fade-up`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{p.empresaNombre}</div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17 }}>{p.descripcion}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span className={`badge badge-${p.tipo === "PUBLICO" ? "blue" : "purple"}`}>
            {p.tipo === "PUBLICO" ? "🌐 Público" : "🔒 Privado"}
          </span>
                    {p.activo === false && <span className="badge badge-red">Inactivo</span>}
                </div>
            </div>

            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--success)", marginBottom: 12 }}>
                ₡{Number(p.salario).toLocaleString()}
            </div>

            {p.requisitos?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Requisitos</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.requisitos.map(r => (
                            <span key={r.caracteristicaId} className="badge badge-blue" style={{ fontSize: 11 }}>
                {r.caracteristica} <strong>Niv.{r.nivel}</strong>
              </span>
                        ))}
                    </div>
                </div>
            )}

            {actions && <div style={{ display: "flex", gap: 8, marginTop: 16 }}>{actions}</div>}

            {/* tooltip on hover para parte pública */}
            {!actions && p.requisitos?.length > 0 && (
                <div className="puesto-tooltip">
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📋 Requisitos</div>
                    {p.requisitos.map(r => (
                        <div key={r.caracteristicaId} style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
                            <span style={{ color: "var(--text)" }}>/ {r.caracteristica}</span> — Nivel {r.nivel}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────── MODAL LOGIN ─────────────── */
function LoginModal({ onClose, onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const r = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!r.ok) { const t = await r.text(); throw new Error(t); }
            const data = await r.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ username: data.username, rol: data.rol }));
            onLogin(data);
        } catch (e) {
            setError(e.message || "Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal card fade-up">
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
                    <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22 }}>Iniciar Sesión</h2>
                    <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>Acceso por correo/identificación y clave</p>
                </div>
                {error && <Alert>{error}</Alert>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Usuario (correo o identificación)</label>
                        <input className="input-field" value={username} onChange={e => setUsername(e.target.value)} required placeholder="usuario@correo.com" />
                    </div>
                    <div className="form-group">
                        <label>Clave</label>
                        <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                            {loading ? <Spinner /> : "Ingresar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─────────────── REGISTRO EMPRESA ─────────────── */
function RegistroEmpresa({ onBack }) {
    const [form, setForm] = useState({ nombre:"", localizacion:"", correo:"", telefono:"", descripcion:"", password:"" });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    async function submit(e) {
        e.preventDefault(); setMsg(null); setLoading(true);
        try {
            const r = await fetch(`${API}/registro/empresa`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const t = await r.text();
            if (!r.ok) throw new Error(t);
            setMsg({ type: "success", text: t });
            setForm({ nombre:"", localizacion:"", correo:"", telefono:"", descripcion:"", password:"" });
        } catch(e) { setMsg({ type:"error", text: e.message }); }
        finally { setLoading(false); }
    }

    return (
        <div className="page-narrow">
            <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 24 }}>← Volver</button>
            <div className="card fade-up">
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🏢</div>
                    <h1 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 26 }}>Registrar Empresa</h1>
                    <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>Una vez aprobado por el administrador, podrás publicar puestos.</p>
                </div>
                {msg && <Alert type={msg.type}>{msg.text}</Alert>}
                <form onSubmit={submit}>
                    {[
                        ["nombre","Nombre de la empresa","text"],
                        ["localizacion","Localización","text"],
                        ["correo","Correo electrónico","email"],
                        ["telefono","Teléfono","text"],
                    ].map(([k,l,t]) => (
                        <div className="form-group" key={k}>
                            <label>{l}</label>
                            <input className="input-field" type={t} value={form[k]} onChange={set(k)} required />
                        </div>
                    ))}
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea className="input-field" rows={3} value={form.descripcion} onChange={set("descripcion")} required style={{ resize: "vertical" }} />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input className="input-field" type="password" value={form.password} onChange={set("password")} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width:"100%" }} disabled={loading}>
                        {loading ? <Spinner /> : "Registrar empresa"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ─────────────── REGISTRO OFERENTE ─────────────── */
function RegistroOferente({ onBack }) {
    const [form, setForm] = useState({ identificacion:"", nombre:"", primerApellido:"", nacionalidad:"", telefono:"", correo:"", lugarResidencia:"", password:"" });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    async function submit(e) {
        e.preventDefault(); setMsg(null); setLoading(true);
        try {
            const r = await fetch(`${API}/registro/oferente`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const t = await r.text();
            if (!r.ok) throw new Error(t);
            setMsg({ type: "success", text: t });
        } catch(e) { setMsg({ type:"error", text: e.message }); }
        finally { setLoading(false); }
    }

    return (
        <div className="page-narrow">
            <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 24 }}>← Volver</button>
            <div className="card fade-up">
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>👤</div>
                    <h1 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 26 }}>Registrar Oferente</h1>
                    <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>Registrá tus datos para ofrecer tus servicios.</p>
                </div>
                {msg && <Alert type={msg.type}>{msg.text}</Alert>}
                <form onSubmit={submit}>
                    {[
                        ["identificacion","Identificación","text"],
                        ["nombre","Nombre","text"],
                        ["primerApellido","Primer apellido","text"],
                        ["nacionalidad","Nacionalidad","text"],
                        ["telefono","Teléfono","text"],
                        ["correo","Correo electrónico","email"],
                        ["lugarResidencia","Lugar de residencia","text"],
                    ].map(([k,l,t]) => (
                        <div className="form-group" key={k}>
                            <label>{l}</label>
                            <input className="input-field" type={t} value={form[k]} onChange={set(k)} required />
                        </div>
                    ))}
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input className="input-field" type="password" value={form.password} onChange={set("password")} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width:"100%" }} disabled={loading}>
                        {loading ? <Spinner /> : "Registrar oferente"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ─────────────── PÁGINA PÚBLICA ─────────────── */
function PublicHome({ onNavigate }) {
    const { data: recientes, loading } = useFetch(`${API}/puestos/publicos/recientes`, {}, []);

    return (
        <div>
            <div className="hero">
                <h1 className="hero-title">
                    Conectamos <span>talento</span><br />con oportunidades
                </h1>
                <p className="hero-sub">
                    Encontrá el trabajo que buscás o publicá tus vacantes disponibles en la plataforma de empleo de Costa Rica.
                </p>
                <div className="hero-actions">
                    <button className="btn btn-primary" style={{ padding: "12px 28px", fontSize: 16 }} onClick={() => onNavigate("buscar")}>
                        🔍 Buscar puestos
                    </button>
                    <button className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: 16 }} onClick={() => onNavigate("reg-empresa")}>
                        🏢 Registrar empresa
                    </button>
                    <button className="btn btn-ghost" style={{ padding: "12px 28px", fontSize: 16 }} onClick={() => onNavigate("reg-oferente")}>
                        👤 Soy oferente
                    </button>
                </div>
            </div>

            <div className="page">
                <hr className="divider" />
                <h2 className="section-title">📌 Puestos recientes</h2>
                <p className="section-sub">Los 5 últimos puestos públicos publicados — posicioná el mouse para ver detalles</p>

                {loading && <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>}
                {!loading && recientes?.length === 0 && (
                    <Alert type="info">No hay puestos públicos disponibles aún.</Alert>
                )}
                <div className="grid-3">
                    {recientes?.map(p => <PuestoCard key={p.id} p={p} />)}
                </div>
            </div>
        </div>
    );
}

/* ─────────────── BÚSQUEDA PÚBLICA ─────────────── */
function BuscarPuestos() {
    const { data: arbol } = useFetch(`${API}/caracteristicas`, {}, []);
    const [selected, setSelected] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    function toggleCaract(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }

    async function buscar() {
        setLoading(true);
        const qs = selected.map(id => `caracteristicas=${id}`).join("&");
        const r = await fetch(`${API}/buscar/puestos?${qs}`);
        const data = await r.json();
        setResults(data);
        setLoading(false);
    }

    return (
        <div className="page">
            <h1 className="section-title">🔍 Buscar Puestos</h1>
            <p className="section-sub">Filtrá por las características que te interesan</p>

            <div className="search-layout">
                <div className="search-panel">
                    <div className="search-title">Características</div>
                    {!arbol && <Spinner />}
                    {arbol?.map(node => (
                        <TreeNode
                            key={node.id} node={node}
                            selected={selected} onToggle={toggleCaract}
                            showLevels={false}
                        />
                    ))}
                    <button
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: 16 }}
                        onClick={buscar}
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : "Buscar"}
                    </button>
                    {selected.length > 0 && (
                        <button className="btn btn-ghost btn-sm" style={{ width:"100%", marginTop: 8 }} onClick={() => { setSelected([]); setResults(null); }}>
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div>
                    {results === null && (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                            <p>Seleccioná características y presioná "Buscar"</p>
                        </div>
                    )}
                    {results !== null && results.length === 0 && (
                        <Alert type="info">No se encontraron puestos con esas características.</Alert>
                    )}
                    {results !== null && results.length > 0 && (
                        <>
                            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
                                {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
                            </p>
                            <div className="grid-2">
                                {results.map(p => <PuestoCard key={p.id} p={p} />)}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────── DASHBOARD EMPRESA ─────────────── */
function DashboardEmpresa() {
    const user = getUser();
    const [tab, setTab] = useState("puestos");
    const [puestos, setPuestos] = useState([]);
    const [candidatos, setCandidatos] = useState(null);
    const [arbol, setArbol] = useState(null);
    const [loadingP, setLoadingP] = useState(true);

    // Form nuevo puesto
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ descripcion: "", salario: "", tipo: "PUBLICO", caracteristicas: [], levels: {} });
    const [formMsg, setFormMsg] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Búsqueda candidatos
    const [busqSel, setBusqSel] = useState([]);
    const [busqLevels, setBusqLevels] = useState({});
    const [busqLoading, setBusqLoading] = useState(false);
    const [candidatoDetalle, setCandidatoDetalle] = useState(null);

    useEffect(() => {
        fetch(`${API}/puestos/mios`, { headers: authHeaders() })
            .then(r => r.json()).then(setPuestos).finally(() => setLoadingP(false));
        fetch(`${API}/caracteristicas`).then(r => r.json()).then(setArbol);
    }, []);

    function toggleFormCaract(id) {
        setForm(f => {
            const cs = f.caracteristicas.includes(id)
                ? f.caracteristicas.filter(x => x !== id)
                : [...f.caracteristicas, id];
            return { ...f, caracteristicas: cs };
        });
    }

    async function publicarPuesto(e) {
        e.preventDefault(); setFormMsg(null); setFormLoading(true);
        const payload = {
            descripcion: form.descripcion,
            salario: Number(form.salario),
            tipo: form.tipo,
            caracteristicas: form.caracteristicas.map(id => ({
                caracteristicaId: id,
                nivel: form.levels[id] ?? 1,
            })),
        };
        try {
            const r = await fetch(`${API}/puestos`, {
                method: "POST", headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            const t = await r.text();
            if (!r.ok) throw new Error(t);
            setFormMsg({ type: "success", text: "¡Puesto publicado!" });
            setShowForm(false);
            // recargar puestos
            const r2 = await fetch(`${API}/puestos/mios`, { headers: authHeaders() });
            setPuestos(await r2.json());
        } catch(e) { setFormMsg({ type:"error", text: e.message }); }
        finally { setFormLoading(false); }
    }

    async function desactivar(id) {
        if (!confirm("¿Desactivar este puesto?")) return;
        await fetch(`${API}/puestos/${id}/desactivar`, { method:"PUT", headers: authHeaders() });
        setPuestos(ps => ps.map(p => p.id === id ? { ...p, activo: false } : p));
    }

    async function buscarCandidatos() {
        setBusqLoading(true);
        const habilidades = busqSel.map(id => ({ caracteristicaId: id, nivel: busqLevels[id] ?? 1 }));
        const r = await fetch(`${API}/candidatos/buscar`, {
            method: "POST", headers: authHeaders(),
            body: JSON.stringify({ habilidades }),
        });
        const data = await r.json();
        setCandidatos(data);
        setBusqLoading(false);
    }

    return (
        <div className="page">
            <div className="dash-header">
                <div>
                    <div className="dash-title">Panel de Empresa</div>
                    <div className="dash-sub">Bienvenido, {user?.username}</div>
                </div>
                <span className="badge badge-blue">🏢 EMPRESA</span>
            </div>

            <div className="tabs">
                {[["puestos","💼 Mis puestos"],["candidatos","🔍 Buscar candidatos"]].map(([k,l]) => (
                    <div key={k} className={`tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</div>
                ))}
            </div>

            {/* Tab: mis puestos */}
            {tab === "puestos" && (
                <div>
                    <div style={{ display:"flex", justifyContent:"flex-end", marginBottom: 16 }}>
                        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                            {showForm ? "✕ Cerrar" : "+ Nuevo puesto"}
                        </button>
                    </div>

                    {formMsg && <Alert type={formMsg.type}>{formMsg.text}</Alert>}

                    {showForm && (
                        <div className="card fade-up" style={{ marginBottom: 24 }}>
                            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: 16 }}>Publicar nuevo puesto</h3>
                            <form onSubmit={publicarPuesto}>
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Descripción del puesto</label>
                                        <input className="input-field" value={form.descripcion} onChange={e => setForm(f=>({...f,descripcion:e.target.value}))} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Salario (₡)</label>
                                        <input className="input-field" type="number" value={form.salario} onChange={e => setForm(f=>({...f,salario:e.target.value}))} required min="0" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Tipo de publicación</label>
                                        <select className="input-field" value={form.tipo} onChange={e => setForm(f=>({...f,tipo:e.target.value}))}>
                                            <option value="PUBLICO">🌐 Público</option>
                                            <option value="PRIVADO">🔒 Privado</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ marginBottom: 10, display:"block" }}>Características requeridas (seleccioná y elegí el nivel)</label>
                                    <div style={{ background:"var(--surface2)", borderRadius: 8, padding: 16, maxHeight: 300, overflowY:"auto" }}>
                                        {arbol?.map(node => (
                                            <TreeNode
                                                key={node.id} node={node}
                                                selected={form.caracteristicas}
                                                onToggle={toggleFormCaract}
                                                showLevels={true}
                                                levels={form.levels}
                                                onLevelChange={(id, v) => setForm(f => ({ ...f, levels: { ...f.levels, [id]: v } }))}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display:"flex", gap: 10 }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                        {formLoading ? <Spinner /> : "Publicar puesto"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loadingP && <div style={{ textAlign:"center", padding: 40 }}><Spinner /></div>}
                    {!loadingP && puestos.length === 0 && (
                        <Alert type="info">No has publicado ningún puesto aún.</Alert>
                    )}
                    <div className="grid-2">
                        {puestos.map(p => (
                            <PuestoCard key={p.id} p={p} actions={
                                p.activo !== false ? [
                                    <button key="d" className="btn btn-danger btn-sm" onClick={() => desactivar(p.id)}>Desactivar</button>
                                ] : [<span key="i" className="badge badge-red">Inactivo</span>]
                            } />
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: buscar candidatos */}
            {tab === "candidatos" && (
                <div>
                    <div className="search-layout">
                        <div className="search-panel">
                            <div className="search-title">Habilidades requeridas</div>
                            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Seleccioná habilidades y definí el nivel mínimo.</p>
                            {!arbol && <Spinner />}
                            {arbol?.map(node => (
                                <TreeNode
                                    key={node.id} node={node}
                                    selected={busqSel}
                                    onToggle={id => setBusqSel(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id])}
                                    showLevels={true}
                                    levels={busqLevels}
                                    onLevelChange={(id,v) => setBusqLevels(l => ({...l,[id]:v}))}
                                />
                            ))}
                            <button className="btn btn-primary" style={{ width:"100%", marginTop: 16 }} onClick={buscarCandidatos} disabled={busqLoading}>
                                {busqLoading ? <Spinner /> : "Buscar candidatos"}
                            </button>
                        </div>

                        <div>
                            {candidatos === null && (
                                <div style={{ textAlign:"center", padding: "60px 0", color:"var(--muted)" }}>
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                                    <p>Usá los filtros para encontrar candidatos.</p>
                                </div>
                            )}
                            {candidatos?.length === 0 && <Alert type="info">Ningún candidato coincide con los criterios.</Alert>}
                            {candidatos?.map(c => (
                                <div key={c.id} className="card card-hover fade-up" style={{ marginBottom: 16 }}>
                                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                                        <div>
                                            <div style={{ fontFamily:"var(--font-head)", fontWeight: 700, fontSize: 17 }}>
                                                {c.nombre} {c.primerApellido}
                                            </div>
                                            <div style={{ fontSize: 13, color:"var(--muted)", marginTop: 2 }}>{c.correo}</div>
                                        </div>
                                        <div style={{ display:"flex", gap: 8, flexDirection:"column", alignItems:"flex-end" }}>
                                            {c.tieneCurriculo && (
                                                <a
                                                    href={`${API}/candidatos/${c.id}/curriculo`}
                                                    target="_blank" rel="noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                >📄 Ver currículo</a>
                                            )}
                                            <button className="btn btn-ghost btn-sm" onClick={() => setCandidatoDetalle(c.id === candidatoDetalle ? null : c.id)}>
                                                {c.id === candidatoDetalle ? "Ocultar" : "Ver habilidades"}
                                            </button>
                                        </div>
                                    </div>
                                    {c.id === candidatoDetalle && c.habilidades?.length > 0 && (
                                        <div style={{ marginTop: 12 }}>
                                            <div style={{ fontSize: 12, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".06em", marginBottom: 8 }}>Habilidades</div>
                                            <div style={{ display:"flex", flexWrap:"wrap", gap: 6 }}>
                                                {c.habilidades.map((h,i) => (
                                                    <span key={i} className="badge badge-purple">
                            {h.caracteristica} <strong>Niv.{h.nivel}</strong>
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────── DASHBOARD OFERENTE ─────────────── */
function DashboardOferente() {
    const user = getUser();
    const [tab, setTab] = useState("puestos");
    const [puestos, setPuestos] = useState([]);
    const [loadingP, setLoadingP] = useState(true);
    const [arbol, setArbol] = useState(null);
    const [habilSel, setHabilSel] = useState([]);
    const [habilLevels, setHabilLevels] = useState({});
    const [habilMsg, setHabilMsg] = useState(null);
    const [habilLoading, setHabilLoading] = useState(false);
    const [currFile, setCurrFile] = useState(null);
    const [currMsg, setCurrMsg] = useState(null);
    const [currLoading, setCurrLoading] = useState(false);

    useEffect(() => {
        fetch(`${API}/puestos/disponibles`, { headers: authHeaders() })
            .then(r => r.json()).then(setPuestos).finally(() => setLoadingP(false));
        fetch(`${API}/caracteristicas`).then(r => r.json()).then(setArbol);
    }, []);

    async function guardarHabilidades() {
        setHabilMsg(null); setHabilLoading(true);
        const habilidades = habilSel.map(id => ({ caracteristicaId: id, nivel: habilLevels[id] ?? 1 }));
        try {
            const r = await fetch(`${API}/oferente/habilidades`, {
                method:"PUT", headers: authHeaders(),
                body: JSON.stringify({ habilidades }),
            });
            const t = await r.text();
            if (!r.ok) throw new Error(t);
            setHabilMsg({ type:"success", text: "Habilidades guardadas." });
        } catch(e) { setHabilMsg({ type:"error", text: e.message }); }
        finally { setHabilLoading(false); }
    }

    async function subirCurriculo() {
        if (!currFile) return;
        setCurrMsg(null); setCurrLoading(true);
        const fd = new FormData();
        fd.append("archivo", currFile);
        try {
            const r = await fetch(`${API}/oferente/curriculo`, {
                method:"POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd,
            });
            const t = await r.text();
            if (!r.ok) throw new Error(t);
            setCurrMsg({ type:"success", text: "Currículo subido correctamente." });
            setCurrFile(null);
        } catch(e) { setCurrMsg({ type:"error", text: e.message }); }
        finally { setCurrLoading(false); }
    }

    return (
        <div className="page">
            <div className="dash-header">
                <div>
                    <div className="dash-title">Panel de Oferente</div>
                    <div className="dash-sub">Bienvenido, {user?.username}</div>
                </div>
                <span className="badge badge-purple">👤 OFERENTE</span>
            </div>

            <div className="tabs">
                {[["puestos","💼 Puestos disponibles"],["habilidades","⚡ Mis habilidades"],["curriculo","📄 Currículo"]].map(([k,l]) => (
                    <div key={k} className={`tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</div>
                ))}
            </div>

            {tab === "puestos" && (
                <div>
                    <p style={{ color:"var(--muted)", fontSize: 14, marginBottom: 20 }}>
                        Como oferente aprobado, ves todos los puestos activos (públicos y privados).
                    </p>
                    {loadingP && <div style={{ textAlign:"center", padding: 40 }}><Spinner /></div>}
                    {!loadingP && puestos.length === 0 && <Alert type="info">No hay puestos disponibles por el momento.</Alert>}
                    <div className="grid-2">
                        {puestos.map(p => <PuestoCard key={p.id} p={p} />)}
                    </div>
                </div>
            )}

            {tab === "habilidades" && (
                <div style={{ maxWidth: 600 }}>
                    <p style={{ color:"var(--muted)", fontSize: 14, marginBottom: 16 }}>
                        Seleccioná las habilidades que tenés y el nivel que manejas. Esto reemplaza tu lista completa.
                    </p>
                    {habilMsg && <Alert type={habilMsg.type}>{habilMsg.text}</Alert>}
                    <div className="card" style={{ marginBottom: 16 }}>
                        {!arbol && <Spinner />}
                        {arbol?.map(node => (
                            <TreeNode
                                key={node.id} node={node}
                                selected={habilSel}
                                onToggle={id => setHabilSel(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])}
                                showLevels={true}
                                levels={habilLevels}
                                onLevelChange={(id,v) => setHabilLevels(l => ({...l,[id]:v}))}
                            />
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={guardarHabilidades} disabled={habilLoading}>
                        {habilLoading ? <Spinner /> : "💾 Guardar habilidades"}
                    </button>
                </div>
            )}

            {tab === "curriculo" && (
                <div style={{ maxWidth: 480 }}>
                    <p style={{ color:"var(--muted)", fontSize: 14, marginBottom: 16 }}>
                        Subí tu currículo en formato PDF. Este estará disponible para empresas que te encuentren en búsquedas.
                    </p>
                    {currMsg && <Alert type={currMsg.type}>{currMsg.text}</Alert>}
                    <div className="card">
                        <div
                            style={{
                                border: "2px dashed var(--border)", borderRadius: 10,
                                padding: "40px 20px", textAlign:"center",
                                background: currFile ? "rgba(52,211,153,.05)" : "transparent",
                                cursor:"pointer", transition: "all 0.2s",
                            }}
                            onClick={() => document.getElementById("cv-input").click()}
                        >
                            <div style={{ fontSize: 36, marginBottom: 8 }}>📎</div>
                            <div style={{ color:"var(--muted)", fontSize: 14 }}>
                                {currFile ? (
                                    <span style={{ color:"var(--success)" }}>✓ {currFile.name}</span>
                                ) : "Clic para seleccionar un PDF"}
                            </div>
                        </div>
                        <input
                            id="cv-input" type="file" accept=".pdf"
                            style={{ display:"none" }}
                            onChange={e => setCurrFile(e.target.files[0] || null)}
                        />
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 16, width:"100%" }}
                            onClick={subirCurriculo}
                            disabled={!currFile || currLoading}
                        >
                            {currLoading ? <Spinner /> : "⬆ Subir currículo"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────── DASHBOARD ADMIN ─────────────── */
function DashboardAdmin() {
    const user = getUser();
    const [tab, setTab] = useState("empresas");
    const [empresas, setEmpresas] = useState([]);
    const [oferentes, setOferentes] = useState([]);
    const [arbol, setArbol] = useState(null);
    const [newCaract, setNewCaract] = useState({ nombre:"", parentId:"" });
    const [caractMsg, setCaractMsg] = useState(null);

    useEffect(() => {
        fetch(`${API}/admin/empresas/pendientes`, { headers: authHeaders() })
            .then(r => r.json()).then(setEmpresas);
        fetch(`${API}/admin/oferentes/pendientes`, { headers: authHeaders() })
            .then(r => r.json()).then(setOferentes);
        fetch(`${API}/caracteristicas`).then(r => r.json()).then(setArbol);
    }, []);

    async function aprobarEmpresa(id) {
        await fetch(`${API}/admin/empresas/${id}/aprobar`, { method:"PUT", headers: authHeaders() });
        setEmpresas(es => es.filter(e => e.id !== id));
    }

    async function aprobarOferente(id) {
        await fetch(`${API}/admin/oferentes/${id}/aprobar`, { method:"PUT", headers: authHeaders() });
        setOferentes(os => os.filter(o => o.id !== id));
    }

    async function crearCaract(e) {
        e.preventDefault(); setCaractMsg(null);
        const payload = { nombre: newCaract.nombre, parentId: newCaract.parentId ? Number(newCaract.parentId) : null };
        try {
            const r = await fetch(`${API}/admin/caracteristicas`, {
                method:"POST", headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            const t = await r.text();
            if (!r.ok) throw new Error(t);
            setCaractMsg({ type:"success", text: "Característica creada." });
            setNewCaract({ nombre:"", parentId:"" });
            fetch(`${API}/caracteristicas`).then(r => r.json()).then(setArbol);
        } catch(e) { setCaractMsg({ type:"error", text: e.message }); }
    }

    // Flatten tree for select
    function flatTree(nodes, prefix="") {
        return nodes?.flatMap(n => [
            { id: n.id, nombre: `${prefix}${n.nombre}`, hasChildren: n.hijos?.length > 0 },
            ...flatTree(n.hijos || [], `${prefix}  `)
        ]) ?? [];
    }
    const flatList = flatTree(arbol ?? []);

    return (
        <div className="page">
            <div className="dash-header">
                <div>
                    <div className="dash-title">Panel de Administrador</div>
                    <div className="dash-sub">Bienvenido, {user?.username}</div>
                </div>
                <span className="badge badge-yellow">⚙️ ADMIN</span>
            </div>

            <div className="tabs">
                {[
                    ["empresas", `🏢 Empresas (${empresas.length})`],
                    ["oferentes", `👤 Oferentes (${oferentes.length})`],
                    ["caracteristicas","🗂 Características"]
                ].map(([k,l]) => (
                    <div key={k} className={`tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</div>
                ))}
            </div>

            {tab === "empresas" && (
                <div>
                    <h2 style={{ fontFamily:"var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                        Empresas pendientes de aprobación
                    </h2>
                    {empresas.length === 0 && <Alert type="success">No hay empresas pendientes.</Alert>}
                    <div className="table-wrap">
                        {empresas.length > 0 && (
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th><th>Nombre</th><th>Correo</th><th>Localización</th><th>Teléfono</th><th>Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {empresas.map(e => (
                                    <tr key={e.id}>
                                        <td><span className="badge badge-blue">#{e.id}</span></td>
                                        <td style={{ fontWeight: 600 }}>{e.nombre}</td>
                                        <td style={{ color:"var(--muted)" }}>{e.correo}</td>
                                        <td style={{ color:"var(--muted)" }}>{e.localizacion}</td>
                                        <td style={{ color:"var(--muted)" }}>{e.telefono}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm" onClick={() => aprobarEmpresa(e.id)}>
                                                ✓ Aprobar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {tab === "oferentes" && (
                <div>
                    <h2 style={{ fontFamily:"var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                        Oferentes pendientes de aprobación
                    </h2>
                    {oferentes.length === 0 && <Alert type="success">No hay oferentes pendientes.</Alert>}
                    <div className="table-wrap">
                        {oferentes.length > 0 && (
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th><th>Nombre</th><th>Correo</th><th>Identificación</th><th>Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {oferentes.map(o => (
                                    <tr key={o.id}>
                                        <td><span className="badge badge-purple">#{o.id}</span></td>
                                        <td style={{ fontWeight: 600 }}>{o.nombre} {o.primerApellido}</td>
                                        <td style={{ color:"var(--muted)" }}>{o.correo}</td>
                                        <td style={{ color:"var(--muted)" }}>{o.identificacion}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm" onClick={() => aprobarOferente(o.id)}>
                                                ✓ Aprobar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {tab === "caracteristicas" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 24 }}>
                    <div>
                        <h3 style={{ fontFamily:"var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                            Árbol actual
                        </h3>
                        <div className="card" style={{ maxHeight: 500, overflowY:"auto" }}>
                            {!arbol && <Spinner />}
                            {arbol?.map(node => (
                                <TreeNode
                                    key={node.id} node={node}
                                    selected={[]} onToggle={() => {}}
                                    showLevels={false}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontFamily:"var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                            Agregar característica
                        </h3>
                        {caractMsg && <Alert type={caractMsg.type}>{caractMsg.text}</Alert>}
                        <div className="card">
                            <form onSubmit={crearCaract}>
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input
                                        className="input-field"
                                        value={newCaract.nombre}
                                        onChange={e => setNewCaract(n => ({...n, nombre: e.target.value}))}
                                        required placeholder="ej: React, Python, SQL..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Categoría padre (opcional — dejar vacío para raíz)</label>
                                    <select
                                        className="input-field"
                                        value={newCaract.parentId}
                                        onChange={e => setNewCaract(n => ({...n, parentId: e.target.value}))}
                                    >
                                        <option value="">— Raíz (nueva categoría) —</option>
                                        {flatList.map(n => (
                                            <option key={n.id} value={n.id}>{n.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width:"100%" }}>
                                    + Agregar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────── APP ROOT ─────────────── */
export default function App() {
    const [page, setPage] = useState("home");
    const [user, setUser] = useState(() => getUser());
    const [showLogin, setShowLogin] = useState(false);

    function handleLogin(data) {
        setUser({ username: data.username, rol: data.rol });
        setShowLogin(false);
        // redirect to dashboard
        if      (data.rol === "ADMIN")    setPage("admin");
        else if (data.rol === "EMPRESA")  setPage("empresa");
        else if (data.rol === "OFERENTE") setPage("oferente");
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setPage("home");
    }

    const navLinks = [
        { id:"home",    label:"BolsaEmpleo" },
        { id:"buscar",  label:"Buscar" },
        ...(!user ? [
            { id:"reg-empresa",  label:"Empresa" },
            { id:"reg-oferente", label:"Oferente" },
        ] : []),
        ...(user?.rol === "EMPRESA"  ? [{ id:"empresa",  label:"Mi panel" }] : []),
        ...(user?.rol === "OFERENTE" ? [{ id:"oferente", label:"Mi panel" }] : []),
        ...(user?.rol === "ADMIN"    ? [{ id:"admin",    label:"Administrar" }] : []),
    ];

    return (
        <>
            <style>{GLOBAL_STYLE}</style>

            <nav className="nav">
                <div className="nav-logo" onClick={() => setPage("home")}>🧭 BolsaEmpleo</div>
                <div className="nav-links">
                    {navLinks.slice(1).map(l => (
                        <div
                            key={l.id}
                            className={`nav-link ${page === l.id ? "active" : ""}`}
                            onClick={() => setPage(l.id)}
                        >{l.label}</div>
                    ))}
                </div>
                <div className="nav-user">
                    {user ? (
                        <>
                            <div className="nav-avatar" title={user.username}>{user.username[0].toUpperCase()}</div>
                            <span style={{ fontSize: 13, color:"var(--muted)" }}>{user.rol}</span>
                            <button className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
                        </>
                    ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(true)}>Login</button>
                    )}
                </div>
            </nav>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}

            {page === "home"         && <PublicHome onNavigate={setPage} />}
            {page === "buscar"       && <BuscarPuestos />}
            {page === "reg-empresa"  && <RegistroEmpresa onBack={() => setPage("home")} />}
            {page === "reg-oferente" && <RegistroOferente onBack={() => setPage("home")} />}
            {page === "empresa"      && user?.rol === "EMPRESA"  && <DashboardEmpresa />}
            {page === "oferente"     && user?.rol === "OFERENTE" && <DashboardOferente />}
            {page === "admin"        && user?.rol === "ADMIN"    && <DashboardAdmin />}

            {/* Páginas protegidas sin login */}
            {["empresa","oferente","admin"].includes(page) && !user && (
                <div className="page-narrow" style={{ textAlign:"center" }}>
                    <Alert type="error">Debes iniciar sesión para ver esta página.</Alert>
                    <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
                </div>
            )}

            <footer className="footer">
                <span><strong>Bolsa de Empleo</strong> — EIF209 Programación 4 · UNA 2026-01</span>
                <span>Contacto: <a href="mailto:info@bolsaempleo.local">info@bolsaempleo.local</a></span>
                <span style={{ color:"var(--border)" }}>Créditos: Equipo de desarrollo</span>
            </footer>
        </>
    );
}
