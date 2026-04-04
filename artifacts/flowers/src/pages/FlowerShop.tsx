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

const PETAL_SHAPES = [
  "M10,0 C15,5 20,15 10,25 C0,15 5,5 10,0Z",
  "M12,0 C20,4 22,14 12,22 C2,14 4,4 12,0Z",
  "M0,10 C5,2 15,0 20,10 C15,20 5,18 0,10Z",
  "M10,0 C18,3 22,12 15,20 C8,22 2,16 0,8 C3,2 6,-1 10,0Z",
  "M8,0 C14,1 18,8 16,15 C14,22 6,22 3,16 C0,10 2,0 8,0Z",
];

function FloatingPetals({ accentRgb }: { accentRgb: string }) {
  const petals = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    shape: PETAL_SHAPES[i % PETAL_SHAPES.length],
    x: Math.random() * 100,
    size: 14 + Math.random() * 22,
    dur: 12 + Math.random() * 18,
    delay: Math.random() * 20,
    drift: (Math.random() - 0.5) * 120,
    opacity: 0.06 + Math.random() * 0.13,
    rotate: Math.random() * 360,
    rotateDur: 8 + Math.random() * 12,
    color: i % 3 === 0 ? `rgba(${accentRgb}, 1)` : i % 3 === 1 ? "#C9A84C" : "#FF9BB5",
  }));
  return (
    <div className="petals-canvas" aria-hidden="true">
      {petals.map(p => (
        <svg key={p.id} className="fp"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, opacity: p.opacity, animationDuration: `${p.dur}s`, animationDelay: `-${p.delay}s`, "--drift": `${p.drift}px`, "--rot": `${p.rotate}deg`, "--rot-dur": `${p.rotateDur}s` } as React.CSSProperties}
          viewBox="0 0 22 26" fill={p.color}>
          <path d={p.shape} />
        </svg>
      ))}
    </div>
  );
}

const BASE = import.meta.env.BASE_URL;

const UNS = {
  heroMain:  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=700&q=85&auto=format&fit=crop",
  love:      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&q=80&auto=format&fit=crop",
  wedding:   "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80&auto=format&fit=crop",
  birthday:  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=80&auto=format&fit=crop",
  gift:      "https://images.unsplash.com/photo-1547393429-741346b0e2f5?w=700&q=80&auto=format&fit=crop",
  seasonal:  "https://images.unsplash.com/photo-1490750967868-88df5691cc17?w=700&q=80&auto=format&fit=crop",
  rose:      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=700&q=80&auto=format&fit=crop",
  tulip:     "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=700&q=80&auto=format&fit=crop",
  florist1:  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80&auto=format&fit=crop&crop=face",
  florist2:  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80&auto=format&fit=crop&crop=face",
  florist3:  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80&auto=format&fit=crop&crop=face",
  florist4:  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80&auto=format&fit=crop&crop=face",
};

// ── Multi-language data ──────────────────────────────────────────

const collectionsData = [
  { id: "love", Icon: Heart, priceFrom: "85", wide: true, img: UNS.love, gradient: "linear-gradient(135deg,#2d0015,#1a0010)",
    tm: { name: "Söýgi & Romantika", desc: "Ýüregiňizdäki duýgulary beýan ediň. Gyzyl güller, ýumşak reňkler, näzik gaplama.", items: "45+ görnüş", tag: "Iň Meşhur" },
    ru: { name: "Любовь и романтика", desc: "Выразите чувства сердца. Красные розы, нежные тона, изящная упаковка.", items: "45+ видов", tag: "Хит продаж" } },
  { id: "wedding", Icon: Gem, priceFrom: "250", wide: true, img: UNS.wedding, gradient: "linear-gradient(135deg,#0e0020,#1a0030)",
    tm: { name: "Toý & Durmuş Dabarasy", desc: "Ömrüňiziň iň möhüm gününde. Gelin buketi, zal bezegi, süpürenç gülleri.", items: "30+ paket", tag: "Aýratyn" },
    ru: { name: "Свадьба и торжество", desc: "В самый важный день вашей жизни. Букет невесты, украшение зала, свадебные цветы.", items: "30+ пакетов", tag: "Особый" } },
  { id: "birthday", Icon: Sparkles, priceFrom: "55", wide: false, img: UNS.birthday, gradient: "linear-gradient(135deg,#1a0020,#280035)",
    tm: { name: "Doglan Gün", desc: "Ýakynlaryňyzy begendiriň. Ýaşyna we islegine görä özboluşly buket.", items: "60+ görnüş", tag: "Her Ýaş Üçin" },
    ru: { name: "День рождения", desc: "Порадуйте близких. Уникальный букет для любого возраста и желания.", items: "60+ видов", tag: "Для любого возраста" } },
  { id: "corporate", Icon: Building2, priceFrom: "200", wide: false, img: UNS.seasonal, gradient: "linear-gradient(135deg,#050a08,#0d1510)",
    tm: { name: "Işewürlik", desc: "Ofis bezegi, konferensiýa gülleri, iş partnýorlaryna sowgat çözgütleri.", items: "Aýratyn dizaýn", tag: "Işewür" },
    ru: { name: "Корпоратив", desc: "Украшение офиса, цветы для конференций, подарки бизнес-партнёрам.", items: "Индивидуальный дизайн", tag: "Бизнес" } },
  { id: "sympathy", Icon: Bird, priceFrom: "70", wide: false, img: UNS.tulip, gradient: "linear-gradient(135deg,#080808,#121218)",
    tm: { name: "Hormat & Sadaka", desc: "Kyn wagtlarda ýanyňyzda bolmak. Içgin we hormatly çemenler.", items: "20+ görnüş", tag: "Inçe" },
    ru: { name: "Скорбь и память", desc: "Быть рядом в трудные моменты. Сдержанные и уважительные букеты.", items: "20+ видов", tag: "Деликатный" } },
  { id: "seasonal", Icon: Leaf, priceFrom: "45", wide: false, img: UNS.seasonal, gradient: "linear-gradient(135deg,#0a1205,#152010)",
    tm: { name: "Möwsümleýin Güller", desc: "Bahar, tomus, güýz we gyş. Her möwsümiň iň owadan gülleri.", items: "Möwsüme görä", tag: "Täze" },
    ru: { name: "Сезонные цветы", desc: "Весна, лето, осень и зима. Самые красивые цветы каждого сезона.", items: "По сезону", tag: "Новинка" } },
  { id: "boxes", Icon: Gift, priceFrom: "120", wide: true, img: UNS.gift, gradient: "linear-gradient(135deg,#150e00,#221800)",
    tm: { name: "Sowgat Gutulary", desc: "Güller + şokolad + yşk şemi + şahsy hat. Doly duýgy bukjasy.", items: "25+ kombinasiýa", tag: "Doly Set" },
    ru: { name: "Подарочные наборы", desc: "Цветы + шоколад + свеча + личная открытка. Полный набор эмоций.", items: "25+ комбинаций", tag: "Полный набор" } },
  { id: "subscription", Icon: Calendar, priceFrom: "180", wide: true, img: UNS.rose, gradient: "linear-gradient(135deg,#0d0020,#180030)",
    tm: { name: "Abuna Hyzmat", desc: "Her hepde ýa-da her aý öýüňize täze güller geler. Awtomatik bagtlylyk.", items: "Aýlyk / Hepdelik", tag: "🔥 Täzelik" },
    ru: { name: "Подписка на цветы", desc: "Каждую неделю или месяц свежие цветы прямо домой. Автоматическое счастье.", items: "Месяц / Неделя", tag: "🔥 Новинка" } },
];

const productsData = [
  { id: 1, category: "love", price: 185, oldPrice: 220, img: UNS.rose, gradient: "linear-gradient(135deg,#1a0010,#3d0020)",
    tm: { name: "Gyzyl Gül Neoklassik", flowers: "51 gyzyl gül", size: "Uly", badge: "Iň Köp Satylýan" },
    ru: { name: "Красная роза Неоклассика", flowers: "51 красная роза", size: "Большой", badge: "Самый популярный" } },
  { id: 2, category: "wedding", price: 145, oldPrice: null, img: UNS.tulip, gradient: "linear-gradient(135deg,#0d0010,#200015)",
    tm: { name: "Ak Lale Arzuw", flowers: "25 ak lale + pip", size: "Orta", badge: "Toý Saýlawy" },
    ru: { name: "Белый тюльпан Мечта", flowers: "25 белых тюльпанов + зелень", size: "Средний", badge: "Выбор невесты" } },
  { id: 3, category: "birthday", price: 95, oldPrice: 115, img: UNS.birthday, gradient: "linear-gradient(135deg,#130010,#280025)",
    tm: { name: "Pastel Buket Sürprizi", flowers: "Garylyk pastel güller", size: "Orta", badge: "Doglan Gün Saýlawy" },
    ru: { name: "Пастельный сюрприз", flowers: "Смешанные пастельные цветы", size: "Средний", badge: "Выбор именинника" } },
  { id: 4, category: "gift", price: 245, oldPrice: null, img: UNS.gift, gradient: "linear-gradient(135deg,#100d00,#201800)",
    tm: { name: "Aýratyn Sowgat Gutusy", flowers: "Güller + Ferrero + Şem", size: "Aýratyn", badge: "Aýratyn" },
    ru: { name: "Особый подарочный набор", flowers: "Цветы + Ferrero + Свеча", size: "Особый", badge: "Особый" } },
  { id: 5, category: "wedding", price: 380, oldPrice: null, img: UNS.wedding, gradient: "linear-gradient(135deg,#0a0808,#1a1015)",
    tm: { name: "Kaşan Gelin Buketi", flowers: "Awen + Gül + Pip", size: "Toý", badge: "Kaşan" },
    ru: { name: "Роскошный букет невесты", flowers: "Пион + Роза + Зелень", size: "Свадебный", badge: "Роскошный" } },
  { id: 6, category: "birthday", price: 65, oldPrice: 80, img: UNS.seasonal, gradient: "linear-gradient(135deg,#100a00,#201200)",
    tm: { name: "Gün Şöhlesi Buketi", flowers: "Gün gülü + Sary güller", size: "Kiçi", badge: "Şadyýan" },
    ru: { name: "Солнечный букет", flowers: "Подсолнухи + Жёлтые цветы", size: "Маленький", badge: "Радостный" } },
  { id: 7, category: "corporate", price: 120, oldPrice: null, img: UNS.love, gradient: "linear-gradient(135deg,#050a08,#0d1510)",
    tm: { name: "Işewür Stol Bezegi", flowers: "Ak + Ýaşyl garylyk", size: "Ofis", badge: "Işewür" },
    ru: { name: "Офисная композиция", flowers: "Белые + Зелёные цветы", size: "Офис", badge: "Бизнес" } },
  { id: 8, category: "seasonal", price: 75, oldPrice: null, img: UNS.seasonal, gradient: "linear-gradient(135deg,#080010,#120018)",
    tm: { name: "Möwsüm Sürpriz Buketi", flowers: "Gülçi saýlawy", size: "Orta", badge: "Täze" },
    ru: { name: "Сезонный сюрприз", flowers: "Выбор флориста", size: "Средний", badge: "Новинка" } },
  { id: 9, category: "love", price: 420, oldPrice: 500, img: UNS.heroMain, gradient: "linear-gradient(135deg,#140010,#2a0020)",
    tm: { name: "100 Gül Ajaýyp Galpak", flowers: "100 dürli reňkli gül", size: "Ajaýyp", badge: "Haýran Ediji" },
    ru: { name: "100 роз в шляпной коробке", flowers: "100 разноцветных роз", size: "Грандиозный", badge: "Восхитительный" } },
  { id: 10, category: "sympathy", price: 115, oldPrice: null, img: UNS.tulip, gradient: "linear-gradient(135deg,#050810,#0a1018)",
    tm: { name: "Ýatlamaçy Çemen Gutusy", flowers: "Ak we mawy güller", size: "Orta", badge: "Hormat" },
    ru: { name: "Траурная композиция", flowers: "Белые и голубые цветы", size: "Средний", badge: "С уважением" } },
  { id: 11, category: "gift", price: 350, oldPrice: 420, img: UNS.gift, gradient: "linear-gradient(135deg,#120008,#220012)",
    tm: { name: "Söýgi Sandyk Sowgat", flowers: "Sandyk + Güller + Şokolad + Hoşboý", size: "Aýratyn Set", badge: "Iň Meşhur" },
    ru: { name: "Романтический сундук", flowers: "Сундук + Цветы + Шоколад + Духи", size: "Особый набор", badge: "Самый популярный" } },
  { id: 12, category: "corporate", price: 280, oldPrice: null, img: UNS.love, gradient: "linear-gradient(135deg,#080510,#120a1a)",
    tm: { name: "Hepdelik Ofis Abunasy", flowers: "Her hepde awtomatik", size: "Abuna", badge: "Abuna" },
    ru: { name: "Еженедельная офисная подписка", flowers: "Каждую неделю автоматически", size: "Подписка", badge: "Подписка" } },
];

const floristsData = [
  { img: UNS.florist1,
    tm: { name: "Maýagül Nurlyýewa", title: "Baş Gülçi & Bezegçi", exp: "9 Ýyl", specialty: "Toý & Kaşan Bukety", cert: "Ýewropa Sertifikatly", achievement: "500+ Toý Buketi", quote: "Her gül öz dilinde gürleýär. Men diňe terjimeçi." },
    ru: { name: "Маягуль Нурлыева", title: "Главный флорист и декоратор", exp: "9 лет", specialty: "Свадьба и роскошные букеты", cert: "Европейский сертификат", achievement: "500+ свадебных букетов", quote: "Каждый цветок говорит на своём языке. Я лишь переводчик." } },
  { img: UNS.florist2,
    tm: { name: "Güljeren Orazowa", title: "Işewür Gülçi", exp: "6 Ýyl", specialty: "Ofis & Çäre Bezegi", cert: "Işewür Hünärmen", achievement: "200+ Işewür Müşderi", quote: "Içerki bezeg işiň dilidir." },
    ru: { name: "Гульджерен Оразова", title: "Корпоративный флорист", exp: "6 лет", specialty: "Офис и мероприятия", cert: "Бизнес-специалист", achievement: "200+ корпоративных клиентов", quote: "Интерьер — это язык бизнеса." } },
  { img: UNS.florist3,
    tm: { name: "Leýli Annagylyjowa", title: "Söýgi Buketi Ussady", exp: "7 Ýyl", specialty: "Romantik Çemenler", cert: "Gülçilik Ussady", achievement: "1000+ Söýgi Buketi", quote: "Güller söz bilen düşündirip bolmajak zady aýdýar." },
    ru: { name: "Лейли Аннагылычова", title: "Мастер романтических букетов", exp: "7 лет", specialty: "Романтические букеты", cert: "Мастер флористики", achievement: "1000+ романтических букетов", quote: "Цветы говорят то, что нельзя выразить словами." } },
  { img: UNS.florist4,
    tm: { name: "Aýgözel Durdyýewa", title: "Döredijilik Bezegçisi", exp: "4 Ýyl", specialty: "Täzeçil & Döwrebap Görnüş", cert: "Halkara Bäsleşik Ýeňijisi", achievement: "3x Bäsleşik Baýragy", quote: "Gülçilik — bu janly sungat." },
    ru: { name: "Айгозель Дурдыева", title: "Творческий декоратор", exp: "4 года", specialty: "Современный и авангардный стиль", cert: "Победитель международного конкурса", achievement: "3x премии конкурсов", quote: "Флористика — это живое искусство." } },
];

const testimonialsData = [
  { rating: 5, avatar: UNS.wedding,
    tm: { name: "Aýna Çaryýewa", role: "Täze Gelin", occasion: "Toý Buketi", result: "Ömrümüň iň owadan güni", text: "Toý buketime seredip aglamaga başladym. Maýagül hanym meniň arzuwymdan hem owadan bir zat döretdi. Her suratyma seredenimdе ony görýärin.", date: "2 hepde öň" },
    ru: { name: "Айна Чарыева", role: "Невеста", occasion: "Свадебный букет", result: "Самый красивый день моей жизни", text: "Я заплакала, увидев свой свадебный букет. Маягуль создала нечто прекраснее моей мечты. В каждой фотографии я вижу его.", date: "2 недели назад" } },
  { rating: 5, avatar: UNS.rose,
    tm: { name: "Serdar Rejepow", role: "Söýgüli", occasion: "Söýgi Sürprizi", result: "Ony geň galdyrdym!", text: "Aýalym wagtynda gapysyna gelende ynanamady. Güller şeýle täze we owadandy! 'Bu näme?' diýip aglady. Bu dükan söýgüni hakykata öwürýär.", date: "1 aý öň" },
    ru: { name: "Сердар Реджепов", role: "Влюблённый", occasion: "Романтический сюрприз", result: "Я удивил её!", text: "Жена не поверила, когда цветы появились у её двери вовремя. Такие свежие и красивые! Она заплакала от счастья. Этот магазин превращает любовь в реальность.", date: "1 месяц назад" } },
  { rating: 5, avatar: UNS.seasonal,
    tm: { name: "Läle Atamyradowa", role: "Ofis Dolandyryjysy", occasion: "Hepdelik Abuna", result: "Ofisimiz gülzara döndi", text: "Her duşenbe irden täze güller gelýär. Işgärlerimiz we müşderilerimiz ofisimizde hemişe açylyp duran güllere haýran galýarlar.", date: "Hemişelik müşderi" },
    ru: { name: "Лале Атамырадова", role: "Офис-менеджер", occasion: "Еженедельная подписка", result: "Офис превратился в сад", text: "Каждое утро в понедельник приходят свежие цветы. Наши сотрудники и клиенты всегда восхищаются цветущим офисом.", date: "Постоянный клиент" } },
  { rating: 5, avatar: UNS.birthday,
    tm: { name: "Ogulgerek Işanowa", role: "Ejesi", occasion: "Doglan Gün Sowgady", result: "Çagam begençden aglady", text: "18 ýaşly gyzyma sürpriz etdim. 18 gülli dürli reňkli buketi görende göz ýaşlary döküp ugrady. Şeýle pursat döredendigi üçin sagboluň.", date: "3 hepde öň" },
    ru: { name: "Огулгерек Ишанова", role: "Мама", occasion: "Подарок на день рождения", result: "Дочь расплакалась от счастья", text: "Я сделала сюрприз своей 18-летней дочери. Увидев букет из 18 разноцветных роз, она расплакалась. Спасибо за такой особый момент.", date: "3 недели назад" } },
  { rating: 5, avatar: UNS.gift,
    tm: { name: "Döwlet Hydyrow", role: "Biznes Eýesi", occasion: "Korporatiw Sargyt", result: "Iş partnýorlarym haýran galdy", text: "20 sany iş partnýorymyza sowgat gönderendik. Hemmesini wagtynda we birmeňzeş owadan gaplama bilen iberdi. Indi ähli korporatiw sowgatlarymyz üçin diňe olar.", date: "2 aý öň" },
    ru: { name: "Довлет Хыдыров", role: "Владелец бизнеса", occasion: "Корпоративный заказ", result: "Партнёры были поражены", text: "Мы отправили подарки 20 бизнес-партнёрам. Все доставлено вовремя в одинаково красивой упаковке. Теперь только они для всех корпоративных подарков.", date: "2 месяца назад" } },
  { rating: 5, avatar: UNS.love,
    tm: { name: "Bahargül Nurmuhammedowa", role: "Toý Gurnagçysy", occasion: "Toý Zal Bezegi", result: "Müşderim gözden ýaş dökdi", text: "Toý gurnagçysy hökmünde köp gülçi bilen işledim. Bu ýeriň hili we wagtynda gelmek ygtybarylygy başgaça. Müşderilerime hemişe maslahat berýärin.", date: "Hemişelik hyzmatdaş" },
    ru: { name: "Бахаргуль Нурмухаммедова", role: "Свадебный организатор", occasion: "Украшение свадебного зала", result: "Моя клиентка расплакалась", text: "Как организатор свадеб я работала со многими флористами. Качество и надёжность этого магазина — на другом уровне. Всегда рекомендую своим клиентам.", date: "Постоянный партнёр" } },
];

const eventsData = [
  { month: 2, day: 14, Icon: Heart,
    tm: { name: "14-nji Fewral", subtitle: "Söýgüliler Güni" },
    ru: { name: "14 февраля", subtitle: "День влюблённых" } },
  { month: 3, day: 8, Icon: Flower2,
    tm: { name: "8-nji Mart", subtitle: "Zenanlar Güni" },
    ru: { name: "8 марта", subtitle: "Международный женский день" } },
  { month: 3, day: 21, Icon: Leaf,
    tm: { name: "21-nji Mart", subtitle: "Nowruz Baýramy" },
    ru: { name: "21 марта", subtitle: "Навруз Байрам" } },
  { month: new Date().getMonth() + 2, day: 1, Icon: Sparkles,
    tm: { name: "Doglan Günler", subtitle: "Her Gün!" },
    ru: { name: "Дни рождения", subtitle: "Каждый день!" } },
  { month: 5, day: 12, Icon: Heart,
    tm: { name: "Ene Günleri", subtitle: "Annalar Güni" },
    ru: { name: "День матери", subtitle: "Для мамы" } },
  { month: 6, day: 15, Icon: Award,
    tm: { name: "Okuw Soňy", subtitle: "Gutlag Buketi" },
    ru: { name: "Конец учёбы", subtitle: "Поздравительный букет" } },
];

// ── Flag SVG components ──────────────────────────────────────────

function FlagRU({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.667} viewBox="0 0 30 20" style={{ borderRadius: 3, display: "block" }}>
      <rect width="30" height="6.67" y="0" fill="#fff" />
      <rect width="30" height="6.67" y="6.67" fill="#0039A6" />
      <rect width="30" height="6.67" y="13.33" fill="#D52B1E" />
    </svg>
  );
}

function FlagTM({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 24 40" style={{ borderRadius: 3, display: "block" }}>
      <rect width="24" height="40" fill="#3E9B3E" />
      <rect width="5" height="40" x="4" fill="#B22222" />
      <circle cx="6.5" cy="10" r="2.5" fill="#FFD700" />
      <circle cx="6.5" cy="18" r="2.5" fill="#FFD700" />
      <circle cx="6.5" cy="26" r="2.5" fill="#FFD700" />
      <circle cx="6.5" cy="34" r="2.5" fill="#FFD700" />
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────

export default function FlowerShop() {
  const params = new URLSearchParams(window.location.search);
  const SHOP = {
    name:     params.get("name")     || "Gül Dünýäsi",
    tagline:  params.get("tag")      || "",
    city:     params.get("city")     || "Aşgabat",
    phone:    params.get("phone")    || "+993 12 34-56-78",
    address:  params.get("addr")     || "Bitarap Türkmenistan şaýoly 22",
    color:    (params.get("color")   || "E91E8C").replace("#", ""),
    color2:   (params.get("color2")  || "FF6B9D").replace("#", ""),
    instagram: params.get("ig")      || "guldunyasi",
    telegram:  params.get("tg")      || "guldunyasi_tm",
    whatsapp:  params.get("wa")      || "",
    founded:   params.get("est")     || "2018",
    orders:    params.get("orders")  || "5000+",
    rating:    params.get("rating")  || "4.9",
    reviews:   params.get("reviews") || "320+",
    delivery:  params.get("delivery")|| "60",
  };

  const accent    = `#${SHOP.color}`;
  const accent2   = `#${SHOP.color2}`;
  const accentRgb = hexToRgb(SHOP.color);

  // Default language: Russian
  const [lang, setLang] = useState<"tm" | "ru">("ru");

  const [activeFilter, setActiveFilter]   = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled]     = useState(false);
  const [formData, setFormData]           = useState({ name: "", phone: "", contact: "phone", occasion: "", budget: "300" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [statsVisible, setStatsVisible]   = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  // ── Translations ─────────────────────────────────────────────
  const T = {
    tm: {
      navLinks: [["#collections","Koleksiýalar"],["#products","Önümler"],["#florists","Gülçiler"],["#pricing","Bahalar"],["#contact","Habarlaş"]] as [string,string][],
      navOrder: "Sargyt",
      navDelivery: "min",
      heroLine1: "Duýgularyňy",
      heroLine2: "Güller",
      heroLine3: "Bilen Aýt",
      heroReviews: "Syn",
      heroBody: `Her bir pursat, her bir söýgi — gülleriň dili bilen aýdylýar. ${SHOP.city} şäherinde ${SHOP.orders} bagtly müşderi, ${SHOP.delivery} minutda eltip bermek. Arzuwlaryňyzy hakykata öwürýäris.`,
      heroBtnOrder: "Sargyt Beriň",
      heroBtnCols: "Koleksiýalar",
      trustDelivery: "Şol gün eltip bermek",
      trustRating: "/5 Baha",
      trustOrders: "Sargyt",
      fcDelivery: "Çalt Eltip Bermek",
      fcDeliveryUnit: "min içinde",
      fcRating: "Baha",
      fcReviews: "syn",
      fcFlowers: "Täze Güller",
      fcFlowersSub: "Her gün getiriler",
      statOrders: "Bagtly Sargyt",
      statRating: "Ortaça Baha",
      statDelivery: "Eltip Bermek",
      statVariety: "Gül Görnüşi",
      colSectionLabel: "Koleksiýalar",
      colSectionH2: "Her Pursata Ýörite Çemen",
      colSectionSub: "Toýdan korporatiw çärä, söýgi sürprizinden möwsümleýin owadanlyga — her mümkinçilik üçin aýratyn çözgüt.",
      colPriceFrom: "TMT-dan",
      whySectionLabel: "Näme üçin biz?",
      whyHeading1: "Güller diňe",
      whyHeading2: "çemen däl,",
      whyHeading3: "duýgudyr",
      whyBody: `${SHOP.founded}-njy ýyldan bäri ${SHOP.city} şäherinde. Her güli öz elimiz bilen saýlaýarys, her buketi ýüregimiz bilen düzýäris. Müşderimiz bagtly bolmasa, biz maksadymyza ýetmedik bolarys.`,
      whyStats: `${SHOP.orders} sargyt · ${SHOP.rating}/5 baha · ${SHOP.reviews} syn · ${SHOP.founded}-den bäri`,
      features: [
        { title: `${SHOP.delivery} Minutda Eltip Bermek`, desc: "Şäher içinde tiz we ygtybarly eltip bermek." },
        { title: "Şol Gün Kesilýän Güller", desc: "Her gün irden bakja we ýerli ekijiçilerden täze güller." },
        { title: "Siz Üçin Özboluşly Dizaýn", desc: "Gülçiňiz sizi diňleýär we arzuwlaryňyzy döredýär." },
        { title: "Bermezden Öň Surata Düşürilýär", desc: "Buketi ibermezden öň suratyny WhatsApp/Telegram arkaly iberýäris." },
      ],
      prodSectionLabel: "Önümler",
      prodSectionH2: "Gülçilerimizden Buketler",
      prodSectionSub: "Özboluşly el işi buketler, her biriniň öz hekaýasy bar.",
      filterTabs: [["all","Ählisi"],["love","Söýgi"],["wedding","Toý"],["birthday","Doglan Gün"],["gift","Sowgat"],["corporate","Işewürlik"],["seasonal","Möwsüm"]] as [string,string][],
      orderBtn: "Sargyt Beriň",
      wishBtn: "Halanlarym",
      floSectionLabel: "Toparymyz",
      floSectionH2: "Hünärmen Gülçilerimiz",
      floSectionSub: "Her biri öz sungatynyň ussady — gülleri dile getirýänler.",
      floContact: "Habarlaş",
      processSectionLabel: "Nädip Sargyt Bermeli?",
      processSectionH2: "Dört Ädimde Sargydyňyz",
      stepLabel: "Ädim",
      steps: [
        { num: "01", title: "Habarlaşyň", desc: "Telefon, Telegram ýa-da WhatsApp arkaly biz bilen habarlaşyň." },
        { num: "02", title: "Dizaýny Saýlaň", desc: "Gülçimiz sizi diňlär we iň laýyk buketi teklip eder." },
        { num: "03", title: "Surata Düşüriň", desc: "Buketi bermezden öň suratyny size iberýäris — razylyk soraýarys." },
        { num: "04", title: "Eltip Bermek", desc: `${SHOP.delivery} minutda gapyňyza eltilýär ýa-da özüňiz alyp bilýärsiňiz.` },
      ],
      testSectionLabel: "Syn & Teswirler",
      testSectionH2: "Müşderilerimiz Näme Diýýär?",
      testSectionSub: `${SHOP.reviews} hakyky syndan iň gowy saýlananlar.`,
      priceSectionLabel: "Bahalar",
      priceSectionH2: "Her Harçlama Laýyk Çözgüt",
      priceSectionSub: "Aşakdaky bahalar takmynan. Gülçimiz siziň bilen jikme-jik gürleşer.",
      priceTiers: [
        { label: "Başlangyç", name: "Kiçi Buket", desc: "5–9 gül. Ýakymly gündelik sowgat." },
        { label: "Orta",      name: "Adaty Buket", desc: "15–21 gül. Doglan gün we öý sowgady." },
        { label: "Aýratyn",   name: "Kaşan Buket", desc: "35–51 gül. Täsirli we owadan." },
        { label: "Saýlama",   name: "Özboluşly Sargyt", desc: "Islege görä. Çäk ýok." },
      ],
      priceTierPrices: ["55","95","185","350+"],
      weddingSectionLabel: "Toý Paketleri",
      weddingSectionH2: "Toý Gülleriniň Bahalary",
      weddingChoose: "Saýla",
      weddingPopular: "Iň Meşhur",
      weddingPackages: [
        { name: "Ýeňil Toý", note: "Kiçi toý üçin", popular: false, price: "250", items: ["Gelin buketi (25 gül)","2 Bezeg buketi","Toý stoly bezegi","Erkin gowşurmak"] },
        { name: "Aýratyn Toý", note: "Iň meşhur paket", popular: true, price: "550", items: ["Gelin buketi (51 gül)","Gelin ata göwünjeň buketi","Stol merkezleri (5)","Zal giriş bezegi","Gülçi gatnaşýar"] },
        { name: "Kaşan Toý", note: "Doly hyzmat", popular: false, price: "1200+", items: ["Çäksiz güller","Ähli otag bezegi","2 gülçi + utgaşdyryjy","24/7 goldaw","Surat pozisiýasy"] },
      ],
      subSectionLabel: "Abuna Hyzmat",
      subSectionH2: "Hemişe Täze Güller",
      subStart: "Başla",
      subSeason: "möwsüm",
      subs: [
        { title: "Hepdelik Abuna", price: "180", detail: "Her duşenbe irden — ykjam buket", items: ["7 günde bir gün täze güller","Öý ýa-da ofis","Erkin düzmek","Islendik wagt ýatyrylmak"] },
        { title: "Aýlyk Abuna",  price: "320", detail: "Her aý iki gezek — kaşan buket",  items: ["2 hepde bir gezek täze güller","Gülçi saýlawy ýa-da özüňiz saýlaýar","Aýratyn arzanlaşyk","Öýe gelip bermek"] },
      ],
      eventSectionLabel: "Möhüm Seneler",
      eventSectionH2: "Baýramlary Unutmaň",
      eventSectionSub: "Ýakyn seneler — şu gün sargydyňyzy beriň!",
      daysLeft: "gün galdy",
      contactLabel: "Habarlaşmak",
      contactH2a: "Sargydyňyzy",
      contactH2b: "Beriň",
      contactBody: "6 sagadyň içinde gülçimiz siz bilen habarlaşar we islege görä çözgüt tapar.",
      contactHours: "Her gün 08:00 — 22:00",
      contactDelivery: `Eltip bermek: ${SHOP.delivery} minut içinde`,
      formName: "Adyňyz",
      formNamePh: "Adyňyz...",
      formPhone: "Telefon",
      formPhonePh: "+993...",
      formContact: "Habarlaşmak usuly",
      formOccasion: "Haýsy mümkinçilik?",
      formOccasionPh: "Saýlaň...",
      occasions: ["Söýgi Buketi","Doglan Gün","Toý","Korporatiw","Sowgat","Başga"],
      formColors: "Reňk islegleriňiz",
      formDelivTime: "Eltip bermek wagty",
      formDelivAddr: "Eltip bermek salgysy",
      formDelivAddrPh: `${SHOP.city}...`,
      formBudget: "Harçlamam",
      formNote: "Özboluşly islek ýa-da habar",
      formNotePh: "Haýsydyr bir özboluşly islegiňiz...",
      formSubmit: "Sargydy Iber",
      budgetHints: ["kiçi buket","orta buket","uly buket","aýratyn buket"],
      colorNames: ["Gyzyl","Gülgüne","Ak","Sary","Benewşe","Mawy","Ýaşyl"],
      successTitle: "Sargydyňyz Kabul Edildi!",
      successGreeting: "Salam",
      successEmoji: "🌸",
      successCall: `${SHOP.delivery} minutda gülçimiz`,
      successCallEnd: "belgiňize jaň eder.",
      successOrderLabel: "Sargytyňyz",
      successDefaultOccasion: "Gülçi bilen ylalaşmak",
      successEnd: `${SHOP.name} sizi begendirmäge howlukýar!`,
      footerPages: "Sahypalar",
      footerCollections: "Koleksiýalar",
      footerContact: "Habarlaşmak",
      footerHome: "Baş Sahypa",
      footerBio: `${SHOP.city} şäherinde ${SHOP.founded}-njy ýyldan bäri hyzmat edýäris.\n${SHOP.orders} bagtly müşderimiz bar.`,
      footerCopy: "Ähli hukuklar goralýar.",
      footerColLinks: ["Söýgi & Romantika","Toý & Durmuş Dabarasy","Doglan Gün","Işewürlik","Abuna Hyzmat"],
      mobileCta: "Sargyt Beriň",
    },
    ru: {
      navLinks: [["#collections","Коллекции"],["#products","Букеты"],["#florists","Флористы"],["#pricing","Цены"],["#contact","Контакты"]] as [string,string][],
      navOrder: "Заказ",
      navDelivery: "мин",
      heroLine1: "Выразите",
      heroLine2: "Чувства",
      heroLine3: "Цветами",
      heroReviews: "Отзывов",
      heroBody: `Каждый момент, каждое чувство — говорит языком цветов. В ${SHOP.city} ${SHOP.orders} счастливых клиентов, доставка за ${SHOP.delivery} минут. Воплощаем ваши мечты в реальность.`,
      heroBtnOrder: "Сделать заказ",
      heroBtnCols: "Коллекции",
      trustDelivery: "Доставка в день заказа",
      trustRating: "/5 Оценка",
      trustOrders: "Заказов",
      fcDelivery: "Быстрая доставка",
      fcDeliveryUnit: "мин",
      fcRating: "Оценка",
      fcReviews: "отзывов",
      fcFlowers: "Свежие цветы",
      fcFlowersSub: "Привозим каждый день",
      statOrders: "Счастливых заказов",
      statRating: "Средняя оценка",
      statDelivery: "Доставка",
      statVariety: "Видов цветов",
      colSectionLabel: "Коллекции",
      colSectionH2: "Букет для каждого случая",
      colSectionSub: "От свадьбы до корпоратива, от романтического сюрприза до сезонной красоты — индивидуальное решение для каждого.",
      colPriceFrom: "TMT от",
      whySectionLabel: "Почему мы?",
      whyHeading1: "Цветы — это",
      whyHeading2: "не просто букет,",
      whyHeading3: "это чувство",
      whyBody: `С ${SHOP.founded} года мы работаем в ${SHOP.city}. Каждый цветок выбираем вручную, каждый букет складываем с душой. Если клиент не счастлив — мы не достигли своей цели.`,
      whyStats: `${SHOP.orders} заказов · ${SHOP.rating}/5 оценка · ${SHOP.reviews} отзывов · с ${SHOP.founded} года`,
      features: [
        { title: `Доставка за ${SHOP.delivery} минут`, desc: "Быстрая и надёжная доставка по городу." },
        { title: "Цветы, срезанные в день заказа", desc: "Каждое утро получаем свежие цветы от садоводов и местных производителей." },
        { title: "Индивидуальный дизайн для вас", desc: "Флорист выслушает вас и создаст букет вашей мечты." },
        { title: "Фото перед доставкой", desc: "Перед отправкой букета присылаем фото через WhatsApp/Telegram для согласования." },
      ],
      prodSectionLabel: "Букеты",
      prodSectionH2: "Букеты от наших флористов",
      prodSectionSub: "Уникальные букеты ручной работы — у каждого своя история.",
      filterTabs: [["all","Все"],["love","Любовь"],["wedding","Свадьба"],["birthday","День рождения"],["gift","Подарок"],["corporate","Корпоратив"],["seasonal","Сезон"]] as [string,string][],
      orderBtn: "Заказать",
      wishBtn: "В избранное",
      floSectionLabel: "Наша команда",
      floSectionH2: "Наши профессиональные флористы",
      floSectionSub: "Каждый — мастер своего искусства, заставляющий цветы говорить.",
      floContact: "Написать",
      processSectionLabel: "Как сделать заказ?",
      processSectionH2: "Ваш заказ в 4 шага",
      stepLabel: "Шаг",
      steps: [
        { num: "01", title: "Свяжитесь с нами", desc: "Позвоните, напишите в Telegram или WhatsApp." },
        { num: "02", title: "Выберите дизайн", desc: "Флорист выслушает вас и предложит идеальный букет." },
        { num: "03", title: "Фото согласования", desc: "Перед доставкой присылаем фото букета — ждём вашего одобрения." },
        { num: "04", title: "Доставка", desc: `Доставим к вашей двери за ${SHOP.delivery} минут или заберёте сами.` },
      ],
      testSectionLabel: "Отзывы",
      testSectionH2: "Что говорят наши клиенты?",
      testSectionSub: `Лучшее из ${SHOP.reviews} реальных отзывов.`,
      priceSectionLabel: "Цены",
      priceSectionH2: "Решение для любого бюджета",
      priceSectionSub: "Указанные цены примерные. Флорист обсудит с вами детали.",
      priceTiers: [
        { label: "Начальный", name: "Маленький букет", desc: "5–9 цветков. Приятный повседневный подарок." },
        { label: "Средний",   name: "Стандартный букет", desc: "15–21 цветок. Для дня рождения и домашнего подарка." },
        { label: "Особый",    name: "Роскошный букет", desc: "35–51 цветок. Эффектный и красивый." },
        { label: "Люкс",      name: "Индивидуальный заказ", desc: "По вашему желанию. Без ограничений." },
      ],
      priceTierPrices: ["55","95","185","350+"],
      weddingSectionLabel: "Свадебные пакеты",
      weddingSectionH2: "Цены на свадебные цветы",
      weddingChoose: "Выбрать",
      weddingPopular: "Самый популярный",
      weddingPackages: [
        { name: "Лёгкая свадьба", note: "Для небольшой свадьбы", popular: false, price: "250", items: ["Букет невесты (25 цветков)","2 декоративных букета","Украшение свадебного стола","Бесплатная доставка"] },
        { name: "Особая свадьба", note: "Самый популярный пакет", popular: true, price: "550", items: ["Букет невесты (51 цветок)","Букет для отца невесты","Центральные композиции (5)","Украшение входа в зал","Присутствие флориста"] },
        { name: "Роскошная свадьба", note: "Полный сервис", popular: false, price: "1200+", items: ["Неограниченное количество цветов","Украшение всех помещений","2 флориста + координатор","Поддержка 24/7","Фотопозиция"] },
      ],
      subSectionLabel: "Подписка",
      subSectionH2: "Всегда свежие цветы",
      subStart: "Начать",
      subSeason: "сезон",
      subs: [
        { title: "Еженедельная подписка", price: "180", detail: "Каждый понедельник утром — компактный букет", items: ["Свежие цветы каждые 7 дней","Домой или в офис","Свободная композиция","Отмена в любое время"] },
        { title: "Ежемесячная подписка",  price: "320", detail: "Дважды в месяц — роскошный букет",           items: ["Свежие цветы раз в 2 недели","Выбор флориста или ваш выбор","Особая скидка","Доставка на дом"] },
      ],
      eventSectionLabel: "Важные даты",
      eventSectionH2: "Не забудьте о праздниках",
      eventSectionSub: "Ближайшие даты — закажите уже сегодня!",
      daysLeft: "дней осталось",
      contactLabel: "Контакты",
      contactH2a: "Сделайте",
      contactH2b: "заказ",
      contactBody: "В течение 6 часов флорист свяжется с вами и найдёт идеальное решение.",
      contactHours: "Каждый день 08:00 — 22:00",
      contactDelivery: `Доставка: за ${SHOP.delivery} минут`,
      formName: "Ваше имя",
      formNamePh: "Ваше имя...",
      formPhone: "Телефон",
      formPhonePh: "+993...",
      formContact: "Способ связи",
      formOccasion: "Какой повод?",
      formOccasionPh: "Выберите...",
      occasions: ["Романтический букет","День рождения","Свадьба","Корпоратив","Подарок","Другое"],
      formColors: "Ваши пожелания по цвету",
      formDelivTime: "Время доставки",
      formDelivAddr: "Адрес доставки",
      formDelivAddrPh: `${SHOP.city}...`,
      formBudget: "Мой бюджет",
      formNote: "Особые пожелания",
      formNotePh: "Любые особые пожелания...",
      formSubmit: "Отправить заказ",
      budgetHints: ["маленький букет","средний букет","большой букет","особый букет"],
      colorNames: ["Красный","Розовый","Белый","Жёлтый","Фиолетовый","Синий","Зелёный"],
      successTitle: "Ваш заказ принят!",
      successGreeting: "Привет",
      successEmoji: "🌸",
      successCall: `За ${SHOP.delivery} минут флорист позвонит на номер`,
      successCallEnd: "",
      successOrderLabel: "Ваш заказ",
      successDefaultOccasion: "Согласование с флористом",
      successEnd: `${SHOP.name} спешит вас порадовать!`,
      footerPages: "Страницы",
      footerCollections: "Коллекции",
      footerContact: "Контакты",
      footerHome: "Главная",
      footerBio: `В ${SHOP.city} мы работаем с ${SHOP.founded} года.\n${SHOP.orders} счастливых клиентов.`,
      footerCopy: "Все права защищены.",
      footerColLinks: ["Любовь и романтика","Свадьба и торжество","День рождения","Корпоратив","Подписка на цветы"],
      mobileCta: "Сделать заказ",
    },
  };

  const t = T[lang];

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent2", accent2);
    document.documentElement.style.setProperty("--accent-rgb", accentRgb);
    document.title = lang === "ru"
      ? `${SHOP.name} — ${SHOP.city} | Цветы и подарки`
      : `${SHOP.name} — ${SHOP.city} | Güller & Sowgatlyklar`;

    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${accent}"/><text x="50%" y="68%" text-anchor="middle" font-family="serif" font-size="20" fill="white">${SHOP.name.charAt(0)}</text></svg>`;
    const faviconUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(faviconSvg)));
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = faviconUrl;

    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);

    gsap.set(".hero-curtain",  { scaleY: 1, transformOrigin: "top center" });
    gsap.set(".hero-badge",    { x: -50, opacity: 0, filter: "blur(8px)" });
    gsap.set(".hero-line-1",   { y: 100, opacity: 0, scale: 0.86, filter: "blur(14px)" });
    gsap.set(".hero-line-2",   { y: 100, opacity: 0, scale: 0.86, filter: "blur(14px)" });
    gsap.set(".hero-line-3",   { y: 100, opacity: 0, scale: 0.86, filter: "blur(14px)" });
    gsap.set(".hero-tagline",  { opacity: 0, y: 20, filter: "blur(6px)" });
    gsap.set(".hero-body",     { y: 28, opacity: 0 });
    gsap.set(".hero-buttons .hbtn", { y: 28, opacity: 0, scale: 0.94 });
    gsap.set(".floating-card", { x: 80, opacity: 0, scale: 0.88 });
    gsap.set(".trust-strip",   { opacity: 0, y: 12 });
    gsap.set(".hero-img-wrap", { scale: 1.08, opacity: 0, filter: "blur(10px)" });
    gsap.set(".nav",           { y: -80, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl
      .to(".hero-curtain",   { scaleY: 0, duration: 1.1, ease: "expo.inOut" })
      .to(".nav",            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.6")
      .to(".hero-img-wrap",  { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "-=0.7")
      .to(".hero-badge",     { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "back.out(1.6)" }, "-=0.9")
      .to(".hero-line-1",    { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, "-=0.5")
      .to(".hero-line-2",    { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, "-=0.65")
      .to(".hero-line-3",    { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, "-=0.65")
      .to(".hero-tagline",   { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, "-=0.4")
      .to(".hero-body",      { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
      .to(".hero-buttons .hbtn", { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.13, ease: "back.out(1.4)" }, "-=0.35")
      .to(".floating-card",  { x: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.14, ease: "back.out(1.8)" }, "-=0.4")
      .to(".trust-strip",    { opacity: 1, y: 0, duration: 0.5 }, "-=0.25");

    const initReveal = (el: HTMLElement) => {
      const type = el.dataset.reveal || "up";
      el.style.willChange = "opacity, transform, filter";
      el.style.opacity = "0";
      el.style.filter = "blur(8px)";
      if (type === "left")  el.style.transform = "translateX(-60px) scale(0.96)";
      else if (type === "right") el.style.transform = "translateX(60px) scale(0.96)";
      else if (type === "scale") el.style.transform = "scale(0.85)";
      else el.style.transform = "translateY(60px) scale(0.97)";
      const delay = el.dataset.delay ? `${el.dataset.delay}ms` : "0ms";
      el.style.transition = `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}, filter 0.8s cubic-bezier(.22,1,.36,1) ${delay}`;
    };
    const fireReveal = (el: HTMLElement) => { el.style.opacity = "1"; el.style.transform = "none"; el.style.filter = "blur(0px)"; };

    const revealEls = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    revealEls.forEach(el => {
      if (el.classList.contains("reveal-left")) el.dataset.reveal = "left";
      else if (el.classList.contains("reveal-right")) el.dataset.reveal = "right";
      else if (el.classList.contains("reveal-scale")) el.dataset.reveal = "scale";
      else el.dataset.reveal = "up";
      initReveal(el);
    });

    const cardGroups = document.querySelectorAll<HTMLElement>(".card-group");
    cardGroups.forEach(group => {
      group.querySelectorAll<HTMLElement>(".card-anim").forEach(c => {
        c.style.willChange = "opacity, transform, filter";
        c.style.opacity = "0";
        c.style.transform = "translateY(65px) scale(0.92)";
        c.style.filter = "blur(6px)";
        c.style.transition = "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1), filter 0.7s cubic-bezier(.22,1,.36,1)";
      });
    });

    const ioReveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { fireReveal(entry.target as HTMLElement); ioReveal.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(el => ioReveal.observe(el));

    const ioCards = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = (entry.target as HTMLElement).querySelectorAll<HTMLElement>(".card-anim");
          cards.forEach((c, i) => setTimeout(() => { c.style.opacity = "1"; c.style.transform = "none"; c.style.filter = "blur(0px)"; }, i * 80));
          ioCards.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
    cardGroups.forEach(g => ioCards.observe(g));

    const sectionHeaders = document.querySelectorAll<HTMLElement>(".section-header.reveal");
    sectionHeaders.forEach(header => {
      header.querySelectorAll<HTMLElement>(".section-label, .section-h2, .section-sub").forEach((child, i) => {
        child.style.opacity = "0";
        child.style.transform = "translateY(30px)";
        child.style.filter = "blur(5px)";
        child.style.transition = `opacity 0.7s cubic-bezier(.22,1,.36,1) ${i * 120}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${i * 120}ms, filter 0.7s cubic-bezier(.22,1,.36,1) ${i * 120}ms`;
      });
    });
    const ioHeaders = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).querySelectorAll<HTMLElement>(".section-label, .section-h2, .section-sub").forEach(child => { child.style.opacity = "1"; child.style.transform = "none"; child.style.filter = "blur(0px)"; });
          ioHeaders.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    sectionHeaders.forEach(h => ioHeaders.observe(h));

    const fallback = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right, .reveal-scale, .card-anim, .section-label, .section-h2, .section-sub").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; el.style.filter = "none"; });
      document.querySelectorAll<HTMLElement>(".nav,.hero-badge,.hero-line-1,.hero-line-2,.hero-line-3,.hero-tagline,.hero-body,.trust-strip,.floating-card,.hero-img-wrap").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; el.style.filter = "none"; });
      document.querySelectorAll<HTMLElement>(".hero-curtain").forEach(el => { el.style.transform = "scaleY(0)"; });
    }, 4000);

    const obs = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect(); ioReveal.disconnect(); ioCards.disconnect(); ioHeaders.disconnect();
      clearTimeout(fallback); tl.kill();
    };
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const filteredProducts = activeFilter === "all" ? productsData : productsData.filter(p => p.category === activeFilter);
  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); setFormSubmitted(true); };
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const colorSwatches = [["#E53935","0"],["#EC407A","1"],["#FFFFFF","2"],["#FDD835","3"],["#8E24AA","4"],["#1E88E5","5"],["#43A047","6"]];

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

        .petals-canvas { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
        .fp { position:absolute; bottom:-40px; animation:petalRise linear infinite; filter:blur(0.4px); will-change:transform,opacity; }
        @keyframes petalRise {
          0%   { transform:translateY(0) translateX(0px) rotate(0deg) scale(1); opacity:var(--op,0.09); }
          20%  { transform:translateY(-20vh) translateX(calc(var(--drift,60px)*.3)) rotate(60deg) scale(1.04); }
          50%  { transform:translateY(-50vh) translateX(var(--drift,60px)) rotate(140deg) scale(0.95); }
          80%  { transform:translateY(-80vh) translateX(calc(var(--drift,60px)*.6)) rotate(220deg) scale(1.02); opacity:var(--op,0.09); }
          100% { transform:translateY(-105vh) translateX(calc(var(--drift,60px)*.1)) rotate(var(--rot,360deg)) scale(0.8); opacity:0; }
        }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);} 33%{transform:translateY(-14px) rotate(2deg);} 66%{transform:translateY(-7px) rotate(-1deg);} }
        @keyframes slowRotate { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes accentPulse { 0%,100%{box-shadow:0 0 20px rgba(${accentRgb},.35),0 4px 20px rgba(0,0,0,.3);} 50%{box-shadow:0 0 45px rgba(${accentRgb},.7),0 4px 20px rgba(0,0,0,.3);} }
        @keyframes starGlow { 0%,100%{color:#E8C96B;filter:drop-shadow(0 0 3px #E8C96B);} 50%{color:#fff;filter:drop-shadow(0 0 10px #E8C96B);} }
        @keyframes scaleIn { from{transform:scale(.92);opacity:0;} to{transform:scale(1);opacity:1;} }
        @keyframes slideUp { from{transform:translateY(30px);opacity:0;} to{transform:translateY(0);opacity:1;} }
        @keyframes drawStroke { to{stroke-dashoffset:0;} }
        @keyframes menuItemIn { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
        @keyframes menuBgIn { from{opacity:0;} to{opacity:1;} }
        @keyframes patternMove { 0%{background-position:0 0;} 100%{background-position:60px 60px;} }

        /* NAV */
        .nav { position:fixed; top:0; left:0; right:0; z-index:1000; padding:1rem 2rem; display:flex; align-items:center; justify-content:space-between; transition:all .4s cubic-bezier(.4,0,.2,1); }
        .nav.scrolled { background:rgba(6,4,10,.92); backdrop-filter:blur(28px) saturate(200%); border-bottom:1px solid rgba(${accentRgb},.18); box-shadow:0 4px 48px rgba(0,0,0,.5); }
        .nav-logo { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:600; color:var(--text); text-decoration:none; display:flex; align-items:center; gap:.55rem; letter-spacing:.01em; }
        .nav-logo svg { color:var(--accent); }
        .nav-links { display:flex; gap:2rem; list-style:none; }
        .nav-links a { color:var(--text-muted); text-decoration:none; font-size:.9rem; font-weight:500; transition:color .2s; position:relative; padding-bottom:4px; }
        .nav-links a::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px; background:var(--accent); transform:scaleX(0); transition:transform .25s ease; }
        .nav-links a:hover { color:var(--text); }
        .nav-links a:hover::after { transform:scaleX(1); }
        .nav-right { display:flex; align-items:center; gap:.8rem; }
        .nav-delivery { font-size:.78rem; color:var(--accent); font-family:'Space Grotesk',sans-serif; padding:.35rem .9rem; border:1px solid rgba(${accentRgb},.35); border-radius:30px; display:flex; align-items:center; gap:.4rem; background:rgba(${accentRgb},.06); }
        .btn-accent { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:none; padding:.72rem 1.6rem; border-radius:30px; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer; transition:all .3s; text-decoration:none; display:inline-flex; align-items:center; gap:.45rem; }
        .btn-accent:hover { transform:translateY(-2px); animation:accentPulse 2s infinite; }
        .btn-ghost { background:transparent; color:var(--text); border:1px solid rgba(255,255,255,.18); padding:.72rem 1.6rem; border-radius:30px; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:500; cursor:pointer; transition:all .3s; text-decoration:none; display:inline-flex; align-items:center; gap:.45rem; }
        .btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
        .hamburger { display:none; background:rgba(${accentRgb},.08); border:1px solid rgba(${accentRgb},.2); border-radius:12px; color:var(--text); cursor:pointer; padding:.55rem; transition:all .2s; width:44px; height:44px; align-items:center; justify-content:center; }
        .hamburger:hover { background:rgba(${accentRgb},.16); border-color:rgba(${accentRgb},.4); }

        /* Language switcher */
        .lang-switcher { display:flex; align-items:center; gap:.35rem; background:rgba(${accentRgb},.06); border:1px solid rgba(${accentRgb},.2); border-radius:30px; padding:.28rem .5rem; }
        .lang-btn { display:flex; align-items:center; gap:.3rem; padding:.28rem .55rem; border-radius:20px; border:none; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:.73rem; font-weight:600; transition:all .25s; background:transparent; color:var(--text-muted); letter-spacing:.02em; }
        .lang-btn.active { background:var(--accent); color:#fff; box-shadow:0 2px 8px rgba(${accentRgb},.4); }
        .lang-btn:not(.active):hover { background:rgba(${accentRgb},.12); color:var(--text); }

        /* MOBILE MENU */
        .mobile-menu { display:none; position:fixed; inset:0; z-index:1100; background:rgba(4,2,8,.97); flex-direction:column; align-items:center; justify-content:center; gap:0; opacity:0; transition:opacity .35s ease; overflow:hidden; }
        .mobile-menu.open { display:flex; animation:menuBgIn .3s ease forwards; }
        .mobile-menu::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle at 50% 50%, rgba(${accentRgb},.04) 0%, transparent 70%),repeating-linear-gradient(0deg,transparent,transparent 29px,rgba(${accentRgb},.04) 30px),repeating-linear-gradient(90deg,transparent,transparent 29px,rgba(${accentRgb},.04) 30px); animation:patternMove 8s linear infinite; pointer-events:none; }
        .mobile-menu::after { content:''; position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(${accentRgb},.06) 0%, transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; }
        .mm-corner { position:absolute; pointer-events:none; opacity:.12; }
        .mm-corner-tl { top:-30px; left:-30px; width:200px; height:200px; }
        .mm-corner-br { bottom:-30px; right:-30px; width:180px; height:180px; transform:rotate(180deg); }
        .mm-top-line { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent); }
        .mm-bottom-line { position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(${accentRgb},.3),transparent); }
        .mm-logo { position:absolute; top:1.6rem; left:1.6rem; font-family:'Cormorant Garamond',serif; font-size:1.4rem; color:var(--text); display:flex; align-items:center; gap:.5rem; z-index:2; opacity:.8; }
        .mm-logo svg { color:var(--accent); }
        .mobile-close { position:absolute; top:1.2rem; right:1.2rem; background:rgba(${accentRgb},.08); border:1px solid rgba(${accentRgb},.2); border-radius:50%; color:var(--text); cursor:pointer; width:44px; height:44px; display:flex; align-items:center; justify-content:center; transition:all .2s; z-index:2; }
        .mobile-close:hover { background:rgba(${accentRgb},.18); transform:rotate(90deg); }
        .mm-nav-list { list-style:none; display:flex; flex-direction:column; align-items:center; gap:.2rem; position:relative; z-index:2; padding:2rem 0; }
        .mm-nav-item { overflow:hidden; }
        .mm-nav-item a { display:flex; align-items:center; gap:.6rem; font-family:'Playfair Display',serif; font-size:clamp(1.7rem,7vw,2.5rem); color:rgba(248,244,252,.75); text-decoration:none; transition:color .25s,transform .25s; padding:.55rem 2rem; letter-spacing:.01em; position:relative; }
        .mm-nav-item a::before { content:'✦'; font-size:.7em; color:var(--accent); opacity:0; transform:translateX(-8px); transition:all .25s; font-family:sans-serif; }
        .mm-nav-item a:hover { color:var(--text); transform:translateX(6px); }
        .mm-nav-item a:hover::before { opacity:1; transform:translateX(0); }
        .mm-divider { width:60px; height:1px; background:linear-gradient(90deg,transparent,rgba(${accentRgb},.4),transparent); margin:.5rem 0; position:relative; z-index:2; }
        .mm-social { display:flex; gap:1rem; position:relative; z-index:2; margin-top:.5rem; }
        .mm-social a { display:flex; align-items:center; gap:.4rem; color:var(--text-muted); text-decoration:none; font-size:.82rem; background:rgba(${accentRgb},.06); border:1px solid rgba(${accentRgb},.18); padding:.5rem 1rem; border-radius:20px; transition:all .25s; }
        .mm-social a:hover { color:var(--accent); border-color:rgba(${accentRgb},.5); }
        .mm-cta { position:relative; z-index:2; margin-top:1.2rem; }
        .mobile-menu.open .mm-nav-item { animation:menuItemIn .4s cubic-bezier(.22,1,.36,1) both; }
        .mobile-menu.open .mm-nav-item:nth-child(1) { animation-delay:.08s; }
        .mobile-menu.open .mm-nav-item:nth-child(2) { animation-delay:.14s; }
        .mobile-menu.open .mm-nav-item:nth-child(3) { animation-delay:.20s; }
        .mobile-menu.open .mm-nav-item:nth-child(4) { animation-delay:.26s; }
        .mobile-menu.open .mm-nav-item:nth-child(5) { animation-delay:.32s; }
        .mobile-menu.open .mm-divider,.mobile-menu.open .mm-social,.mobile-menu.open .mm-cta { animation:menuItemIn .4s cubic-bezier(.22,1,.36,1) .38s both; }

        /* HERO */
        .hero-curtain { position:fixed; inset:0; z-index:999; background:var(--bg); pointer-events:none; transform-origin:top center; }
        .hero { min-height:100vh; display:flex; align-items:center; position:relative; overflow:hidden; padding:8rem 2rem 5rem; }
        .hero-orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .hero-orb-1 { width:700px; height:700px; background:var(--accent); opacity:.07; top:50%; left:50%; transform:translate(-50%,-50%); animation:slowRotate 35s linear infinite; }
        .hero-orb-2 { width:350px; height:350px; background:var(--accent2); opacity:.05; top:15%; right:8%; animation:slowRotate 25s linear infinite reverse; }
        .hero-orb-3 { width:250px; height:250px; background:var(--accent); opacity:.04; bottom:10%; left:5%; animation:slowRotate 20s linear infinite; }
        .dot-grid { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(${accentRgb},.07) 1px,transparent 1px); background-size:26px 26px; pointer-events:none; }
        .hero-content { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; max-width:1400px; margin:0 auto; width:100%; }
        .hero-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(${accentRgb},.1); border:1px solid rgba(${accentRgb},.3); border-radius:30px; padding:.42rem 1.1rem; font-size:.82rem; color:var(--accent); margin-bottom:1.6rem; font-family:'Space Grotesk',sans-serif; width:fit-content; }
        .hero-heading { font-family:'Playfair Display',serif; font-style:italic; line-height:1.05; margin-bottom:1.1rem; overflow:hidden; }
        .hero-line-1,.hero-line-2,.hero-line-3 { display:block; font-size:clamp(2.8rem,7vw,6.5rem); font-weight:700; }
        .hero-line-1,.hero-line-3 { color:var(--text); }
        .hero-line-2 { background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-tagline { font-family:'Cormorant Garamond',serif; font-size:1.15rem; color:var(--gold); letter-spacing:.06em; margin-bottom:1.1rem; font-style:italic; }
        .hero-body { color:var(--text-muted); line-height:1.8; margin-bottom:2.2rem; max-width:500px; font-size:.97rem; }
        .hero-buttons { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2.5rem; }
        .trust-strip { display:flex; gap:1.5rem; flex-wrap:wrap; }
        .trust-item { display:flex; align-items:center; gap:.45rem; font-size:.83rem; color:var(--text-muted); }
        .trust-item svg { color:var(--accent); flex-shrink:0; }
        .hero-right { position:relative; display:flex; justify-content:center; align-items:center; min-height:400px; }
        .hero-img-wrap { width:300px; height:300px; border-radius:50%; overflow:hidden; border:1px solid rgba(${accentRgb},.2); box-shadow:0 0 80px rgba(${accentRgb},.15); position:relative; }
        .hero-img-wrap img { width:100%; height:100%; object-fit:cover; }
        .floating-card { position:absolute; background:rgba(16,12,24,.92); border:1px solid rgba(${accentRgb},.2); border-radius:16px; padding:.85rem 1.1rem; backdrop-filter:blur(20px); animation:float var(--dur,4s) ease-in-out infinite; min-width:140px; }
        .floating-card:nth-child(2) { top:4%; right:0; --dur:3.2s; }
        .floating-card:nth-child(3) { top:42%; left:-5%; --dur:4.1s; }
        .floating-card:nth-child(4) { bottom:4%; right:10%; --dur:5s; }
        .fc-icon { color:var(--accent); margin-bottom:.4rem; }
        .fc-title { font-size:.82rem; color:var(--text); font-weight:600; margin-bottom:.2rem; }
        .fc-sub { font-size:.74rem; color:var(--text-muted); }
        .fc-stars { display:flex; gap:2px; color:var(--gold); margin-bottom:.3rem; }

        /* STATS */
        .stats-section { background:linear-gradient(135deg,rgba(${accentRgb},.06),transparent 60%); border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:3.5rem 2rem; position:relative; z-index:1; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2rem; max-width:1000px; margin:0 auto; text-align:center; }
        .stat-number { font-family:'Space Grotesk',sans-serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:700; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; animation:${statsVisible ? "scaleIn .6s ease forwards" : "none"}; }
        .stat-label { font-size:.82rem; color:var(--text-muted); margin-top:.5rem; letter-spacing:.02em; }
        .stat-icon { color:var(--accent); margin-bottom:.5rem; opacity:.7; }

        /* SECTION */
        .section { padding:clamp(3.5rem,8vw,7rem) clamp(1rem,4vw,2.5rem); max-width:1440px; margin:0 auto; position:relative; z-index:1; }
        .section-header { text-align:center; margin-bottom:3.5rem; }
        .section-label { font-family:'Space Grotesk',sans-serif; font-size:.72rem; letter-spacing:.22em; text-transform:uppercase; color:var(--accent); margin-bottom:.6rem; display:flex; align-items:center; justify-content:center; gap:.5rem; }
        .section-label::before,.section-label::after { content:''; flex:1; max-width:60px; height:1px; background:linear-gradient(90deg,transparent,var(--accent)); }
        .section-label::after { background:linear-gradient(270deg,transparent,var(--accent)); }
        .section-h2 { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4.5vw,2.8rem); color:var(--text); margin-bottom:.8rem; line-height:1.2; }
        .section-sub { color:var(--text-muted); font-size:.97rem; max-width:520px; margin:0 auto; line-height:1.7; }

        /* COLLECTIONS */
        .collections-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .collection-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; overflow:hidden; cursor:pointer; transition:all .35s cubic-bezier(.4,0,.2,1); position:relative; min-height:240px; display:flex; flex-direction:column; }
        .collection-card.wide { grid-column:span 2; }
        .collection-card:hover { transform:translateY(-7px); box-shadow:0 24px 60px rgba(${accentRgb},.22); border-color:rgba(${accentRgb},.4); }
        .collection-card:hover .col-arrow { opacity:1; transform:translateX(0); }
        .col-img-wrap { height:160px; overflow:hidden; position:relative; }
        .col-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
        .collection-card:hover .col-img-wrap img { transform:scale(1.06); }
        .col-tag { position:absolute; top:.8rem; left:.8rem; background:rgba(${accentRgb},.85); color:#fff; font-size:.68rem; padding:.25rem .65rem; border-radius:20px; font-family:'Space Grotesk',sans-serif; font-weight:600; letter-spacing:.05em; z-index:2; }
        .col-body { padding:1.3rem 1.4rem 1.4rem; flex:1; display:flex; flex-direction:column; justify-content:space-between; }
        .col-icon-wrap { width:38px; height:38px; background:rgba(${accentRgb},.1); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--accent); margin-bottom:.75rem; }
        .col-name { font-family:'Playfair Display',serif; font-size:1.1rem; margin-bottom:.4rem; }
        .col-desc { color:var(--text-muted); font-size:.83rem; line-height:1.5; margin-bottom:.8rem; }
        .col-footer { display:flex; align-items:center; justify-content:space-between; }
        .col-price { font-family:'Space Grotesk',sans-serif; font-size:.88rem; color:var(--accent); font-weight:600; }
        .col-arrow { color:var(--accent); opacity:0; transform:translateX(-6px); transition:all .3s ease; }

        /* WHY US */
        .why-section { padding:clamp(3.5rem,8vw,7rem) clamp(1rem,4vw,2.5rem); position:relative; z-index:1; }
        .why-grid { display:grid; grid-template-columns:3fr 2fr; gap:5rem; align-items:center; max-width:1200px; margin:0 auto; }
        .why-heading { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,5vw,5rem); font-style:italic; line-height:1.1; color:var(--text); margin-bottom:1.5rem; }
        .why-body { color:var(--text-muted); line-height:1.85; margin-bottom:1.5rem; font-size:.97rem; }
        .gold-divider { height:1px; background:linear-gradient(90deg,var(--gold) 0%,rgba(201,168,76,.3) 60%,transparent 100%); margin:1.5rem 0; }
        .why-stats-inline { color:var(--text-muted); font-size:.92rem; }
        .why-stats-inline strong { color:var(--gold); }
        .feature-list { display:flex; flex-direction:column; gap:1.6rem; }
        .feature-item { display:flex; gap:1rem; align-items:flex-start; }
        .feature-icon-box { width:44px; height:44px; border-radius:12px; background:rgba(${accentRgb},.1); border:1px solid rgba(${accentRgb},.2); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
        .feature-title { font-weight:600; font-size:.95rem; margin-bottom:.3rem; }
        .feature-desc { color:var(--text-muted); font-size:.84rem; line-height:1.55; }

        /* PRODUCTS */
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

        /* FLORISTS */
        .florists-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .florist-card { background:var(--surface); border:1px solid var(--border); border-radius:22px; overflow:hidden; transition:all .4s; }
        .florist-card:hover { box-shadow:0 20px 60px rgba(${accentRgb},.2); border-color:rgba(${accentRgb},.3); transform:perspective(800px) rotateY(3deg) rotateX(-2deg) translateY(-4px); }
        .florist-card:hover .florist-cta { opacity:1; transform:translateY(0); }
        .florist-top { position:relative; overflow:hidden; height:220px; }
        .florist-top img { width:100%; height:100%; object-fit:cover; object-position:top; }
        .florist-badge { position:absolute; top:.8rem; right:.8rem; font-size:.68rem; background:rgba(201,168,76,.85); color:#000; padding:.25rem .65rem; border-radius:20px; font-family:'Space Grotesk',sans-serif; font-weight:700; }
        .florist-overlay { position:absolute; bottom:0; left:0; right:0; padding:1rem; background:linear-gradient(0deg,rgba(6,4,10,.95) 60%,transparent); }
        .florist-quote-text { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:.95rem; color:rgba(248,244,252,.75); line-height:1.4; }
        .florist-bottom { padding:1.3rem; }
        .florist-name { font-family:'Playfair Display',serif; font-size:1.05rem; margin-bottom:.2rem; }
        .florist-role { color:var(--text-muted); font-size:.82rem; margin-bottom:.8rem; }
        .florist-tags { display:flex; gap:.4rem; flex-wrap:wrap; }
        .florist-tag { font-size:.69rem; background:var(--surface2); border:1px solid var(--border); padding:.18rem .55rem; border-radius:8px; color:var(--text-muted); display:flex; align-items:center; gap:.3rem; }
        .florist-cta { display:flex; align-items:center; justify-content:center; gap:.4rem; width:100%; margin-top:1rem; padding:.6rem; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.85rem; font-weight:600; cursor:pointer; opacity:0; transform:translateY(8px); transition:all .3s; }

        /* PROCESS */
        .process-section { padding:clamp(3.5rem,8vw,7rem) clamp(1rem,4vw,2.5rem); background:linear-gradient(180deg,transparent,rgba(${accentRgb},.04),transparent); position:relative; z-index:1; }
        .process-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; max-width:1050px; margin:0 auto; position:relative; }
        .process-connector { position:absolute; top:2rem; left:calc(12.5% + 1rem); right:calc(12.5% + 1rem); height:1px; background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent); }
        .process-step { text-align:center; padding:1rem .5rem; position:relative; }
        .step-number { font-family:'Space Grotesk',sans-serif; font-size:.72rem; font-weight:700; color:var(--accent); letter-spacing:.15em; text-transform:uppercase; margin-bottom:.6rem; }
        .step-icon-circle { width:60px; height:60px; border-radius:50%; background:var(--surface2); border:2px solid rgba(${accentRgb},.25); display:flex; align-items:center; justify-content:center; margin:0 auto .9rem; color:var(--accent); transition:all .4s; box-shadow:0 0 20px rgba(${accentRgb},.15); }
        .process-step:hover .step-icon-circle { border-color:var(--accent); box-shadow:0 0 30px rgba(${accentRgb},.4); background:rgba(${accentRgb},.1); }
        .step-title { font-family:'Playfair Display',serif; font-size:1rem; margin-bottom:.45rem; }
        .step-desc { color:var(--text-muted); font-size:.82rem; line-height:1.55; }

        /* TESTIMONIALS */
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
        .t-name { font-size:.9rem; font-weight:600; }
        .t-role { font-size:.76rem; color:var(--text-muted); }
        .t-date { font-size:.73rem; color:var(--text-muted); opacity:.7; }

        /* PRICING */
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

        /* EVENTS */
        .events-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:1rem; }
        .event-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:1.5rem 1rem; text-align:center; transition:all .3s; cursor:pointer; }
        .event-card:hover { border-color:var(--accent); transform:translateY(-5px); box-shadow:0 12px 35px rgba(${accentRgb},.15); }
        .event-icon { width:48px; height:48px; border-radius:14px; background:rgba(${accentRgb},.1); display:flex; align-items:center; justify-content:center; color:var(--accent); margin:0 auto .9rem; }
        .event-name { font-family:'Playfair Display',serif; font-size:.9rem; margin-bottom:.35rem; }
        .event-sub { color:var(--text-muted); font-size:.75rem; margin-bottom:.65rem; }
        .event-days { font-family:'Space Grotesk',sans-serif; font-size:.76rem; color:var(--accent); background:rgba(${accentRgb},.1); border-radius:20px; padding:.2rem .65rem; display:inline-block; font-weight:600; }

        /* CONTACT */
        .contact-grid { display:grid; grid-template-columns:1fr 1.6fr; gap:4rem; max-width:1100px; margin:0 auto; }
        .contact-info-heading { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,3.5vw,2.3rem); margin-bottom:1rem; line-height:1.2; }
        .contact-info-body { color:var(--text-muted); line-height:1.75; margin-bottom:2rem; font-size:.95rem; }
        .contact-item { display:flex; align-items:center; gap:.8rem; margin-bottom:.9rem; color:var(--text-muted); font-size:.9rem; }
        .contact-item-icon { width:36px; height:36px; border-radius:10px; background:rgba(${accentRgb},.1); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
        .contact-item strong { color:var(--text); }
        .social-row { display:flex; gap:.7rem; margin-top:1.4rem; flex-wrap:wrap; }
        .social-btn { display:inline-flex; align-items:center; gap:.45rem; color:var(--text-muted); text-decoration:none; font-size:.82rem; background:var(--surface); border:1px solid var(--border); padding:.42rem .9rem; border-radius:20px; transition:all .25s; }
        .social-btn:hover { border-color:var(--accent); color:var(--accent); background:rgba(${accentRgb},.06); }
        .form-card { background:var(--surface); border:1px solid var(--border); border-radius:26px; padding:2rem; }
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

        /* FOOTER */
        .footer { border-top:1px solid var(--border); padding:4rem 2rem 2rem; background:linear-gradient(180deg,transparent,rgba(${accentRgb},.04)); position:relative; z-index:1; }
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
        .footer-bottom { display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border); padding-top:1.5rem; gap:1rem; flex-wrap:wrap; }
        .footer-copy { color:var(--text-muted); font-size:.82rem; }
        .footer-agency { color:var(--text-muted); font-size:.8rem; display:flex; align-items:center; gap:.4rem; }
        .footer-agency a { color:var(--accent); text-decoration:none; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .nav-links, .nav-delivery { display:none; }
          .hamburger { display:flex; }
          .nav-right .btn-accent { display:none; }
          .hero-content { grid-template-columns:1fr; gap:2.5rem; text-align:center; }
          .hero-right { display:none; }
          .hero-body { max-width:100%; }
          .hero-buttons { justify-content:center; }
          .trust-strip { justify-content:center; }
          .collections-grid { grid-template-columns:repeat(2,1fr); }
          .collection-card.wide { grid-column:span 2; }
          .products-grid { grid-template-columns:repeat(2,1fr); }
          .florists-grid { grid-template-columns:repeat(2,1fr); }
          .testimonials-grid { grid-template-columns:1fr 1fr; }
          .events-grid { grid-template-columns:repeat(3,1fr); }
          .why-grid { grid-template-columns:1fr; gap:2.5rem; }
          .footer-grid { grid-template-columns:1fr 1fr; gap:2rem; }
          .process-steps { grid-template-columns:repeat(2,1fr); gap:1.5rem; }
          .process-connector { display:none; }
          .contact-grid { grid-template-columns:1fr; gap:2rem; }
          .stats-grid { grid-template-columns:repeat(2,1fr); gap:1.5rem; }
          .price-tiers-grid { grid-template-columns:repeat(2,1fr); }
          .wedding-grid { grid-template-columns:1fr; }
          .sub-grid { grid-template-columns:1fr; }
        }
        @media (max-width: 640px) {
          .nav { padding:.8rem 1.2rem; }
          .hero { padding:6rem 1.2rem 3.5rem; }
          .hero-line-1,.hero-line-2,.hero-line-3 { font-size:clamp(2.2rem,12vw,3.5rem); }
          .hero-buttons { flex-direction:column; align-items:stretch; }
          .hero-buttons .btn-accent,.hero-buttons .btn-ghost { justify-content:center; }
          .collections-grid { grid-template-columns:1fr; }
          .collection-card.wide { grid-column:span 1; }
          .products-grid { grid-template-columns:1fr; }
          .florists-grid { grid-template-columns:1fr; }
          .testimonials-grid { grid-template-columns:1fr; }
          .events-grid { grid-template-columns:repeat(2,1fr); }
          .filter-tabs { gap:.4rem; }
          .filter-tab { font-size:.78rem; padding:.4rem .9rem; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .price-tiers-grid { grid-template-columns:1fr 1fr; }
          .footer-grid { grid-template-columns:1fr; gap:1.8rem; }
          .footer-bottom { flex-direction:column; align-items:flex-start; }
          .section { padding:3rem 1.2rem; }
          .form-grid-2 { grid-template-columns:1fr; }
          .process-steps { grid-template-columns:1fr 1fr; }
          .sub-grid { grid-template-columns:1fr; }
          .form-card { padding:1.4rem; }
          .lang-btn span { display:none; }
        }
        @media (max-width: 400px) {
          .events-grid { grid-template-columns:1fr 1fr; }
          .price-tiers-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <FloatingPetals accentRgb={accentRgb} />

      {/* NAV */}
      <nav className={`nav${navScrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-logo"><Flower2 size={22} /> {SHOP.name}</a>
        <ul className="nav-links">
          {t.navLinks.map(([href, label]) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <span className="nav-delivery"><Truck size={12} /> {SHOP.delivery} {t.navDelivery}</span>

          {/* Language switcher */}
          <div className="lang-switcher">
            <button className={`lang-btn${lang === "ru" ? " active" : ""}`} onClick={() => setLang("ru")} title="Русский">
              <FlagRU size={18} /> <span>RU</span>
            </button>
            <button className={`lang-btn${lang === "tm" ? " active" : ""}`} onClick={() => setLang("tm")} title="Türkmen">
              <FlagTM size={14} /> <span>TM</span>
            </button>
          </div>

          <a href="#contact" className="btn-accent hbtn"><Flower size={15} /> {t.navOrder}</a>
          <button className="hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        <div className="mm-top-line" />
        <div className="mm-bottom-line" />
        <svg className="mm-corner mm-corner-tl" viewBox="0 0 200 200" fill="none">
          <circle cx="0" cy="0" r="100" stroke={`rgba(${accentRgb},.5)`} strokeWidth="1" fill="none" />
          <circle cx="0" cy="0" r="70" stroke={`rgba(${accentRgb},.3)`} strokeWidth="1" fill="none" />
          {[0,45,90,135].map(deg => <line key={deg} x1="0" y1="0" x2="100" y2="0" stroke={`rgba(${accentRgb},.2)`} strokeWidth="1" transform={`rotate(${deg})`} />)}
        </svg>
        <svg className="mm-corner mm-corner-br" viewBox="0 0 200 200" fill="none">
          <circle cx="200" cy="200" r="100" stroke={`rgba(${accentRgb},.5)`} strokeWidth="1" fill="none" />
          <circle cx="200" cy="200" r="60" stroke={`rgba(${accentRgb},.25)`} strokeWidth="1" fill="none" />
        </svg>
        <div className="mm-logo"><Flower2 size={20} /> {SHOP.name}</div>
        <button className="mobile-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close"><X size={20} /></button>
        <ul className="mm-nav-list">
          {t.navLinks.map(([href, label]) => (
            <li key={href} className="mm-nav-item">
              <a href={href} onClick={() => setMobileMenuOpen(false)}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="mm-divider" />
        <div className="mm-social">
          {SHOP.instagram && <a href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a>}
          {SHOP.telegram && <a href={`https://t.me/${SHOP.telegram}`} target="_blank" rel="noreferrer"><Send size={14} /> Telegram</a>}
        </div>
        <div className="mm-cta">
          <a href="#contact" className="btn-accent" onClick={() => setMobileMenuOpen(false)}>
            <Flower size={15} /> {t.mobileCta}
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-curtain" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="dot-grid" />
        <div className="hero-content">
          <div>
            <div className="hero-badge"><Sparkles size={13} /> {SHOP.city} — {SHOP.rating} ★ · {SHOP.reviews} {t.heroReviews}</div>
            <h1 className="hero-heading">
              <span className="hero-line-1">{t.heroLine1}</span>
              <span className="hero-line-2">{t.heroLine2}</span>
              <span className="hero-line-3">{t.heroLine3}</span>
            </h1>
            {SHOP.tagline && <div className="hero-tagline">✦ {SHOP.tagline} ✦</div>}
            <p className="hero-body">{t.heroBody}</p>
            <div className="hero-buttons">
              <a href="#contact" className="btn-accent hbtn"><ShoppingBag size={16} /> {t.heroBtnOrder}</a>
              <a href="#collections" className="btn-ghost hbtn"><Leaf size={16} /> {t.heroBtnCols}</a>
            </div>
            <div className="trust-strip">
              <div className="trust-item"><CheckCircle size={14} /> {t.trustDelivery}</div>
              <div className="trust-item"><Star size={14} /> {SHOP.rating}{t.trustRating}</div>
              <div className="trust-item"><Heart size={14} /> {SHOP.orders} {t.trustOrders}</div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-img-wrap">
              <img src={UNS.heroMain} alt="Flowers" loading="eager" />
            </div>
            <div className="floating-card">
              <div className="fc-icon"><Truck size={16} /></div>
              <div className="fc-title">{t.fcDelivery}</div>
              <div className="fc-sub">{SHOP.delivery} {t.fcDeliveryUnit}</div>
            </div>
            <div className="floating-card">
              <div className="fc-stars">{[...Array(5)].map((_,i) => <Star key={i} size={11} fill="currentColor" />)}</div>
              <div className="fc-title">{SHOP.rating} {t.fcRating}</div>
              <div className="fc-sub">{SHOP.reviews} {t.fcReviews}</div>
            </div>
            <div className="floating-card">
              <div className="fc-icon"><Flower2 size={16} /></div>
              <div className="fc-title">{t.fcFlowers}</div>
              <div className="fc-sub">{t.fcFlowersSub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {[
            { Icon: ShoppingBag, num: SHOP.orders,            label: t.statOrders },
            { Icon: Star,        num: SHOP.rating,            label: t.statRating },
            { Icon: Truck,       num: `${SHOP.delivery} ${t.navDelivery}`, label: t.statDelivery },
            { Icon: Flower2,     num: "200+",                 label: t.statVariety },
          ].map(({ Icon, num, label }) => (
            <div className="stat-item" key={label}>
              <div className="stat-icon"><Icon size={22} /></div>
              <div className="stat-number">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section id="collections" className="section">
        <div className="section-header reveal">
          <div className="section-label">{t.colSectionLabel}</div>
          <h2 className="section-h2">{t.colSectionH2}</h2>
          <p className="section-sub">{t.colSectionSub}</p>
        </div>
        <div className="collections-grid card-group">
          {collectionsData.map(col => {
            const d = col[lang];
            return (
              <div key={col.id} className={`collection-card card-anim${col.wide ? " wide" : ""}`}>
                <div className="col-img-wrap" style={{ background: col.gradient }}>
                  <img src={col.img} alt={d.name} loading="lazy" />
                  <div className="col-tag">{d.tag}</div>
                </div>
                <div className="col-body">
                  <div className="col-top">
                    <div className="col-icon-wrap"><col.Icon size={18} /></div>
                    <div className="col-name">{d.name}</div>
                    <div className="col-desc">{d.desc}</div>
                  </div>
                  <div className="col-footer">
                    <span className="col-price">{d.items} · {col.priceFrom} {t.colPriceFrom}</span>
                    <ChevronRight size={16} className="col-arrow" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY US */}
      <div className="why-section">
        <div className="why-grid">
          <div className="reveal-left">
            <div className="section-label" style={{ justifyContent: "flex-start" }}>{t.whySectionLabel}</div>
            <h2 className="why-heading">{t.whyHeading1}<br />{t.whyHeading2}<br /><em>{t.whyHeading3}</em></h2>
            <p className="why-body">{t.whyBody}</p>
            <div className="gold-divider" />
            <div className="why-stats-inline" dangerouslySetInnerHTML={{ __html: t.whyStats.replace(/(\d[\d+\/]+[\d\.+]*)/g, '<strong>$1</strong>') }} />
          </div>
          <div className="feature-list reveal-right">
            {t.features.map(({ title, desc }, i) => {
              const icons = [Truck, Scissors, Ribbon, Camera];
              const Icon = icons[i] || Truck;
              return (
                <div className="feature-item" key={i}>
                  <div className="feature-icon-box"><Icon size={18} /></div>
                  <div>
                    <div className="feature-title">{title}</div>
                    <div className="feature-desc">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" className="section">
        <div className="section-header reveal">
          <div className="section-label">{t.prodSectionLabel}</div>
          <h2 className="section-h2">{t.prodSectionH2}</h2>
          <p className="section-sub">{t.prodSectionSub}</p>
        </div>
        <div className="filter-tabs">
          {t.filterTabs.map(([v, l]) => (
            <button key={v} className={`filter-tab${activeFilter === v ? " active" : ""}`} onClick={() => setActiveFilter(v)}>{l}</button>
          ))}
        </div>
        <div className="products-grid card-group">
          {filteredProducts.map(p => {
            const d = p[lang];
            return (
              <div key={p.id} className="product-card card-anim">
                <div className="product-img-wrap" style={{ background: p.gradient }}>
                  <img className="p-img" src={p.img} alt={d.name} loading="lazy" />
                  <div className="p-badge">{d.badge}</div>
                  <button className="p-wish" aria-label={t.wishBtn}><Heart size={14} /></button>
                </div>
                <div className="product-info">
                  <div className="p-name">{d.name}</div>
                  <div className="p-flowers"><Leaf size={11} /> {d.flowers}</div>
                  <div className="p-size-tag">{d.size}</div>
                  <div className="p-price-row">
                    <span className="p-price">{p.price}</span>
                    <span className="p-currency">TMT</span>
                    {p.oldPrice && <span className="p-old">{p.oldPrice}</span>}
                  </div>
                  <button className="p-order-btn"><ShoppingBag size={14} /> {t.orderBtn}</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FLORISTS */}
      <section id="florists" className="section">
        <div className="section-header reveal">
          <div className="section-label">{t.floSectionLabel}</div>
          <h2 className="section-h2">{t.floSectionH2}</h2>
          <p className="section-sub">{t.floSectionSub}</p>
        </div>
        <div className="florists-grid card-group">
          {floristsData.map((f, i) => {
            const d = f[lang];
            return (
              <div key={i} className="florist-card card-anim">
                <div className="florist-top">
                  <img src={f.img} alt={d.name} loading="lazy" />
                  <div className="florist-badge">{d.cert}</div>
                  <div className="florist-overlay">
                    <div className="florist-quote-text">"{d.quote}"</div>
                  </div>
                </div>
                <div className="florist-bottom">
                  <div className="florist-name">{d.name}</div>
                  <div className="florist-role">{d.title} · {d.exp}</div>
                  <div className="florist-tags">
                    <span className="florist-tag"><Award size={10} /> {d.achievement}</span>
                    <span className="florist-tag"><Scissors size={10} /> {d.specialty}</span>
                  </div>
                  <button className="florist-cta"><Send size={13} /> {t.floContact}</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ORDER PROCESS */}
      <div className="process-section">
        <div className="section-header reveal">
          <div className="section-label">{t.processSectionLabel}</div>
          <h2 className="section-h2">{t.processSectionH2}</h2>
        </div>
        <div className="process-steps card-group">
          <div className="process-connector" />
          {[
            { Icon: MessageCircle, step: t.steps[0] },
            { Icon: Scissors,      step: t.steps[1] },
            { Icon: Camera,        step: t.steps[2] },
            { Icon: Truck,         step: t.steps[3] },
          ].map(({ Icon, step }) => (
            <div className="process-step card-anim" key={step.num}>
              <div className="step-number">{t.stepLabel} {step.num}</div>
              <div className="step-icon-circle"><Icon size={24} /></div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-header reveal">
          <div className="section-label">{t.testSectionLabel}</div>
          <h2 className="section-h2">{t.testSectionH2}</h2>
          <p className="section-sub">{t.testSectionSub}</p>
        </div>
        <div className="testimonials-grid card-group">
          {testimonialsData.map((test, i) => {
            const d = test[lang];
            return (
              <div key={i} className="testimonial-card card-anim">
                <div className="t-quotemark">"</div>
                <div className="t-stars">{[...Array(test.rating)].map((_,j) => <Star key={j} size={13} fill="currentColor" />)}</div>
                <div className="t-occasion"><Flower size={11} /> {d.occasion}</div>
                <div className="t-result">{d.result}</div>
                <div className="t-text">"{d.text}"</div>
                <div className="t-author">
                  <div className="t-avatar"><img src={test.avatar} alt={d.name} loading="lazy" /></div>
                  <div>
                    <div className="t-name">{d.name}</div>
                    <div className="t-role">{d.role}</div>
                    <div className="t-date">{d.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section">
        <div className="section-header reveal">
          <div className="section-label">{t.priceSectionLabel}</div>
          <h2 className="section-h2">{t.priceSectionH2}</h2>
          <p className="section-sub">{t.priceSectionSub}</p>
        </div>

        <div className="price-tiers-grid card-group">
          {t.priceTiers.map((tier, i) => (
            <div className="price-tier card-anim" key={tier.label}>
              <div className="pt-label">{tier.label}</div>
              <div className="pt-price">{t.priceTierPrices[i]} <span style={{ fontSize: ".9rem" }}>TMT</span></div>
              <div className="pt-name">{tier.name}</div>
              <div className="pt-desc">{tier.desc}</div>
            </div>
          ))}
        </div>

        <div className="section-header reveal" style={{ marginTop: "3rem" }}>
          <div className="section-label">{t.weddingSectionLabel}</div>
          <h2 className="section-h2" style={{ fontSize: "1.9rem" }}>{t.weddingSectionH2}</h2>
        </div>

        <div className="wedding-grid card-group">
          {t.weddingPackages.map(p => (
            <div key={p.name} className={`wp-card card-anim${p.popular ? " popular" : ""}`}>
              {p.popular && <div className="wp-popular-badge">{t.weddingPopular}</div>}
              <div className="wp-price">{p.price} <sup>TMT</sup></div>
              <div className="wp-name">{p.name}</div>
              <div className="wp-note">{p.note}</div>
              <ul className="wp-list">
                {p.items.map(it => <li key={it} className="wp-item"><CheckCircle size={14} /> {it}</li>)}
              </ul>
              <a href="#contact" className="btn-accent" style={{ marginTop: "1.4rem", width: "100%", justifyContent: "center" }}>{t.weddingChoose}</a>
            </div>
          ))}
        </div>

        <div className="section-header reveal" style={{ marginTop: "2.5rem" }}>
          <div className="section-label">{t.subSectionLabel}</div>
          <h2 className="section-h2" style={{ fontSize: "1.9rem" }}>{t.subSectionH2}</h2>
        </div>
        <div className="sub-grid card-group">
          {t.subs.map(s => (
            <div key={s.title} className="sub-card card-anim">
              <div className="sub-title">{s.title}</div>
              <div className="sub-price">{s.price} TMT <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>/ {t.subSeason}</span></div>
              <div className="sub-detail">{s.detail}</div>
              <ul className="sub-list">
                {s.items.map(it => <li key={it}><CheckCircle size={13} /> {it}</li>)}
              </ul>
              <a href="#contact" className="btn-accent" style={{ marginTop: "1.4rem", display: "inline-flex" }}>{t.subStart}</a>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="section">
        <div className="section-header reveal">
          <div className="section-label">{t.eventSectionLabel}</div>
          <h2 className="section-h2">{t.eventSectionH2}</h2>
          <p className="section-sub">{t.eventSectionSub}</p>
        </div>
        <div className="events-grid card-group">
          {eventsData.map((ev, i) => {
            const d = ev[lang];
            return (
              <div key={i} className="event-card card-anim">
                <div className="event-icon"><ev.Icon size={22} /></div>
                <div className="event-name">{d.name}</div>
                <div className="event-sub">{d.subtitle}</div>
                <div className="event-days">{daysUntil(ev.month, ev.day)} {t.daysLeft}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="contact-grid">
          <div className="reveal">
            <div className="section-label" style={{ justifyContent: "flex-start" }}>{t.contactLabel}</div>
            <h2 className="contact-info-heading">{t.contactH2a}<br />{t.contactH2b}</h2>
            <p className="contact-info-body">{t.contactBody}</p>
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
              <div>{t.contactHours}</div>
            </div>
            <div className="contact-item">
              <div className="contact-item-icon"><Truck size={16} /></div>
              <div>{t.contactDelivery}</div>
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
                <div className="success-title">{t.successTitle}</div>
                <div className="success-body">
                  {t.successGreeting}, <strong>{formData.name}</strong>! {t.successEmoji}<br /><br />
                  {t.successCall} <strong>{formData.phone}</strong>{t.successCallEnd && ` ${t.successCallEnd}`}<br /><br />
                  {t.successOrderLabel}: <strong>{formData.occasion || t.successDefaultOccasion}</strong><br /><br />
                  {t.successEnd}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">{t.formName} <span className="req">*</span></label>
                    <input className="form-input" type="text" placeholder={t.formNamePh} required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.formPhone} <span className="req">*</span></label>
                    <input className="form-input" type="tel" placeholder={t.formPhonePh} required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.formContact} <span className="req">*</span></label>
                  <div className="radio-group">
                    {[["phone", lang === "ru" ? "Телефон" : "Telefon"],["telegram","Telegram"],["whatsapp","WhatsApp"]].map(([v,l]) => (
                      <label key={v} className="radio-item">
                        <input type="radio" name="contact" value={v} checked={formData.contact === v} onChange={() => setFormData({ ...formData, contact: v })} /> {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.formOccasion} <span className="req">*</span></label>
                  <select className="form-select" value={formData.occasion} onChange={e => setFormData({ ...formData, occasion: e.target.value })}>
                    <option value="">{t.formOccasionPh}</option>
                    {t.occasions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.formColors}</label>
                  <div className="color-swatches">
                    {colorSwatches.map(([c, idx]) => (
                      <div key={c} className={`cswatch ${selectedColors.includes(c) ? "selected" : ""}`}
                        style={{ background: c, border: c === "#FFFFFF" ? "2px solid #555" : undefined }}
                        title={t.colorNames[parseInt(idx)]} onClick={() => toggleColor(c)} />
                    ))}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">{t.formDelivTime}</label>
                    <input className="form-input" type="datetime-local" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.formDelivAddr}</label>
                    <input className="form-input" type="text" placeholder={t.formDelivAddrPh} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.formBudget}: <span className="budget-val">{parseInt(formData.budget).toLocaleString()} TMT</span></label>
                  <input style={{ width: "100%", accentColor: accent }} type="range" min="50" max="2000" step="50" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                  <div className="budget-hint">
                    ~{parseInt(formData.budget) < 100 ? t.budgetHints[0] : parseInt(formData.budget) < 200 ? t.budgetHints[1] : parseInt(formData.budget) < 400 ? t.budgetHints[2] : t.budgetHints[3]}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.formNote}</label>
                  <textarea className="form-textarea" placeholder={t.formNotePh} />
                </div>
                <button type="submit" className="submit-btn">
                  <Flower size={17} /> {t.formSubmit} <ArrowRight size={16} />
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
              {SHOP.tagline && <div className="footer-tagline">{SHOP.tagline}</div>}
              <p className="footer-bio">{t.footerBio.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
            </div>
            <div>
              <div className="footer-col-h">{t.footerPages}</div>
              <ul className="footer-links">
                {[[`#`, t.footerHome],["#collections", t.colSectionLabel],["#florists", t.floSectionLabel],["#pricing", t.priceSectionLabel],["#contact", t.contactLabel]].map(([h,l]) => (
                  <li key={h}><a href={h}><ChevronRight size={12} />{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-h">{t.footerCollections}</div>
              <ul className="footer-links">
                {t.footerColLinks.map(l => <li key={l}><a href="#collections"><ChevronRight size={12} />{l}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="footer-col-h">{t.footerContact}</div>
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
            <div className="footer-copy">© {new Date().getFullYear()} {SHOP.name}. {t.footerCopy}</div>
            <div className="footer-agency">
              <div className="lang-switcher" style={{ transform: "scale(0.9)" }}>
                <button className={`lang-btn${lang === "ru" ? " active" : ""}`} onClick={() => setLang("ru")}><FlagRU size={16} /> <span>RU</span></button>
                <button className={`lang-btn${lang === "tm" ? " active" : ""}`} onClick={() => setLang("tm")}><FlagTM size={12} /> <span>TM</span></button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
