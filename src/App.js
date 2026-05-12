import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

const MEMBERS = [
  { id: 'axel', name: 'Axel', emoji: '⚽', category: 'multi',
    challenges: ['Volver a jugar fútbol y meterme a equipo', 'Viajar a Europa', 'Terminar Porttica', 'Terminar Estructura de Monterra'] },
  { id: 'pancho', name: 'Pancho', emoji: '🚴', category: 'fitness',
    challenges: ['Xel-Ha en 2h30', '+200 días de ejercicio en el año', 'Carrera en bici +100km', '1/2 maratón en 1h40', 'Meditar 3x por semana'] },
  { id: 'reynol', name: 'Reynol', emoji: '🧘', category: 'habits',
    challenges: ['Rituales de mañana con respiración y meditación 4 días/semana', 'Eliminar pantallas 30 min antes de dormir y leer'] },
  { id: 'cesar', name: 'Cesar', emoji: '⛳', category: 'fitness',
    challenges: ['Bajar a 15% de body fat', 'Bajar handicap de golf a 5'] },
  { id: 'jazmin', name: 'Jazmín', emoji: '💪', category: 'fitness',
    challenges: ['Ir al gimnasio 4-5 días por semana', 'Mejorar hábitos alimenticios', 'Inscribirse a escuela de inglés'] },
  { id: 'gabriela', name: 'Gabriela', emoji: '🏃', category: 'fitness',
    challenges: ['Cumplir dieta para subir masa muscular', 'Superar los 10k corriendo'] },
  { id: 'elizabeth', name: 'Elizabeth', emoji: '🏊', category: 'fitness',
    challenges: ['Tomar clases de natación', 'Buscar un reto acuático a fin de año'] },
  { id: 'eduardo', name: 'Eduardo', emoji: '🥗', category: 'fitness',
    challenges: ['Bajar de 86 a 74 kg', 'Aprender a cocinar sano'] },
  { id: 'fernanda_df', name: 'Fernanda D.', emoji: '📚', category: 'education',
    challenges: ['Leer 1 libro al mes', 'Ampliar conocimiento en finanzas estudiando'] },
  { id: 'fany', name: 'Fany', emoji: '🏋️', category: 'multi',
    challenges: ['Ser constante en el ejercicio y lograr objetivo físico', 'Traer familia a Tijuana de vacaciones'] },
  { id: 'vanessa', name: 'Vanessa', emoji: '🏃', category: 'fitness',
    challenges: ['Ir al gimnasio 5 veces a la semana', 'Correr 2 veces a la semana', 'PLd al corriente'] },
  { id: 'gerardo', name: 'Gerardo', emoji: '💼', category: 'multi',
    challenges: ['Bajar de 92 a 80 kg haciendo ejercicio', 'Emprender un negocio'] },
  { id: 'rodolfo', name: 'Rodolfo', emoji: '📖', category: 'education',
    challenges: ['Leer al menos 2 libros (incl. Deja de ser tú de Joe Dispenza)'] },
  { id: 'mich', name: 'Mich', emoji: '🏠', category: 'business',
    challenges: ['Poner a funcionar Ícaro para facilitar acceso a vivienda'] },
  { id: 'javier', name: 'Javier', emoji: '🇫🇷', category: 'education',
    challenges: ['Retomar clases de francés y lograr nivel B1'] },
  { id: 'fer_dtl', name: 'Fer DTL', emoji: '✈️', category: 'travel',
    challenges: ['Viajar a Londres para concluir 2026 e iniciar 2027'] },
  { id: 'ivan_d', name: 'Iván D.', emoji: '🏋️', category: 'fitness',
    challenges: ['Realizar un Hyrox en la segunda mitad del año'] },
  { id: 'pao', name: 'Pao', emoji: '💰', category: 'business',
    challenges: ['Iniciar emprendimiento personal', 'Generar ingresos extras arriba de $50,000 mensuales para maestría'] },
  { id: 'fer_kepka', name: 'Fer Kepka', emoji: '🎨', category: 'business',
    challenges: ['Hacer de un hobby algo que genere dinero extra (ejercicio o renders)'] },
  { id: 'francisco', name: 'Francisco', emoji: '🏥', category: 'multi',
    challenges: ['Bajar 15-20 kg siendo constante en el gimnasio', 'Terminar 1er y 2do cuatrimestre de maestría', 'Conocer el Golden Gate en San Francisco'] },
  { id: 'ivan_s', name: 'Iván S.', emoji: '⚡', category: 'fitness',
    challenges: ['Bajar 20 kilos antes del 31 de diciembre'] },
  { id: 'valentin', name: 'Valentín', emoji: '🗣️', category: 'education',
    challenges: ['Aprender a expresarse en inglés hablando', 'Dedicar 15 min diarios a una lección de inglés'] },
  { id: 'tanya', name: 'Tanya', emoji: '🤖', category: 'education',
    challenges: ['Certificarse en IA para arquitectos', 'Vivir el presente y disfrutar el momento'] },
  { id: 'karim', name: 'Karim', emoji: '🎓', category: 'education',
    challenges: ['Inscribirse a un MBA, maestría o certificación avanzada'] },
  { id: 'fer_guzman', name: 'Fer Guzmán', emoji: '🍓', category: 'multi',
    challenges: ['Conseguir certificado en francés', 'Viajar y conocer al menos 3 lugares nuevos'] },
  { id: 'laura', name: 'Laura', emoji: '📚', category: 'education',
    challenges: ['Terminar lista de lectura de 50 libros'] },
];

const CATEGORY_COLORS = {
  fitness: '#FF6B35', education: '#4ECDC4', business: '#FFE66D',
  habits: '#A8E6CF', travel: '#FF8B94', multi: '#C3A6FF',
};
const CATEGORY_LABELS = {
  fitness: 'Fitness', education: 'Aprendizaje', business: 'Emprendimiento',
  habits: 'Hábitos', travel: 'Viaje', multi: 'Multi-reto',
};

function getDateKey() { return new Date().toISOString().split('T')[0]; }
function getDayOfYear() {
  const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}
function getStreak(logs) {
  if (!logs?.length) return 0;
  const sorted = [...new Set(logs)].sort((a, b) => b.localeCompare(a));
  let streak = 0, current = new Date();
  for (let d of sorted) {
    const diff = Math.round((current - new Date(d)) / 86400000);
    if (diff <= 1) { streak++; current = new Date(d); } else break;
  }
  return streak;
}

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': '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', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

export default function App() {
  const [view, setView] = useState('board');
  const [selectedMember, setSelectedMember] = useState(null);
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [logActivity, setLogActivity] = useState('');
  const [logNote, setLogNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('retos2026_user') || null);
  const [userPicker, setUserPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [groupSummary, setGroupSummary] = useState('');
  const [groupLoading, setGroupLoading] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(db, 'activities'), snap => {
      setData(snap.val() || {});
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  function saveUser(uid) {
    setCurrentUser(uid);
    localStorage.setItem('retos2026_user', uid);
  }

  function getMD(id) { return data[id] || { logs: [], notes: [], progress: 0 }; }

  async function submitActivity(memberId) {
    if (!logActivity.trim()) return;
    setSaving(true);
    const today = getDateKey();
    const md = getMD(memberId);
    const logs = [...(md.logs || []), today];
    const notes = [...(md.notes || []), { date: today, text: logActivity.trim() + (logNote.trim() ? ' — ' + logNote.trim() : ''), ts: Date.now() }];
    const progress = Math.min(100, (md.progress || 0) + 2);
    try {
      await set(ref(db, `activities/${memberId}`), { logs, notes, progress });
      setLogActivity(''); setLogNote('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (e) { alert('Error al guardar. Verifica tu conexión.'); }
    setSaving(false);
  }

  async function getAiSummary(member) {
    const md = getMD(member.id);
    if (!md.notes?.length) { setAiSummary('Esta persona aún no ha registrado actividades.'); return; }
    setAiLoading(true);
    setAiSummary('');
    const historial = md.notes.map(n => `${n.date}: ${n.text}`).join('\n');
    const prompt = `Eres el asistente del grupo de retos 2026. Analiza el historial de actividades de ${member.name} y genera un resumen inteligente y motivador en español.

RETOS DE ${member.name.toUpperCase()}:
${member.challenges.map((c, i) => `${i + 1}. ${c}`).join('\n')}

HISTORIAL DE ACTIVIDADES (${md.notes.length} registros, ${new Set(md.logs).size} días únicos):
${historial}

Genera un resumen que incluya:
- Progreso específico hacia cada reto (extrae números concretos: kms corridos, kg bajados, libros leídos, días de gym, etc.)
- Racha actual: ${getStreak(md.logs)} días consecutivos
- Análisis de consistencia
- Una frase motivadora personalizada al final

Sé específico con los números que puedas extraer. Responde de forma conversacional y motivadora, máximo 200 palabras.`;
    try {
      const summary = await callClaude(prompt);
      setAiSummary(summary);
    } catch (e) { setAiSummary('Error al generar el resumen. Intenta de nuevo.'); }
    setAiLoading(false);
  }

  async function getGroupSummary() {
    setGroupLoading(true);
    setGroupSummary('');
    const membersWithActivity = MEMBERS.filter(m => getMD(m.id).notes?.length > 0);
    if (!membersWithActivity.length) { setGroupSummary('Nadie ha registrado actividades todavía.'); setGroupLoading(false); return; }
    const resumenPorPersona = membersWithActivity.map(m => {
      const md = getMD(m.id);
      const ultimas = (md.notes || []).slice(-5).map(n => n.text).join('; ');
      return `${m.name} (meta: ${m.challenges[0]}): ${md.notes.length} actividades, racha ${getStreak(md.logs)} días. Últimas entradas: ${ultimas}`;
    }).join('\n');
    const prompt = `Eres el coach del grupo de retos 2026. Son 26 amigos que se pusieron metas para este año. Analiza el resumen del grupo y genera un reporte grupal motivador en español.

ACTIVIDAD DEL GRUPO:
${resumenPorPersona}

Genera un reporte grupal que incluya:
1. ⭐ TOP 3 más consistentes (por racha o actividades)
2. 📊 Tendencias del grupo esta semana
3. 🔥 Logro destacado de alguien específico
4. 💪 Motivación para quien necesita arrancar o retomar
5. 🎯 Reto grupal de la semana

Tono: coach amigo, divertido pero motivador. Máximo 250 palabras.`;
    try {
      const summary = await callClaude(prompt);
      setGroupSummary(summary);
    } catch (e) { setGroupSummary('Error al generar el resumen. Intenta de nuevo.'); }
    setGroupLoading(false);
  }

  const totalLogs = Object.values(data).reduce((s, d) => s + (d.logs?.length || 0), 0);
  const activeMembers = MEMBERS.filter(m => getMD(m.id).logs?.length > 0).length;
  const filtered = filterCat === 'all' ? MEMBERS : MEMBERS.filter(m => m.category === filterCat);

  if (!loaded) return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔥</div>
        <div style={{ color: '#FF6B35', fontFamily: `Georgia,serif`, fontSize: 14, letterSpacing: 2 }}>CARGANDO...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'Georgia sans-serif', color: '#F0EDE8' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(78,205,196,0.05) 0%, transparent 50%)' }} />

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#FF6B35', textTransform: 'uppercase' }}>Grupo Retos</div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>2026 🔥</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setUserPicker(true)} style={{ background: currentUser ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${currentUser ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 20, padding: '6px 12px', color: currentUser ? '#FF6B35' : '#aaa', fontSize: 12, cursor: 'pointer', fontFamily: `Georgia,serif` }}>
            {currentUser ? '👤 ' + MEMBERS.find(m => m.id === currentUser)?.name : '¿Quién soy?'}
          </button>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            {[['board', '📊'], ['ai', '🤖'], ['log', '✍️']].map(([v, icon]) => (
              <button key={v} onClick={() => { setView(v); setSelectedMember(null); setAiSummary(''); }} style={{ padding: '7px 12px', background: view === v ? 'rgba(255,107,53,0.2)' : 'transparent', border: 'none', color: view === v ? '#FF6B35' : '#666', cursor: 'pointer', fontSize: 14, fontFamily: `Georgia,serif` }}>{icon}</button>
            ))}
          </div>
        </div>
      </header>

      {/* USER PICKER */}
      {userPicker && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setUserPicker(false)}>
          <div style={{ background: '#14141A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 380, maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 12, letterSpacing: 3, color: '#FF6B35', marginBottom: 16, textTransform: 'uppercase' }}>¿Quién eres?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MEMBERS.map(m => (
                <button key={m.id} onClick={() => { saveUser(m.id); setUserPicker(false); setView('log'); }} style={{ background: currentUser === m.id ? 'rgba(255,107,53,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${currentUser === m.id ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '7px 14px', color: currentUser === m.id ? '#FF6B35' : '#ccc', cursor: 'pointer', fontSize: 13, fontFamily: `Georgia,serif` }}>{m.emoji} {m.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATS BAR */}
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 5 }}>
        {[['26', 'participantes'], [totalLogs, 'actividades'], [activeMembers, 'han registrado'], [getDayOfYear() + '/365', 'día del año']].map(([val, label]) => (
          <div key={label} style={{ flex: '0 0 auto', padding: '10px 18px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#FF6B35' }}>{val}</div>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <main style={{ position: 'relative', zIndex: 5, padding: '20px 16px', maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>

        {/* BOARD VIEW */}
        {view === 'board' && !selectedMember && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {[['all', 'Todos 🌟'], ...Object.entries(CATEGORY_LABELS).map(([k, v]) => [k, v])].map(([cat, label]) => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{ flex: '0 0 auto', background: filterCat === cat ? (cat === 'all' ? 'rgba(255,107,53,0.2)' : `${CATEGORY_COLORS[cat]}20`) : 'rgba(255,255,255,0.04)', border: `1px solid ${filterCat === cat ? (cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat]) : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '5px 12px', color: filterCat === cat ? (cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat]) : '#666', cursor: 'pointer', fontSize: 11, fontFamily: `Georgia,serif` }}>{label}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {filtered.map((member, i) => {
                const md = getMD(member.id);
                const streak = getStreak(md.logs || []);
                const progress = md.progress || 0;
                const loggedToday = (md.logs || []).includes(getDateKey());
                const lastNote = md.notes?.slice(-1)[0];
                const color = CATEGORY_COLORS[member.category];
                const isMe = currentUser === member.id;
                return (
                  <div key={member.id} onClick={() => setSelectedMember(member)} style={{ background: isMe ? 'rgba(255,107,53,0.07)' : 'rgba(255,255,255,0.025)', border: `1px solid ${isMe ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: 16, cursor: 'pointer', animation: `fadeIn 0.4s ease ${i * 0.02}s both` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{member.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{member.name}</div>
                          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color, marginTop: 1 }}>{CATEGORY_LABELS[member.category]}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {loggedToday && <div style={{ fontSize: 9, color: '#4ECDC4', letterSpacing: 1 }}>✓ HOY</div>}
                        {streak > 0 && <div style={{ fontSize: 12, color: '#FFE66D' }}>🔥 {streak}</div>}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, marginBottom: 10 }}>
                      <div style={{ height: '100%', borderRadius: 4, width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5 }}>{member.challenges[0]}{member.challenges.length > 1 && <span style={{ color: '#444' }}> +{member.challenges.length - 1}</span>}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: '#444' }}>
                      <span>{md.logs?.length || 0} actividades</span><span>{progress}% avance</span>
                    </div>
                    {lastNote && <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11, color: '#555', borderLeft: `2px solid ${color}44`, fontStyle: 'italic' }}>'{lastNote.text.length > 55 ? lastNote.text.slice(0, 55) + '…' : lastNote.text}'</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PROFILE VIEW */}
        {view === 'board' && selectedMember && (() => {
          const member = selectedMember;
          const md = getMD(member.id);
          const streak = getStreak(md.logs || []);
          const color = CATEGORY_COLORS[member.category];
          const isMe = currentUser === member.id;
          const loggedToday = (md.logs || []).includes(getDateKey());
          return (
            <div>
              <button onClick={() => { setSelectedMember(null); setAiSummary(''); }} style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0, fontFamily: `Georgia,serif` }}>← tablero</button>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 22, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <span style={{ fontSize: 44 }}>{member.emoji}</span>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{member.name}</div>
                      <div style={{ fontSize: 10, letterSpacing: 2, color, textTransform: 'uppercase' }}>{CATEGORY_LABELS[member.category]}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 26, color: '#FFE66D' }}>🔥 {streak}</div>
                    <div style={{ fontSize: 9, color: '#444' }}>racha días</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  {[[md.logs?.length || 0, 'actividades'], [md.progress || 0, '% avance'], [new Set(md.logs || []).size, 'días únicos']].map(([v, l]) => (
                    <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 'bold', color }}>{v}</div>
                      <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: '#555' }}>
                    <span>Progreso estimado</span><span style={{ color }}>{md.progress || 0}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 8 }}>
                    <div style={{ height: '100%', borderRadius: 6, width: `${md.progress || 0}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                  </div>
                </div>
              </div>

              {/* AI SUMMARY */}
              <div style={{ marginBottom: 20 }}>
                <button onClick={() => getAiSummary(member)} disabled={aiLoading} style={{ width: '100%', background: aiLoading ? 'rgba(255,255,255,0.03)' : 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: 12, padding: '13px', color: '#4ECDC4', fontSize: 14, cursor: aiLoading ? 'default' : 'pointer', fontFamily: `Georgia,serif`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {aiLoading ? '🤖 Analizando su progreso...' : '🤖 Generar resumen IA de su progreso'}
                </button>
                {aiSummary && (
                  <div style={{ marginTop: 12, padding: 16, background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: 12, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {aiSummary}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Retos 2026</div>
                {member.challenges.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color, fontWeight: 'bold' }}>{i + 1}</div>
                    <div style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{c}</div>
                  </div>
                ))}
              </div>

              {isMe && (
                <div style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: '#FF6B35', textTransform: 'uppercase', marginBottom: 14 }}>
                    {loggedToday ? '✓ Ya registraste hoy — agregar más' : 'Registrar actividad de hoy'}
                  </div>
                  <input value={logActivity} onChange={e => setLogActivity(e.target.value)} placeholder='¿Qué hiciste hoy?' style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#F0EDE8', fontSize: 14, fontFamily: `Georgia,serif`, marginBottom: 10, boxSizing: 'border-box' }} />
                  <input value={logNote} onChange={e => setLogNote(e.target.value)} placeholder='Detalle: km, kg, páginas, tiempo...' style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#999', fontSize: 13, fontFamily: `Georgia,serif`, marginBottom: 14, boxSizing: 'border-box' }} />
                  <button onClick={() => submitActivity(member.id)} disabled={saving} style={{ width: '100%', background: saving ? '#333' : '#FF6B35', border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontSize: 15, fontWeight: 'bold', cursor: saving ? 'default' : 'pointer', fontFamily: `Georgia,serif` }}>{saving ? 'Guardando...' : 'Registrar ✓'}</button>
                  {showSuccess && <div style={{ marginTop: 10, textAlign: 'center', color: '#4ECDC4', fontSize: 13 }}>¡Guardado! 🎉</div>}
                </div>
              )}

              {md.notes?.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Historial</div>
                  {[...(md.notes || [])].reverse().slice(0, 30).map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontSize: 10, color: '#444', flexShrink: 0 }}>{n.date}</div>
                      <div style={{ fontSize: 13, color: '#bbb' }}>{n.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* AI VIEW */}
        {view === 'ai' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: '#4ECDC4', textTransform: 'uppercase', marginBottom: 6 }}>Inteligencia Artificial</div>
              <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>Resúmenes del grupo</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>La IA analiza los registros en texto libre y genera reportes personalizados según los retos de cada quien</div>
            </div>

            {/* GROUP SUMMARY */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#4ECDC4', textTransform: 'uppercase', marginBottom: 4 }}>📊 Reporte grupal</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 14 }}>Top 3, logros destacados, quién necesita motivación y reto grupal de la semana</div>
              <button onClick={getGroupSummary} disabled={groupLoading} style={{ width: '100%', background: groupLoading ? 'rgba(255,255,255,0.03)' : 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: 10, padding: '14px', color: '#4ECDC4', fontSize: 14, cursor: groupLoading ? 'default' : 'pointer', fontFamily: `Georgia,serif` }}>
                {groupLoading ? '🤖 Analizando al grupo completo...' : '🤖 Generar reporte grupal'}
              </button>
              {groupSummary && (
                <div style={{ marginTop: 14, padding: 16, background: 'rgba(78,205,196,0.05)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: 10, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {groupSummary}
                </div>
              )}
            </div>

            {/* INDIVIDUAL */}
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 14 }}>👤 Resumen individual</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {MEMBERS.map(member => {
                const md = getMD(member.id);
                const hasActivity = md.notes?.length > 0;
                const color = CATEGORY_COLORS[member.category];
                return (
                  <button key={member.id}
                    onClick={() => { if (!hasActivity) return; setSelectedMember(member); setView('board'); setAiSummary(''); setTimeout(() => getAiSummary(member), 200); }}
                    style={{ background: hasActivity ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)', border: `1px solid ${hasActivity ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`, borderRadius: 12, padding: '14px 16px', cursor: hasActivity ? 'pointer' : 'default', textAlign: 'left', fontFamily: `Georgia,serif`, display: 'flex', alignItems: 'center', gap: 12, opacity: hasActivity ? 1 : 0.4 }}>
                    <span style={{ fontSize: 24 }}>{member.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 'bold', color: '#F0EDE8' }}>{member.name}</div>
                      <div style={{ fontSize: 10, color: hasActivity ? color : '#444', marginTop: 2 }}>
                        {hasActivity ? `${md.notes.length} registros · tap para resumen IA` : 'Sin actividad aún'}
                      </div>
                    </div>
                    {hasActivity && <span style={{ color: '#4ECDC4', fontSize: 16 }}>→</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* LOG VIEW */}
        {view === 'log' && (
          <div>
            {!currentUser ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>¡Hola!</div>
                <div style={{ color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Primero dinos quién eres</div>
                <button onClick={() => setUserPicker(true)} style={{ background: 'rgba(255,107,53,0.2)', border: '1px solid #FF6B35', borderRadius: 12, padding: '14px 28px', color: '#FF6B35', cursor: 'pointer', fontSize: 15, fontFamily: `Georgia,serif` }}>Seleccionar mi perfil</button>
              </div>
            ) : (() => {
              const member = MEMBERS.find(m => m.id === currentUser);
              const md = getMD(currentUser);
              const loggedToday = (md.logs || []).includes(getDateKey());
              const streak = getStreak(md.logs || []);
              const color = CATEGORY_COLORS[member.category];
              return (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{member.emoji}</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>🔥 {streak} días de racha · {md.logs?.length || 0} actividades totales</div>
                    {loggedToday && <div style={{ marginTop: 8, fontSize: 12, color: '#4ECDC4' }}>✓ Ya registraste hoy</div>}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#FF6B35', marginBottom: 14, textTransform: 'uppercase' }}>¿Qué hiciste hoy?</div>
                    <input value={logActivity} onChange={e => setLogActivity(e.target.value)} placeholder='Fui al gym, corrí 5km, leí 30 págs...' style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px', color: '#F0EDE8', fontSize: 15, fontFamily: `Georgia,serif`, marginBottom: 10, boxSizing: 'border-box' }} />
                    <input value={logNote} onChange={e => setLogNote(e.target.value)} placeholder='Detalle: tiempo, distancia, páginas...' style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px', color: '#888', fontSize: 13, fontFamily: `Georgia,serif`, marginBottom: 16, boxSizing: 'border-box' }} />
                    <button onClick={() => submitActivity(currentUser)} disabled={saving} style={{ width: '100%', background: saving ? '#222' : 'linear-gradient(135deg, #FF6B35, #ff8f5e)', border: 'none', borderRadius: 12, padding: '16px', color: '#fff', fontSize: 16, fontWeight: 'bold', cursor: saving ? 'default' : 'pointer', fontFamily: `Georgia,serif` }}>{saving ? 'Guardando...' : 'Registrar actividad ✓'}</button>
                    {showSuccess && <div style={{ marginTop: 12, textAlign: 'center', color: '#4ECDC4', fontSize: 14 }}>¡Guardado para todos! 🎉</div>}
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Mis retos</div>
                  {member.challenges.map((c, i) => (
                    <div key={i} style={{ padding: '10px 14px', marginBottom: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 10, borderLeft: `3px solid ${color}`, fontSize: 13, color: '#bbb' }}>{c}</div>
                  ))}
                  {md.notes?.length > 0 && (
                    <>
                      <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', margin: '20px 0 12px' }}>Mis últimas actividades</div>
                      {[...(md.notes || [])].reverse().slice(0, 8).map((n, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ fontSize: 10, color: '#444', flexShrink: 0 }}>{n.date}</div>
                          <div style={{ fontSize: 13, color: '#bbb' }}>{n.text}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input { outline: none; }
        input:focus { border-color: rgba(255,107,53,0.5) !important; }
        input::placeholder { color: #333; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
