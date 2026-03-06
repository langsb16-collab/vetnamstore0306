export async function onRequest() {
  const categories = [
    { id: 1, name_ko: "전체", name_en: "All", icon: "LayoutGrid", color: "#1428A0" },
    { id: 2, name_ko: "음식점", name_en: "Restaurants", icon: "Utensils", color: "#E11D48" },
    { id: 3, name_ko: "뷰티", name_en: "Beauty", icon: "Sparkles", color: "#DB2777" },
    { id: 4, name_ko: "교육", name_en: "Education", icon: "GraduationCap", color: "#2563EB" },
    { id: 5, name_ko: "한국식품마트", name_en: "K-Mart", icon: "ShoppingBag", color: "#059669" },
    { id: 6, name_ko: "국제택배", name_en: "Delivery", icon: "Truck", color: "#D97706" },
    { id: 7, name_ko: "환전/송금", name_en: "Exchange", icon: "Banknote", color: "#0891B2" },
    { id: 8, name_ko: "휴대폰", name_en: "Mobile", icon: "Smartphone", color: "#4F46E5" },
    { id: 9, name_ko: "행정대행", name_en: "Admin", icon: "FileText", color: "#7C3AED" },
    { id: 10, name_ko: "오락", name_en: "Entertainment", icon: "Gamepad2", color: "#EA580C" },
    { id: 11, name_ko: "생활편의", name_en: "Convenience", icon: "Home", color: "#65A30D" }
  ];

  return Response.json(categories);
}
