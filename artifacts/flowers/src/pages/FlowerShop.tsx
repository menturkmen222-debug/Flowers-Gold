import { useEffect, useRef, useState } from "react";

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function daysUntil(month: number, day: number): number {
  const now = new Date();
  let target = new Date(now.getFullYear(), month - 1, day);
  if (target < now) target = new Date(now.getFullYear() + 1, month - 1, day);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const collections = [
  { id: "love", emoji: "❤️", name: "Söýgi & Romantika", desc: "Ýüregiňizdäki duýgulary beýan ediň. Gyzyl güller, ýuwaş reňkler, serêntäk gaplama.", items: "45+ görnüş", priceFrom: "85", tag: "Iň Meşhur", wide: true },
  { id: "wedding", emoji: "💍", name: "Toý & Nikaý", desc: "Ömrüňiziň iň möhüm gününde. Gelin buketi, zal bezegi, süpürenç gülleri.", items: "30+ paket", priceFrom: "250", tag: "Premium", wide: true },
  { id: "birthday", emoji: "🎂", name: "Doglan Gün", desc: "Ýakynlaryňyzy begendiriň. Ýaşyna we zowkuna görä özboluşly buketi.", items: "60+ görnüş", priceFrom: "55", tag: "Her Ýaş Üçin", wide: false },
  { id: "corporate", emoji: "🏢", name: "Korporatiw", desc: "Ofis bezegi, konferensiýa gülleri, iş partnýorlaryna sowgat çözgütleri.", items: "Aýratyn dizaýn", priceFrom: "200", tag: "B2B", wide: false },
  { id: "sympathy", emoji: "🕊️", name: "Hormat & Sadaka", desc: "Kyn wagtlarda ýanyňyzda bolmak. Içgin we hormatly çemenler.", items: "20+ görnüş", priceFrom: "70", tag: "Inçe", wide: false },
  { id: "seasonal", emoji: "🌸", name: "Möwsümleýin", desc: "Bahar, tomus, güýz we gyş. Her möwsümiň iň owadan gülleri.", items: "Möwsüme görä", priceFrom: "45", tag: "Täze", wide: false },
  { id: "boxes", emoji: "🎁", name: "Sowgat Gutulary", desc: "Güller + şokolad + yşk şemi + şahsy hat. Doly duýgy bukjasy.", items: "25+ kombinasiýa", priceFrom: "120", tag: "Doly Set", wide: true },
  { id: "subscription", emoji: "📅", name: "Abuna Hyzmat", desc: "Her hepde ýa-da her aý öýüňize täze güller geler. Awtomatik bagtlylyk.", items: "Aýlyk / Hepdelik", priceFrom: "180", tag: "🔥 Täzelik", wide: true },
];

const products = [
  { id: 1, name: "Gyzyl Gül Neoklassik", category: "love", flowers: "51 gyzyl gül", size: "Uly", price: 185, oldPrice: 220, badge: "🔥 Iň Köp Satylýan", emoji: "🌹", gradient: "linear-gradient(135deg, #1a0010, #3d0020)" },
  { id: 2, name: "Ak Lale Arzuw", category: "wedding", flowers: "25 ak lale + pip", size: "Orta", price: 145, oldPrice: null, badge: "💍 Toý Saýlawy", emoji: "🌷", gradient: "linear-gradient(135deg, #0d0010, #200015)" },
  { id: 3, name: "Pastel Buket Sürprizi", category: "birthday", flowers: "Garylyk pastel güller", size: "Orta", price: 95, oldPrice: 115, badge: "🎂 Doglan Gün Hit", emoji: "💐", gradient: "linear-gradient(135deg, #130010, #280025)" },
  { id: 4, name: "Premium Sowgat Gutusy", category: "gift", flowers: "Güller + Ferrero + Şem", size: "Premium", price: 245, oldPrice: null, badge: "⭐ Premium", emoji: "🎁", gradient: "linear-gradient(135deg, #100d00, #201800)" },
  { id: 5, name: "Lüks Gelin Buketi", category: "wedding", flowers: "Awen + Gül + Pip", size: "Toý", price: 380, oldPrice: null, badge: "💎 Lýuks", emoji: "👰", gradient: "linear-gradient(135deg, #0a0808, #1a1015)" },
  { id: 6, name: "Gün Şöhlesi Buketi", category: "birthday", flowers: "Gün gülü + Sary güller", size: "Kiçi", price: 65, oldPrice: 80, badge: "☀️ Şadyýan", emoji: "🌻", gradient: "linear-gradient(135deg, #100a00, #201200)" },
  { id: 7, name: "Korporatiw Stol Bezegi", category: "corporate", flowers: "Ak + Ýaşyl garylyk", size: "Ofis", price: 120, oldPrice: null, badge: "🏢 B2B", emoji: "🌿", gradient: "linear-gradient(135deg, #050a08, #0d1510)" },
  { id: 8, name: "Möwsüm Sürpriz Buketi", category: "seasonal", flowers: "Florist saýlawy", size: "Orta", price: 75, oldPrice: null, badge: "🌸 Täze", emoji: "🌺", gradient: "linear-gradient(135deg, #080010, #120018)" },
  { id: 9, name: "100 Gül Premium Galpak", category: "love", flowers: "100 dürli reňkli gül", size: "Uly-Premium", price: 420, oldPrice: 500, badge: "❤️ Wau Effekt", emoji: "🎪", gradient: "linear-gradient(135deg, #140010, #2a0020)" },
  { id: 10, name: "Ýatlamaçy Çemen Gutusy", category: "sympathy", flowers: "Ak we mawy güller", size: "Orta", price: 115, oldPrice: null, badge: "🕊️ Hormat", emoji: "💙", gradient: "linear-gradient(135deg, #050810, #0a1018)" },
  { id: 11, name: "Söýgi Sandyk Sowgat", category: "gift", flowers: "Sandyk + Güller + Şokolad + Parfum", size: "Premium Set", price: 350, oldPrice: 420, badge: "💝 Bestseller", emoji: "🧺", gradient: "linear-gradient(135deg, #120008, #220012)" },
  { id: 12, name: "Hepdelik Ofis Abunasy", category: "corporate", flowers: "Her hepde awtomatik", size: "Abuna", price: 280, oldPrice: null, badge: "📅 Abuna", emoji: "📅", gradient: "linear-gradient(135deg, #080510, #120a1a)" },
];

const florists = [
  { name: "Maýagül Nurlyýewa", title: "Baş Florist & Dizaýner", exp: "9 Ýyl", specialty: "Toý & Lýuks Bukety", cert: "Ýewropa Sertifikatly", emoji: "👩‍🌾", achievement: "500+ Toý Buketi", quote: "Her gül öz dilinde gürleýär. Men diňe terjimeçi." },
  { name: "Güljeren Orazowa", title: "Korporatiw Florist", exp: "6 Ýyl", specialty: "Ofis & Çäre Bezegi", cert: "B2B Hünärmen", emoji: "💼", achievement: "200+ Korporatiw Müşderi", quote: "Içerki bezeg işiň dilidir." },
  { name: "Leýli Annagylyjowa", title: "Söýgi Buketi Spesialisti", exp: "7 Ýyl", specialty: "Romantik Çemenler", cert: "Floristika Ussady", emoji: "💝", achievement: "1000+ Söýgi Buketi", quote: "Güller söz bilen düşündirip bolmajak zady aýdýar." },
  { name: "Aýgözel Durdyýewa", title: "Kreatiw Dizaýner", exp: "4 Ýyl", specialty: "Eksperimental & Täze Görnüş", cert: "Halkara Bäsleşik Ýeňijisi", emoji: "🎨", achievement: "3x Bäsleşik Baýragy", quote: "Floristika — bu janly sungat." },
];

const testimonials = [
  { name: "Aýna Çaryýewa", role: "Täze gelni", rating: 5, occasion: "Toý Buketi", emoji: "👰", result: "Ömrümüň iň owadan güni", text: "Toý buketime seredip ağlamaga başladym. Maýagül hanym meniň arzuwymdan hem owadan bir zat döretdi. Her fotosuratyma seredenimdä ony görýärin.", date: "2 hepde öň" },
  { name: "Serdar Rejepow", role: "Söýgüli", rating: 5, occasion: "Söýgi Sürprizi", emoji: "💑", result: "Ony geň galdyrdym!", text: "Aýalym wagtynda gapysyna gelende ynanamady. Güller şeýle täze we owadandy! 'Bu näme?' diýip ağlady. Bu dükany söýgüni mümkin edýär.", date: "1 aý öň" },
  { name: "Läle Atamyradowa", role: "Ofis Dolandyryjysy", rating: 5, occasion: "Hepdelik Abuna", emoji: "🏢", result: "Ofisimiz syrça boldy", text: "Her duşenbe irden täze güller gelýär. Işgärlerimiz we müşderilerimiz ofisimizde hemişe gülläp duran güllere haýranlar. Hyzmatdaşlygymyz bir ýyldan geçdi.", date: "Hemişelik müşderi" },
  { name: "Ogulgerek Işanowa", role: "Ejesi", rating: 5, occasion: "Doglan Gün Sowgady", emoji: "🎂", result: "Çagam begençden aglady", text: "18 ýaşly gyzyma sürpriz etdim. 18 gülli dürli reňkli buketi görende göz ýaşlary döküp ugrady. Şeýle pursat döredendigi üçin tüýs ýürekden sagboluň.", date: "3 hepde öň" },
  { name: "Döwlet Hydyrow", role: "Biznes Eýesi", rating: 5, occasion: "Korporatiw Sargyt", emoji: "💼", result: "Iş partnýorlarym haýran galdy", text: "20 sany iş partnýorymyza sowgat gönderendik. Hemmesini wagtynda we birmeňzeş owadan gaplama bilen iberdi. Indi ähli korporatiw sowgatlarymyz üçin diňe olar.", date: "2 aý öň" },
  { name: "Bahargül Nurmuhammedowa", role: "Toý Gurnagçysy", rating: 5, occasion: "Toý Zal Bezegi", emoji: "💍", result: "Müşderim çüwdürimde ağlady", text: "Toý gurnagçysy hökmünde köp florist bilen işledim. Bu ýeriň hili we wagtynda gelmek ygtybarylygy başgaça. Müşderilerime hemişe maslahat berýärin.", date: "Professional hyzmatdaş" },
];

const events = [
  { name: "14-nji Fewral", month: 2, day: 14, emoji: "❤️", subtitle: "Söýgüliler Güni" },
  { name: "8-nji Mart", month: 3, day: 8, emoji: "🌷", subtitle: "Zenanlar Güni" },
  { name: "21-nji Mart", month: 3, day: 21, emoji: "🌸", subtitle: "Nowruz Baýramy" },
  { name: "Doglan Günler", month: new Date().getMonth() + 2, day: 1, emoji: "🎂", subtitle: "Her Gün!" },
  { name: "Ene Günleri", month: 5, day: 12, emoji: "👩", subtitle: "Annalar Güni" },
  { name: "Okuw ýylı soňy", month: 6, day: 15, emoji: "🎓", subtitle: "Gutlag Buketi" },
];

export default function FlowerShop() {
  const params = new URLSearchParams(window.location.search);
  const SHOP = {
    name: params.get("name") || "Gül Dünýäsi",
    tagline: params.get("tag") || "Duýgularyňy güller bilen aýt.",
    city: params.get("city") || "Aşgabat",
    phone: params.get("phone") || "+993 12 34-56-78",
    address: params.get("addr") || "Bitarap Türkmenistan şaýoly 22",
    color: (params.get("color") || "E91E8C").replace("#", ""),
    color2: (params.get("color2") || "FF6B9D").replace("#", ""),
    instagram: params.get("ig") || "guldunyasi",
    telegram: params.get("tg") || "guldunyasi_tm",
    whatsapp: params.get("wa") || "",
    founded: params.get("est") || "2018",
    orders: params.get("orders") || "5000+",
    rating: params.get("rating") || "4.9",
    reviews: params.get("reviews") || "320+",
    delivery: params.get("delivery") || "60",
  };

  const accent = `#${SHOP.color}`;
  const accent2 = `#${SHOP.color2}`;
  const accentRgb = hexToRgb(SHOP.color);

  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", contact: "phone", occasion: "", budget: "300" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const gsapLoaded = useRef(false);

  useEffect(() => {
    // Set CSS vars
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent2", accent2);
    document.documentElement.style.setProperty("--accent-rgb", accentRgb);

    // Dynamic title
    document.title = `${SHOP.name} — ${SHOP.city} | Güller & Sowgatlyklar`;

    // Dynamic favicon
    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${accent}"/><text x="50%" y="68%" text-anchor="middle" font-family="serif" font-size="20" fill="white">${SHOP.name.charAt(0)}</text></svg>`;
    const faviconUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(faviconSvg)));
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = faviconUrl;

    // Scroll nav
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);

    // Load GSAP
    if (!gsapLoaded.current) {
      gsapLoaded.current = true;
      const gsapScript = document.createElement("script");
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      gsapScript.onload = () => {
        const stScript = document.createElement("script");
        stScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        stScript.onload = () => {
          const g = (window as any).gsap;
          const ST = (window as any).ScrollTrigger;
          g.registerPlugin(ST);
          const tl = g.timeline({ defaults: { ease: "power3.out" } });
          tl
            .from(".nav", { y: -100, opacity: 0, duration: 0.7 })
            .from(".hero-badge", { x: -50, opacity: 0, duration: 0.5 }, "-=0.4")
            .from(".hero-line-1", { y: 120, opacity: 0, duration: 0.8 }, "-=0.3")
            .from(".hero-line-2", { y: 120, opacity: 0, duration: 0.8 }, "-=0.5")
            .from(".hero-line-3", { y: 120, opacity: 0, duration: 0.8 }, "-=0.5")
            .from(".hero-tagline", { opacity: 0, duration: 0.6 }, "-=0.4")
            .from(".hero-body", { y: 30, opacity: 0, duration: 0.5 }, "-=0.3")
            .from(".hero-buttons .btn", { y: 30, opacity: 0, duration: 0.5, stagger: 0.15 }, "-=0.2")
            .from(".floating-card", { x: 80, opacity: 0, duration: 0.7, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.3")
            .from(".trust-strip", { opacity: 0, duration: 0.5 }, "-=0.2");

          g.utils.toArray(".reveal").forEach((el: Element) => {
            g.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          });
          g.utils.toArray(".card-group").forEach((group: Element) => {
            g.from(group.querySelectorAll(".card-anim"), { y: 80, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: group, start: "top 80%", once: true } });
          });
        };
        document.head.appendChild(stScript);
      };
      document.head.appendChild(gsapScript);
    }

    // Intersection observer for stats
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);

    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const filteredProducts = activeFilter === "all" ? products : products.filter(p => p.category === activeFilter);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --accent: ${accent};
          --accent2: ${accent2};
          --accent-rgb: ${accentRgb};
          --bg: #080608;
          --surface: #120E11;
          --surface2: #1C1520;
          --border: rgba(${accentRgb}, 0.15);
          --text: #FAF7F9;
          --text-muted: #9B8DA0;
          --gold: #C9A84C;
          --gold-light: #E8C96B;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);} 33%{transform:translateY(-15px) rotate(2deg);} 66%{transform:translateY(-8px) rotate(-1deg);} }
        @keyframes slowRotate { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes accentGlow { 0%,100%{box-shadow:0 0 20px rgba(${accentRgb},.3),0 0 60px rgba(${accentRgb},.1);} 50%{box-shadow:0 0 40px rgba(${accentRgb},.6),0 0 100px rgba(${accentRgb},.2);} }
        @keyframes starPulse { 0%,100%{filter:drop-shadow(0 0 4px gold);} 50%{filter:drop-shadow(0 0 12px gold) drop-shadow(0 0 20px gold);} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.1);opacity:.8;} }
        @keyframes countup { from{opacity:0;} to{opacity:1;} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        @keyframes strokeAnim { to{stroke-dashoffset:0;} }
        @keyframes petalFloat { 0%,100%{transform:translateY(0) rotate(0deg) scale(1);} 25%{transform:translateY(-20px) rotate(5deg) scale(1.02);} 75%{transform:translateY(-10px) rotate(-3deg) scale(.98);} }

        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-space { font-family: 'Space Grotesk', sans-serif; }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; transition: all .4s ease; }
        .nav.scrolled { background: rgba(8,6,8,.92); backdrop-filter: blur(24px) saturate(180%); border-bottom: 1px solid rgba(${accentRgb},.2); box-shadow: 0 4px 40px rgba(0,0,0,.4); }
        .nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: .5rem; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: .9rem; transition: color .2s; position: relative; }
        .nav-links a:hover { color: var(--text); }
        .nav-links a:hover::after { content: '🌸'; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 12px; animation: fadeInUp .3s ease; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .nav-delivery { font-size: .8rem; color: var(--accent); font-family: 'Space Grotesk', sans-serif; padding: .3rem .8rem; border: 1px solid rgba(${accentRgb},.3); border-radius: 20px; }
        .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; border: none; padding: .7rem 1.5rem; border-radius: 30px; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 500; cursor: pointer; transition: all .3s; text-decoration: none; display: inline-flex; align-items: center; gap: .4rem; }
        .btn-primary:hover { transform: translateY(-2px); animation: accentGlow 2s infinite; }
        .btn-outline { background: transparent; color: var(--text); border: 1px solid rgba(255,255,255,.2); padding: .7rem 1.5rem; border-radius: 30px; font-family: 'DM Sans', sans-serif; font-size: .9rem; cursor: pointer; transition: all .3s; text-decoration: none; display: inline-flex; align-items: center; gap: .4rem; }
        .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 5px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--text); transition: all .3s; border-radius: 2px; }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .mobile-menu { display: none; position: fixed; inset: 0; z-index: 999; background: rgba(8,6,8,.97); backdrop-filter: blur(20px); flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--text); text-decoration: none; transition: color .2s; }
        .mobile-menu a:hover { color: var(--accent); }

        /* HERO */
        .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 8rem 2rem 4rem; }
        .hero-bg { position: absolute; inset: 0; background: var(--bg); }
        .petal-bg { position: absolute; width: 600px; height: 600px; border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; background: var(--accent); opacity: .06; filter: blur(80px); top: 50%; left: 50%; transform: translate(-50%,-50%); animation: slowRotate 30s linear infinite; }
        .dot-grid { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(${accentRgb},.08) 1px, transparent 1px); background-size: 24px 24px; }
        .petal-float { position: absolute; border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; animation: petalFloat var(--dur,6s) ease-in-out infinite; }
        .hero-content { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1400px; margin: 0 auto; width: 100%; }
        .hero-left { }
        .hero-badge { display: inline-flex; align-items: center; gap: .5rem; background: rgba(${accentRgb},.1); border: 1px solid rgba(${accentRgb},.3); border-radius: 30px; padding: .4rem 1rem; font-size: .85rem; color: var(--accent); margin-bottom: 1.5rem; font-family: 'Space Grotesk', sans-serif; }
        .hero-heading { font-family: 'Playfair Display', serif; font-style: italic; line-height: 1.05; margin-bottom: 1rem; overflow: hidden; }
        .hero-line-1, .hero-line-2, .hero-line-3 { display: block; font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 700; color: var(--text); }
        .hero-line-2 { color: var(--accent); }
        .hero-tagline { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--gold); letter-spacing: .05em; margin-bottom: 1rem; font-style: italic; }
        .hero-body { color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem; max-width: 500px; }
        .hero-buttons { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .trust-strip { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: .4rem; font-size: .85rem; color: var(--text-muted); }
        .hero-right { position: relative; display: flex; justify-content: center; align-items: center; }
        .floating-card { position: absolute; background: rgba(18,14,17,.9); border: 1px solid rgba(${accentRgb},.2); border-radius: 16px; padding: 1rem 1.2rem; backdrop-filter: blur(20px); animation: float var(--dur,4s) ease-in-out infinite; }
        .floating-card:nth-child(1) { top: 5%; right: 5%; --dur: 3s; }
        .floating-card:nth-child(2) { top: 40%; left: 5%; --dur: 4s; }
        .floating-card:nth-child(3) { bottom: 5%; right: 20%; --dur: 5s; }
        .fc-title { font-size: .85rem; color: var(--text); font-weight: 500; margin-bottom: .3rem; }
        .fc-sub { font-size: .75rem; color: var(--text-muted); }
        .hero-center-flower { width: 300px; height: 300px; border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; background: linear-gradient(135deg, rgba(${accentRgb},.15), rgba(${accentRgb},.05)); border: 1px solid rgba(${accentRgb},.15); display: flex; align-items: center; justify-content: center; font-size: 8rem; animation: slowRotate 20s linear infinite; }

        /* STATS */
        .stats-section { background: linear-gradient(135deg, rgba(${accentRgb},.05), transparent); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 3rem 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; max-width: 1000px; margin: 0 auto; text-align: center; }
        .stat-number { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem,5vw,3.5rem); font-weight: 700; color: var(--accent); line-height: 1; }
        .stat-label { font-size: .85rem; color: var(--text-muted); margin-top: .4rem; }

        /* SECTIONS */
        .section { padding: clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem); max-width: 1400px; margin: 0 auto; }
        .section-full { padding: clamp(4rem,8vw,7rem) 0; }
        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-label { font-family: 'Space Grotesk', sans-serif; font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: .5rem; }
        .section-h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem,5vw,3rem); color: var(--text); margin-bottom: .8rem; }
        .section-sub { color: var(--text-muted); font-size: 1rem; max-width: 500px; margin: 0 auto; line-height: 1.6; }

        /* COLLECTIONS */
        .collections-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
        .collection-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2rem 1.5rem; cursor: pointer; transition: all .3s; position: relative; overflow: hidden; min-height: 220px; display: flex; flex-direction: column; justify-content: space-between; }
        .collection-card.wide { grid-column: span 2; }
        .collection-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(${accentRgb},.2); border-color: rgba(${accentRgb},.4); }
        .collection-card:hover .col-emoji { animation: pulse .6s ease; }
        .col-tag { position: absolute; top: 1rem; left: 1rem; background: rgba(${accentRgb},.15); border: 1px solid rgba(${accentRgb},.3); color: var(--accent); font-size: .7rem; padding: .2rem .6rem; border-radius: 20px; font-family: 'Space Grotesk', sans-serif; }
        .col-emoji { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
        .col-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: .5rem; }
        .col-desc { color: var(--text-muted); font-size: .85rem; line-height: 1.5; margin-bottom: .8rem; }
        .col-price { font-family: 'Space Grotesk', sans-serif; font-size: .9rem; color: var(--accent); }
        .col-arrow { position: absolute; bottom: 1rem; right: 1rem; color: var(--accent); font-size: 1.2rem; opacity: 0; transition: opacity .3s; }
        .collection-card:hover .col-arrow { opacity: 1; }

        /* WHY US */
        .why-us-section { padding: clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem); }
        .why-us-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 5rem; align-items: center; max-width: 1200px; margin: 0 auto; }
        .why-left-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem,6vw,5rem); font-style: italic; line-height: 1.1; color: var(--text); margin-bottom: 1.5rem; }
        .why-left-body { color: var(--text-muted); line-height: 1.8; margin-bottom: 1.5rem; }
        .gold-divider { height: 1px; background: linear-gradient(90deg, var(--gold), transparent); margin: 1.5rem 0; }
        .why-stats-inline { color: var(--text-muted); font-size: .9rem; }
        .why-stats-inline span { color: var(--gold); font-weight: 600; }
        .feature-item { display: flex; gap: 1rem; margin-bottom: 2rem; opacity: 0; animation: fadeInUp .6s ease forwards; }
        .feature-item:nth-child(1){animation-delay:.1s} .feature-item:nth-child(2){animation-delay:.25s} .feature-item:nth-child(3){animation-delay:.4s} .feature-item:nth-child(4){animation-delay:.55s}
        .feature-icon { font-size: 1.8rem; flex-shrink: 0; }
        .feature-text h4 { font-family: 'DM Sans', sans-serif; font-weight: 600; margin-bottom: .3rem; color: var(--text); }
        .feature-text p { color: var(--text-muted); font-size: .85rem; line-height: 1.5; }

        /* PRODUCTS */
        .filter-tabs { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2.5rem; }
        .filter-tab { padding: .5rem 1.2rem; border-radius: 30px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .3s; font-size: .85rem; }
        .filter-tab.active, .filter-tab:hover { background: var(--accent); color: white; border-color: var(--accent); }
        .products-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
        .product-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; cursor: pointer; transition: all .4s; position: relative; }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(${accentRgb},.25); }
        .product-card:hover .product-emoji { transform: scale(1.1); }
        .product-card:hover .product-order-btn { transform: translateY(0); opacity: 1; }
        .product-card:hover .product-wishlist { opacity: 1; }
        .product-bg { padding: 2.5rem 1.5rem 1.5rem; background: var(--gradient, var(--surface2)); display: flex; flex-direction: column; align-items: center; min-height: 160px; justify-content: center; position: relative; }
        .product-badge { position: absolute; top: .8rem; left: .8rem; font-size: .7rem; background: rgba(${accentRgb},.2); border: 1px solid rgba(${accentRgb},.4); color: var(--accent); padding: .2rem .6rem; border-radius: 20px; font-family: 'Space Grotesk', sans-serif; }
        .product-wishlist { position: absolute; top: .8rem; right: .8rem; font-size: 1rem; opacity: 0; transition: opacity .3s; cursor: pointer; }
        .product-emoji { font-size: 3.5rem; transition: transform .3s; animation: float 4s ease-in-out infinite; }
        .product-info { padding: 1.2rem; }
        .product-name { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: .4rem; }
        .product-flowers { color: var(--text-muted); font-size: .8rem; margin-bottom: .3rem; }
        .product-size { display: inline-block; font-size: .7rem; background: var(--surface2); border-radius: 8px; padding: .15rem .5rem; color: var(--text-muted); margin-bottom: .8rem; }
        .product-price-row { display: flex; align-items: baseline; gap: .5rem; }
        .product-price { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--text); }
        .product-old-price { font-family: 'Space Grotesk', sans-serif; font-size: .9rem; color: var(--text-muted); text-decoration: line-through; }
        .product-currency { font-size: .75rem; color: var(--text-muted); }
        .product-order-btn { display: block; width: 100%; margin-top: .8rem; padding: .6rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: .85rem; cursor: pointer; transition: all .3s; transform: translateY(20px); opacity: 0; }

        /* FLORISTS */
        .florists-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
        .florist-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: all .4s; cursor: default; }
        .florist-card:hover { transform: perspective(1000px) rotateY(5deg) rotateX(-3deg); box-shadow: 0 20px 60px rgba(${accentRgb},.2); }
        .florist-card:hover .florist-contact { opacity: 1; transform: translateY(0); }
        .florist-top { padding: 2rem 1.5rem; background: linear-gradient(180deg, rgba(${accentRgb},.08), transparent); text-align: center; position: relative; }
        .florist-achievement { position: absolute; top: .8rem; right: .8rem; font-size: .7rem; background: rgba(201,168,76,.15); border: 1px solid rgba(201,168,76,.3); color: var(--gold); padding: .2rem .6rem; border-radius: 20px; font-family: 'Space Grotesk', sans-serif; }
        .florist-emoji { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
        .florist-quote { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1rem; color: var(--text-muted); line-height: 1.5; }
        .florist-bottom { padding: 1.5rem; background: var(--surface2); }
        .florist-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: .3rem; }
        .florist-title-text { color: var(--text-muted); font-size: .85rem; margin-bottom: .8rem; }
        .florist-tags { display: flex; gap: .5rem; flex-wrap: wrap; }
        .florist-tag { font-size: .7rem; background: var(--surface); border: 1px solid var(--border); padding: .2rem .5rem; border-radius: 8px; color: var(--text-muted); }
        .florist-contact { margin-top: 1rem; background: var(--accent); color: white; border: none; width: 100%; padding: .6rem; border-radius: 10px; font-family: 'DM Sans', sans-serif; cursor: pointer; opacity: 0; transform: translateY(10px); transition: all .3s; }

        /* ORDER PROCESS */
        .process-section { padding: clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem); background: linear-gradient(180deg, transparent, rgba(${accentRgb},.03), transparent); }
        .process-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; max-width: 1000px; margin: 0 auto; position: relative; }
        .process-line { position: absolute; top: 3rem; left: 12.5%; right: 12.5%; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
        .process-step { text-align: center; position: relative; }
        .step-dot { width: 60px; height: 60px; border-radius: 50%; background: var(--surface2); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1rem; transition: all .5s; }
        .step-dot.active { border-color: var(--accent); box-shadow: 0 0 20px rgba(${accentRgb},.5); animation: pulse 2s infinite; }
        .step-num { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: var(--accent); opacity: .3; margin-bottom: .5rem; }
        .step-title { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: .5rem; }
        .step-desc { color: var(--text-muted); font-size: .82rem; line-height: 1.5; }

        /* TESTIMONIALS */
        .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; align-items: start; }
        .testimonial-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; position: relative; transition: all .3s; }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(${accentRgb},.15); }
        .testimonial-quote-bg { position: absolute; top: 1rem; right: 1.5rem; font-size: 5rem; color: var(--accent); opacity: .1; font-family: 'Cormorant Garamond', serif; line-height: 1; }
        .testimonial-stars { display: flex; gap: .2rem; margin-bottom: .8rem; animation: starPulse 3s infinite; }
        .testimonial-occasion { display: inline-block; font-size: .7rem; background: rgba(${accentRgb},.1); border: 1px solid rgba(${accentRgb},.2); color: var(--accent); padding: .2rem .6rem; border-radius: 20px; margin-bottom: .8rem; font-family: 'Space Grotesk', sans-serif; }
        .testimonial-result { font-size: 1rem; font-weight: 600; color: var(--accent); margin-bottom: .8rem; }
        .testimonial-text { color: var(--text-muted); font-size: .88rem; line-height: 1.6; margin-bottom: 1.2rem; }
        .testimonial-author { display: flex; align-items: center; gap: .8rem; }
        .testimonial-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(${accentRgb},.15); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .testimonial-name { font-size: .9rem; font-weight: 600; }
        .testimonial-role { font-size: .78rem; color: var(--text-muted); }
        .testimonial-date { font-size: .75rem; color: var(--text-muted); margin-top: .2rem; }

        /* PRICING */
        .pricing-section { padding: clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem); }
        .price-tiers { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .price-tier { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; text-align: center; }
        .price-tier-from { color: var(--text-muted); font-size: .8rem; margin-bottom: .3rem; }
        .price-tier-price { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--accent); margin-bottom: .3rem; }
        .price-tier-name { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: .5rem; }
        .price-tier-desc { color: var(--text-muted); font-size: .8rem; }
        .wedding-packages { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .wp-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; position: relative; overflow: hidden; transition: all .3s; }
        .wp-card.popular { border-color: var(--accent); }
        .wp-card.popular::before { content: 'Iň Meşhur'; position: absolute; top: 1rem; right: -2rem; background: var(--accent); color: white; font-size: .75rem; padding: .3rem 3rem; transform: rotate(45deg); font-family: 'Space Grotesk', sans-serif; }
        .wp-price { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: var(--text); margin-bottom: .3rem; }
        .wp-price span { font-size: 1rem; color: var(--text-muted); }
        .wp-name { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: .5rem; }
        .wp-note { color: var(--text-muted); font-size: .85rem; margin-bottom: 1rem; }
        .wp-list { list-style: none; }
        .wp-list li { padding: .4rem 0; color: var(--text-muted); font-size: .88rem; border-bottom: 1px solid var(--border); display: flex; gap: .5rem; }
        .wp-list li::before { content: '✓'; color: var(--accent); flex-shrink: 0; }
        .subscription-boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .sub-box { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; }
        .sub-price { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: var(--accent); }
        .sub-features { list-style: none; margin-top: 1rem; }
        .sub-features li { padding: .3rem 0; color: var(--text-muted); font-size: .85rem; display: flex; gap: .5rem; }
        .sub-features li::before { content: '✅'; }

        /* EVENTS */
        .events-section { padding: clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem); }
        .events-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 1rem; }
        .event-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem 1rem; text-align: center; transition: all .3s; }
        .event-card:hover { border-color: var(--accent); transform: translateY(-4px); }
        .event-emoji { font-size: 2rem; display: block; margin-bottom: .8rem; }
        .event-name { font-family: 'Playfair Display', serif; font-size: .9rem; margin-bottom: .4rem; }
        .event-sub { color: var(--text-muted); font-size: .75rem; margin-bottom: .6rem; }
        .event-days { font-family: 'Space Grotesk', sans-serif; font-size: .8rem; color: var(--accent); background: rgba(${accentRgb},.1); border-radius: 20px; padding: .2rem .6rem; animation: pulse 3s infinite; display: inline-block; }

        /* CONTACT FORM */
        .contact-section { padding: clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; max-width: 1100px; margin: 0 auto; }
        .contact-info h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem,4vw,2.5rem); margin-bottom: 1rem; }
        .contact-info p { color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem; }
        .contact-item { display: flex; align-items: center; gap: .8rem; margin-bottom: 1rem; color: var(--text-muted); font-size: .9rem; }
        .contact-item strong { color: var(--text); }
        .contact-form { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 2.5rem; }
        .form-group { margin-bottom: 1.2rem; }
        .form-label { display: block; font-size: .85rem; color: var(--text-muted); margin-bottom: .4rem; font-family: 'DM Sans', sans-serif; }
        .form-label span { color: var(--accent); }
        .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: .8rem 1rem; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: .9rem; transition: border-color .2s; outline: none; }
        .form-input:focus { border-color: var(--accent); }
        .form-select { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: .8rem 1rem; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: .9rem; outline: none; cursor: pointer; }
        .form-radio-group { display: flex; gap: 1rem; }
        .form-radio { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
        .form-radio input { accent-color: var(--accent); }
        .color-palette { display: flex; gap: .5rem; flex-wrap: wrap; }
        .color-swatch { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; transition: transform .2s; border: 2px solid transparent; }
        .color-swatch:hover { transform: scale(1.2); }
        .color-swatch.selected { border-color: white; transform: scale(1.2); }
        .budget-display { font-family: 'Space Grotesk', sans-serif; color: var(--accent); font-size: 1.1rem; font-weight: 600; }
        .form-range { width: 100%; accent-color: var(--accent); }
        .form-textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: .8rem 1rem; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: .9rem; resize: vertical; min-height: 80px; outline: none; }
        .form-textarea:focus { border-color: var(--accent); }
        .submit-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; border: none; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all .3s; margin-top: .5rem; }
        .submit-btn:hover { animation: accentGlow 2s infinite; transform: translateY(-2px); }
        .success-message { text-align: center; padding: 2rem; }
        .success-check { width: 80px; height: 80px; margin: 0 auto 1.5rem; }
        .success-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--accent); margin-bottom: 1rem; }
        .success-body { color: var(--text-muted); line-height: 1.7; }

        /* FOOTER */
        .footer { border-top: 1px solid var(--border); padding: 4rem 2rem 2rem; background: linear-gradient(180deg, transparent, rgba(${accentRgb},.03)); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 3rem; max-width: 1200px; margin: 0 auto; margin-bottom: 2rem; }
        .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--text); margin-bottom: .5rem; }
        .footer-tagline { color: var(--text-muted); font-size: .9rem; font-style: italic; margin-bottom: 1rem; }
        .footer-links { list-style: none; }
        .footer-links li { margin-bottom: .5rem; }
        .footer-links a { color: var(--text-muted); text-decoration: none; font-size: .88rem; transition: color .2s; }
        .footer-links a:hover { color: var(--accent); }
        .footer-col-title { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: 1rem; color: var(--text); }
        .footer-contact-item { display: flex; gap: .5rem; margin-bottom: .6rem; color: var(--text-muted); font-size: .85rem; align-items: flex-start; }
        .social-links { display: flex; gap: .8rem; margin-top: 1rem; flex-wrap: wrap; }
        .social-link { display: flex; align-items: center; gap: .4rem; color: var(--text-muted); text-decoration: none; font-size: .82rem; background: var(--surface); border: 1px solid var(--border); padding: .4rem .8rem; border-radius: 20px; transition: all .3s; }
        .social-link:hover { border-color: var(--accent); color: var(--accent); }
        .footer-bottom { border-top: 1px solid var(--border); padding-top: 1.5rem; text-align: center; max-width: 1200px; margin: 0 auto; }
        .footer-copy { color: var(--text-muted); font-size: .82rem; }
        .footer-copy a { color: var(--accent); text-decoration: none; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .collections-grid { grid-template-columns: repeat(2,1fr); }
          .collection-card.wide { grid-column: span 1; }
          .products-grid { grid-template-columns: repeat(3,1fr); }
          .florists-grid { grid-template-columns: repeat(2,1fr); }
          .events-grid { grid-template-columns: repeat(3,1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-right { display: none; }
          .hamburger { display: flex; }
          .hero-content { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .why-us-grid { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: repeat(2,1fr); }
          .florists-grid { grid-template-columns: 1fr; overflow-x: auto; display: flex; gap: 1rem; padding-bottom: 1rem; }
          .florist-card { min-width: 260px; }
          .process-grid { grid-template-columns: 1fr 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .price-tiers { grid-template-columns: repeat(2,1fr); }
          .wedding-packages { grid-template-columns: 1fr; }
          .subscription-boxes { grid-template-columns: 1fr; }
          .events-grid { grid-template-columns: repeat(2,1fr); }
          .contact-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .collections-grid { grid-template-columns: 1fr; }
          .hero-line-1, .hero-line-2, .hero-line-3 { font-size: clamp(2.5rem, 14vw, 4rem); }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .products-grid { grid-template-columns: 1fr; }
          .process-grid { grid-template-columns: 1fr; }
          .price-tiers { grid-template-columns: 1fr; }
          .events-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${navScrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">🌸 {SHOP.name}</a>
        <ul className="nav-links">
          <li><a href="#collections">Koleksiýalar</a></li>
          <li><a href="#products">Çemenler</a></li>
          <li><a href="#florists">Floristler</a></li>
          <li><a href="#pricing">Bahalar</a></li>
          <li><a href="#contact">Habarlaş</a></li>
        </ul>
        <div className="nav-right">
          <span className="nav-delivery">📦 {SHOP.delivery} min Eltip Bermek</span>
          <a href="#contact" className="btn-primary">Sargyt Et</a>
        </div>
        <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {["#collections", "#products", "#florists", "#pricing", "#contact"].map((h, i) => (
          <a key={i} href={h} onClick={() => setMobileMenuOpen(false)}>
            {["Koleksiýalar", "Çemenler", "Floristler", "Bahalar", "Habarlaş"][i]}
          </a>
        ))}
        <div style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>📞 {SHOP.phone}</div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="petal-bg" />
          <div className="dot-grid" />
          <div className="petal-float" style={{ width: 120, height: 120, background: `rgba(${accentRgb},.06)`, top: "10%", left: "5%", "--dur": "7s" } as React.CSSProperties} />
          <div className="petal-float" style={{ width: 80, height: 80, background: `rgba(${accentRgb},.04)`, top: "70%", left: "3%", "--dur": "9s" } as React.CSSProperties} />
          <div className="petal-float" style={{ width: 150, height: 150, background: `rgba(${accentRgb},.03)`, bottom: "10%", right: "3%", "--dur": "8s" } as React.CSSProperties} />
        </div>
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">🌹 {SHOP.city} · {SHOP.rating}★ · {SHOP.reviews} teswir</div>
            <h1 className="hero-heading">
              <span className="hero-line-1">Duýgularyňy</span>
              <span className="hero-line-2">güller bilen</span>
              <span className="hero-line-3">aýt.</span>
            </h1>
            <p className="hero-tagline">— {SHOP.tagline}</p>
            <p className="hero-body">
              {SHOP.name} — {SHOP.city} şäherinde iň owadan gül çemenler, sowgat gutulary we buket dizaýny.<br />
              {SHOP.orders} bagtly müşderimiz bar.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn-primary btn">🌸 Sargyt Et →</a>
              <a href="#collections" className="btn-outline btn">Koleksiýalara Gör ↓</a>
            </div>
            <div className="trust-strip">
              <span className="trust-item">⚡ {SHOP.delivery} min içinde</span>
              <span className="trust-item">🌷 Täze güller her gün</span>
              <span className="trust-item">🎁 Mugt gaplama</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-center-flower">🌹</div>
            <div className="floating-card">
              <div className="fc-title">💐 Düýn iberildi</div>
              <div className="fc-sub">★★★★★ "Örän owadan!"</div>
            </div>
            <div className="floating-card">
              <div className="fc-title">🚀 Çalt Eltip</div>
              <div className="fc-sub">{SHOP.delivery} min ✓</div>
            </div>
            <div className="floating-card">
              <div className="fc-title">🌹 {SHOP.orders}</div>
              <div className="fc-sub">Bagtly Sargyt</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {[
            { num: SHOP.orders, label: "Bagtly Sargyt" },
            { num: SHOP.rating + "★", label: "Ortaça Baha" },
            { num: SHOP.reviews, label: "Müşderi Teswiri" },
            { num: SHOP.delivery + " min", label: "Eltip Bermek Wagty" },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-number" style={{ animationDelay: `${i * .15}s`, animation: statsVisible ? "countup .6s ease forwards" : "none" }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="section">
        <div className="section-header reveal">
          <div className="section-label">Koleksiýalar</div>
          <h2 className="section-h2">Sizi Näme Üçin Geldi?</h2>
          <p className="section-sub">Duýgunuza laýyk çemen tapyň.</p>
        </div>
        <div className="collections-grid card-group">
          {collections.map(c => (
            <div key={c.id} className={`collection-card card-anim ${c.wide ? "wide" : ""}`}>
              <div className="col-tag">{c.tag}</div>
              <span className="col-emoji">{c.emoji}</span>
              <div>
                <div className="col-name">{c.name}</div>
                <div className="col-desc">{c.desc}</div>
                <div className="col-price">{c.priceFrom} TMT-dan · {c.items}</div>
              </div>
              <span className="col-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us-section">
        <div className="why-us-grid">
          <div className="reveal">
            <h2 className="why-left-heading">Her çemen<br />bir hekaýa.</h2>
            <p className="why-left-body">
              Biz diňe gül satmaýarys —<br />
              duýgulary, ýatlamalary we möhüm pursatlary bezäp berýäris.
            </p>
            <p className="why-left-body">
              {SHOP.name}, {SHOP.founded}-njy ýyldan bäri<br />
              {SHOP.city} şäherinde bagtly pursatlar döredýär.
            </p>
            <div className="gold-divider" />
            <p className="why-stats-inline">
              <span>{SHOP.orders}</span> sargyt · <span>{SHOP.rating}★</span> baha.
            </p>
          </div>
          <div>
            {[
              { icon: "🌿", title: "Täze Güller, Her Gün", desc: `Floristlerimiz her irden bazara gidip iň täze gülleri saýlaýar.` },
              { icon: "✂️", title: "Hünärmen Floristler", desc: `5+ ýyllyk tejribeli dizaýnerlerimiz her çemeni eser hökmünde işleýär.` },
              { icon: "🚀", title: `${SHOP.delivery} Min Eltip Bermek`, desc: `${SHOP.city} içinde. Sowadyjyly ulag bilen gül täze ýetýär.` },
              { icon: "🎀", title: "Mugt Premium Gaplama", desc: `Her sargyt bilen mugt ribbon, sowgat haty we owadan gaplama.` },
            ].map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="section">
        <div className="section-header reveal">
          <div className="section-label">Önümler</div>
          <h2 className="section-h2">Iň Meşhur Çemenlerimiz</h2>
        </div>
        <div className="filter-tabs">
          {[
            { id: "all", label: "Hemmesi" },
            { id: "love", label: "Söýgi" },
            { id: "birthday", label: "Doglan Gün" },
            { id: "wedding", label: "Toý" },
            { id: "gift", label: "Sowgat" },
            { id: "corporate", label: "Korporatiw" },
          ].map(f => (
            <button key={f.id} className={`filter-tab ${activeFilter === f.id ? "active" : ""}`} onClick={() => setActiveFilter(f.id)}>{f.label}</button>
          ))}
        </div>
        <div className="products-grid card-group">
          {filteredProducts.map(p => (
            <div key={p.id} className="product-card card-anim">
              <div className="product-bg" style={{ background: p.gradient }}>
                <div className="product-badge">{p.badge}</div>
                <span className="product-wishlist">♡</span>
                <span className="product-emoji">{p.emoji}</span>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-flowers">{p.flowers}</div>
                <span className="product-size">{p.size}</span>
                <div className="product-price-row">
                  <span className="product-price">{p.price}</span>
                  <span className="product-currency">TMT</span>
                  {p.oldPrice && <span className="product-old-price">{p.oldPrice}</span>}
                </div>
                <button className="product-order-btn" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Sargyt Et</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLORISTS */}
      <section id="florists" className="section">
        <div className="section-header reveal">
          <div className="section-label">Hünärmenler</div>
          <h2 className="section-h2">Çemenlerimizi Döredýän Hünärmenler</h2>
        </div>
        <div className="florists-grid card-group">
          {florists.map((f, i) => (
            <div key={i} className="florist-card card-anim">
              <div className="florist-top">
                <div className="florist-achievement">{f.achievement}</div>
                <span className="florist-emoji">{f.emoji}</span>
                <p className="florist-quote">"{f.quote}"</p>
              </div>
              <div className="florist-bottom">
                <div className="florist-name">{f.name}</div>
                <div className="florist-title-text">{f.title}</div>
                <div className="florist-tags">
                  <span className="florist-tag">{f.exp}</span>
                  <span className="florist-tag">{f.specialty}</span>
                  <span className="florist-tag">{f.cert}</span>
                </div>
                <button className="florist-contact" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Habarlaş</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER PROCESS */}
      <section className="process-section">
        <div className="section-header reveal">
          <div className="section-label">Ädimler</div>
          <h2 className="section-h2">Gül Almak Hiç Wagt Bu Çenli Aňsat Bolmandyr</h2>
        </div>
        <div className="process-grid reveal">
          <div className="process-line" />
          {[
            { step: "01", emoji: "📱", title: "Habarlaş", desc: "Telefon ýa-da saýt arkaly sargyt ediň" },
            { step: "02", emoji: "🌸", title: "Florist Saýlaýar", desc: "Hünärmen florist aýratyn çemeňizi işleýär" },
            { step: "03", emoji: "🚗", title: "Eltip Bermek", desc: `${SHOP.delivery} minut içinde gapyňyza gelýär` },
            { step: "04", emoji: "😍", title: "Bagtly Pursat", desc: "Sargyt eliňize ýetýär, täze we owadan" },
          ].map((s, i) => (
            <div key={i} className="process-step">
              <div className="step-num">{s.step}</div>
              <div className="step-dot active">{s.emoji}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-header reveal">
          <div className="section-label">Müşderi Teswirler</div>
          <h2 className="section-h2">Olaryň Ýylgyryşy Biziň Iň Uly Baýragymyz</h2>
        </div>
        <div className="testimonials-grid card-group">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card card-anim">
              <div className="testimonial-quote-bg">"</div>
              <div className="testimonial-stars">{"★".repeat(t.rating)}</div>
              <div className="testimonial-occasion">{t.occasion}</div>
              <div className="testimonial-result">{t.result}</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.emoji}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                  <div className="testimonial-date">{t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <div className="section-header reveal">
          <div className="section-label">Bahalar</div>
          <h2 className="section-h2">Göwnüňizdäki Buket Üçin Dogry Baha</h2>
        </div>
        <div className="price-tiers reveal">
          {[
            { from: "55", name: "Standart Buket", desc: "9-21 gül" },
            { from: "120", name: "Orta Buket", desc: "25-51 gül" },
            { from: "250", name: "Lýuks Buket", desc: "51-101 gül" },
            { from: "Ylalaşyk", name: "Özboluşly Sargyt", desc: "Doly dizaýn" },
          ].map((p, i) => (
            <div key={i} className="price-tier">
              <div className="price-tier-from">-dan başlanýar</div>
              <div className="price-tier-price">{p.from} {p.from !== "Ylalaşyk" ? "TMT" : ""}</div>
              <div className="price-tier-name">{p.name}</div>
              <div className="price-tier-desc">{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="section-header reveal" style={{ marginTop: "3rem" }}>
          <h2 className="section-h2" style={{ fontSize: "1.8rem" }}>Toý & Çäre Paketleri</h2>
        </div>
        <div className="wedding-packages reveal">
          {[
            { name: "Bagtly Başlangyç", price: "1 200", popular: false, includes: ["Gelin buketi (35 gül)", "Döşde takylýan çemen (2 sany)", "Stol bezegi (5 stol)", "Toý torty bezegi"], note: "Kiçi we ýapyk toýlar üçin ideal" },
            { name: "Arzuw Toýy", price: "3 500", popular: true, includes: ["Premium gelin buketi", "Döşde takylýan (10 sany)", "Stol bezegi (15 stol)", "Giriş bezegi", "Toý takhtasy bezegi", "Fotosurat gülleri"], note: "Iň meşhur toý paketi" },
            { name: "Şa Toý", price: null, popular: false, includes: ["Çäksiz konzultasiýa", "Doly zal bezegi", "Özboluşly konsepsiýa", "Gün bütin hyzmat", "Gurnamak we ýygnamak", "Ähli islegleriňiz"], note: "Iň ýakymly günüňiz üçin" },
          ].map((p, i) => (
            <div key={i} className={`wp-card ${p.popular ? "popular" : ""}`}>
              <div className="wp-price">{p.price ? <>{p.price} <span>TMT</span></> : <span style={{ color: "var(--accent)" }}>Ylalaşyk</span>}</div>
              <div className="wp-name">{p.name}</div>
              <div className="wp-note">{p.note}</div>
              <ul className="wp-list">
                {p.includes.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-header reveal" style={{ marginTop: "3rem" }}>
          <h2 className="section-h2" style={{ fontSize: "1.8rem" }}>Abuna Hyzmat</h2>
        </div>
        <div className="subscription-boxes reveal">
          {[
            { title: "Hepdelik", price: "280 TMT/hepde", detail: "1 buket/hepde" },
            { title: "Aýlyk", price: "900 TMT/aý", detail: "4 buket/aý — 3 hepde bahasy!" },
          ].map((s, i) => (
            <div key={i} className="sub-box">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: ".5rem" }}>{s.title}</h3>
              <div className="sub-price">{s.price}</div>
              <div style={{ color: "var(--text-muted)", fontSize: ".85rem", marginBottom: "1rem" }}>{s.detail}</div>
              <ul className="sub-features">
                {["Awtomatik eltip bermek", "Her gezek täze dizaýn", "Islän wagtyňyz ýatyrmak", "Mugt gaplama hemişe"].map((f, j) => <li key={j}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="events-section">
        <div className="section-header reveal">
          <div className="section-label">Pursatlar</div>
          <h2 className="section-h2">Ýakyn Pursatlaryňyzy Ýatdan Çykarmaň</h2>
        </div>
        <div className="events-grid card-group">
          {events.map((e, i) => {
            const days = e.name === "Doglan Günler" ? 0 : daysUntil(e.month, e.day);
            return (
              <div key={i} className="event-card card-anim">
                <span className="event-emoji">{e.emoji}</span>
                <div className="event-name">{e.name}</div>
                <div className="event-sub">{e.subtitle}</div>
                <span className="event-days">{days === 0 ? "Her gün!" : `${days} gün galdy`}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-grid">
          <div className="contact-info reveal">
            <div className="section-label">Habarlaşmak</div>
            <h2>Sargydyňyzy Beriň</h2>
            <p>6 sagadyň içinde floristimiz siz bilen habarlaşar</p>
            <div className="contact-item">📞 <strong>{SHOP.phone}</strong></div>
            <div className="contact-item">📍 <span>{SHOP.address}, {SHOP.city}</span></div>
            <div className="contact-item">⏰ <span>Her gün 08:00 — 22:00</span></div>
            <div className="contact-item">🚀 <span>Eltip bermek: {SHOP.delivery} minut içinde</span></div>
            <div className="social-links">
              {SHOP.instagram && <a className="social-link" href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer">📸 @{SHOP.instagram}</a>}
              {SHOP.telegram && <a className="social-link" href={`https://t.me/${SHOP.telegram}`} target="_blank" rel="noreferrer">✈️ @{SHOP.telegram}</a>}
              {SHOP.whatsapp && <a className="social-link" href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>}
            </div>
          </div>

          <div className="contact-form reveal">
            {formSubmitted ? (
              <div className="success-message">
                <svg className="success-check" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke={accent} strokeWidth="4" />
                  <path d="M24 40 L35 51 L56 29" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="50" style={{ animation: "strokeAnim 0.8s ease forwards" }} />
                </svg>
                <div className="success-title">✨ SARGYDYŇYZ KABUL EDILDI! ✨</div>
                <div className="success-body">
                  Salam, <strong>{formData.name}</strong>! 🌸<br /><br />
                  {SHOP.delivery} minutda floristimiz<br />
                  <strong>{formData.phone}</strong> belgiňize jaň eder.<br /><br />
                  Sargytyňyz: <strong>{formData.occasion || "Florist bilen ylalaşmak"}</strong><br />
                  Habarlaşmak: <strong>{formData.contact === "phone" ? "Telefon" : formData.contact === "telegram" ? "Telegram" : "WhatsApp"}</strong><br /><br />
                  {SHOP.name} sizi begendirmäge howlukýar! 🌹
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Adyňyz <span>*</span></label>
                    <input className="form-input" type="text" placeholder="Adyňyz..." required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefon belgiňiz <span>*</span></label>
                    <input className="form-input" type="tel" placeholder="+993..." required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Habarlaşmak usuly <span>*</span></label>
                  <div className="form-radio-group">
                    {[["phone", "Telefon"], ["telegram", "Telegram"], ["whatsapp", "WhatsApp"]].map(([v, l]) => (
                      <label key={v} className="form-radio">
                        <input type="radio" name="contact" value={v} checked={formData.contact === v} onChange={() => setFormData({ ...formData, contact: v })} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Haýsy mümkinçilik? <span>*</span></label>
                  <select className="form-select" value={formData.occasion} onChange={e => setFormData({ ...formData, occasion: e.target.value })}>
                    <option value="">Saýlaň...</option>
                    {["Söýgi Buketi", "Doglan Gün", "Toý", "Korporatiw", "Sowgat", "Başga"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reňk islegleriňiz</label>
                  <div className="color-palette">
                    {["#E53935", "#EC407A", "#FFFFFF", "#FDD835", "#8E24AA", "#1E88E5", "#43A047"].map(c => (
                      <div key={c} className="color-swatch" style={{ background: c, border: c === "#FFFFFF" ? "2px solid #333" : undefined }} title={c} onClick={e => e.currentTarget.classList.toggle("selected")} />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Eltip bermek wagty</label>
                  <input className="form-input" type="datetime-local" />
                </div>
                <div className="form-group">
                  <label className="form-label">Eltip bermek salgysy</label>
                  <input className="form-input" type="text" placeholder={`${SHOP.city}, köçe, jaý...`} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bujetim: <span className="budget-display">{parseInt(formData.budget).toLocaleString()} TMT</span></label>
                  <input className="form-range" type="range" min="50" max="2000" step="50" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                  <div style={{ color: "var(--text-muted)", fontSize: ".78rem", marginTop: ".3rem" }}>
                    Bu baha üçin takmynan: {parseInt(formData.budget) < 100 ? "kiçi buket" : parseInt(formData.budget) < 200 ? "orta buket" : parseInt(formData.budget) < 400 ? "uly buket" : "premium buket"}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Özboluşly islek ýa-da habar</label>
                  <textarea className="form-textarea" placeholder="Haýsydyr bir özboluşly islegiňiz bar bolsa..." />
                </div>
                <button type="submit" className="submit-btn">🌸 Sargydy Iber →</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">🌸 {SHOP.name}</div>
            <div className="footer-tagline">{SHOP.tagline}</div>
            <p style={{ color: "var(--text-muted)", fontSize: ".85rem", lineHeight: "1.6" }}>
              {SHOP.city} şäherinde {SHOP.founded}-njy ýyldan bäri hyzmat edýäris. {SHOP.orders} bagtly müşderimiz bar.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Sahypalar</div>
            <ul className="footer-links">
              {["Baş Sahypa", "Koleksiýalar", "Floristler", "Bahalar", "Habarlaş"].map((l, i) => <li key={i}><a href={["#", "#collections", "#florists", "#pricing", "#contact"][i]}>{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Koleksiýalar</div>
            <ul className="footer-links">
              {["Söýgi & Romantika", "Toý & Nikaý", "Doglan Gün", "Korporatiw", "Abuna Hyzmat"].map((l, i) => <li key={i}><a href="#collections">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Habarlaşmak</div>
            <div className="footer-contact-item">📞 <strong>{SHOP.phone}</strong></div>
            <div className="footer-contact-item">📍 {SHOP.address}</div>
            <div className="footer-contact-item">🏙️ {SHOP.city}</div>
            <div className="social-links">
              {SHOP.instagram && <a className="social-link" href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer">📸 Instagram</a>}
              {SHOP.telegram && <a className="social-link" href={`https://t.me/${SHOP.telegram}`} target="_blank" rel="noreferrer">✈️ Telegram</a>}
              {SHOP.whatsapp && <a className="social-link" href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} {SHOP.name} · Ähli hukuklar goragly<br />
            Bu saýt 🛠️ <a href="#" rel="noreferrer">Ýeňil Web Agentligi</a> tarapyndan döredildi · yenil.ru
          </p>
        </div>
      </footer>
    </>
  );
}
