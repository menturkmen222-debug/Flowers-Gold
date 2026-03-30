import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart, Gem, Gift, Building2, Bird, Leaf, Calendar,
  Phone, MapPin, Clock, Instagram, Send, MessageCircle,
  Star, ChevronRight, Truck, Scissors, Sparkles, Ribbon,
  ShoppingBag, Menu, X, ArrowRight, Award, CheckCircle,
  Flower, Flower2, Camera, Briefcase
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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

const BASE = import.meta.env.BASE_URL;

const collections = [
  { id: "love", Icon: Heart, name: "Söýgi & Romantika", desc: "Ýüregiňizdäki duýgulary beýan ediň. Gyzyl güller, ýuwaş reňkler, serêntäk gaplama.", items: "45+ görnüş", priceFrom: "85", tag: "Iň Meşhur", wide: true, img: "col-love.png", gradient: "linear-gradient(135deg,#2d0015,#1a0010)" },
  { id: "wedding", Icon: Gem, name: "Toý & Nikaý", desc: "Ömrüňiziň iň möhüm gününde. Gelin buketi, zal bezegi, süpürenç gülleri.", items: "30+ paket", priceFrom: "250", tag: "Premium", wide: true, img: "col-wedding.png", gradient: "linear-gradient(135deg,#0e0020,#1a0030)" },
  { id: "birthday", Icon: Sparkles, name: "Doglan Gün", desc: "Ýakynlaryňyzy begendiriň. Ýaşyna we zowkuna görä özboluşly buketi.", items: "60+ görnüş", priceFrom: "55", tag: "Her Ýaş Üçin", wide: false, img: "col-birthday.png", gradient: "linear-gradient(135deg,#1a0020,#280035)" },
  { id: "corporate", Icon: Building2, name: "Korporatiw", desc: "Ofis bezegi, konferensiýa gülleri, iş partnýorlaryna sowgat çözgütleri.", items: "Aýratyn dizaýn", priceFrom: "200", tag: "B2B", wide: false, gradient: "linear-gradient(135deg,#050a08,#0d1510)" },
  { id: "sympathy", Icon: Bird, name: "Hormat & Sadaka", desc: "Kyn wagtlarda ýanyňyzda bolmak. Içgin we hormatly çemenler.", items: "20+ görnüş", priceFrom: "70", tag: "Inçe", wide: false, gradient: "linear-gradient(135deg,#080808,#121218)" },
  { id: "seasonal", Icon: Leaf, name: "Möwsümleýin Güller", desc: "Bahar, tomus, güýz we gyş. Her möwsümiň iň owadan gülleri.", items: "Möwsüme görä", priceFrom: "45", tag: "Täze", wide: false, img: "product-seasonal.png", gradient: "linear-gradient(135deg,#0a1205,#152010)" },
  { id: "boxes", Icon: Gift, name: "Sowgat Gutulary", desc: "Güller + şokolad + yşk şemi + şahsy hat. Doly duýgy bukjasy.", items: "25+ kombinasiýa", priceFrom: "120", tag: "Doly Set", wide: true, img: "col-gift.png", gradient: "linear-gradient(135deg,#150e00,#221800)" },
  { id: "subscription", Icon: Calendar, name: "Abuna Hyzmat", desc: "Her hepde ýa-da her aý öýüňize täze güller geler. Awtomatik bagtlylyk.", items: "Aýlyk / Hepdelik", priceFrom: "180", tag: "🔥 Täzelik", wide: true, gradient: "linear-gradient(135deg,#0d0020,#180030)" },
];

const products = [
  { id: 1, name: "Gyzyl Gül Neoklassik", category: "love", flowers: "51 gyzyl gül", size: "Uly", price: 185, oldPrice: 220, badge: "Iň Köp Satylýan", img: "product-rose.png", gradient: "linear-gradient(135deg,#1a0010,#3d0020)" },
  { id: 2, name: "Ak Lale Arzuw", category: "wedding", flowers: "25 ak lale + pip", size: "Orta", price: 145, oldPrice: null, badge: "Toý Saýlawy", img: "product-tulip.png", gradient: "linear-gradient(135deg,#0d0010,#200015)" },
  { id: 3, name: "Pastel Buket Sürprizi", category: "birthday", flowers: "Garylyk pastel güller", size: "Orta", price: 95, oldPrice: 115, badge: "Doglan Gün Hit", img: "col-birthday.png", gradient: "linear-gradient(135deg,#130010,#280025)" },
  { id: 4, name: "Premium Sowgat Gutusy", category: "gift", flowers: "Güller + Ferrero + Şem", size: "Premium", price: 245, oldPrice: null, badge: "Premium", img: "col-gift.png", gradient: "linear-gradient(135deg,#100d00,#201800)" },
  { id: 5, name: "Lüks Gelin Buketi", category: "wedding", flowers: "Awen + Gül + Pip", size: "Toý", price: 380, oldPrice: null, badge: "Lýuks", img: "col-wedding.png", gradient: "linear-gradient(135deg,#0a0808,#1a1015)" },
  { id: 6, name: "Gün Şöhlesi Buketi", category: "birthday", flowers: "Gün gülü + Sary güller", size: "Kiçi", price: 65, oldPrice: 80, badge: "Şadyýan", img: "product-seasonal.png", gradient: "linear-gradient(135deg,#100a00,#201200)" },
  { id: 7, name: "Korporatiw Stol Bezegi", category: "corporate", flowers: "Ak + Ýaşyl garylyk", size: "Ofis", price: 120, oldPrice: null, badge: "B2B", img: null, gradient: "linear-gradient(135deg,#050a08,#0d1510)" },
  { id: 8, name: "Möwsüm Sürpriz Buketi", category: "seasonal", flowers: "Florist saýlawy", size: "Orta", price: 75, oldPrice: null, badge: "Täze", img: "product-seasonal.png", gradient: "linear-gradient(135deg,#080010,#120018)" },
  { id: 9, name: "100 Gül Premium Galpak", category: "love", flowers: "100 dürli reňkli gül", size: "Uly-Premium", price: 420, oldPrice: 500, badge: "Wau Effekt", img: "hero-bouquet.png", gradient: "linear-gradient(135deg,#140010,#2a0020)" },
  { id: 10, name: "Ýatlamaçy Çemen Gutusy", category: "sympathy", flowers: "Ak we mawy güller", size: "Orta", price: 115, oldPrice: null, badge: "Hormat", img: "product-tulip.png", gradient: "linear-gradient(135deg,#050810,#0a1018)" },
  { id: 11, name: "Söýgi Sandyk Sowgat", category: "gift", flowers: "Sandyk + Güller + Şokolad + Parfum", size: "Premium Set", price: 350, oldPrice: 420, badge: "Bestseller", img: "col-gift.png", gradient: "linear-gradient(135deg,#120008,#220012)" },
  { id: 12, name: "Hepdelik Ofis Abunasy", category: "corporate", flowers: "Her hepde awtomatik", size: "Abuna", price: 280, oldPrice: null, badge: "Abuna", img: null, gradient: "linear-gradient(135deg,#080510,#120a1a)" },
];

const florists = [
  { name: "Maýagül Nurlyýewa", title: "Baş Florist & Dizaýner", exp: "9 Ýyl", specialty: "Toý & Lýuks Bukety", cert: "Ýewropa Sertifikatly", img: "florist-1.png", achievement: "500+ Toý Buketi", quote: "Her gül öz dilinde gürleýär. Men diňe terjimeçi." },
  { name: "Güljeren Orazowa", title: "Korporatiw Florist", exp: "6 Ýyl", specialty: "Ofis & Çäre Bezegi", cert: "B2B Hünärmen", img: "florist-2.png", achievement: "200+ Korporatiw Müşderi", quote: "Içerki bezeg işiň dilidir." },
  { name: "Leýli Annagylyjowa", title: "Söýgi Buketi Spesialisti", exp: "7 Ýyl", specialty: "Romantik Çemenler", cert: "Floristika Ussady", img: "florist-1.png", achievement: "1000+ Söýgi Buketi", quote: "Güller söz bilen düşündirip bolmajak zady aýdýar." },
  { name: "Aýgözel Durdyýewa", title: "Kreatiw Dizaýner", exp: "4 Ýyl", specialty: "Eksperimental & Täze Görnüş", cert: "Halkara Bäsleşik Ýeňijisi", img: "florist-2.png", achievement: "3x Bäsleşik Baýragy", quote: "Floristika — bu janly sungat." },
];

const testimonials = [
  { name: "Aýna Çaryýewa", role: "Täze gelni", rating: 5, occasion: "Toý Buketi", result: "Ömrümüň iň owadan güni", text: "Toý buketime seredip ağlamaga başladym. Maýagül hanym meniň arzuwymdan hem owadan bir zat döretdi. Her fotosuratyma seredenimdä ony görýärin.", date: "2 hepde öň", avatar: "col-wedding.png" },
  { name: "Serdar Rejepow", role: "Söýgüli", rating: 5, occasion: "Söýgi Sürprizi", result: "Ony geň galdyrdym!", text: "Aýalym wagtynda gapysyna gelende ynanamady. Güller şeýle täze we owadandy! 'Bu näme?' diýip ağlady. Bu dükany söýgüni mümkin edýär.", date: "1 aý öň", avatar: "product-rose.png" },
  { name: "Läle Atamyradowa", role: "Ofis Dolandyryjysy", rating: 5, occasion: "Hepdelik Abuna", result: "Ofisimiz syrça boldy", text: "Her duşenbe irden täze güller gelýär. Işgärlerimiz we müşderilerimiz ofisimizde hemişe gülläp duran güllere haýranlar.", date: "Hemişelik müşderi", avatar: "product-seasonal.png" },
  { name: "Ogulgerek Işanowa", role: "Ejesi", rating: 5, occasion: "Doglan Gün Sowgady", result: "Çagam begençden aglady", text: "18 ýaşly gyzyma sürpriz etdim. 18 gülli dürli reňkli buketi görende göz ýaşlary döküp ugrady. Şeýle pursat döredendigi üçin sagboluň.", date: "3 hepde öň", avatar: "col-birthday.png" },
  { name: "Döwlet Hydyrow", role: "Biznes Eýesi", rating: 5, occasion: "Korporatiw Sargyt", result: "Iş partnýorlarym haýran galdy", text: "20 sany iş partnýorymyza sowgat gönderendik. Hemmesini wagtynda we birmeňzeş owadan gaplama bilen iberdi. Indi ähli korporatiw sowgatlarymyz üçin diňe olar.", date: "2 aý öň", avatar: "col-gift.png" },
  { name: "Bahargül Nurmuhammedowa", role: "Toý Gurnagçysy", rating: 5, occasion: "Toý Zal Bezegi", result: "Müşderim gözden ýaş dökdi", text: "Toý gurnagçysy hökmünde köp florist bilen işledim. Bu ýeriň hili we wagtynda gelmek ygtybarylygy başgaça. Müşderilerime hemişe maslahat berýärin.", date: "Professional hyzmatdaş", avatar: "col-love.png" },
];

const events = [
  { name: "14-nji Fewral", month: 2, day: 14, Icon: Heart, subtitle: "Söýgüliler Güni" },
  { name: "8-nji Mart", month: 3, day: 8, Icon: Flower2, subtitle: "Zenanlar Güni" },
  { name: "21-nji Mart", month: 3, day: 21, Icon: Leaf, subtitle: "Nowruz Baýramy" },
  { name: "Doglan Günler", month: new Date().getMonth() + 2, day: 1, Icon: Sparkles, subtitle: "Her Gün!" },
  { name: "Ene Günleri", month: 5, day: 12, Icon: Heart, subtitle: "Annalar Güni" },
  { name: "Okuw Soňy", month: 6, day: 15, Icon: Award, subtitle: "Gutlag Buketi" },
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

  const img = (name: string) => `${BASE}img/${name}`;

  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", contact: "phone", occasion: "", budget: "300" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent2", accent2);
    document.documentElement.style.setProperty("--accent-rgb", accentRgb);
    document.title = `${SHOP.name} — ${SHOP.city} | Güller & Sowgatlyklar`;

    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${accent}"/><text x="50%" y="68%" text-anchor="middle" font-family="serif" font-size="20" fill="white">${SHOP.name.charAt(0)}</text></svg>`;
    const faviconUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(faviconSvg)));
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = faviconUrl;

    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);

    // ── HERO entry animation with bundled GSAP (no CDN) ──
    gsap.set(".hero-badge", { x: -40, opacity: 0 });
    gsap.set(".hero-line-1, .hero-line-2, .hero-line-3", { y: 80, opacity: 0 });
    gsap.set(".hero-tagline", { opacity: 0 });
    gsap.set(".hero-body", { y: 20, opacity: 0 });
    gsap.set(".hero-buttons .hbtn", { y: 20, opacity: 0 });
    gsap.set(".floating-card", { x: 60, opacity: 0 });
    gsap.set(".trust-strip", { opacity: 0 });
    gsap.set(".nav", { y: -80, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl
      .to(".nav",            { y: 0, opacity: 1, duration: 0.6 })
      .to(".hero-badge",     { x: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      .to(".hero-line-1",    { y: 0, opacity: 1, duration: 0.7 }, "-=0.2")
      .to(".hero-line-2",    { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
      .to(".hero-line-3",    { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
      .to(".hero-tagline",   { opacity: 1, duration: 0.5 }, "-=0.3")
      .to(".hero-body",      { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      .to(".hero-buttons .hbtn", { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, "-=0.2")
      .to(".floating-card",  { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" }, "-=0.3")
      .to(".trust-strip",    { opacity: 1, duration: 0.5 }, "-=0.2");

    // ── Scroll reveals via IntersectionObserver (reliable, no CDN) ──
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
    revealEls.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(48px)";
      el.style.transition = "opacity 0.75s cubic-bezier(.4,0,.2,1), transform 0.75s cubic-bezier(.4,0,.2,1)";
    });

    const cardGroups = document.querySelectorAll<HTMLElement>(".card-group");
    cardGroups.forEach(group => {
      const cards = group.querySelectorAll<HTMLElement>(".card-anim");
      cards.forEach(c => {
        c.style.opacity = "0";
        c.style.transform = "translateY(55px)";
        c.style.transition = "opacity 0.65s cubic-bezier(.4,0,.2,1), transform 0.65s cubic-bezier(.4,0,.2,1)";
      });
    });

    const ioReveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          ioReveal.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(el => ioReveal.observe(el));

    const ioCards = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const group = entry.target as HTMLElement;
          const cards = group.querySelectorAll<HTMLElement>(".card-anim");
          cards.forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            }, i * 65);
          });
          ioCards.unobserve(group);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

    cardGroups.forEach(g => ioCards.observe(g));

    // Safety fallback: ensure everything is visible after 4s regardless
    const fallback = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal, .card-anim").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      document.querySelectorAll<HTMLElement>(".nav,.hero-badge,.hero-line-1,.hero-line-2,.hero-line-3,.hero-tagline,.hero-body,.trust-strip,.floating-card").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, 4000);

    // Stats counter
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
      ioReveal.disconnect();
      ioCards.disconnect();
      clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  const filteredProducts = activeFilter === "all" ? products : products.filter(p => p.category === activeFilter);

  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); setFormSubmitted(true); };

  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --accent: ${accent};
          --accent2: ${accent2};
          --accent-rgb: ${accentRgb};
          --bg: #06040A;
          --surface: #100C18;
          --surface2: #1A1526;
          --border: rgba(${accentRgb}, 0.12);
          --text: #F8F4FC;
          --text-muted: #8A7A9A;
          --gold: #C9A84C;
          --gold-light: #E8C96B;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);} 33%{transform:translateY(-14px) rotate(2deg);} 66%{transform:translateY(-7px) rotate(-1deg);} }
        @keyframes slowRotate { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes accentPulse { 0%,100%{box-shadow:0 0 20px rgba(${accentRgb},.35),0 4px 20px rgba(0,0,0,.3);} 50%{box-shadow:0 0 45px rgba(${accentRgb},.7),0 4px 20px rgba(0,0,0,.3);} }
        @keyframes starGlow { 0%,100%{color:#E8C96B;filter:drop-shadow(0 0 3px #E8C96B);} 50%{color:#fff;filter:drop-shadow(0 0 10px #E8C96B);} }
        @keyframes scaleIn { from{transform:scale(.92);opacity:0;} to{transform:scale(1);opacity:1;} }
        @keyframes slideUp { from{transform:translateY(30px);opacity:0;} to{transform:translateY(0);opacity:1;} }
        @keyframes drawStroke { to{stroke-dashoffset:0;} }
        @keyframes petalSpin { 0%,100%{transform:translateY(0) rotate(0deg) scale(1);} 33%{transform:translateY(-18px) rotate(5deg) scale(1.03);} 66%{transform:translateY(-9px) rotate(-3deg) scale(.97);} }
        @keyframes shimmer { 0%{background-position:200% center;} 100%{background-position:-200% center;} }

        /* ── NAV ── */
        .nav { position:fixed; top:0; left:0; right:0; z-index:1000; padding:1.1rem 2.5rem; display:flex; align-items:center; justify-content:space-between; transition:all .4s cubic-bezier(.4,0,.2,1); }
        .nav.scrolled { background:rgba(6,4,10,.88); backdrop-filter:blur(28px) saturate(200%); border-bottom:1px solid rgba(${accentRgb},.18); box-shadow:0 4px 48px rgba(0,0,0,.5); }
        .nav-logo { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:600; color:var(--text); text-decoration:none; display:flex; align-items:center; gap:.55rem; letter-spacing:.01em; }
        .nav-logo svg { color:var(--accent); }
        .nav-links { display:flex; gap:2rem; list-style:none; }
        .nav-links a { color:var(--text-muted); text-decoration:none; font-size:.9rem; font-weight:500; transition:color .2s; position:relative; padding-bottom:4px; }
        .nav-links a::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px; background:var(--accent); transform:scaleX(0); transition:transform .25s ease; }
        .nav-links a:hover { color:var(--text); }
        .nav-links a:hover::after { transform:scaleX(1); }
        .nav-right { display:flex; align-items:center; gap:1rem; }
        .nav-delivery { font-size:.78rem; color:var(--accent); font-family:'Space Grotesk',sans-serif; padding:.35rem .9rem; border:1px solid rgba(${accentRgb},.35); border-radius:30px; display:flex; align-items:center; gap:.4rem; background:rgba(${accentRgb},.06); }
        .btn-accent { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:none; padding:.72rem 1.6rem; border-radius:30px; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer; transition:all .3s; text-decoration:none; display:inline-flex; align-items:center; gap:.45rem; }
        .btn-accent:hover { transform:translateY(-2px); animation:accentPulse 2s infinite; }
        .btn-ghost { background:transparent; color:var(--text); border:1px solid rgba(255,255,255,.18); padding:.72rem 1.6rem; border-radius:30px; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:500; cursor:pointer; transition:all .3s; text-decoration:none; display:inline-flex; align-items:center; gap:.45rem; }
        .btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
        .hamburger { display:none; background:none; border:none; color:var(--text); cursor:pointer; padding:.5rem; }
        .mobile-menu { display:none; position:fixed; inset:0; z-index:999; background:rgba(6,4,10,.97); backdrop-filter:blur(24px); flex-direction:column; align-items:center; justify-content:center; gap:2.2rem; }
        .mobile-menu.open { display:flex; }
        .mobile-menu a { font-family:'Playfair Display',serif; font-size:2.2rem; color:var(--text); text-decoration:none; transition:color .2s; }
        .mobile-menu a:hover { color:var(--accent); }
        .mobile-close { position:absolute; top:1.5rem; right:1.5rem; background:none; border:none; color:var(--text); cursor:pointer; }

        /* ── HERO ── */
        .hero { min-height:100vh; display:flex; align-items:center; position:relative; overflow:hidden; padding:8rem 2.5rem 5rem; }
        .hero-orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .hero-orb-1 { width:700px; height:700px; background:var(--accent); opacity:.07; top:50%; left:50%; transform:translate(-50%,-50%); animation:slowRotate 35s linear infinite; }
        .hero-orb-2 { width:350px; height:350px; background:var(--accent2); opacity:.05; top:15%; right:8%; animation:slowRotate 25s linear infinite reverse; }
        .hero-orb-3 { width:250px; height:250px; background:var(--accent); opacity:.04; bottom:10%; left:5%; animation:slowRotate 20s linear infinite; }
        .dot-grid { position:absolute; inset:0; background-image:radial-gradient(circle, rgba(${accentRgb},.07) 1px, transparent 1px); background-size:26px 26px; pointer-events:none; }
        .petal-float { position:absolute; border-radius:60% 40% 70% 30% / 50% 60% 40% 50%; pointer-events:none; animation:petalSpin var(--dur,6s) ease-in-out infinite; }
        .hero-content { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; max-width:1400px; margin:0 auto; width:100%; }
        .hero-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(${accentRgb},.1); border:1px solid rgba(${accentRgb},.3); border-radius:30px; padding:.42rem 1.1rem; font-size:.82rem; color:var(--accent); margin-bottom:1.6rem; font-family:'Space Grotesk',sans-serif; width:fit-content; }
        .hero-heading { font-family:'Playfair Display',serif; font-style:italic; line-height:1.05; margin-bottom:1.1rem; overflow:hidden; }
        .hero-line-1,.hero-line-2,.hero-line-3 { display:block; font-size:clamp(3.2rem,8vw,6.5rem); font-weight:700; }
        .hero-line-1,.hero-line-3 { color:var(--text); }
        .hero-line-2 { background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-tagline { font-family:'Cormorant Garamond',serif; font-size:1.15rem; color:var(--gold); letter-spacing:.06em; margin-bottom:1.1rem; font-style:italic; }
        .hero-body { color:var(--text-muted); line-height:1.8; margin-bottom:2.2rem; max-width:500px; font-size:.97rem; }
        .hero-buttons { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2.5rem; }
        .trust-strip { display:flex; gap:2rem; flex-wrap:wrap; }
        .trust-item { display:flex; align-items:center; gap:.45rem; font-size:.83rem; color:var(--text-muted); }
        .trust-item svg { color:var(--accent); flex-shrink:0; }
        .hero-right { position:relative; display:flex; justify-content:center; align-items:center; min-height:460px; }
        .hero-img-wrap { width:320px; height:320px; border-radius:50%; overflow:hidden; border:1px solid rgba(${accentRgb},.2); box-shadow:0 0 80px rgba(${accentRgb},.15); position:relative; }
        .hero-img-wrap img { width:100%; height:100%; object-fit:cover; }
        .hero-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(${accentRgb},.12),rgba(${accentRgb},.04)); }
        .floating-card { position:absolute; background:rgba(16,12,24,.92); border:1px solid rgba(${accentRgb},.2); border-radius:16px; padding:1rem 1.3rem; backdrop-filter:blur(20px); animation:float var(--dur,4s) ease-in-out infinite; min-width:160px; }
        .floating-card:nth-child(2) { top:4%; right:0; --dur:3.2s; }
        .floating-card:nth-child(3) { top:42%; left:-5%; --dur:4.1s; }
        .floating-card:nth-child(4) { bottom:4%; right:10%; --dur:5s; }
        .fc-icon { color:var(--accent); margin-bottom:.4rem; }
        .fc-title { font-size:.85rem; color:var(--text); font-weight:600; margin-bottom:.2rem; }
        .fc-sub { font-size:.76rem; color:var(--text-muted); }
        .fc-stars { display:flex; gap:2px; color:var(--gold); margin-bottom:.3rem; }

        /* ── STATS ── */
        .stats-section { background:linear-gradient(135deg,rgba(${accentRgb},.06),transparent 60%); border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:3.5rem 2rem; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2rem; max-width:1000px; margin:0 auto; text-align:center; }
        .stat-item { }
        .stat-number { font-family:'Space Grotesk',sans-serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:700; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; animation:${statsVisible ? "scaleIn .6s ease forwards" : "none"}; }
        .stat-label { font-size:.82rem; color:var(--text-muted); margin-top:.5rem; letter-spacing:.02em; }
        .stat-icon { color:var(--accent); margin-bottom:.5rem; opacity:.7; }

        /* ── SECTION WRAPPER ── */
        .section { padding:clamp(4rem,8vw,7rem) clamp(1rem,4vw,3rem); max-width:1440px; margin:0 auto; }
        .section-header { text-align:center; margin-bottom:3.5rem; }
        .section-label { font-family:'Space Grotesk',sans-serif; font-size:.72rem; letter-spacing:.22em; text-transform:uppercase; color:var(--accent); margin-bottom:.6rem; display:flex; align-items:center; justify-content:center; gap:.5rem; }
        .section-label::before,.section-label::after { content:''; flex:1; max-width:60px; height:1px; background:linear-gradient(90deg,transparent,var(--accent)); }
        .section-label::after { background:linear-gradient(270deg,transparent,var(--accent)); }
        .section-h2 { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4.5vw,2.8rem); color:var(--text); margin-bottom:.8rem; line-height:1.2; }
        .section-sub { color:var(--text-muted); font-size:.97rem; max-width:520px; margin:0 auto; line-height:1.7; }

        /* ── COLLECTIONS ── */
        .collections-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .collection-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; overflow:hidden; cursor:pointer; transition:all .35s cubic-bezier(.4,0,.2,1); position:relative; min-height:240px; display:flex; flex-direction:column; }
        .collection-card.wide { grid-column:span 2; }
        .collection-card:hover { transform:translateY(-7px); box-shadow:0 24px 60px rgba(${accentRgb},.22); border-color:rgba(${accentRgb},.4); }
        .collection-card:hover .col-arrow { opacity:1; transform:translateX(0); }
        .col-img-wrap { height:160px; overflow:hidden; position:relative; }
        .col-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
        .collection-card:hover .col-img-wrap img { transform:scale(1.06); }
        .col-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
        .col-tag { position:absolute; top:.8rem; left:.8rem; background:rgba(${accentRgb},.85); color:#fff; font-size:.68rem; padding:.25rem .65rem; border-radius:20px; font-family:'Space Grotesk',sans-serif; font-weight:600; letter-spacing:.05em; z-index:2; }
        .col-body { padding:1.3rem 1.4rem 1.4rem; flex:1; display:flex; flex-direction:column; justify-content:space-between; }
        .col-top { }
        .col-icon-wrap { width:38px; height:38px; background:rgba(${accentRgb},.1); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--accent); margin-bottom:.75rem; }
        .col-name { font-family:'Playfair Display',serif; font-size:1.1rem; margin-bottom:.4rem; }
        .col-desc { color:var(--text-muted); font-size:.83rem; line-height:1.5; margin-bottom:.8rem; }
        .col-footer { display:flex; align-items:center; justify-content:space-between; }
        .col-price { font-family:'Space Grotesk',sans-serif; font-size:.88rem; color:var(--accent); font-weight:600; }
        .col-arrow { color:var(--accent); opacity:0; transform:translateX(-6px); transition:all .3s ease; }

        /* ── WHY US ── */
        .why-section { padding:clamp(4rem,8vw,7rem) clamp(1rem,4vw,3rem); }
        .why-grid { display:grid; grid-template-columns:3fr 2fr; gap:5rem; align-items:center; max-width:1200px; margin:0 auto; }
        .why-heading { font-family:'Cormorant Garamond',serif; font-size:clamp(2.5rem,6vw,5rem); font-style:italic; line-height:1.1; color:var(--text); margin-bottom:1.5rem; }
        .why-body { color:var(--text-muted); line-height:1.85; margin-bottom:1.5rem; font-size:.97rem; }
        .gold-divider { height:1px; background:linear-gradient(90deg,var(--gold) 0%,rgba(201,168,76,.3) 60%,transparent 100%); margin:1.5rem 0; }
        .why-stats-inline { color:var(--text-muted); font-size:.92rem; }
        .why-stats-inline strong { color:var(--gold); }
        .feature-list { display:flex; flex-direction:column; gap:1.6rem; }
        .feature-item { display:flex; gap:1rem; align-items:flex-start; }
        .feature-icon-box { width:44px; height:44px; border-radius:12px; background:rgba(${accentRgb},.1); border:1px solid rgba(${accentRgb},.2); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
        .feature-title { font-weight:600; font-size:.95rem; margin-bottom:.3rem; }
        .feature-desc { color:var(--text-muted); font-size:.84rem; line-height:1.55; }

        /* ── PRODUCTS ── */
        .filter-tabs { display:flex; gap:.5rem; flex-wrap:wrap; justify-content:center; margin-bottom:2.8rem; }
        .filter-tab { padding:.48rem 1.2rem; border-radius:30px; border:1px solid var(--border); background:transparent; color:var(--text-muted); font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .25s; font-size:.85rem; font-weight:500; }
        .filter-tab.active,.filter-tab:hover { background:var(--accent); color:#fff; border-color:var(--accent); }
        .products-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .product-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; overflow:hidden; cursor:pointer; transition:all .35s cubic-bezier(.4,0,.2,1); position:relative; }
        .product-card:hover { transform:translateY(-8px); box-shadow:0 20px 60px rgba(${accentRgb},.25); border-color:rgba(${accentRgb},.35); }
        .product-card:hover .p-order-btn { transform:translateY(0); opacity:1; }
        .product-card:hover .p-wish { opacity:1; }
        .product-card:hover .p-img { transform:scale(1.05); }
        .product-img-wrap { position:relative; height:200px; overflow:hidden; }
        .p-img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
        .p-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
        .p-badge { position:absolute; top:.8rem; left:.8rem; font-size:.68rem; background:rgba(${accentRgb},.85); color:#fff; padding:.25rem .65rem; border-radius:20px; font-family:'Space Grotesk',sans-serif; font-weight:600; z-index:2; }
        .p-wish { position:absolute; top:.8rem; right:.8rem; width:32px; height:32px; background:rgba(6,4,10,.7); border-radius:50%; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .3s; cursor:pointer; backdrop-filter:blur(10px); color:var(--text-muted); border:none; }
        .p-wish:hover { color:var(--accent); }
        .product-info { padding:1.2rem 1.3rem 1.3rem; }
        .p-name { font-family:'Playfair Display',serif; font-size:1rem; margin-bottom:.35rem; line-height:1.3; }
        .p-flowers { color:var(--text-muted); font-size:.79rem; margin-bottom:.3rem; display:flex; align-items:center; gap:.3rem; }
        .p-size-tag { display:inline-flex; align-items:center; font-size:.7rem; background:var(--surface2); border-radius:8px; padding:.15rem .55rem; color:var(--text-muted); margin-bottom:.85rem; }
        .p-price-row { display:flex; align-items:baseline; gap:.5rem; }
        .p-price { font-family:'Space Grotesk',sans-serif; font-size:1.3rem; font-weight:700; color:var(--text); }
        .p-currency { font-size:.75rem; color:var(--text-muted); }
        .p-old { font-family:'Space Grotesk',sans-serif; font-size:.88rem; color:var(--text-muted); text-decoration:line-through; }
        .p-order-btn { display:flex; align-items:center; justify-content:center; gap:.4rem; width:100%; margin-top:.85rem; padding:.62rem; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.85rem; font-weight:600; cursor:pointer; transition:all .3s; transform:translateY(20px); opacity:0; }

        /* ── FLORISTS ── */
        .florists-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .florist-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; overflow:hidden; transition:all .4s; }
        .florist-card:hover { box-shadow:0 20px 60px rgba(${accentRgb},.2); border-color:rgba(${accentRgb},.3); transform:perspective(800px) rotateY(3deg) rotateX(-2deg) translateY(-4px); }
        .florist-card:hover .florist-cta { opacity:1; transform:translateY(0); }
        .florist-top { position:relative; overflow:hidden; height:220px; }
        .florist-top img { width:100%; height:100%; object-fit:cover; object-position:top; }
        .florist-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg,rgba(${accentRgb},.08),transparent); }
        .florist-badge { position:absolute; top:.8rem; right:.8rem; font-size:.68rem; background:rgba(201,168,76,.85); color:#000; padding:.25rem .65rem; border-radius:20px; font-family:'Space Grotesk',sans-serif; font-weight:700; }
        .florist-overlay { position:absolute; bottom:0; left:0; right:0; padding:1rem; background:linear-gradient(0deg,rgba(6,4,10,.95) 60%,transparent); }
        .florist-quote-text { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:.95rem; color:rgba(248,244,252,.75); line-height:1.4; }
        .florist-bottom { padding:1.3rem; }
        .florist-name { font-family:'Playfair Display',serif; font-size:1.05rem; margin-bottom:.2rem; }
        .florist-role { color:var(--text-muted); font-size:.82rem; margin-bottom:.8rem; }
        .florist-tags { display:flex; gap:.4rem; flex-wrap:wrap; }
        .florist-tag { font-size:.69rem; background:var(--surface2); border:1px solid var(--border); padding:.18rem .55rem; border-radius:8px; color:var(--text-muted); display:flex; align-items:center; gap:.3rem; }
        .florist-cta { display:flex; align-items:center; justify-content:center; gap:.4rem; width:100%; margin-top:1rem; padding:.6rem; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.85rem; font-weight:600; cursor:pointer; opacity:0; transform:translateY(8px); transition:all .3s; }

        /* ── ORDER PROCESS ── */
        .process-section { padding:clamp(4rem,8vw,7rem) clamp(1rem,4vw,3rem); background:linear-gradient(180deg,transparent,rgba(${accentRgb},.04),transparent); }
        .process-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; max-width:1050px; margin:0 auto; position:relative; }
        .process-connector { position:absolute; top:2rem; left:calc(12.5% + 1rem); right:calc(12.5% + 1rem); height:1px; background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent); }
        .process-step { text-align:center; padding:1rem .5rem; position:relative; }
        .step-number { font-family:'Space Grotesk',sans-serif; font-size:.72rem; font-weight:700; color:var(--accent); letter-spacing:.15em; text-transform:uppercase; margin-bottom:.6rem; }
        .step-icon-circle { width:60px; height:60px; border-radius:50%; background:var(--surface2); border:2px solid rgba(${accentRgb},.25); display:flex; align-items:center; justify-content:center; margin:0 auto .9rem; color:var(--accent); transition:all .4s; box-shadow:0 0 20px rgba(${accentRgb},.15); }
        .process-step:hover .step-icon-circle { border-color:var(--accent); box-shadow:0 0 30px rgba(${accentRgb},.4); background:rgba(${accentRgb},.1); }
        .step-title { font-family:'Playfair Display',serif; font-size:1rem; margin-bottom:.45rem; }
        .step-desc { color:var(--text-muted); font-size:.82rem; line-height:1.55; }

        /* ── TESTIMONIALS ── */
        .testimonials-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; align-items:start; }
        .testimonial-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; padding:1.6rem; position:relative; transition:all .3s; overflow:hidden; }
        .testimonial-card:hover { transform:translateY(-5px); box-shadow:0 16px 45px rgba(${accentRgb},.15); }
        .t-quotemark { position:absolute; top:1rem; right:1.3rem; font-size:5rem; color:var(--accent); opacity:.08; font-family:'Cormorant Garamond',serif; line-height:1; pointer-events:none; }
        .t-stars { display:flex; gap:.2rem; color:var(--gold); margin-bottom:.85rem; animation:starGlow 3s infinite; }
        .t-occasion { display:inline-flex; align-items:center; gap:.4rem; font-size:.7rem; background:rgba(${accentRgb},.08); border:1px solid rgba(${accentRgb},.18); color:var(--accent); padding:.22rem .65rem; border-radius:20px; margin-bottom:.85rem; font-family:'Space Grotesk',sans-serif; font-weight:600; }
        .t-result { font-size:.97rem; font-weight:700; color:var(--accent); margin-bottom:.75rem; }
        .t-text { color:var(--text-muted); font-size:.86rem; line-height:1.65; margin-bottom:1.3rem; }
        .t-author { display:flex; align-items:center; gap:.85rem; border-top:1px solid var(--border); padding-top:1rem; }
        .t-avatar { width:42px; height:42px; border-radius:50%; overflow:hidden; border:2px solid rgba(${accentRgb},.2); flex-shrink:0; }
        .t-avatar img { width:100%; height:100%; object-fit:cover; }
        .t-avatar-fallback { width:100%; height:100%; background:rgba(${accentRgb},.1); display:flex; align-items:center; justify-content:center; color:var(--accent); }
        .t-name { font-size:.9rem; font-weight:600; }
        .t-role { font-size:.76rem; color:var(--text-muted); }
        .t-date { font-size:.73rem; color:var(--text-muted); opacity:.7; }

        /* ── PRICING ── */
        .price-tiers-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.3rem; margin-bottom:3rem; }
        .price-tier { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:1.6rem 1.4rem; text-align:center; transition:all .3s; }
        .price-tier:hover { border-color:rgba(${accentRgb},.35); transform:translateY(-4px); }
        .pt-label { font-size:.75rem; color:var(--text-muted); letter-spacing:.08em; text-transform:uppercase; margin-bottom:.4rem; font-family:'Space Grotesk',sans-serif; }
        .pt-price { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:700; color:var(--accent); margin-bottom:.3rem; }
        .pt-name { font-family:'Playfair Display',serif; font-size:1.05rem; margin-bottom:.4rem; }
        .pt-desc { color:var(--text-muted); font-size:.8rem; }
        .wedding-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; margin-bottom:3rem; }
        .wp-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; padding:2rem; position:relative; overflow:hidden; transition:all .3s; }
        .wp-card.popular { border-color:var(--accent); }
        .wp-popular-badge { position:absolute; top:1rem; right:-2.5rem; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; font-size:.72rem; padding:.3rem 3.5rem; transform:rotate(45deg); font-family:'Space Grotesk',sans-serif; font-weight:700; }
        .wp-price { font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; color:var(--text); line-height:1; margin-bottom:.3rem; }
        .wp-price sup { font-size:1rem; color:var(--text-muted); }
        .wp-name { font-family:'Playfair Display',serif; font-size:1.3rem; margin-bottom:.4rem; }
        .wp-note { color:var(--text-muted); font-size:.84rem; margin-bottom:1.2rem; }
        .wp-list { list-style:none; display:flex; flex-direction:column; gap:.5rem; }
        .wp-item { display:flex; align-items:center; gap:.6rem; color:var(--text-muted); font-size:.87rem; }
        .wp-item svg { color:var(--accent); flex-shrink:0; }
        .sub-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
        .sub-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; padding:2rem; }
        .sub-title { font-family:'Playfair Display',serif; font-size:1.3rem; margin-bottom:.5rem; }
        .sub-price { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:700; color:var(--accent); margin-bottom:.3rem; }
        .sub-detail { color:var(--text-muted); font-size:.84rem; margin-bottom:1.2rem; }
        .sub-list { list-style:none; display:flex; flex-direction:column; gap:.5rem; }
        .sub-list li { display:flex; align-items:center; gap:.6rem; color:var(--text-muted); font-size:.86rem; }
        .sub-list li svg { color:var(--accent); flex-shrink:0; }

        /* ── EVENTS ── */
        .events-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:1rem; }
        .event-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:1.5rem 1rem; text-align:center; transition:all .3s; cursor:pointer; }
        .event-card:hover { border-color:var(--accent); transform:translateY(-5px); box-shadow:0 12px 35px rgba(${accentRgb},.15); }
        .event-icon { width:48px; height:48px; border-radius:14px; background:rgba(${accentRgb},.1); display:flex; align-items:center; justify-content:center; color:var(--accent); margin:0 auto .9rem; }
        .event-name { font-family:'Playfair Display',serif; font-size:.9rem; margin-bottom:.35rem; }
        .event-sub { color:var(--text-muted); font-size:.75rem; margin-bottom:.65rem; }
        .event-days { font-family:'Space Grotesk',sans-serif; font-size:.76rem; color:var(--accent); background:rgba(${accentRgb},.1); border-radius:20px; padding:.2rem .65rem; display:inline-block; font-weight:600; }

        /* ── CONTACT ── */
        .contact-grid { display:grid; grid-template-columns:1fr 1.6fr; gap:4rem; max-width:1100px; margin:0 auto; }
        .contact-info-heading { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,3.5vw,2.3rem); margin-bottom:1rem; line-height:1.2; }
        .contact-info-body { color:var(--text-muted); line-height:1.75; margin-bottom:2rem; font-size:.95rem; }
        .contact-item { display:flex; align-items:center; gap:.8rem; margin-bottom:.9rem; color:var(--text-muted); font-size:.9rem; }
        .contact-item-icon { width:36px; height:36px; border-radius:10px; background:rgba(${accentRgb},.1); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
        .contact-item strong { color:var(--text); }
        .social-row { display:flex; gap:.7rem; margin-top:1.4rem; flex-wrap:wrap; }
        .social-btn { display:inline-flex; align-items:center; gap:.45rem; color:var(--text-muted); text-decoration:none; font-size:.82rem; background:var(--surface); border:1px solid var(--border); padding:.42rem .9rem; border-radius:20px; transition:all .25s; }
        .social-btn:hover { border-color:var(--accent); color:var(--accent); background:rgba(${accentRgb},.06); }
        .form-card { background:var(--surface); border:1px solid var(--border); border-radius:26px; padding:2.5rem; }
        .form-group { margin-bottom:1.2rem; }
        .form-label { display:block; font-size:.82rem; color:var(--text-muted); margin-bottom:.42rem; font-weight:500; }
        .form-label .req { color:var(--accent); }
        .form-input { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:.82rem 1rem; color:var(--text); font-family:'DM Sans',sans-serif; font-size:.9rem; transition:border-color .2s; outline:none; }
        .form-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(${accentRgb},.08); }
        .form-select { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:.82rem 1rem; color:var(--text); font-family:'DM Sans',sans-serif; font-size:.9rem; outline:none; cursor:pointer; appearance:none; }
        .form-select:focus { border-color:var(--accent); }
        .radio-group { display:flex; gap:1rem; flex-wrap:wrap; }
        .radio-item { display:flex; align-items:center; gap:.45rem; cursor:pointer; font-size:.9rem; color:var(--text-muted); }
        .radio-item input { accent-color:var(--accent); }
        .color-swatches { display:flex; gap:.5rem; flex-wrap:wrap; }
        .cswatch { width:30px; height:30px; border-radius:50%; cursor:pointer; transition:all .2s; border:2px solid transparent; }
        .cswatch:hover { transform:scale(1.2); }
        .cswatch.selected { border-color:#fff; box-shadow:0 0 0 2px var(--accent); transform:scale(1.15); }
        .budget-val { font-family:'Space Grotesk',sans-serif; color:var(--accent); font-weight:700; }
        .budget-hint { font-size:.76rem; color:var(--text-muted); margin-top:.35rem; }
        .form-textarea { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:.82rem 1rem; color:var(--text); font-family:'DM Sans',sans-serif; font-size:.9rem; resize:vertical; min-height:80px; outline:none; transition:border-color .2s; }
        .form-textarea:focus { border-color:var(--accent); }
        .form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .submit-btn { width:100%; padding:1rem 1.5rem; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:none; border-radius:14px; font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:700; cursor:pointer; transition:all .3s; margin-top:.6rem; display:flex; align-items:center; justify-content:center; gap:.5rem; letter-spacing:.02em; }
        .submit-btn:hover { animation:accentPulse 2s infinite; transform:translateY(-2px); }
        .success-wrap { text-align:center; padding:2.5rem 1.5rem; animation:scaleIn .5s ease; }
        .success-check { width:80px; height:80px; margin:0 auto 1.5rem; }
        .success-title { font-family:'Playfair Display',serif; font-size:1.5rem; color:var(--accent); margin-bottom:1rem; }
        .success-body { color:var(--text-muted); line-height:1.75; font-size:.92rem; }

        /* ── FOOTER ── */
        .footer { border-top:1px solid var(--border); padding:4.5rem 2.5rem 2rem; background:linear-gradient(180deg,transparent,rgba(${accentRgb},.04)); }
        .footer-inner { max-width:1200px; margin:0 auto; }
        .footer-grid { display:grid; grid-template-columns:2.2fr 1fr 1fr 1.8fr; gap:3rem; margin-bottom:2.5rem; }
        .footer-logo { font-family:'Cormorant Garamond',serif; font-size:1.8rem; color:var(--text); margin-bottom:.5rem; display:flex; align-items:center; gap:.5rem; }
        .footer-logo svg { color:var(--accent); }
        .footer-tagline { color:var(--text-muted); font-size:.88rem; font-style:italic; margin-bottom:1rem; }
        .footer-bio { color:var(--text-muted); font-size:.83rem; line-height:1.65; }
        .footer-col-h { font-family:'Playfair Display',serif; font-size:1rem; margin-bottom:1.1rem; }
        .footer-links { list-style:none; display:flex; flex-direction:column; gap:.5rem; }
        .footer-links a { color:var(--text-muted); text-decoration:none; font-size:.86rem; transition:color .2s; display:flex; align-items:center; gap:.4rem; }
        .footer-links a:hover { color:var(--accent); }
        .footer-contact-row { display:flex; gap:.7rem; margin-bottom:.7rem; color:var(--text-muted); font-size:.85rem; align-items:flex-start; }
        .footer-contact-icon { color:var(--accent); flex-shrink:0; margin-top:.1rem; }
        .footer-social { display:flex; gap:.6rem; margin-top:1rem; flex-wrap:wrap; }
        .footer-social a { display:flex; align-items:center; gap:.4rem; color:var(--text-muted); text-decoration:none; font-size:.8rem; background:var(--surface); border:1px solid var(--border); padding:.38rem .8rem; border-radius:20px; transition:all .25s; }
        .footer-social a:hover { border-color:var(--accent); color:var(--accent); }
        .footer-bottom { border-top:1px solid var(--border); padding-top:1.5rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
        .footer-copy { color:var(--text-muted); font-size:.8rem; }
        .footer-copy a { color:var(--accent); text-decoration:none; }
        .footer-agency { font-size:.78rem; color:var(--text-muted); display:flex; align-items:center; gap:.4rem; }

        /* ── RESPONSIVE ── */
        @media (max-width:1100px) {
          .collections-grid { grid-template-columns:repeat(2,1fr); }
          .collection-card.wide { grid-column:span 1; }
          .products-grid { grid-template-columns:repeat(3,1fr); }
          .florists-grid { grid-template-columns:repeat(2,1fr); }
          .events-grid { grid-template-columns:repeat(3,1fr); }
          .footer-grid { grid-template-columns:1fr 1fr; }
          .why-grid { gap:3rem; }
        }
        @media (max-width:768px) {
          .nav-links,.nav-right { display:none; }
          .hamburger { display:flex; }
          .hero-content { grid-template-columns:1fr; }
          .hero-right { display:none; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .why-grid { grid-template-columns:1fr; }
          .products-grid { grid-template-columns:repeat(2,1fr); }
          .florists-grid { overflow-x:auto; display:flex; gap:1rem; padding-bottom:1rem; }
          .florist-card { min-width:260px; flex-shrink:0; }
          .process-steps { grid-template-columns:1fr 1fr; }
          .process-connector { display:none; }
          .testimonials-grid { grid-template-columns:1fr; }
          .price-tiers-grid { grid-template-columns:repeat(2,1fr); }
          .wedding-grid { grid-template-columns:1fr; }
          .sub-grid { grid-template-columns:1fr; }
          .events-grid { grid-template-columns:repeat(2,1fr); }
          .contact-grid { grid-template-columns:1fr; }
          .footer-grid { grid-template-columns:1fr; }
          .collections-grid { grid-template-columns:1fr; }
          .hero-line-1,.hero-line-2,.hero-line-3 { font-size:clamp(2.5rem,14vw,4rem); }
          .form-grid-2 { grid-template-columns:1fr; }
          .footer-bottom { flex-direction:column; text-align:center; }
        }
        @media (max-width:480px) {
          .products-grid { grid-template-columns:1fr; }
          .price-tiers-grid { grid-template-columns:1fr; }
          .events-grid { grid-template-columns:repeat(2,1fr); }
          .process-steps { grid-template-columns:1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${navScrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <Flower2 size={22} />
          {SHOP.name}
        </a>
        <ul className="nav-links">
          {[["#collections","Koleksiýalar"],["#products","Çemenler"],["#florists","Floristler"],["#pricing","Bahalar"],["#contact","Habarlaş"]].map(([h,l]) => (
            <li key={h}><a href={h}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <span className="nav-delivery"><Truck size={13} /> {SHOP.delivery} min Eltip Bermek</span>
          <a href="#contact" className="btn-accent"><ShoppingBag size={15} /> Sargyt Et</a>
        </div>
        <button className="hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
          <Menu size={24} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}><X size={28} /></button>
        {[["#collections","Koleksiýalar"],["#products","Çemenler"],["#florists","Floristler"],["#pricing","Bahalar"],["#contact","Habarlaş"]].map(([h,l]) => (
          <a key={h} href={h} onClick={() => setMobileMenuOpen(false)}>{l}</a>
        ))}
        <a href={`tel:${SHOP.phone}`} style={{ fontSize: "1rem", color: "var(--accent)" }}>{SHOP.phone}</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="dot-grid" />
        <div className="petal-float" style={{ width: 100, height: 100, background: `rgba(${accentRgb},.05)`, top: "12%", left: "3%", "--dur": "8s" } as React.CSSProperties} />
        <div className="petal-float" style={{ width: 70, height: 70, background: `rgba(${accentRgb},.04)`, top: "65%", left: "2%", "--dur": "10s" } as React.CSSProperties} />

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <Star size={13} fill="currentColor" />
              {SHOP.city} &middot; {SHOP.rating}★ &middot; {SHOP.reviews} teswir
            </div>
            <h1 className="hero-heading">
              <span className="hero-line-1">Duýgularyňy</span>
              <span className="hero-line-2">güller bilen</span>
              <span className="hero-line-3">aýt.</span>
            </h1>
            <p className="hero-tagline">— {SHOP.tagline}</p>
            <p className="hero-body">
              {SHOP.name} — {SHOP.city} şäherinde iň owadan gül çemenler,<br />
              sowgat gutulary we buket dizaýny. {SHOP.orders} bagtly müşderimiz bar.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn-accent hbtn"><Flower size={16} /> Sargyt Et <ArrowRight size={15} /></a>
              <a href="#collections" className="btn-ghost hbtn">Koleksiýalara Gör</a>
            </div>
            <div className="trust-strip">
              <span className="trust-item"><Truck size={14} /> {SHOP.delivery} min içinde</span>
              <span className="trust-item"><Sparkles size={14} /> Täze güller her gün</span>
              <span className="trust-item"><Ribbon size={14} /> Mugt gaplama</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-img-wrap">
              <img src={img("hero-bouquet.png")} alt="Premium güller" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="hero-img-fallback">
                <Flower2 size={100} color={`rgba(${accentRgb},.4)`} />
              </div>
            </div>
            <div className="floating-card">
              <div className="fc-stars">{[...Array(5)].map((_,i) => <Star key={i} size={11} fill="currentColor" />)}</div>
              <div className="fc-title">Düýn iberildi</div>
              <div className="fc-sub">"Örän owadan!" — Aýna</div>
            </div>
            <div className="floating-card">
              <div className="fc-icon"><Truck size={18} /></div>
              <div className="fc-title">Çalt Eltip Bermek</div>
              <div className="fc-sub">{SHOP.delivery} minut</div>
            </div>
            <div className="floating-card">
              <div className="fc-icon"><Award size={18} /></div>
              <div className="fc-title">{SHOP.orders}</div>
              <div className="fc-sub">Bagtly Sargyt</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {[
            { num: SHOP.orders, label: "Bagtly Sargyt", Icon: Heart },
            { num: SHOP.rating + "★", label: "Ortaça Baha", Icon: Star },
            { num: SHOP.reviews, label: "Müşderi Teswiri", Icon: MessageCircle },
            { num: SHOP.delivery + " min", label: "Eltip Bermek Wagty", Icon: Truck },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon"><s.Icon size={20} /></div>
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="section">
        <div className="section-header reveal">
          <div className="section-label">Koleksiýalar</div>
          <h2 className="section-h2">Sizi Näme Üçin Getirdi?</h2>
          <p className="section-sub">Duýgunuza laýyk çemen tapyň.</p>
        </div>
        <div className="collections-grid card-group">
          {collections.map(c => (
            <div key={c.id} className={`collection-card card-anim ${c.wide ? "wide" : ""}`}>
              {c.img ? (
                <div className="col-img-wrap">
                  <div className="col-tag">{c.tag}</div>
                  <img src={img(c.img)} alt={c.name} onError={e => {
                    const wrap = (e.target as HTMLImageElement).parentElement!;
                    wrap.style.background = c.gradient;
                    (e.target as HTMLImageElement).style.display = "none";
                  }} />
                </div>
              ) : (
                <div className="col-img-wrap">
                  <div className="col-tag">{c.tag}</div>
                  <div className="col-img-placeholder" style={{ background: c.gradient }}>
                    <c.Icon size={48} color={`rgba(${accentRgb},.5)`} />
                  </div>
                </div>
              )}
              <div className="col-body">
                <div className="col-top">
                  <div className="col-icon-wrap"><c.Icon size={18} /></div>
                  <div className="col-name">{c.name}</div>
                  <div className="col-desc">{c.desc}</div>
                </div>
                <div className="col-footer">
                  <div className="col-price">{c.priceFrom} TMT-dan · {c.items}</div>
                  <div className="col-arrow"><ChevronRight size={18} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="why-section">
        <div className="why-grid">
          <div className="reveal">
            <h2 className="why-heading">Her çemen<br />bir hekaýa.</h2>
            <p className="why-body">
              Biz diňe gül satmaýarys —<br />
              duýgulary, ýatlamalary we möhüm pursatlary bezäp berýäris.
            </p>
            <p className="why-body">
              {SHOP.name}, {SHOP.founded}-njy ýyldan bäri<br />
              {SHOP.city} şäherinde bagtly pursatlar döredýär.
            </p>
            <div className="gold-divider" />
            <p className="why-stats-inline"><strong>{SHOP.orders}</strong> sargyt · <strong>{SHOP.rating}★</strong> baha</p>
          </div>
          <div className="feature-list card-group">
            {[
              { Icon: Leaf, title: "Täze Güller, Her Gün", desc: `Floristlerimiz her irden bazara gidip iň täze gülleri saýlaýar.` },
              { Icon: Scissors, title: "Hünärmen Floristler", desc: `5+ ýyllyk tejribeli dizaýnerlerimiz her çemeni eser hökmünde işleýär.` },
              { Icon: Truck, title: `${SHOP.delivery} Min Eltip Bermek`, desc: `${SHOP.city} içinde. Sowadyjyly ulag bilen gül täze ýetýär.` },
              { Icon: Ribbon, title: "Mugt Premium Gaplama", desc: `Her sargyt bilen mugt ribbon, sowgat haty we owadan gaplama.` },
            ].map((f, i) => (
              <div key={i} className="feature-item card-anim">
                <div className="feature-icon-box"><f.Icon size={20} /></div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
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
          {[["all","Hemmesi"],["love","Söýgi"],["birthday","Doglan Gün"],["wedding","Toý"],["gift","Sowgat"],["corporate","Korporatiw"]].map(([id,label]) => (
            <button key={id} className={`filter-tab ${activeFilter === id ? "active" : ""}`} onClick={() => setActiveFilter(id)}>{label}</button>
          ))}
        </div>
        <div className="products-grid card-group">
          {filteredProducts.map(p => (
            <div key={p.id} className="product-card card-anim">
              <div className="product-img-wrap">
                {p.img ? (
                  <img className="p-img" src={img(p.img)} alt={p.name} onError={e => {
                    const wrap = (e.target as HTMLImageElement).parentElement!;
                    (e.target as HTMLImageElement).style.display = "none";
                    wrap.style.background = p.gradient;
                  }} />
                ) : (
                  <div className="p-img-fallback" style={{ background: p.gradient }}>
                    <Flower2 size={56} color={`rgba(${accentRgb},.4)`} />
                  </div>
                )}
                <span className="p-badge">{p.badge}</span>
                <button className="p-wish"><Heart size={14} /></button>
              </div>
              <div className="product-info">
                <div className="p-name">{p.name}</div>
                <div className="p-flowers"><Leaf size={12} /> {p.flowers}</div>
                <div className="p-size-tag">{p.size}</div>
                <div className="p-price-row">
                  <span className="p-price">{p.price}</span>
                  <span className="p-currency">TMT</span>
                  {p.oldPrice && <span className="p-old">{p.oldPrice}</span>}
                </div>
                <button className="p-order-btn" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                  <ShoppingBag size={14} /> Sargyt Et
                </button>
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
                <img src={img(f.img)} alt={f.name} onError={e => {
                  (e.target as HTMLImageElement).style.display = "none";
                }} />
                <div className="florist-img-fallback" style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,rgba(${accentRgb},.1),transparent)` }}>
                  <Camera size={48} color={`rgba(${accentRgb},.3)`} />
                </div>
                <span className="florist-badge">{f.achievement}</span>
                <div className="florist-overlay">
                  <p className="florist-quote-text">"{f.quote}"</p>
                </div>
              </div>
              <div className="florist-bottom">
                <div className="florist-name">{f.name}</div>
                <div className="florist-role">{f.title}</div>
                <div className="florist-tags">
                  <span className="florist-tag"><Clock size={10} /> {f.exp}</span>
                  <span className="florist-tag"><Flower size={10} /> {f.specialty}</span>
                  <span className="florist-tag"><Award size={10} /> {f.cert}</span>
                </div>
                <button className="florist-cta" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                  <Phone size={14} /> Habarlaş
                </button>
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
        <div className="process-steps reveal">
          <div className="process-connector" />
          {[
            { n: "01", Icon: Phone, title: "Habarlaş", desc: "Telefon ýa-da saýt arkaly sargyt ediň" },
            { n: "02", Icon: Scissors, title: "Florist Saýlaýar", desc: "Hünärmen florist aýratyn çemeňizi işleýär" },
            { n: "03", Icon: Truck, title: "Eltip Bermek", desc: `${SHOP.delivery} minut içinde gapyňyza gelýär` },
            { n: "04", Icon: Heart, title: "Bagtly Pursat", desc: "Sargyt eliňize ýetýär, täze we owadan" },
          ].map((s, i) => (
            <div key={i} className="process-step">
              <div className="step-number">Ädim {s.n}</div>
              <div className="step-icon-circle"><s.Icon size={24} /></div>
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
              <div className="t-quotemark">"</div>
              <div className="t-stars">{[...Array(t.rating)].map((_,j) => <Star key={j} size={14} fill="currentColor" />)}</div>
              <div className="t-occasion"><Flower size={11} /> {t.occasion}</div>
              <div className="t-result">{t.result}</div>
              <p className="t-text">{t.text}</p>
              <div className="t-author">
                <div className="t-avatar">
                  <img src={img(t.avatar)} alt={t.name} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="t-avatar-fallback"><Flower2 size={18} /></div>
                </div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                  <div className="t-date">{t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section">
        <div className="section-header reveal">
          <div className="section-label">Bahalar</div>
          <h2 className="section-h2">Göwnüňizdäki Buket Üçin Dogry Baha</h2>
        </div>
        <div className="price-tiers-grid reveal">
          {[
            { label: "başlangyç", price: "55", name: "Standart Buket", desc: "9–21 gül" },
            { label: "orta", price: "120", name: "Orta Buket", desc: "25–51 gül" },
            { label: "lüks", price: "250", name: "Lýuks Buket", desc: "51–101 gül" },
            { label: "premium", price: "Ylalaşyk", name: "Özboluşly Sargyt", desc: "Doly dizaýn" },
          ].map((p, i) => (
            <div key={i} className="price-tier">
              <div className="pt-label">{p.label}</div>
              <div className="pt-price">{p.price !== "Ylalaşyk" ? `${p.price} TMT` : p.price}</div>
              <div className="pt-name">{p.name}</div>
              <div className="pt-desc">{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="section-header reveal" style={{ marginTop: "3.5rem", marginBottom: "2rem" }}>
          <div className="section-label">Toý & Çäre</div>
          <h2 className="section-h2" style={{ fontSize: "1.9rem" }}>Toý Paketleri</h2>
        </div>
        <div className="wedding-grid reveal">
          {[
            { name: "Bagtly Başlangyç", price: "1 200", popular: false, includes: ["Gelin buketi (35 gül)", "Döşde takylýan çemen (2 sany)", "Stol bezegi (5 stol)", "Toý torty bezegi"], note: "Kiçi we ýapyk toýlar üçin ideal" },
            { name: "Arzuw Toýy", price: "3 500", popular: true, includes: ["Premium gelin buketi", "Döşde takylýan (10 sany)", "Stol bezegi (15 stol)", "Giriş bezegi", "Toý takhtasy bezegi", "Fotosurat gülleri"], note: "Iň meşhur toý paketi" },
            { name: "Şa Toý", price: null, popular: false, includes: ["Çäksiz konzultasiýa", "Doly zal bezegi", "Özboluşly konsepsiýa", "Gün bütin hyzmat", "Gurnamak we ýygnamak", "Ähli islegleriňiz"], note: "Iň ýakymly günüňiz üçin" },
          ].map((p, i) => (
            <div key={i} className={`wp-card ${p.popular ? "popular" : ""}`}>
              {p.popular && <div className="wp-popular-badge">Iň Meşhur</div>}
              <div className="wp-price">{p.price ? <>{p.price} <sup>TMT</sup></> : <span style={{ color: "var(--accent)", fontSize: "1.5rem" }}>Ylalaşyk</span>}</div>
              <div className="wp-name">{p.name}</div>
              <div className="wp-note">{p.note}</div>
              <ul className="wp-list">
                {p.includes.map((item, j) => <li key={j} className="wp-item"><CheckCircle size={14} /> {item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-header reveal" style={{ marginTop: "3.5rem", marginBottom: "2rem" }}>
          <div className="section-label">Abuna</div>
          <h2 className="section-h2" style={{ fontSize: "1.9rem" }}>Abuna Hyzmat</h2>
        </div>
        <div className="sub-grid reveal">
          {[
            { title: "Hepdelik", price: "280 TMT", detail: "1 buket / hepde" },
            { title: "Aýlyk", price: "900 TMT", detail: "4 buket / aý — 3 hepde bahasy!" },
          ].map((s, i) => (
            <div key={i} className="sub-card">
              <div className="sub-title">{s.title}</div>
              <div className="sub-price">{s.price}</div>
              <div className="sub-detail">{s.detail}</div>
              <ul className="sub-list">
                {["Awtomatik eltip bermek", "Her gezek täze dizaýn", "Islän wagtyňyz ýatyrmak", "Mugt gaplama hemişe"].map((f, j) => (
                  <li key={j}><CheckCircle size={14} /> {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="section">
        <div className="section-header reveal">
          <div className="section-label">Pursatlar</div>
          <h2 className="section-h2">Ýakyn Pursatlaryňyzy Ýatdan Çykarmaň</h2>
        </div>
        <div className="events-grid card-group">
          {events.map((e, i) => {
            const days = e.name === "Doglan Günler" ? 0 : daysUntil(e.month, e.day);
            return (
              <div key={i} className="event-card card-anim">
                <div className="event-icon"><e.Icon size={22} /></div>
                <div className="event-name">{e.name}</div>
                <div className="event-sub">{e.subtitle}</div>
                <span className="event-days">{days === 0 ? "Her gün!" : `${days} gün galdy`}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="contact-grid">
          <div className="reveal">
            <div className="section-label" style={{ justifyContent: "flex-start" }}>Habarlaşmak</div>
            <h2 className="contact-info-heading">Sargydyňyzy<br />Beriň</h2>
            <p className="contact-info-body">6 sagadyň içinde floristimiz siz bilen habarlaşar we islege görä çözgüt tapar.</p>
            <div className="contact-item">
              <div className="contact-item-icon"><Phone size={16} /></div>
              <div><strong>{SHOP.phone}</strong></div>
            </div>
            <div className="contact-item">
              <div className="contact-item-icon"><MapPin size={16} /></div>
              <div>{SHOP.address}, {SHOP.city}</div>
            </div>
            <div className="contact-item">
              <div className="contact-item-icon"><Clock size={16} /></div>
              <div>Her gün 08:00 — 22:00</div>
            </div>
            <div className="contact-item">
              <div className="contact-item-icon"><Truck size={16} /></div>
              <div>Eltip bermek: {SHOP.delivery} minut içinde</div>
            </div>
            <div className="social-row">
              {SHOP.instagram && <a className="social-btn" href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer"><Instagram size={14} /> @{SHOP.instagram}</a>}
              {SHOP.telegram && <a className="social-btn" href={`https://t.me/${SHOP.telegram}`} target="_blank" rel="noreferrer"><Send size={14} /> @{SHOP.telegram}</a>}
              {SHOP.whatsapp && <a className="social-btn" href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>}
            </div>
          </div>

          <div className="form-card reveal">
            {formSubmitted ? (
              <div className="success-wrap">
                <svg className="success-check" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke={accent} strokeWidth="3.5" />
                  <path d="M24 40 L35 51 L56 29" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="50" style={{ animation: "drawStroke .8s ease .2s forwards" }} />
                </svg>
                <div className="success-title">Sargydyňyz Kabul Edildi!</div>
                <div className="success-body">
                  Salam, <strong>{formData.name}</strong>! 🌸<br /><br />
                  {SHOP.delivery} minutda floristimiz <strong>{formData.phone}</strong> belgiňize jaň eder.<br /><br />
                  Sargytyňyz: <strong>{formData.occasion || "Florist bilen ylalaşmak"}</strong><br /><br />
                  {SHOP.name} sizi begendirmäge howlukýar!
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Adyňyz <span className="req">*</span></label>
                    <input className="form-input" type="text" placeholder="Adyňyz..." required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefon <span className="req">*</span></label>
                    <input className="form-input" type="tel" placeholder="+993..." required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Habarlaşmak usuly <span className="req">*</span></label>
                  <div className="radio-group">
                    {[["phone","Telefon"],["telegram","Telegram"],["whatsapp","WhatsApp"]].map(([v,l]) => (
                      <label key={v} className="radio-item">
                        <input type="radio" name="contact" value={v} checked={formData.contact === v} onChange={() => setFormData({ ...formData, contact: v })} /> {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Haýsy mümkinçilik? <span className="req">*</span></label>
                  <select className="form-select" value={formData.occasion} onChange={e => setFormData({ ...formData, occasion: e.target.value })}>
                    <option value="">Saýlaň...</option>
                    {["Söýgi Buketi","Doglan Gün","Toý","Korporatiw","Sowgat","Başga"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reňk islegleriňiz</label>
                  <div className="color-swatches">
                    {[["#E53935","Gyzyl"],["#EC407A","Gülgüne"],["#FFFFFF","Ak"],["#FDD835","Sary"],["#8E24AA","Benewşe"],["#1E88E5","Mawy"],["#43A047","Ýaşyl"]].map(([c,n]) => (
                      <div key={c} className={`cswatch ${selectedColors.includes(c) ? "selected" : ""}`} style={{ background: c, border: c === "#FFFFFF" ? "2px solid #555" : undefined }} title={n} onClick={() => toggleColor(c)} />
                    ))}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Eltip bermek wagty</label>
                    <input className="form-input" type="datetime-local" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Eltip bermek salgysy</label>
                    <input className="form-input" type="text" placeholder={`${SHOP.city}...`} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bujetim: <span className="budget-val">{parseInt(formData.budget).toLocaleString()} TMT</span></label>
                  <input style={{ width: "100%", accentColor: accent }} type="range" min="50" max="2000" step="50" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                  <div className="budget-hint">
                    Takmynan: {parseInt(formData.budget) < 100 ? "kiçi buket" : parseInt(formData.budget) < 200 ? "orta buket" : parseInt(formData.budget) < 400 ? "uly buket" : "premium buket"}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Özboluşly islek ýa-da habar</label>
                  <textarea className="form-textarea" placeholder="Haýsydyr bir özboluşly islegiňiz..." />
                </div>
                <button type="submit" className="submit-btn">
                  <Flower size={17} /> Sargydy Iber <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-logo"><Flower2 size={24} /> {SHOP.name}</div>
              <div className="footer-tagline">{SHOP.tagline}</div>
              <p className="footer-bio">{SHOP.city} şäherinde {SHOP.founded}-njy ýyldan bäri hyzmat edýäris.<br />{SHOP.orders} bagtly müşderimiz bar.</p>
            </div>
            <div>
              <div className="footer-col-h">Sahypalar</div>
              <ul className="footer-links">
                {[["#","Baş Sahypa"],["#collections","Koleksiýalar"],["#florists","Floristler"],["#pricing","Bahalar"],["#contact","Habarlaş"]].map(([h,l]) => <li key={h}><a href={h}><ChevronRight size={12} />{l}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="footer-col-h">Koleksiýalar</div>
              <ul className="footer-links">
                {["Söýgi & Romantika","Toý & Nikaý","Doglan Gün","Korporatiw","Abuna Hyzmat"].map(l => <li key={l}><a href="#collections"><ChevronRight size={12} />{l}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="footer-col-h">Habarlaşmak</div>
              <div className="footer-contact-row"><Phone size={14} className="footer-contact-icon" /> <strong>{SHOP.phone}</strong></div>
              <div className="footer-contact-row"><MapPin size={14} className="footer-contact-icon" /> {SHOP.address}</div>
              <div className="footer-contact-row"><Briefcase size={14} className="footer-contact-icon" /> {SHOP.city}</div>
              <div className="footer-social">
                {SHOP.instagram && <a href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer"><Instagram size={13} /> Instagram</a>}
                {SHOP.telegram && <a href={`https://t.me/${SHOP.telegram}`} target="_blank" rel="noreferrer"><Send size={13} /> Telegram</a>}
                {SHOP.whatsapp && <a href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={13} /> WhatsApp</a>}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© {new Date().getFullYear()} {SHOP.name} · Ähli hukuklar goragly</p>
            <p className="footer-agency"><Sparkles size={12} /> Bu saýt <a href="#" rel="noreferrer">Ýeňil Web Agentligi</a> tarapyndan döredildi</p>
          </div>
        </div>
      </footer>
    </>
  );
}
