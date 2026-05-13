import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, BarChart3, Factory, Gauge, LineChart, MapPin, ShieldCheck, ClipboardCheck, TrendingUp, Wheat, CheckCircle2 } from 'lucide-react';
import './styles.css';

const sectors = ['Frigoríficos', 'Feedlots', 'Molinos', 'Plantas alimentarias', 'Lácteos', 'Establecimientos agropecuarios'];
const pains = ['Costos que suben sin explicación operativa clara', 'Decisiones apoyadas en planillas dispersas', 'Dependencia excesiva de personas clave', 'Producción, logística y administración trabajando desalineadas'];
const services = [
  { icon: ClipboardCheck, title: 'Diagnóstico de Rentabilidad Operativa', text: 'Un proceso corto y concreto para detectar pérdidas, cuellos de botella y oportunidades de mejora medibles.' },
  { icon: BarChart3, title: 'Dashboards de KPIs operativos', text: 'Indicadores útiles para dirección y planta: producción, costos, logística, eficiencia y cumplimiento.' },
  { icon: Gauge, title: 'Sistema de gestión para planta', text: 'Rutinas, tableros y seguimiento para que la operación deje de depender de urgencias y memoria informal.' },
];
const steps = ['Relevamiento rápido del proceso y datos disponibles', 'Análisis de pérdidas, costos, capacidad y puntos críticos', 'Priorización de mejoras por impacto y facilidad de ejecución', 'Plan de acción con tablero de seguimiento'];

function App(){
  return <>
    <header className="nav">
      <a className="brand" href="#top"><span>MV</span><strong>Manuel Vasena</strong></a>
      <nav><a href="#servicios">Servicios</a><a href="#metodo">Método</a><a href="#contacto">Contacto</a></nav>
    </header>

    <main id="top">
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow"><MapPin size={16}/> Córdoba, Argentina · Consultoría agroindustrial</p>
          <h1>Más control, rentabilidad y capacidad de ejecución para empresas agroindustriales.</h1>
          <p className="lead">Ayudo a frigoríficos, feedlots, molinos y plantas alimentarias a ordenar procesos, costos, logística y gestión operativa sin agregar complejidad innecesaria.</p>
          <div className="actions">
            <a className="btn primary" href="mailto:mvasena1@gmail.com?subject=Pre%20Diagn%C3%B3stico%20Express">Solicitar Pre Diagnóstico <ArrowRight size={18}/></a>
            <a className="btn secondary" href="#servicios">Ver enfoque</a>
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
        <div className="grid3">{services.map(({icon:Icon,title,text}) => <article className="card" key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="metodo" className="section split">
        <div><p className="eyebrow"><LineChart size={16}/> Método</p><h2>Diagnóstico claro, números accionables y ejecución posible.</h2><p>El foco no es producir informes largos: es encontrar los pocos puntos que explican la mayor parte de la pérdida o desorden operativo, y convertirlos en decisiones.</p></div>
        <div className="timeline">{steps.map((s,i)=><div className="step" key={s}><b>{String(i+1).padStart(2,'0')}</b><span>{s}</span></div>)}</div>
      </section>

      <section className="section impact">
        <Wheat/><h2>Especializado en pymes y empresas familiares del agro.</h2><p>Trabajo con organizaciones que crecieron, ganaron complejidad y necesitan profesionalizar la gestión sin perder velocidad ni sentido práctico.</p>
      </section>

      <section id="contacto" className="cta">
        <div><p className="eyebrow"><TrendingUp size={16}/> Próximo paso</p><h2>Empezá por un Pre Diagnóstico Express.</h2><p>Una primera lectura para entender si hay oportunidades reales de mejora en costos, procesos, logística o gestión.</p></div>
        <a className="btn primary light" href="mailto:mvasena1@gmail.com?subject=Pre%20Diagn%C3%B3stico%20Express">Escribirme <ArrowRight size={18}/></a>
      </section>
    </main>
    <footer>© {new Date().getFullYear()} Manuel Vasena Consultoría · Optimización operativa agroindustrial</footer>
  </>
}

createRoot(document.getElementById('root')).render(<App/>);
