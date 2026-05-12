import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

const MEMBERS = [
  { id: 'axel', name: 'Axel', emoji: '⚽', category: 'multi',
    challenges: ['Volver a jugar futbol y meterme a equipo', 'Viajar a Europa', 'Terminar Porttica', 'Terminar Estructura de Monterra'],
    fields: [
      { key: 'jugaste', label: 'Jugaste futbol hoy?', type: 'yesno' },
      { key: 'horas_trabajo', label: 'Horas trabajadas en Porttica o Monterra', type: 'number', unit: 'hrs' },
      { key: 'nota', label: 'Nota del dia', type: 'text' },
    ]},
  { id: 'pancho', name: 'Pancho', emoji: '🚴', category: 'fitness',
    challenges: ['Xel-Ha en 2h30', '+200 dias de ejercicio', 'Carrera en bici +100km', 'Medio maraton en 1h40', 'Meditar 3x semana'],
    fields: [
      { key: 'tipo', label: 'Tipo de actividad', type: 'select', options: ['Correr', 'Bici', 'Gym', 'Natacion', 'Meditacion', 'Otro'] },
      { key: 'km', label: 'Kilometros (si aplica)', type: 'number', unit: 'km' },
      { key: 'tiempo', label: 'Tiempo', type: 'number', unit: 'min' },
      { key: 'medite', label: 'Meditaste hoy?', type: 'yesno' },
    ]},
  { id: 'reynol', name: 'Reynol', emoji: '🧘', category: 'habits',
    challenges: ['Rituales manana con respiracion y meditacion 4 dias/semana', 'Eliminar pantallas 30 min antes de dormir y leer'],
    fields: [
      { key: 'medite', label: 'Hiciste tu ritual de manana?', type: 'yesno' },
      { key: 'sin_pantallas', label: 'Sin pantallas antes de dormir?', type: 'yesno' },
      { key: 'leiste', label: 'Leiste antes de dormir?', type: 'yesno' },
      { key: 'paginas', label: 'Cuantas paginas leiste', type: 'number', unit: 'pag' },
    ]},
  { id: 'cesar', name: 'Cesar', emoji: '⛳', category: 'fitness',
    challenges: ['Bajar a 15% de body fat', 'Bajar handicap de golf a 5'],
    fields: [
      { key: 'peso', label: 'Peso de hoy', type: 'number', unit: 'kg' },
      { key: 'body_fat', label: 'Body fat % (si lo mediste)', type: 'number', unit: '%' },
      { key: 'golf', label: 'Jugaste golf?', type: 'yesno' },
      { key: 'handicap', label: 'Handicap actual', type: 'number', unit: 'pts' },
    ]},
  { id: 'jazmin', name: 'Jazmin', emoji: '💪', category: 'fitness',
    challenges: ['Ir al gimnasio 4-5 dias por semana', 'Mejorar habitos alimenticios', 'Inscribirse a escuela de ingles'],
    fields: [
      { key: 'gym', label: 'Fuiste al gym?', type: 'yesno' },
      { key: 'comiste_bien', label: 'Como fue tu alimentacion hoy?', type: 'select', options: ['Muy bien', 'Bien', 'Regular', 'Mal'] },
      { key: 'ingles', label: 'Hiciste algo de ingles hoy?', type: 'yesno' },
      { key: 'nota', label: 'Nota adicional', type: 'text' },
    ]},
  { id: 'gabriela', name: 'Gabriela', emoji: '🏃', category: 'fitness',
    challenges: ['Cumplir dieta para subir masa muscular', 'Superar los 10k corriendo'],
    fields: [
      { key: 'dieta', label: 'Cumpliste tu dieta hoy?', type: 'yesno' },
      { key: 'corri', label: 'Corriste hoy?', type: 'yesno' },
      { key: 'km', label: 'Cuantos km corriste', type: 'number', unit: 'km' },
      { key: 'peso', label: 'Peso de hoy', type: 'number', unit: 'kg' },
    ]},
  { id: 'elizabeth', name: 'Elizabeth', emoji: '🏊', category: 'fitness',
    challenges: ['Tomar clases de natacion', 'Buscar un reto acuatico a fin de ano'],
    fields: [
      { key: 'clase', label: 'Tomaste clase de natacion?', type: 'yesno' },
      { key: 'tiempo', label: 'Tiempo en el agua', type: 'number', unit: 'min' },
      { key: 'nota', label: 'Como te fue?', type: 'text' },
    ]},
  { id: 'eduardo', name: 'Eduardo', emoji: '🥗', category: 'fitness',
    challenges: ['Bajar de 86 a 74 kg', 'Aprender a cocinar sano'],
    fields: [
      { key: 'peso', label: 'Peso de hoy', type: 'number', unit: 'kg' },
      { key: 'cocine', label: 'Cocinaste algo sano?', type: 'yesno' },
      { key: 'ejercicio', label: 'Hiciste ejercicio?', type: 'yesno' },
      { key: 'receta', label: 'Que cocinaste?', type: 'text' },
    ]},
  { id: 'fernanda_df', name: 'Fernanda D.', emoji: '📚', category: 'education',
    challenges: ['Leer 1 libro al mes', 'Ampliar conocimiento en finanzas estudiando'],
    fields: [
      { key: 'paginas', label: 'Paginas leidas hoy', type: 'number', unit: 'pag' },
      { key: 'libro', label: 'Que libro estas leyendo?', type: 'text' },
      { key: 'termino_libro', label: 'Terminaste un libro?', type: 'yesno' },
      { key: 'estudie_finanzas', label: 'Estudiaste finanzas hoy?', type: 'yesno' },
    ]},
  { id: 'fany', name: 'Fany', emoji: '🏋️', category: 'multi',
    challenges: ['Ser constante en el ejercicio', 'Traer familia a Tijuana de vacaciones'],
    fields: [
      { key: 'ejercicio', label: 'Hiciste ejercicio hoy?', type: 'yesno' },
      { key: 'tipo', label: 'Tipo de ejercicio', type: 'text' },
      { key: 'avance_viaje', label: 'Avanzaste en planear el viaje familiar?', type: 'yesno' },
    ]},
  { id: 'vanessa', name: 'Vanessa', emoji: '🏃', category: 'fitness',
    challenges: ['Ir al gimnasio 5 veces a la semana', 'Correr 2 veces a la semana', 'PLd al corriente'],
    fields: [
      { key: 'gym', label: 'Fuiste al gym?', type: 'yesno' },
      { key: 'corri', label: 'Corriste hoy?', type: 'yesno' },
      { key: 'km', label: 'Cuantos km corriste', type: 'number', unit: 'km' },
      { key: 'pld', label: 'Avanzaste en PLd?', type: 'yesno' },
    ]},
  { id: 'gerardo', name: 'Gerardo', emoji: '💼', category: 'multi',
    challenges: ['Bajar de 92 a 80 kg haciendo ejercicio', 'Emprender un negocio'],
    fields: [
      { key: 'peso', label: 'Peso de hoy', type: 'number', unit: 'kg' },
      { key: 'ejercicio', label: 'Hiciste ejercicio?', type: 'yesno' },
      { key: 'negocio', label: 'Avanzaste en tu negocio hoy?', type: 'yesno' },
      { key: 'que_hice', label: 'Que hiciste para el negocio?', type: 'text' },
    ]},
  { id: 'rodolfo', name: 'Rodolfo', emoji: '📖', category: 'education',
    challenges: ['Leer al menos 2 libros (incl. Deja de ser tu)'],
    fields: [
      { key: 'paginas', label: 'Paginas leidas hoy', type: 'number', unit: 'pag' },
      { key: 'libro', label: 'Que libro estas leyendo?', type: 'text' },
      { key: 'termino_libro', label: 'Terminaste un libro?', type: 'yesno' },
    ]},
  { id: 'mich', name: 'Mich', emoji: '🏠', category: 'business',
    challenges: ['Poner a funcionar Icaro para facilitar acceso a vivienda'],
    fields: [
      { key: 'avance', label: 'Avanzaste en Icaro hoy?', type: 'yesno' },
      { key: 'que_hice', label: 'Que lograste hoy?', type: 'text' },
      { key: 'horas', label: 'Horas dedicadas', type: 'number', unit: 'hrs' },
    ]},
  { id: 'javier', name: 'Javier', emoji: '🇫🇷', category: 'education',
    challenges: ['Retomar clases de frances y lograr nivel B1'],
    fields: [
      { key: 'clase', label: 'Tomaste clase o practicaste frances?', type: 'yesno' },
      { key: 'tiempo', label: 'Cuanto tiempo practicaste', type: 'number', unit: 'min' },
      { key: 'nota', label: 'Que aprendiste?', type: 'text' },
    ]},
  { id: 'fer_dtl', name: 'Fer DTL', emoji: '✈️', category: 'travel',
    challenges: ['Viajar a Londres para concluir 2026 e iniciar 2027'],
    fields: [
      { key: 'avance', label: 'Avanzaste en planear el viaje a Londres?', type: 'yesno' },
      { key: 'que_hice', label: 'Que hiciste para el viaje?', type: 'text' },
      { key: 'ahorre', label: 'Ahorraste algo para el viaje?', type: 'yesno' },
    ]},
  { id: 'ivan_d', name: 'Ivan D.', emoji: '🏋️', category: 'fitness',
    challenges: ['Realizar un Hyrox en la segunda mitad del ano'],
    fields: [
      { key: 'entrene', label: 'Entrenaste hoy?', type: 'yesno' },
      { key: 'tipo', label: 'Tipo de entrenamiento', type: 'select', options: ['Correr', 'Fuerza', 'Funcional', 'Hyrox especifico', 'Otro'] },
      { key: 'tiempo', label: 'Duracion', type: 'number', unit: 'min' },
    ]},
  { id: 'pao', name: 'Pao', emoji: '💰', category: 'business',
    challenges: ['Iniciar emprendimiento personal', 'Generar ingresos extras arriba de $50,000 mensuales'],
    fields: [
      { key: 'avance', label: 'Avanzaste en tu emprendimiento?', type: 'yesno' },
      { key: 'ingresos', label: 'Ingresos generados hoy', type: 'number', unit: '$' },
      { key: 'que_hice', label: 'Que hiciste hoy para tu negocio?', type: 'text' },
    ]},
  { id: 'fer_kepka', name: 'Fer Kepka', emoji: '🎨', category: 'business',
    challenges: ['Hacer de un hobby algo que genere dinero extra'],
    fields: [
      { key: 'trabaje', label: 'Trabajaste en tu hobby/negocio?', type: 'yesno' },
      { key: 'ingresos', label: 'Ingresos generados', type: 'number', unit: '$' },
      { key: 'que_hice', label: 'Que hiciste?', type: 'text' },
    ]},
  { id: 'francisco', name: 'Francisco', emoji: '🏥', category: 'multi',
    challenges: ['Bajar 15-20 kg', 'Terminar maestria', 'Conocer Golden Gate'],
    fields: [
      { key: 'peso', label: 'Peso de hoy', type: 'number', unit: 'kg' },
      { key: 'gym', label: 'Fuiste al gym?', type: 'yesno' },
      { key: 'maestria', label: 'Avanzaste en tu maestria?', type: 'yesno' },
      { key: 'nota', label: 'Nota del dia', type: 'text' },
    ]},
  { id: 'ivan_s', name: 'Ivan S.', emoji: '⚡', category: 'fitness',
    challenges: ['Bajar 20 kilos antes del 31 de diciembre'],
    fields: [
      { key: 'peso', label: 'Peso de hoy', type: 'number', unit: 'kg' },
      { key: 'ejercicio', label: 'Hiciste ejercicio?', type: 'yesno' },
      { key: 'comiste_bien', label: 'Como fue tu alimentacion?', type: 'select', options: ['Muy bien', 'Bien', 'Regular', 'Mal'] },
    ]},
  { id: 'valentin', name: 'Valentin', emoji: '🗣️', category: 'education',
    challenges: ['Aprender a expresarse en ingles hablando', 'Dedicar 15 min diarios a leccion de ingles'],
    fields: [
      { key: 'leccion', label: 'Tomaste tu leccion de ingles?', type: 'yesno' },
      { key: 'tiempo', label: 'Cuanto tiempo practicaste', type: 'number', unit: 'min' },
      { key: 'nota', label: 'Que aprendiste hoy?', type: 'text' },
    ]},
  { id: 'tanya', name: 'Tanya', emoji: '🤖', category: 'education',
    challenges: ['Certificarse en IA para arquitectos', 'Vivir el presente'],
    fields: [
      { key: 'estudie_ia', label: 'Estudiaste o practicaste IA hoy?', type: 'yesno' },
      { key: 'tiempo', label: 'Cuanto tiempo le dedicaste', type: 'number', unit: 'min' },
      { key: 'presente', label: 'Momento presente del dia', type: 'text' },
    ]},
  { id: 'karim', name: 'Karim', emoji: '🎓', category: 'education',
    challenges: ['Inscribirse a un MBA, maestria o certificacion avanzada'],
    fields: [
      { key: 'investigue', label: 'Investigaste programas o avanzaste en proceso?', type: 'yesno' },
      { key: 'que_hice', label: 'Que hiciste hoy para este reto?', type: 'text' },
    ]},
  { id: 'fer_guzman', name: 'Fer Guzman', emoji: '🍓', category: 'multi',
    challenges: ['Conseguir certificado en frances', 'Viajar y conocer al menos 3 lugares nuevos'],
    fields: [
      { key: 'frances', label: 'Practicaste o estudiaste frances?', type: 'yesno' },
      { key: 'tiempo_frances', label: 'Cuanto tiempo', type: 'number', unit: 'min' },
      { key: 'viaje', label: 'Avanzaste en planear algun viaje?', type: 'yesno' },
      { key: 'lugares_visitados', label: 'Lugares nuevos visitados en total este ano', type: 'number', unit: 'lugares' },
    ]},
  { id: 'laura', name: 'Laura', emoji: '📚', category: 'education',
    challenges: ['Terminar lista de lectura de 50 libros'],
    fields: [
      { key: 'paginas', label: 'Paginas leidas hoy', type: 'number', unit: 'pag' },
      { key: 'libro', label: 'Que libro estas leyendo?', type: 'text' },
      { key: 'termino_libro', label: 'Terminaste un libro?', type: 'yesno' },
      { key: 'libros_total', label: 'Total de libros terminados este ano', type: 'number', unit: 'libros' },
    ]},
];

const CATEGORY_COLORS = {
  fitness: '#FF6B35', education: '#4ECDC4', business: '#FFE66D',
  habits: '#A8E6CF', travel: '#FF8B94', multi: '#C3A6FF',
};
const CATEGORY_LABELS = {
  fitness: 'Fitness', education: 'Aprendizaje', business: 'Emprendimiento',
  habits: 'Habitos', travel: 'Viaje', multi: 'Multi-reto',
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

function generateIndividualSummary(member, md) {
  if (!md.notes?.length) return 'Aun no ha registrado actividades.';
  const streak = getStreak(md.logs || []);
  const totalDays = new Set(md.logs || []).size;
  const totalActivities = md.notes?.length || 0;
  const entries = md.notes || [];

  const sum = (key) => entries.reduce((s, n) => s + (parseFloat(n[key]) || 0), 0);
  const last = (key) => { for (let i = entries.length - 1; i >= 0; i--) { if (entries[i][key] !== undefined && entries[i][key] !== '') return entries[i][key]; } return null; };
  const count = (key, val) => entries.filter(n => n[key] === val || n[key] === true || n[key] === 'true').length;

  const lines = [];
  lines.push('Resumen de ' + member.name);
  lines.push('');
  lines.push(totalActivities + ' registros en ' + totalDays + ' dias unicos');
  if (streak > 0) lines.push('Racha actual: ' + streak + ' dias seguidos');
  lines.push('');
  lines.push('Progreso por reto:');

  const id = member.id;

  if (['pancho','gabriela','vanessa','ivan_d'].includes(id)) {
    const km = sum('km');
    if (km > 0) lines.push('  Kilometros acumulados: ' + km.toFixed(1) + ' km');
    const gymDays = count('gym', true) + count('entrene', true) + count('corri', true);
    if (gymDays > 0) lines.push('  Dias de ejercicio registrados: ' + gymDays);
    const medDays = count('medite', true);
    if (medDays > 0) lines.push('  Dias de meditacion: ' + medDays);
  }
  if (['cesar','eduardo','gerardo','francisco','ivan_s','gabriela'].includes(id)) {
    const pesoInicial = parseFloat(entries[0]?.peso) || null;
    const pesoActual = parseFloat(last('peso')) || null;
    if (pesoInicial && pesoActual) {
      const diff = pesoInicial - pesoActual;
      lines.push('  Peso inicial registrado: ' + pesoInicial + ' kg');
      lines.push('  Peso mas reciente: ' + pesoActual + ' kg');
      if (diff > 0) lines.push('  Has bajado: ' + diff.toFixed(1) + ' kg');
      else if (diff < 0) lines.push('  Has subido: ' + Math.abs(diff).toFixed(1) + ' kg');
    } else if (pesoActual) {
      lines.push('  Ultimo peso registrado: ' + pesoActual + ' kg');
    }
  }
  if (['fernanda_df','rodolfo','laura','reynol'].includes(id)) {
    const pags = sum('paginas');
    if (pags > 0) lines.push('  Paginas leidas: ' + Math.round(pags));
    const libros = sum('termino_libro') + (sum('libros_total') > 0 ? 0 : 0);
    const librosTotal = last('libros_total');
    if (librosTotal) lines.push('  Libros terminados este ano: ' + librosTotal);
    const libroActual = last('libro');
    if (libroActual) lines.push('  Leyendo actualmente: ' + libroActual);
  }
  if (['valentin','tanya','fer_guzman','javier'].includes(id)) {
    const mins = sum('tiempo') + sum('tiempo_frances');
    if (mins > 0) lines.push('  Minutos de practica acumulados: ' + Math.round(mins) + ' min');
    const diasPractica = count('leccion', true) + count('clase', true) + count('frances', true) + count('estudie_ia', true);
    if (diasPractica > 0) lines.push('  Dias de practica: ' + diasPractica);
  }
  if (['pao','fer_kepka','gerardo','mich'].includes(id)) {
    const ingresos = sum('ingresos');
    if (ingresos > 0) lines.push('  Ingresos registrados: $' + ingresos.toLocaleString());
    const diasAvance = count('avance', true) + count('trabaje', true) + count('negocio', true);
    if (diasAvance > 0) lines.push('  Dias con avance en negocio: ' + diasAvance);
  }

  lines.push('');
  const lastEntries = entries.slice(-3).reverse();
  lines.push('Ultimas actividades:');
  lastEntries.forEach(n => {
    const resumen = Object.entries(n)
      .filter(([k]) => !['date','ts','text'].includes(k))
      .map(([k, v]) => v === true || v === 'true' ? k.replace(/_/g,' ') + ': si' : v === false || v === 'false' ? '' : k.replace(/_/g,' ') + ': ' + v)
      .filter(Boolean).join(' | ');
    lines.push('  ' + n.date + ': ' + (resumen || n.text || ''));
  });

  if (streak >= 7) lines.push('\nRacha increible de ' + streak + ' dias. Ya es un habito!');
  else if (streak >= 3) lines.push('\nVas bien! ' + streak + ' dias seguidos.');
  else if (totalActivities < 3) lines.push('\nCada registro cuenta. Sigue adelante!');

  return lines.join('\n');
}

function generateGroupSummary(allData) {
  const membersWithActivity = MEMBERS.filter(m => allData[m.id]?.notes?.length > 0);
  if (!membersWithActivity.length) return 'Nadie ha registrado actividades todavia. Sean los primeros!';

  const ranked = membersWithActivity
    .map(m => ({ member: m, md: allData[m.id] || {}, streak: getStreak(allData[m.id]?.logs || []), total: allData[m.id]?.notes?.length || 0 }))
    .sort((a, b) => b.streak - a.streak || b.total - a.total);

  const lines = [];
  lines.push('Reporte del Grupo - Retos 2026');
  lines.push('');
  lines.push('TOP 3 mas consistentes:');
  const medals = ['1.', '2.', '3.'];
  ranked.slice(0, 3).forEach((r, i) => {
    lines.push('  ' + medals[i] + ' ' + r.member.name + ' - ' + r.streak + ' dias de racha, ' + r.total + ' actividades');
  });

  lines.push('');
  lines.push('Estado del grupo:');
  lines.push('  ' + membersWithActivity.length + ' de 26 participantes activos');
  const totalActs = membersWithActivity.reduce((s, m) => s + (allData[m.id]?.notes?.length || 0), 0);
  lines.push('  ' + totalActs + ' actividades registradas en total');

  const sinActividad = MEMBERS.filter(m => !allData[m.id]?.notes?.length);
  if (sinActividad.length > 0) {
    lines.push('');
    lines.push('Aun sin actividad (' + sinActividad.length + ' personas):');
    lines.push('  ' + sinActividad.slice(0, 6).map(m => m.name).join(', ') + (sinActividad.length > 6 ? '...' : ''));
    lines.push('  Los esperamos! Nunca es tarde para empezar.');
  }

  const top = ranked[0];
  if (top) {
    lines.push('');
    lines.push('Destacado: ' + top.member.name + ' con ' + top.streak + ' dias seguidos');
  }

  return lines.join('\n');
}

export default function App() {
  const [view, setView] = useState('board');
  const [selectedMember, setSelectedMember] = useState(null);
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('retos2026_user') || null);
  const [userPicker, setUserPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState('');
  const [groupSummary, setGroupSummary] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editValues, setEditValues] = useState({});

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
    const member = MEMBERS.find(m => m.id === memberId);
    const hasData = member.fields.some(f => fieldValues[f.key] !== undefined && fieldValues[f.key] !== '');
    if (!hasData) return;
    setSaving(true);
    const today = getDateKey();
    const md = getMD(memberId);
    const logs = [...(md.logs || []), today];
    const entry = { date: today, ts: Date.now(), ...fieldValues };
    const notes = [...(md.notes || []), entry];
    const progress = Math.min(100, (md.progress || 0) + 2);
    try {
      await set(ref(db, 'activities/' + memberId), { logs, notes, progress });
      setFieldValues({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (e) { alert('Error al guardar.'); }
    setSaving(false);
  }

  function showSummary(member) {
    const md = getMD(member.id);
    setSummary(generateIndividualSummary(member, md));
  }

  function showGroupSummary() {
    setGroupSummary(generateGroupSummary(data));
  }

  async function deleteEntry(memberId, entryTs) {
    const md = getMD(memberId);
    const newNotes = (md.notes || []).filter(n => n.ts !== entryTs);
    const newLogs = newNotes.map(n => n.date);
    const newProgress = Math.max(0, (md.progress || 0) - 2);
    try {
      await set(ref(db, 'activities/' + memberId), { logs: newLogs, notes: newNotes, progress: newProgress });
    } catch (e) { alert('Error al borrar.'); }
  }

  async function saveEditEntry(memberId, entryTs) {
    const md = getMD(memberId);
    const newNotes = (md.notes || []).map(n => n.ts === entryTs ? { ...n, ...editValues } : n);
    try {
      await set(ref(db, 'activities/' + memberId), { ...md, notes: newNotes });
      setEditingEntry(null);
      setEditValues({});
    } catch (e) { alert('Error al guardar.'); }
  }

  const totalLogs = Object.values(data).reduce((s, d) => s + (d.logs?.length || 0), 0);
  const activeMembers = MEMBERS.filter(m => getMD(m.id).logs?.length > 0).length;
  const filtered = filterCat === 'all' ? MEMBERS : MEMBERS.filter(m => m.category === filterCat);

  if (!loaded) return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔥</div>
        <div style={{ color: '#FF6B35', fontFamily: 'Georgia,serif', fontSize: 14, letterSpacing: 2 }}>CARGANDO...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'Georgia,serif', color: '#F0EDE8' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(78,205,196,0.05) 0%, transparent 50%)' }} />

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#FF6B35', textTransform: 'uppercase' }}>Grupo Retos</div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>2026 🔥</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setUserPicker(true)} style={{ background: currentUser ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (currentUser ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.12)'), borderRadius: 20, padding: '6px 12px', color: currentUser ? '#FF6B35' : '#aaa', fontSize: 12, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
            {currentUser ? '👤 ' + MEMBERS.find(m => m.id === currentUser)?.name : '¿Quien soy?'}
          </button>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            {[['board', '📊'], ['ai', '📈'], ['log', '✍️']].map(([v, icon]) => (
              <button key={v} onClick={() => { setView(v); setSelectedMember(null); setSummary(''); }} style={{ padding: '7px 12px', background: view === v ? 'rgba(255,107,53,0.2)' : 'transparent', border: 'none', color: view === v ? '#FF6B35' : '#666', cursor: 'pointer', fontSize: 14, fontFamily: 'Georgia,serif' }}>{icon}</button>
            ))}
          </div>
        </div>
      </header>

      {userPicker && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setUserPicker(false)}>
          <div style={{ background: '#14141A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 380, maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 12, letterSpacing: 3, color: '#FF6B35', marginBottom: 16, textTransform: 'uppercase' }}>Quien eres?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MEMBERS.map(m => (
                <button key={m.id} onClick={() => { saveUser(m.id); setUserPicker(false); setView('log'); }} style={{ background: currentUser === m.id ? 'rgba(255,107,53,0.2)' : 'rgba(255,255,255,0.04)', border: '1px solid ' + (currentUser === m.id ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.1)'), borderRadius: 20, padding: '7px 14px', color: currentUser === m.id ? '#FF6B35' : '#ccc', cursor: 'pointer', fontSize: 13, fontFamily: 'Georgia,serif' }}>{m.emoji} {m.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 5 }}>
        {[['26', 'participantes'], [totalLogs, 'actividades'], [activeMembers, 'han registrado'], [getDayOfYear() + '/365', 'dia del ano']].map(([val, label]) => (
          <div key={label} style={{ flex: '0 0 auto', padding: '10px 18px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#FF6B35' }}>{val}</div>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <main style={{ position: 'relative', zIndex: 5, padding: '20px 16px', maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>

        {view === 'board' && !selectedMember && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {[['all', 'Todos 🌟'], ...Object.entries(CATEGORY_LABELS).map(([k, v]) => [k, v])].map(([cat, label]) => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{ flex: '0 0 auto', background: filterCat === cat ? (cat === 'all' ? 'rgba(255,107,53,0.2)' : CATEGORY_COLORS[cat] + '20') : 'rgba(255,255,255,0.04)', border: '1px solid ' + (filterCat === cat ? (cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat]) : 'rgba(255,255,255,0.1)'), borderRadius: 20, padding: '5px 12px', color: filterCat === cat ? (cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat]) : '#666', cursor: 'pointer', fontSize: 11, fontFamily: 'Georgia,serif' }}>{label}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {filtered.map((member, i) => {
                const md = getMD(member.id);
                const streak = getStreak(md.logs || []);
                const progress = md.progress || 0;
                const loggedToday = (md.logs || []).includes(getDateKey());
                const lastEntry = md.notes?.slice(-1)[0];
                const color = CATEGORY_COLORS[member.category];
                const isMe = currentUser === member.id;
                return (
                  <div key={member.id} onClick={() => setSelectedMember(member)} style={{ background: isMe ? 'rgba(255,107,53,0.07)' : 'rgba(255,255,255,0.025)', border: '1px solid ' + (isMe ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.07)'), borderRadius: 14, padding: 16, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{member.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{member.name}</div>
                          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color, marginTop: 1 }}>{CATEGORY_LABELS[member.category]}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {loggedToday && <div style={{ fontSize: 9, color: '#4ECDC4', letterSpacing: 1 }}>HOY</div>}
                        {streak > 0 && <div style={{ fontSize: 12, color: '#FFE66D' }}>🔥 {streak}</div>}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, marginBottom: 10 }}>
                      <div style={{ height: '100%', borderRadius: 4, width: progress + '%', background: 'linear-gradient(90deg,' + color + ',' + color + '88)' }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5 }}>{member.challenges[0]}{member.challenges.length > 1 && <span style={{ color: '#444' }}> +{member.challenges.length - 1}</span>}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: '#444' }}>
                      <span>{md.logs?.length || 0} registros</span><span>{progress}% avance</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === 'board' && selectedMember && (() => {
          const member = selectedMember;
          const md = getMD(member.id);
          const streak = getStreak(md.logs || []);
          const color = CATEGORY_COLORS[member.category];
          const isMe = currentUser === member.id;
          return (
            <div>
              <button onClick={() => { setSelectedMember(null); setSummary(''); }} style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0, fontFamily: 'Georgia,serif' }}>← tablero</button>
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
                    <div style={{ fontSize: 9, color: '#444' }}>racha dias</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  {[[md.logs?.length || 0, 'registros'], [md.progress || 0, '% avance'], [new Set(md.logs || []).size, 'dias unicos']].map(([v, l]) => (
                    <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 'bold', color }}>{v}</div>
                      <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => showSummary(member)} style={{ width: '100%', background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: 12, padding: '13px', color: '#4ECDC4', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia,serif', marginBottom: summary ? 0 : 20 }}>
                📈 Ver reporte de progreso
              </button>
              {summary && (
                <div style={{ margin: '12px 0 20px', padding: 16, background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: 12, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {summary}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Retos 2026</div>
                {member.challenges.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: color + '22', border: '1px solid ' + color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color, fontWeight: 'bold' }}>{i + 1}</div>
                    <div style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{c}</div>
                  </div>
                ))}
              </div>

              {md.notes?.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Historial</div>
                  {[...(md.notes || [])].reverse().slice(0, 20).map((n, i) => {
                    const resumen = Object.entries(n)
                      .filter(([k]) => !['date','ts','text'].includes(k))
                      .map(([k, v]) => v === true || v === 'true' ? k.replace(/_/g,' ') + ': si' : (v === false || v === 'false' || v === '') ? null : k.replace(/_/g,' ') + ': ' + v)
                      .filter(Boolean).join(' · ');
                    const isEditing = editingEntry === n.ts;
                    const canEdit = isMe;
                    return (
                      <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ fontSize: 10, color: '#444', flexShrink: 0, paddingTop: 2 }}>{n.date}</div>
                          <div style={{ flex: 1, fontSize: 13, color: '#bbb' }}>{resumen || n.text || '-'}</div>
                          {canEdit && !isEditing && (
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                              <button onClick={() => { setEditingEntry(n.ts); setEditValues({...n}); }}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: '3px 8px', color: '#888', cursor: 'pointer', fontSize: 11, fontFamily: 'Georgia,serif' }}>✏️</button>
                              <button onClick={() => { if (window.confirm('Borrar este registro?')) deleteEntry(member.id, n.ts); }}
                                style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 6, padding: '3px 8px', color: '#ff6b6b', cursor: 'pointer', fontSize: 11, fontFamily: 'Georgia,serif' }}>🗑️</button>
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <div style={{ marginTop: 12, padding: 14, background: 'rgba(255,107,53,0.06)', borderRadius: 10, border: '1px solid rgba(255,107,53,0.2)' }}>
                            <div style={{ fontSize: 11, color: '#FF6B35', marginBottom: 12, letterSpacing: 1 }}>EDITANDO REGISTRO</div>
                            {member.fields.map(field => (
                              <div key={field.key} style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{field.label}</div>
                                {field.type === 'yesno' && (
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    {['Si', 'No'].map(opt => (
                                      <button key={opt} onClick={() => setEditValues(prev => ({ ...prev, [field.key]: opt === 'Si' }))}
                                        style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid ' + (editValues[field.key] === (opt === 'Si') ? color : 'rgba(255,255,255,0.1)'), background: editValues[field.key] === (opt === 'Si') ? color + '22' : 'rgba(255,255,255,0.03)', color: editValues[field.key] === (opt === 'Si') ? color : '#888', cursor: 'pointer', fontFamily: 'Georgia,serif', fontSize: 13 }}>{opt}</button>
                                    ))}
                                  </div>
                                )}
                                {field.type === 'number' && (
                                  <input type='number' value={editValues[field.key] || ''} onChange={e => setEditValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#F0EDE8', fontSize: 14, fontFamily: 'Georgia,serif', boxSizing: 'border-box' }} />
                                )}
                                {field.type === 'text' && (
                                  <input type='text' value={editValues[field.key] || ''} onChange={e => setEditValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#F0EDE8', fontSize: 13, fontFamily: 'Georgia,serif', boxSizing: 'border-box' }} />
                                )}
                                {field.type === 'select' && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                    {field.options.map(opt => (
                                      <button key={opt} onClick={() => setEditValues(prev => ({ ...prev, [field.key]: opt }))}
                                        style={{ padding: '6px 12px', borderRadius: 16, border: '1px solid ' + (editValues[field.key] === opt ? color : 'rgba(255,255,255,0.1)'), background: editValues[field.key] === opt ? color + '22' : 'rgba(255,255,255,0.03)', color: editValues[field.key] === opt ? color : '#888', cursor: 'pointer', fontFamily: 'Georgia,serif', fontSize: 12 }}>{opt}</button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                              <button onClick={() => saveEditEntry(member.id, n.ts)}
                                style={{ flex: 1, background: '#FF6B35', border: 'none', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Guardar</button>
                              <button onClick={() => { setEditingEntry(null); setEditValues({}); }}
                                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: '10px', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Cancelar</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {view === 'ai' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: '#4ECDC4', textTransform: 'uppercase', marginBottom: 6 }}>Reportes</div>
              <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>Progreso del grupo</div>
              <div style={{ fontSize: 13, color: '#555' }}>Basado en los datos reales que cada quien registra</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#4ECDC4', textTransform: 'uppercase', marginBottom: 12 }}>Reporte grupal</div>
              <button onClick={showGroupSummary} style={{ width: '100%', background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: 10, padding: '14px', color: '#4ECDC4', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                📊 Generar reporte grupal
              </button>
              {groupSummary && (
                <div style={{ marginTop: 14, padding: 16, background: 'rgba(78,205,196,0.05)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: 10, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {groupSummary}
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 14 }}>Reporte individual</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {MEMBERS.map(member => {
                const md = getMD(member.id);
                const hasActivity = md.notes?.length > 0;
                const color = CATEGORY_COLORS[member.category];
                return (
                  <button key={member.id} onClick={() => { if (!hasActivity) return; setSelectedMember(member); setView('board'); setSummary(''); setTimeout(() => showSummary(member), 200); }}
                    style={{ background: hasActivity ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)', border: '1px solid ' + (hasActivity ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'), borderRadius: 12, padding: '14px 16px', cursor: hasActivity ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'Georgia,serif', display: 'flex', alignItems: 'center', gap: 12, opacity: hasActivity ? 1 : 0.4 }}>
                    <span style={{ fontSize: 24 }}>{member.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 'bold', color: '#F0EDE8' }}>{member.name}</div>
                      <div style={{ fontSize: 10, color: hasActivity ? color : '#444', marginTop: 2 }}>
                        {hasActivity ? md.notes.length + ' registros · ver reporte' : 'Sin actividad aun'}
                      </div>
                    </div>
                    {hasActivity && <span style={{ color: '#4ECDC4', fontSize: 16 }}>→</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === 'log' && (
          <div>
            {!currentUser ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Hola!</div>
                <div style={{ color: '#666', marginBottom: 24 }}>Primero dinos quien eres</div>
                <button onClick={() => setUserPicker(true)} style={{ background: 'rgba(255,107,53,0.2)', border: '1px solid #FF6B35', borderRadius: 12, padding: '14px 28px', color: '#FF6B35', cursor: 'pointer', fontSize: 15, fontFamily: 'Georgia,serif' }}>Seleccionar mi perfil</button>
              </div>
            ) : (() => {
              const member = MEMBERS.find(m => m.id === currentUser);
              const md = getMD(currentUser);
              const streak = getStreak(md.logs || []);
              const color = CATEGORY_COLORS[member.category];
              const loggedToday = (md.logs || []).includes(getDateKey());
              return (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{member.emoji}</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>🔥 {streak} dias de racha · {md.logs?.length || 0} registros totales</div>
                    {loggedToday && <div style={{ marginTop: 8, fontSize: 12, color: '#4ECDC4' }}>Ya registraste hoy</div>}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#FF6B35', marginBottom: 18, textTransform: 'uppercase' }}>
                      {loggedToday ? 'Agregar otro registro de hoy' : 'Registro de hoy'}
                    </div>

                    {member.fields.map(field => (
                      <div key={field.key} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{field.label}{field.unit ? ' (' + field.unit + ')' : ''}</div>
                        {field.type === 'yesno' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            {['Si', 'No'].map(opt => (
                              <button key={opt} onClick={() => setFieldValues(prev => ({ ...prev, [field.key]: opt === 'Si' }))}
                                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid ' + (fieldValues[field.key] === (opt === 'Si') ? color : 'rgba(255,255,255,0.1)'), background: fieldValues[field.key] === (opt === 'Si') ? color + '22' : 'rgba(255,255,255,0.03)', color: fieldValues[field.key] === (opt === 'Si') ? color : '#888', cursor: 'pointer', fontFamily: 'Georgia,serif', fontSize: 14 }}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                        {field.type === 'number' && (
                          <input type='number' value={fieldValues[field.key] || ''} onChange={e => setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder='0'
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#F0EDE8', fontSize: 16, fontFamily: 'Georgia,serif', boxSizing: 'border-box' }} />
                        )}
                        {field.type === 'text' && (
                          <input type='text' value={fieldValues[field.key] || ''} onChange={e => setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder='...'
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#F0EDE8', fontSize: 14, fontFamily: 'Georgia,serif', boxSizing: 'border-box' }} />
                        )}
                        {field.type === 'select' && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {field.options.map(opt => (
                              <button key={opt} onClick={() => setFieldValues(prev => ({ ...prev, [field.key]: opt }))}
                                style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid ' + (fieldValues[field.key] === opt ? color : 'rgba(255,255,255,0.1)'), background: fieldValues[field.key] === opt ? color + '22' : 'rgba(255,255,255,0.03)', color: fieldValues[field.key] === opt ? color : '#888', cursor: 'pointer', fontFamily: 'Georgia,serif', fontSize: 13 }}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <button onClick={() => submitActivity(currentUser)} disabled={saving} style={{ width: '100%', background: saving ? '#222' : 'linear-gradient(135deg, #FF6B35, #ff8f5e)', border: 'none', borderRadius: 12, padding: '16px', color: '#fff', fontSize: 16, fontWeight: 'bold', cursor: saving ? 'default' : 'pointer', fontFamily: 'Georgia,serif', marginTop: 8 }}>
                      {saving ? 'Guardando...' : 'Registrar ✓'}
                    </button>
                    {showSuccess && <div style={{ marginTop: 12, textAlign: 'center', color: '#4ECDC4', fontSize: 14 }}>Guardado para todos! 🎉</div>}
                  </div>

                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Mis retos</div>
                  {member.challenges.map((c, i) => (
                    <div key={i} style={{ padding: '10px 14px', marginBottom: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 10, borderLeft: '3px solid ' + color, fontSize: 13, color: '#bbb' }}>{c}</div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      <style>{`
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
