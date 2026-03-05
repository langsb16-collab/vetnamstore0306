import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ko TEXT,
    name_en TEXT,
    icon TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category_id INTEGER,
    description TEXT,
    address TEXT,
    phone TEXT,
    open_hours TEXT,
    latitude REAL,
    longitude REAL,
    thumbnail TEXT,
    facebook TEXT,
    instagram TEXT,
    x_link TEXT,
    whatsapp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER,
    sender TEXT,
    text TEXT,
    translated_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    title TEXT,
    content TEXT,
    image TEXT,
    video TEXT,
    contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed categories if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const categories = [
    ["전체", "All", "LayoutGrid", "#1428A0"],
    ["음식점", "Restaurants", "Utensils", "#E11D48"],
    ["뷰티", "Beauty", "Sparkles", "#DB2777"],
    ["교육", "Education", "GraduationCap", "#2563EB"],
    ["한국식품마트", "K-Mart", "ShoppingBag", "#059669"],
    ["국제택배", "Delivery", "Truck", "#D97706"],
    ["환전/송금", "Exchange", "Banknote", "#0891B2"],
    ["휴대폰", "Mobile", "Smartphone", "#4F46E5"],
    ["행정대행", "Admin", "FileText", "#7C3AED"],
    ["오락", "Entertainment", "Gamepad2", "#EA580C"],
    ["생활편의", "Convenience", "Home", "#65A30D"]
  ];
  const insert = db.prepare("INSERT INTO categories (name_ko, name_en, icon, color) VALUES (?, ?, ?, ?)");
  categories.forEach(cat => insert.run(cat));
}

// Seed some shops if empty
const shopCount = db.prepare("SELECT COUNT(*) as count FROM shops").get() as { count: number };
if (shopCount.count === 0) {
  const insertShop = db.prepare(`
    INSERT INTO shops (name, category_id, description, address, phone, open_hours, latitude, longitude, thumbnail)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleShops = [
    // 음식점 (2)
    ["Seoul Garden Vietnamese Restaurant", 2, "Authentic Vietnamese cuisine with a modern twist.", "Hanoi, Kim Ma", "024-123-4567", "10:00 - 22:00", 21.0285, 105.8542, "https://picsum.photos/seed/seoulgarden/400/300"],
    ["Matchandeul BBQ", 2, "Premium Korean BBQ known for aged pork.", "Ho Chi Minh City, Dist 1", "028-765-4321", "11:00 - 23:00", 10.7769, 106.7009, "https://picsum.photos/seed/matchandeul/400/300"],
    ["Gogi House", 2, "Popular Korean BBQ chain with a wide variety of meats.", "Da Nang, Hai Chau", "023-222-3333", "11:00 - 22:00", 16.0544, 108.2022, "https://picsum.photos/seed/gogi/400/300"],
    ["King BBQ Buffet", 2, "The king of Korean BBQ buffets in Vietnam.", "Hanoi, My Dinh", "024-555-6666", "10:30 - 22:30", 21.0123, 105.7789, "https://picsum.photos/seed/kingbbq/400/300"],
    ["K-Pub Korean Grill Pub", 2, "Street-style Korean grill and pub atmosphere.", "Ho Chi Minh City, Dist 7", "028-888-9999", "16:00 - 24:00", 10.7289, 106.7089, "https://picsum.photos/seed/kpub/400/300"],

    // 뷰티 (3)
    ["SeoulSpa.Vn", 3, "Leading beauty and skin care clinic.", "Hanoi, Tay Ho", "090-111-2222", "09:00 - 20:00", 21.0589, 105.8289, "https://picsum.photos/seed/seoulspa/400/300"],
    ["Thu Cuc Clinics", 3, "Professional aesthetic and medical spa services.", "Ho Chi Minh City, Dist 3", "090-333-4444", "08:00 - 19:00", 10.7823, 106.6823, "https://picsum.photos/seed/thucuc/400/300"],
    ["Gangnam Beauty Clinic Vietnam", 3, "Korean-standard beauty treatments and surgery.", "Da Nang", "090-555-6666", "09:00 - 21:00", 16.0678, 108.2234, "https://picsum.photos/seed/gangnam/400/300"],
    ["JW Korean Aesthetic Clinic Vietnam", 3, "Specialized in Korean plastic surgery and aesthetics.", "Hanoi", "090-777-8888", "08:30 - 18:00", 21.0345, 105.8456, "https://picsum.photos/seed/jwclinic/400/300"],
    ["Saigon Smile Spa", 3, "Award-winning medical spa and slimming center.", "Ho Chi Minh City", "090-999-0000", "09:00 - 20:00", 10.7989, 106.6989, "https://picsum.photos/seed/saigonsmile/400/300"],

    // 교육 (4)
    ["Korean Cultural Center Vietnam", 4, "Promoting Korean culture and language in Vietnam.", "Hanoi", "024-3944-5980", "09:00 - 18:00", 21.0222, 105.8444, "https://picsum.photos/seed/kcc/400/300"],
    ["Sejong Institute Hanoi", 4, "Official Korean language institute by King Sejong Foundation.", "Hanoi", "024-123-4567", "08:00 - 21:00", 21.0111, 105.8111, "https://picsum.photos/seed/sejong/400/300"],
    ["HCMC Korean Language Center", 4, "Comprehensive Korean language programs in HCMC.", "Ho Chi Minh City", "028-123-4567", "08:00 - 21:00", 10.7333, 106.7111, "https://picsum.photos/seed/hcmckl/400/300"],
    ["Vietnam Korea University of Information and Communication Technology", 4, "Specialized ICT university supported by Korea.", "Da Nang", "023-111-2222", "07:30 - 17:00", 15.9753, 108.2522, "https://picsum.photos/seed/vku/400/300"],
    ["Korean Education Center in Vietnam", 4, "Supporting educational exchange between Korea and Vietnam.", "Ho Chi Minh City", "028-999-8888", "08:30 - 17:30", 10.7777, 106.6999, "https://picsum.photos/seed/kec/400/300"],

    // 한국식품마트 (5)
    ["K-Market Vietnam", 5, "The largest Korean supermarket chain in Vietnam.", "Hanoi", "024-333-4444", "07:00 - 23:00", 21.0333, 105.8333, "https://picsum.photos/seed/kmarket/400/300"],
    ["Lotte Mart", 5, "Global retail leader offering a wide range of Korean products.", "Ho Chi Minh City", "028-333-4444", "08:00 - 22:00", 10.7555, 106.7333, "https://picsum.photos/seed/lottemart/400/300"],
    ["Emart Vietnam", 5, "Korea's number one hypermarket with great value.", "Ho Chi Minh City", "028-555-6666", "07:30 - 22:30", 10.8222, 106.6888, "https://picsum.photos/seed/emart/400/300"],
    ["GS25 Vietnam", 5, "Korean convenience store chain with fresh food.", "Hanoi", "024-555-6666", "24 Hours", 21.0444, 105.8444, "https://picsum.photos/seed/gs25/400/300"],
    ["Korea Mart Da Nang", 5, "Specialized Korean grocery store in Da Nang.", "Da Nang", "023-333-4444", "08:00 - 22:00", 16.0333, 108.2333, "https://picsum.photos/seed/kmartdn/400/300"],

    // 국제택배 (6)
    ["DHL Express", 6, "Global leader in international shipping and logistics.", "Hanoi", "1800-1530", "08:00 - 18:00", 21.0111, 105.8111, "https://picsum.photos/seed/dhl/400/300"],
    ["FedEx", 6, "Reliable international courier services.", "Ho Chi Minh City", "1800-585835", "08:00 - 19:00", 10.7777, 106.6999, "https://picsum.photos/seed/fedex/400/300"],
    ["CJ Logistics", 6, "Korean logistics giant with extensive network in Vietnam.", "Hanoi", "024-123-4567", "08:00 - 18:00", 21.0222, 105.8222, "https://picsum.photos/seed/cjlog/400/300"],
    ["Korea Post EMS", 6, "Official Korean postal service for international express.", "Ho Chi Minh City", "028-123-4567", "08:30 - 17:30", 10.7666, 106.7444, "https://picsum.photos/seed/ems/400/300"],
    ["UPS", 6, "Global package delivery and supply chain management.", "Da Nang", "023-111-2222", "08:00 - 18:00", 16.0444, 108.2111, "https://picsum.photos/seed/ups/400/300"],

    // 환전/송금 (7)
    ["Western Union", 7, "Global money transfer services.", "Hanoi", "1800-599959", "08:00 - 20:00", 21.0333, 105.8333, "https://picsum.photos/seed/wu/400/300"],
    ["Wise", 7, "Modern international money transfers with low fees.", "Online", "N/A", "24 Hours", 10.7777, 106.6999, "https://picsum.photos/seed/wise/400/300"],
    ["MoneyGram", 7, "Fast and reliable money transfer services.", "Ho Chi Minh City", "1800-585835", "08:00 - 19:00", 10.7555, 106.7333, "https://picsum.photos/seed/mg/400/300"],
    ["Shinhan Bank Vietnam", 7, "Leading Korean bank in Vietnam with full services.", "Hanoi", "1900-1577", "08:30 - 16:30", 21.0444, 105.8444, "https://picsum.photos/seed/shinhan/400/300"],
    ["Woori Bank Vietnam", 7, "Major Korean bank providing specialized financial services.", "Ho Chi Minh City", "1800-6003", "08:30 - 16:30", 10.7666, 106.7444, "https://picsum.photos/seed/woori/400/300"],

    // 휴대폰 (8)
    ["Samsung Electronics", 8, "Global leader in mobile technology and innovation.", "Hanoi", "1800-588889", "09:00 - 21:00", 21.0111, 105.8111, "https://picsum.photos/seed/samsung/400/300"],
    ["Apple", 8, "Premium smartphones and ecosystem.", "Ho Chi Minh City", "1800-1127", "09:00 - 21:00", 10.7777, 106.6999, "https://picsum.photos/seed/apple/400/300"],
    ["The Gioi Di Dong", 8, "Largest mobile retailer in Vietnam.", "Da Nang", "1800-1060", "08:00 - 22:00", 16.0444, 108.2111, "https://picsum.photos/seed/tgdd/400/300"],
    ["FPT Shop", 8, "Leading retailer of digital products and mobile phones.", "Hanoi", "1800-6601", "08:00 - 22:00", 21.0222, 105.8222, "https://picsum.photos/seed/fpt/400/300"],
    ["Viettel Store", 8, "Official retail chain of Viettel telecommunications.", "Ho Chi Minh City", "1800-8123", "08:00 - 22:00", 10.7555, 106.7333, "https://picsum.photos/seed/viettel/400/300"],

    // 행정대행 (9)
    ["Korean Embassy in Vietnam", 9, "Diplomatic mission of the Republic of Korea in Hanoi.", "Hanoi", "024-3831-5111", "08:30 - 17:30", 21.0222, 105.8444, "https://picsum.photos/seed/embassy/400/300"],
    ["Korean Consulate General in Ho Chi Minh City", 9, "Consular services for Koreans in Southern Vietnam.", "Ho Chi Minh City", "028-3822-1557", "08:30 - 17:30", 10.7777, 106.6999, "https://picsum.photos/seed/consulate/400/300"],
    ["Vietnam Visa Pro", 9, "Professional visa services for foreigners.", "Hanoi", "090-123-4567", "08:00 - 18:00", 21.0333, 105.8333, "https://picsum.photos/seed/visapro/400/300"],
    ["Vietnam Visa Center", 9, "Official center for Vietnam visa processing.", "Ho Chi Minh City", "028-333-4444", "08:00 - 17:00", 10.7555, 106.7333, "https://picsum.photos/seed/visacenter/400/300"],
    ["KOTRA Hanoi", 9, "Korea Trade-Investment Promotion Agency.", "Hanoi", "024-3946-0511", "08:30 - 17:30", 21.0444, 105.8444, "https://picsum.photos/seed/kotra/400/300"],

    // 오락 (10)
    ["Lotte Cinema Vietnam", 10, "Modern cinema chain with Korean standards.", "Hanoi", "024-123-4567", "09:00 - 24:00", 21.0111, 105.8111, "https://picsum.photos/seed/lottecinema/400/300"],
    ["CGV Cinemas Vietnam", 10, "Leading cinema chain with premium theaters.", "Ho Chi Minh City", "1900-6017", "08:00 - 01:00", 10.7777, 106.6999, "https://picsum.photos/seed/cgv/400/300"],
    ["BHD Star Cineplex", 10, "Popular Vietnamese cinema chain.", "Da Nang", "023-111-2222", "09:00 - 24:00", 16.0444, 108.2111, "https://picsum.photos/seed/bhd/400/300"],
    ["Saigon Skydeck", 10, "Observation deck with panoramic views of HCMC.", "Ho Chi Minh City", "028-3915-6156", "09:30 - 21:30", 10.7711, 106.7044, "https://picsum.photos/seed/skydeck/400/300"],
    ["Sun World Ba Na Hills", 10, "Famous theme park and resort in Da Nang.", "Da Nang", "090-576-6777", "08:00 - 22:00", 15.9955, 107.9899, "https://picsum.photos/seed/banahills/400/300"],

    // 생활편의 (11)
    ["Circle K Vietnam", 11, "24-hour convenience store chain.", "Hanoi", "1900-6368", "24 Hours", 21.0222, 105.8222, "https://picsum.photos/seed/circlek/400/300"],
    ["FamilyMart Vietnam", 11, "Japanese convenience store with fresh food.", "Ho Chi Minh City", "028-123-4567", "24 Hours", 10.7555, 106.7333, "https://picsum.photos/seed/familymart/400/300"],
    ["7-Eleven Vietnam", 11, "Global convenience store leader.", "Ho Chi Minh City", "028-333-4444", "24 Hours", 10.7666, 106.7444, "https://picsum.photos/seed/7eleven/400/300"],
    ["VinMart", 11, "Major Vietnamese supermarket and convenience store chain.", "Hanoi", "024-555-6666", "08:00 - 22:00", 21.0444, 105.8444, "https://picsum.photos/seed/vinmart/400/300"],
    ["Highlands Coffee", 11, "Popular Vietnamese coffee chain.", "Da Nang", "1900-1755", "07:00 - 23:00", 16.0333, 108.2333, "https://picsum.photos/seed/highlands/400/300"]
  ];

  sampleShops.forEach(shop => insertShop.run(shop));
}

// Seed community posts if empty
const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (postCount.count === 0) {
  const insertPost = db.prepare(`
    INSERT INTO posts (category, title, content, contact, image)
    VALUES (?, ?, ?, ?, ?)
  `);

  const samplePosts = [
    ["job", "한국식당 주방 보조 구합니다", "하노이 미딩 지역 한국 식당에서 성실하게 일하실 주방 보조 구합니다. 초보 가능.", "090-123-4567", "https://picsum.photos/seed/kitchen/800/600"],
    ["job", "베트남어 통역 파트타임", "비즈니스 미팅 시 통역 도와주실 분 찾습니다. 한국어/베트남어 능통자 우대.", "090-222-3333", "https://picsum.photos/seed/interpreter/800/600"],
    ["realestate", "하노이 빈홈 아파트 임대", "방 2개, 화장실 2개. 풀옵션. 즉시 입주 가능합니다. 월 800불.", "090-333-4444", "https://picsum.photos/seed/apartment/800/600"],
    ["realestate", "호치민 7군 상가 급매", "유동인구 많은 지역. 현재 식당 운영 중. 권리금 협의.", "090-444-5555", "https://picsum.photos/seed/shop/800/600"],
    ["market", "아이폰 15 프로 판매", "사용 기간 3개월. 상태 최상. 박스 풀셋입니다. 800불.", "090-555-6666", "https://picsum.photos/seed/iphone/800/600"],
    ["market", "중고 골프채 세트", "초보자용 풀세트. 가방 포함. 일괄 300불에 드립니다.", "090-666-7777", "https://picsum.photos/seed/golf/800/600"]
  ];

  samplePosts.forEach(post => insertPost.run(post));
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.use(express.json());

  // API Routes
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/shops", (req, res) => {
    const { categoryId } = req.query;
    let query = "SELECT shops.*, categories.name_ko as category_name FROM shops JOIN categories ON shops.category_id = categories.id";
    let params = [];
    if (categoryId && categoryId !== "1") {
      query += " WHERE shops.category_id = ?";
      params.push(categoryId);
    }
    const shops = db.prepare(query).all(params);
    res.json(shops);
  });

  app.post("/api/shops", (req, res) => {
    const { name, category_id, description, address, phone, open_hours, latitude, longitude, thumbnail, facebook, instagram, x_link, whatsapp } = req.body;
    const info = db.prepare(`
      INSERT INTO shops (name, category_id, description, address, phone, open_hours, latitude, longitude, thumbnail, facebook, instagram, x_link, whatsapp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, category_id, description, address, phone, open_hours, latitude, longitude, thumbnail, facebook, instagram, x_link, whatsapp);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/shops/:id/thumbnail", (req, res) => {
    const { id } = req.params;
    const { thumbnail } = req.body;
    db.prepare("UPDATE shops SET thumbnail = ? WHERE id = ?").run(thumbnail, id);
    res.json({ success: true });
  });

  // Community Posts API
  app.get("/api/posts", (req, res) => {
    const { category } = req.query;
    let query = "SELECT * FROM posts";
    let params = [];
    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }
    query += " ORDER BY created_at DESC";
    const posts = db.prepare(query).all(params);
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  app.post("/api/posts", (req, res) => {
    const { category, title, content, image, video, contact } = req.body;
    const info = db.prepare(`
      INSERT INTO posts (category, title, content, image, video, contact)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(category, title, content, image, video, contact);
    res.json({ id: info.lastInsertRowid });
  });

  // Socket.io
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_shop", (shopId) => {
      socket.join(`shop_${shopId}`);
      // Load history
      const history = db.prepare("SELECT * FROM messages WHERE shop_id = ? ORDER BY created_at ASC").all(shopId);
      socket.emit("chat_history", history);
    });

    socket.on("send_message", (data) => {
      const { shopId, sender, text, translatedText } = data;
      const info = db.prepare("INSERT INTO messages (shop_id, sender, text, translated_text) VALUES (?, ?, ?, ?)").run(shopId, sender, text, translatedText);
      const newMessage = { id: info.lastInsertRowid, shop_id: shopId, sender, text, translated_text: translatedText, created_at: new Date().toISOString() };
      io.to(`shop_${shopId}`).emit("receive_message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
