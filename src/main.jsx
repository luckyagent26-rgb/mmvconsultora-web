import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, BarChart3, Factory, Gauge, LineChart, MapPin, ShieldCheck, ClipboardCheck, TrendingUp, Wheat, CheckCircle2, Bot, Newspaper, FileText, Upload, Eye, Download } from 'lucide-react';
import './styles.css';

const sectors = ['Frigoríficos', 'Feedlots', 'Molinos', 'Plantas alimentarias', 'Lácteos', 'Establecimientos agropecuarios'];
const pains = ['Costos que suben sin explicación operativa clara', 'Decisiones apoyadas en planillas dispersas', 'Dependencia excesiva de personas clave', 'Producción, logística y administración trabajando desalineadas'];
const PRE_DIAGNOSTICO_URL = 'https://chatgpt.com/g/g-69f103d074c48191a1eb8cad0f4bc571-pre-diagnostivo-de-eficiencia-operativa';
const WHATSAPP_URL = 'https://wa.me/5493515724901?text=Hola%20Manuel%2C%20quiero%20usar%20el%20Pre%20Diagn%C3%B3stico%20Express.%20%C2%BFMe%20pas%C3%A1s%20la%20contrase%C3%B1a%20de%20uso%3F';
const CONTACT_URL = 'https://wa.me/5493515724901?text=Hola%20Manuel%2C%20quiero%20conversar%20sobre%20una%20mejora%20operativa%20para%20mi%20empresa.';
const LINKEDIN_URL = 'https://ar.linkedin.com/in/manuelvasena';
const NEWSLETTER_URL = 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7457802799171665921';

const services = [
  { icon: ClipboardCheck, title: 'Diagnóstico de Rentabilidad Operativa', text: 'Un proceso corto y concreto para detectar pérdidas, cuellos de botella y oportunidades de mejora medibles.' },
  { icon: BarChart3, title: 'Dashboards de KPIs operativos', text: 'Indicadores útiles para dirección y planta: producción, costos, logística, eficiencia y cumplimiento.' },
  { icon: Gauge, title: 'Sistema de gestión para planta', text: 'Rutinas, tableros y seguimiento para que la operación deje de depender de urgencias y memoria informal.' },
  { icon: Bot, title: 'Agentes personalizados para eficiencia operativa', text: 'Agentes de IA simples para ordenar información, automatizar seguimientos, generar reportes y acompañar rutinas de gestión sin sumar burocracia.', featured: true },
];
const agentUseCases = ['Automatización de reportes operativos', 'Seguimiento de tareas y responsables', 'Lectura y resumen de partes diarios', 'Alertas sobre KPIs críticos', 'Asistentes internos para procedimientos', 'Integración simple con planillas, WhatsApp, formularios o dashboards'];
const steps = ['Relevamiento rápido del proceso y datos disponibles', 'Análisis de pérdidas, costos, capacidad y puntos críticos', 'Priorización de mejoras por impacto y facilidad de ejecución', 'Plan de acción con tablero de seguimiento'];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

function PdfResources() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ password: '', title: '', file: null });

  async function loadPdfs() {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/pdfs');
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudieron cargar los PDFs.');
      setPdfs(data.pdfs || []);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPdfs();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.file) {
      setStatus('Seleccioná un PDF.');
      return;
    }
    if (form.file.type && form.file.type !== 'application/pdf') {
      setStatus('Solo se pueden cargar archivos PDF.');
      return;
    }
    setStatus('Cargando PDF...');
    try {
      const content = await fileToDataUrl(form.file);
      const response = await fetch('/.netlify/functions/pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: form.password,
          title: form.title,
          filename: form.file.name,
          content,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudo cargar el PDF.');
      setForm({ password: form.password, title: '', file: null });
      event.currentTarget.reset();
      setStatus('PDF cargado correctamente.');
      await loadPdfs();
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section id="recursos" className="section resources">
      <div className="sectionHead">
        <p className="eyebrow"><FileText size={16}/> Recursos PDF</p>
        <h2>Documentos para ver online o descargar.</h2>
        <p>Materiales, guías y documentos que comparto con clientes y contactos. Podés abrirlos en el navegador o descargarlos para leerlos después.</p>
      </div>

      <div className="resourcePanel">
        <div className="pdfGrid">
          {loading ? <p className="emptyState">Cargando documentos...</p> : null}
          {!loading && !pdfs.length ? <p className="emptyState">Todavía no hay PDFs publicados.</p> : null}
          {pdfs.map(pdf => (
            <article className="pdfCard" key={pdf.id}>
              <div className="pdfIcon"><FileText size={26}/></div>
              <div>
                <h3>{pdf.title}</h3>
                <p>{pdf.filename} · {formatFileSize(pdf.size)}</p>
                <div className="pdfLinks">
                  <a href={pdf.viewUrl} target="_blank" rel="noreferrer"><Eye size={17}/> Ver online</a>
                  <a href={pdf.downloadUrl}><Download size={17}/> Descargar</a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <details className="uploadPanel">
          <summary><Upload size={17}/> Cargar nuevo PDF</summary>
          <form onSubmit={handleSubmit}>
            <label>Clave de carga<input type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} required /></label>
            <label>Título visible<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Ej: Guía de diagnóstico operativo" /></label>
            <label>Archivo PDF<input type="file" accept="application/pdf,.pdf" onChange={event => setForm({ ...form, file: event.target.files?.[0] || null })} required /></label>
            <button className="btn primary" type="submit">Subir PDF</button>
            {status ? <p className="uploadStatus">{status}</p> : null}
          </form>
        </details>
      </div>
    </section>
  );
}

function App(){
  return <>
    <header className="nav">
      <a className="brand" href="#top"><span>MV</span><strong>Manuel Vasena</strong></a>
      <nav><a href="#servicios">Servicios</a><a href="#sobre-mi">Sobre mí</a><a href="#newsletter">Newsletter</a><a href="#recursos">PDFs</a><a href="#contacto">Contacto</a></nav>
    </header>

    <main id="top">
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow"><MapPin size={16}/> Córdoba, Argentina · Consultoría agroindustrial</p>
          <h1>Más control, rentabilidad y capacidad de ejecución para empresas del agro y la agroindustria.</h1>
          <p className="lead">Ayudo a empresas familiares y pymes del agro, frigoríficos, feedlots, molinos y plantas alimentarias a ordenar procesos, costos, logística y gestión operativa sin agregar complejidad innecesaria.</p>
          <div className="actions">
            <a className="btn primary" href={CONTACT_URL} target="_blank" rel="noreferrer">Contacto <ArrowRight size={18}/></a>
            <a className="btn secondary" href={PRE_DIAGNOSTICO_URL} target="_blank" rel="noreferrer">Abrir Pre Diagnóstico</a>
          </div>
          <div className="proof"><ShieldCheck size={18}/> +15 años en operaciones agroindustriales e industriales</div>
        </div>
        <aside className="card audit">
          <p className="label">Pre Diagnóstico Express</p>
          <h2>¿Dónde se está escapando margen?</h2>
          <ul>{pains.map(p => <li key={p}><CheckCircle2 size={18}/>{p}</li>)}</ul>
        </aside>
      </section>

      <section className="strip">{sectors.map(s => <span key={s}>{s}</span>)}</section>

      <section id="servicios" className="section">
        <div className="sectionHead"><p className="eyebrow"><Factory size={16}/> Servicios</p><h2>Consultoría práctica para operaciones que ya no pueden gestionarse “a ojo”.</h2></div>
        <div className="grid3">{services.map(({icon:Icon,title,text,featured}) => <article className={`card ${featured ? 'featuredService' : ''}`} key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="agentes" className="section agents">
        <div>
          <p className="eyebrow"><Bot size={16}/> Digitalización aplicada</p>
          <h2>Agentes personalizados para eficiencia operativa.</h2>
          <p>Diseño agentes de IA simples y personalizados para que tu empresa pueda convertir datos dispersos, mensajes, planillas y rutinas operativas en reportes, alertas y acciones concretas.</p>
          <p className="agentCta">Si tu operación depende de WhatsApps, planillas y personas clave, un agente bien diseñado puede ayudarte a recuperar control.</p>
        </div>
        <ul>{agentUseCases.map(item => <li key={item}><CheckCircle2 size={18}/>{item}</li>)}</ul>
      </section>


      <section id="sobre-mi" className="section about">
        <div className="aboutCard">
          <div className="aboutInitials">MV</div>
          <div>
            <p className="eyebrow"><ShieldCheck size={16}/> Sobre mí</p>
            <h2>Manuel Vasena</h2>
            <p className="aboutLead">Soy Ingeniero Agrónomo, MBA y consultor independiente de optimización operativa para el agro y la agroindustria, con base en Córdoba, Argentina.</p>
            <p>Trabajo con empresas familiares y pymes del agro, ganadería y agroindustria para ordenar procesos, costos, logística, KPIs y rutinas de gestión. Mi foco es detectar pérdidas concretas y convertirlas en decisiones simples, medibles y ejecutables.</p>
            <div className="aboutFacts">
              <span>Ingeniero Agrónomo · MBA</span>
              <span>+15 años en operaciones agroindustriales e industriales</span>
              <span>Frigoríficos · Feedlots · Molinos · Lácteos · Alimentos</span>
              <span>Córdoba, Argentina · Trabajo regional LatAm</span>
            </div>
            <div className="aboutLinks">
              <a href={CONTACT_URL} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="mailto:mmvasena@gmail.com">mmvasena@gmail.com</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="section newsletter">
        <div className="newsletterCopy">
          <p className="eyebrow"><Newspaper size={16}/> Newsletter semanal</p>
          <h2>Cómo crecer con rentabilidad.</h2>
          <p>Casos reales, desorden operativo y señales que muchas pymes no ven cuando crecen. Comparto historias de empresas que aumentan ventas, ganan complejidad y necesitan recuperar control sin perder velocidad.</p>
          <a className="btn primary" href={NEWSLETTER_URL} target="_blank" rel="noreferrer">Leer en LinkedIn <ArrowRight size={18}/></a>
        </div>
        <article className="newsletterCard">
          <span>LinkedIn Newsletter</span>
          <h3>Historias de clientes, aprendizajes operativos y crecimiento rentable.</h3>
          <p>Una lectura semanal para dueños, directores y equipos de pymes agroindustriales que quieren detectar fugas de margen antes de que se vuelvan costumbre.</p>
        </article>
      </section>

      <PdfResources />

      <section id="metodo" className="section split">
        <div><p className="eyebrow"><LineChart size={16}/> Método</p><h2>Diagnóstico claro, números accionables y ejecución posible.</h2><p>El foco no es producir informes largos: es encontrar los pocos puntos que explican la mayor parte de la pérdida o desorden operativo, y convertirlos en decisiones.</p></div>
        <div className="timeline">{steps.map((s,i)=><div className="step" key={s}><b>{String(i+1).padStart(2,'0')}</b><span>{s}</span></div>)}</div>
      </section>

      <section className="section impact">
        <Wheat/><h2>Especializado en pymes y empresas familiares del agro.</h2><p>Trabajo con organizaciones que crecieron, ganaron complejidad y necesitan profesionalizar la gestión sin perder velocidad ni sentido práctico.</p>
      </section>

      <section id="contacto" className="cta">
        <div><p className="eyebrow"><TrendingUp size={16}/> Próximo paso</p><h2>Empezá por un Pre Diagnóstico Express.</h2><p>Una primera lectura para entender si hay oportunidades reales de mejora en costos, procesos, logística o gestión. Para usarlo, escribime por WhatsApp y te paso la contraseña de uso.</p></div>
        <div className="ctaActions"><a className="btn primary light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Pedir contraseña <ArrowRight size={18}/></a><a className="btn ghostLight" href={PRE_DIAGNOSTICO_URL} target="_blank" rel="noreferrer">Abrir Pre Diagnóstico</a></div>
      </section>
    </main>
    <a className="mobileSticky" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Pedir contraseña por WhatsApp <ArrowRight size={17}/></a>
    <footer>© {new Date().getFullYear()} Manuel Vasena Consultoría · Optimización operativa agroindustrial</footer>
  </>
}

createRoot(document.getElementById('root')).render(<App/>);
