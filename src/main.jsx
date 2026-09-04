import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight, ArrowUpRight, Instagram, Menu, X, Sparkles,
  Smartphone, Globe2, Utensils, Target, Palette, Play, ChevronRight
} from "lucide-react";
import "./styles.css";

const clients = [
  { name: "Sindpetshop-SP", handle: "@sindpetshop_sp", url: "https://www.instagram.com/sindpetshop_sp/" },
  { name: "Pizzaria Venâncio", handle: "@pizzariavenancio", url: "https://www.instagram.com/pizzariavenancio/" },
  { name: "SEON", handle: "@seon.co", url: "https://www.instagram.com/seon.co/" },
  { name: "CZK Drills", handle: "@czkdrills", url: "https://www.instagram.com/czkdrills/" },
  { name: "MIBIS Dog", handle: "@mibisdog", url: "https://www.instagram.com/mibisdog/" },
  { name: "Eventos Publi", handle: "@eventospubli", url: "https://www.instagram.com/eventospubli/" },
  { name: "Eazy Club", handle: "@eazyclubperus_", url: "https://www.instagram.com/eazyclubperus_/" },
  { name: "Salseiro Lounge", handle: "@salseiro.lounge", url: "https://www.instagram.com/salseiro.lounge/" },
  { name: "DJ Pufinho", handle: "@djpufinho", url: "https://www.instagram.com/djpufinho/" },
  { name: "Sabor do Sul", handle: "@sabordosul_marmitaria", url: "https://www.instagram.com/sabordosul_marmitaria/" }
];

const services = [
  { icon: Smartphone, title: "Redes sociais", text: "Conteúdo que faz sua marca ser percebida.", tag: "SOCIAL" },
  { icon: Globe2, title: "Sites & LPs", text: "Experiências digitais pensadas para converter.", tag: "WEB" },
  { icon: Utensils, title: "Cardápios digitais", text: "Apresente seus produtos com muito mais valor.", tag: "DIGITAL" },
  { icon: Target, title: "Tráfego pago", text: "Estratégia para colocar sua marca diante das pessoas certas.", tag: "ADS" },
  { icon: Palette, title: "Identidade visual", text: "Uma marca que transmite o nível do seu negócio.", tag: "BRANDING" },
  { icon: Play, title: "Conteúdo & vídeo", text: "Peças visuais que transformam atenção em interesse.", tag: "CONTENT" }
];

function App() {
  const [menu, setMenu] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsapp = "https://wa.me/551197149-3985?text=Ol%C3%A1%2C%20Karen!%20Conheci%20a%20Seeven%20e%20quero%20conversar%20sobre%20um%20projeto.";

  return (
    <div className="app">
      <div className="noise" />
      <header className={scroll > 20 ? "header scrolled" : "header"}>
        <a className="brand" href="#top" aria-label="Seeven Projects">
          <span className="brand-mark">V</span>
          <span>SEEVEN<span className="muted">/PROJECTS</span></span>
        </a>

        <nav className={menu ? "nav open" : "nav"}>
          <a href="#work" onClick={() => setMenu(false)}>Projetos</a>
          <a href="#services" onClick={() => setMenu(false)}>Soluções</a>
          <a href="#case" onClick={() => setMenu(false)}>Case</a>
          <a className="nav-cta" href={whatsapp}>Falar com Karen <ArrowUpRight size={15}/></a>
        </nav>

        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">
          {menu ? <X/> : <Menu/>}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-orb orb-a" />
          <div className="hero-orb orb-b" />
          <div className="hero-grid" />

          <div className="hero-content">
            <div className="eyebrow"><span className="dot"/> DIGITAL, BUT DIFFERENT.</div>
            <h1>Sua marca merece<br/><em>impacto.</em></h1>
            <p className="hero-copy">
              Marketing, design e tecnologia para transformar negócios
              em experiências digitais que as pessoas lembram.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#work">Explorar a Seeven <ArrowDownRight size={18}/></a>
              <a className="text-link" href={whatsapp}>Quero falar com a Karen <ArrowUpRight size={16}/></a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="v-stage">
              <div className="v-glow"/>
              <div className="v-ring ring-1"/>
              <div className="v-ring ring-2"/>
              <div className="v-letter">V</div>
              <div className="float-card card-top"><span>STRATEGY</span><strong>01</strong></div>
              <div className="float-card card-bottom"><span>DESIGN</span><strong>07</strong></div>
            </div>
          </div>

          <div className="scroll-note"><span/> role para explorar</div>
        </section>

        <section className="manifesto section">
          <div className="section-label">01 / MANIFESTO</div>
          <div>
            <h2>Não é sobre estar<br/><span>online.</span></h2>
            <p className="big-copy">
              É sobre fazer alguém parar, olhar e pensar:
              <strong> “eu quero isso para a minha marca.”</strong>
            </p>
          </div>
        </section>

        <section id="services" className="services section">
          <div className="section-head">
            <div>
              <div className="section-label">02 / SOLUÇÕES</div>
              <h2>O que sua marca<br/><span>poderia ser?</span></h2>
            </div>
            <p>Você não precisa contratar tudo.<br/>Precisa resolver o que importa.</p>
          </div>

          <div className="services-layout">
            <div className="service-list">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.title}
                    className={activeService === i ? "service active" : "service"}
                    onMouseEnter={() => setActiveService(i)}
                    onClick={() => setActiveService(i)}
                  >
                    <span className="service-icon"><Icon size={19}/></span>
                    <span className="service-text"><small>{s.tag}</small><strong>{s.title}</strong></span>
                    <ChevronRight className="service-arrow" size={19}/>
                  </button>
                )
              })}
            </div>

            <div className="service-demo">
              <div className="demo-glow"/>
              <div className="demo-label">{services[activeService].tag}</div>
              <div className="demo-phone">
                <div className="phone-notch"/>
                <div className="phone-ui">
                  <div className="mini-top"><span>SEEVEN</span><span>•••</span></div>
                  <div className="mini-visual"/>
                  <div className="mini-lines"><i/><i/><i/></div>
                  <div className="mini-button">{services[activeService].title.toUpperCase()}</div>
                </div>
              </div>
              <div className="demo-copy">
                <span>EXPERIÊNCIA DIGITAL</span>
                <h3>{services[activeService].title}</h3>
                <p>{services[activeService].text}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="work section">
          <div className="section-label">03 / PROJETOS</div>
          <div className="work-title-row">
            <h2>Algumas marcas<br/><span>que já passaram por aqui.</span></h2>
            <p>Veja o trabalho diretamente nos perfis.</p>
          </div>

          <div className="client-grid">
            {clients.map((c, i) => (
              <a className="client-card" href={c.url} target="_blank" rel="noreferrer" key={c.name}>
                <div className="client-number">0{i + 1}</div>
                <div className="client-avatar">{c.name.charAt(0)}</div>
                <div className="client-info"><strong>{c.name}</strong><span>{c.handle}</span></div>
                <Instagram size={17}/>
                <ArrowUpRight className="client-go" size={17}/>
              </a>
            ))}
          </div>
        </section>

        <section id="case" className="case section">
          <div className="case-backdrop"/>
          <div className="section-label">04 / CASE STUDY</div>
          <div className="case-intro">
            <span className="case-kicker">SINDPETSHOP-SP</span>
            <h2>Comunicação sindical<br/><span>não é fácil.</span></h2>
            <p>Mesmo em um nicho complexo, estratégia e conteúdo podem transformar atenção em presença.</p>
          </div>

          <div className="stats">
            <div className="stat"><strong>22,2<span>K</span></strong><small>VISUALIZAÇÕES</small><em>+45,9%</em></div>
            <div className="stat"><strong>5,1<span>K</span></strong><small>PESSOAS ALCANÇADAS</small><em>+41,7%</em></div>
            <div className="stat"><strong>600</strong><small>INTERAÇÕES</small><em>+12,4%</em></div>
            <div className="stat featured"><strong>16<span>%</span></strong><small>DE NOVOS PÚBLICOS</small><em>VISUALIZAÇÕES DE NÃO SEGUIDORES</em></div>
          </div>

          <div className="case-note">
            <Sparkles size={17}/>
            <span>Dados apresentados como exemplo de desempenho. Resultados variam conforme estratégia, período e investimento.</span>
          </div>
        </section>

        <section className="cta section">
          <div className="cta-orb"/>
          <div className="section-label">05 / PRÓXIMO PROJETO</div>
          <h2>E se o próximo<br/><span>fosse o seu?</span></h2>
          <p>Conte o que você gostaria de melhorar. A gente encontra o caminho digital.</p>
          <a className="button primary large" href={whatsapp}>Conversar com a Karen <ArrowUpRight size={19}/></a>
          <div className="cta-sign">KAREN <span>/ ASSESSORA SEEVEN</span></div>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark">V</span><span>SEEVEN<span className="muted">/PROJECTS</span></span></div>
        <span>© {new Date().getFullYear()} Seeven Projects</span>
        <a href="https://www.instagram.com/see_7_ven/" target="_blank" rel="noreferrer"><Instagram size={16}/> @see_7_ven</a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);