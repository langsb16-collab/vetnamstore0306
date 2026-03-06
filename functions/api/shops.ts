export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  const categoryId = url.searchParams.get('categoryId');
  
  const shops = [
    // 음식점 (2)
    { id: 1, name: "Seoul Garden Vietnamese Restaurant", category_id: 2, category_name: "음식점", description: "Authentic Vietnamese cuisine with a modern twist.", address: "Hanoi, Kim Ma", phone: "024-123-4567", open_hours: "10:00 - 22:00", latitude: 21.0285, longitude: 105.8542, thumbnail: "https://picsum.photos/seed/seoulgarden/400/300" },
    { id: 2, name: "Matchandeul BBQ", category_id: 2, category_name: "음식점", description: "Premium Korean BBQ known for aged pork.", address: "Ho Chi Minh City, Dist 1", phone: "028-765-4321", open_hours: "11:00 - 23:00", latitude: 10.7769, longitude: 106.7009, thumbnail: "https://picsum.photos/seed/matchandeul/400/300" },
    { id: 3, name: "Gogi House", category_id: 2, category_name: "음식점", description: "Popular Korean BBQ chain with a wide variety of meats.", address: "Da Nang, Hai Chau", phone: "023-222-3333", open_hours: "11:00 - 22:00", latitude: 16.0544, longitude: 108.2022, thumbnail: "https://picsum.photos/seed/gogi/400/300" },
    { id: 4, name: "King BBQ Buffet", category_id: 2, category_name: "음식점", description: "The king of Korean BBQ buffets in Vietnam.", address: "Hanoi, My Dinh", phone: "024-555-6666", open_hours: "10:30 - 22:30", latitude: 21.0123, longitude: 105.7789, thumbnail: "https://picsum.photos/seed/kingbbq/400/300" },
    { id: 5, name: "K-Pub Korean Grill Pub", category_id: 2, category_name: "음식점", description: "Street-style Korean grill and pub atmosphere.", address: "Ho Chi Minh City, Dist 7", phone: "028-888-9999", open_hours: "16:00 - 24:00", latitude: 10.7289, longitude: 106.7089, thumbnail: "https://picsum.photos/seed/kpub/400/300" },

    // 뷰티 (3)
    { id: 6, name: "SeoulSpa.Vn", category_id: 3, category_name: "뷰티", description: "Leading beauty and skin care clinic.", address: "Hanoi, Tay Ho", phone: "090-111-2222", open_hours: "09:00 - 20:00", latitude: 21.0589, longitude: 105.8289, thumbnail: "https://picsum.photos/seed/seoulspa/400/300" },
    { id: 7, name: "Thu Cuc Clinics", category_id: 3, category_name: "뷰티", description: "Professional aesthetic and medical spa services.", address: "Ho Chi Minh City, Dist 3", phone: "090-333-4444", open_hours: "08:00 - 19:00", latitude: 10.7823, longitude: 106.6823, thumbnail: "https://picsum.photos/seed/thucuc/400/300" },
    { id: 8, name: "Gangnam Beauty Clinic Vietnam", category_id: 3, category_name: "뷰티", description: "Korean-standard beauty treatments and surgery.", address: "Da Nang", phone: "090-555-6666", open_hours: "09:00 - 21:00", latitude: 16.0678, longitude: 108.2234, thumbnail: "https://picsum.photos/seed/gangnam/400/300" },
    { id: 9, name: "JW Korean Aesthetic Clinic Vietnam", category_id: 3, category_name: "뷰티", description: "Specialized in Korean plastic surgery and aesthetics.", address: "Hanoi", phone: "090-777-8888", open_hours: "08:30 - 18:00", latitude: 21.0345, longitude: 105.8456, thumbnail: "https://picsum.photos/seed/jwclinic/400/300" },
    { id: 10, name: "Saigon Smile Spa", category_id: 3, category_name: "뷰티", description: "Award-winning medical spa and slimming center.", address: "Ho Chi Minh City", phone: "090-999-0000", open_hours: "09:00 - 20:00", latitude: 10.7989, longitude: 106.6989, thumbnail: "https://picsum.photos/seed/saigonsmile/400/300" },

    // 교육 (4)
    { id: 11, name: "Korean Cultural Center Vietnam", category_id: 4, category_name: "교육", description: "Promoting Korean culture and language in Vietnam.", address: "Hanoi", phone: "024-3944-5980", open_hours: "09:00 - 18:00", latitude: 21.0222, longitude: 105.8444, thumbnail: "https://picsum.photos/seed/kcc/400/300" },
    { id: 12, name: "Sejong Institute Hanoi", category_id: 4, category_name: "교육", description: "Official Korean language institute by King Sejong Foundation.", address: "Hanoi", phone: "024-123-4567", open_hours: "08:00 - 21:00", latitude: 21.0111, longitude: 105.8111, thumbnail: "https://picsum.photos/seed/sejong/400/300" },
    { id: 13, name: "HCMC Korean Language Center", category_id: 4, category_name: "교육", description: "Comprehensive Korean language programs in HCMC.", address: "Ho Chi Minh City", phone: "028-123-4567", open_hours: "08:00 - 21:00", latitude: 10.7333, longitude: 106.7111, thumbnail: "https://picsum.photos/seed/hcmckl/400/300" },
    { id: 14, name: "Vietnam Korea University of Information and Communication Technology", category_id: 4, category_name: "교육", description: "Specialized ICT university supported by Korea.", address: "Da Nang", phone: "023-111-2222", open_hours: "07:30 - 17:00", latitude: 15.9753, longitude: 108.2522, thumbnail: "https://picsum.photos/seed/vku/400/300" },
    { id: 15, name: "Korean Education Center in Vietnam", category_id: 4, category_name: "교육", description: "Supporting educational exchange between Korea and Vietnam.", address: "Ho Chi Minh City", phone: "028-999-8888", open_hours: "08:30 - 17:30", latitude: 10.7777, longitude: 106.6999, thumbnail: "https://picsum.photos/seed/kec/400/300" },

    // 한국식품마트 (5)
    { id: 16, name: "K-Market Vietnam", category_id: 5, category_name: "한국식품마트", description: "The largest Korean supermarket chain in Vietnam.", address: "Hanoi", phone: "024-333-4444", open_hours: "07:00 - 23:00", latitude: 21.0333, longitude: 105.8333, thumbnail: "https://picsum.photos/seed/kmarket/400/300" },
    { id: 17, name: "Lotte Mart", category_id: 5, category_name: "한국식품마트", description: "Global retail leader offering a wide range of Korean products.", address: "Ho Chi Minh City", phone: "028-333-4444", open_hours: "08:00 - 22:00", latitude: 10.7555, longitude: 106.7333, thumbnail: "https://picsum.photos/seed/lottemart/400/300" },
    { id: 18, name: "Emart Vietnam", category_id: 5, category_name: "한국식품마트", description: "Korea's number one hypermarket with great value.", address: "Ho Chi Minh City", phone: "028-555-6666", open_hours: "07:30 - 22:30", latitude: 10.8222, longitude: 106.6888, thumbnail: "https://picsum.photos/seed/emart/400/300" },
    { id: 19, name: "GS25 Vietnam", category_id: 5, category_name: "한국식품마트", description: "Korean convenience store chain with fresh food.", address: "Hanoi", phone: "024-555-6666", open_hours: "24 Hours", latitude: 21.0444, longitude: 105.8444, thumbnail: "https://picsum.photos/seed/gs25/400/300" },
    { id: 20, name: "Korea Mart Da Nang", category_id: 5, category_name: "한국식품마트", description: "Specialized Korean grocery store in Da Nang.", address: "Da Nang", phone: "023-333-4444", open_hours: "08:00 - 22:00", latitude: 16.0333, longitude: 108.2333, thumbnail: "https://picsum.photos/seed/kmartdn/400/300" },

    // 국제택배 (6)
    { id: 21, name: "DHL Express", category_id: 6, category_name: "국제택배", description: "Global leader in international shipping and logistics.", address: "Hanoi", phone: "1800-1530", open_hours: "08:00 - 18:00", latitude: 21.0111, longitude: 105.8111, thumbnail: "https://picsum.photos/seed/dhl/400/300" },
    { id: 22, name: "FedEx", category_id: 6, category_name: "국제택배", description: "Reliable international courier services.", address: "Ho Chi Minh City", phone: "1800-585835", open_hours: "08:00 - 19:00", latitude: 10.7777, longitude: 106.6999, thumbnail: "https://picsum.photos/seed/fedex/400/300" },
    { id: 23, name: "CJ Logistics", category_id: 6, category_name: "국제택배", description: "Korean logistics giant with extensive network in Vietnam.", address: "Hanoi", phone: "024-123-4567", open_hours: "08:00 - 18:00", latitude: 21.0222, longitude: 105.8222, thumbnail: "https://picsum.photos/seed/cjlog/400/300" },
    { id: 24, name: "Korea Post EMS", category_id: 6, category_name: "국제택배", description: "Official Korean postal service for international express.", address: "Ho Chi Minh City", phone: "028-123-4567", open_hours: "08:30 - 17:30", latitude: 10.7666, longitude: 106.7444, thumbnail: "https://picsum.photos/seed/ems/400/300" },
    { id: 25, name: "UPS", category_id: 6, category_name: "국제택배", description: "Global package delivery and supply chain management.", address: "Da Nang", phone: "023-111-2222", open_hours: "08:00 - 18:00", latitude: 16.0444, longitude: 108.2111, thumbnail: "https://picsum.photos/seed/ups/400/300" },

    // 환전/송금 (7)
    { id: 26, name: "Western Union", category_id: 7, category_name: "환전/송금", description: "Global money transfer services.", address: "Hanoi", phone: "1800-599959", open_hours: "08:00 - 20:00", latitude: 21.0333, longitude: 105.8333, thumbnail: "https://picsum.photos/seed/wu/400/300" },
    { id: 27, name: "Wise", category_id: 7, category_name: "환전/송금", description: "Modern international money transfers with low fees.", address: "Online", phone: "N/A", open_hours: "24 Hours", latitude: 10.7777, longitude: 106.6999, thumbnail: "https://picsum.photos/seed/wise/400/300" },
    { id: 28, name: "MoneyGram", category_id: 7, category_name: "환전/송금", description: "Fast and reliable money transfer services.", address: "Ho Chi Minh City", phone: "1800-585835", open_hours: "08:00 - 19:00", latitude: 10.7555, longitude: 106.7333, thumbnail: "https://picsum.photos/seed/mg/400/300" },
    { id: 29, name: "Shinhan Bank Vietnam", category_id: 7, category_name: "환전/송금", description: "Leading Korean bank in Vietnam with full services.", address: "Hanoi", phone: "1900-1577", open_hours: "08:30 - 16:30", latitude: 21.0444, longitude: 105.8444, thumbnail: "https://picsum.photos/seed/shinhan/400/300" },
    { id: 30, name: "Woori Bank Vietnam", category_id: 7, category_name: "환전/송금", description: "Major Korean bank providing specialized financial services.", address: "Ho Chi Minh City", phone: "1800-6003", open_hours: "08:30 - 16:30", latitude: 10.7666, longitude: 106.7444, thumbnail: "https://picsum.photos/seed/woori/400/300" }
  ];

  let filteredShops = shops;
  if (categoryId && categoryId !== "1") {
    filteredShops = shops.filter(shop => shop.category_id === parseInt(categoryId));
  }

  return Response.json(filteredShops);
}
