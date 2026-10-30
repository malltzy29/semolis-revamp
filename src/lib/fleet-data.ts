export interface ProductRow {
  id: number;
  name: string;
  slug: string;
  price_per_day: number;
  min_days: number;
  total_stock: number;
  image_url: string;
  is_active: number;
}

export interface ProductWithAvailability extends ProductRow {
  available_stock: number;
  booked_count: number;
  is_available: boolean;
  specs: FleetSpec;
}

export interface FleetSpec {
  tagline: string;
  targetPersona: string;
  badge: string;
  maxRangeKm: string;
  maxSpeedKmh: string;
  batteryType: string;
  motorPower: string;
  maxLoadKg: string;
  chargingTime: string;
  features: string[];
  includedItems: string[];
  description: string;
  rentToOwnDaily: number;
  rentToOwnNote: string;
}

export interface PaymentMethodOption {
  id: "BCA" | "QRIS" | "OVO" | "GOPAY";
  name: string;
  badge: string;
  description: string;
  isAvailable: boolean;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "BCA",
    name: "Transfer Bank BCA",
    badge: "Tersedia Saat Ini",
    description: "Transfer langsung ke rekening resmi BCA PT Aviana Sinar Anugerah",
    isAvailable: true,
  },
  {
    id: "QRIS",
    name: "QRIS",
    badge: "Coming Soon",
    description: "Coming soon",
    isAvailable: false,
  },
  {
    id: "OVO",
    name: "OVO",
    badge: "Coming Soon",
    description: "Coming soon",
    isAvailable: false,
  },
  {
    id: "GOPAY",
    name: "GoPay",
    badge: "Coming Soon",
    description: "Coming soon",
    isAvailable: false,
  },
];

export const PAYMENT_CONFIG = {
  brandName: "Semolis Bali",
  companyName: "PT Aviana Sinar Anugerah",
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "7725489120",
  accountHolder: "PT Aviana Sinar Anugerah",
  officeAddress: "Jl. Bedugul No. 40, Sidakarya, Denpasar Selatan, Bali",
  adminWhatsApp: "6282266489776",
  adminWhatsAppDisplay: "+62 822-6648-9776",
  officialEmail: "support@sewamotorlistrikbali.com",
  operationalHours: "08:00 – 21:00 WITA (Setiap Hari)",
  instagramHandle: "@asa_sewamilikmolis",
  instagramUrl: "https://www.instagram.com/asa_sewamilikmolis",
  facebookName: "Sewa Motor Listrik Bali / KJI Impala",
  facebookUrl: "https://www.facebook.com/profile.php?id=61559592037020",
  pickupNotice: "Pengambilan & pengembalian unit mandiri di garasi (tidak ada antar jemput)",
  helmNotice: "Penyewaan motor tidak termasuk helm (tidak free helm)",
  midtransNotice:
    "Metode pembayaran QRIS, OVO, dan GoPay Coming soon. Saat ini pembayaran dilayani melalui Transfer Bank BCA.",
  hubLocations: [
    "Garasi & Pengambilan Mandiri: Jl. Bedugul No. 40, Sidakarya, Denpasar Selatan, Bali",
  ],
};

export const TOTAL_SGB_COUNT = 29;

export const RENT_TO_OWN_INFO = {
  durationDays: 720,
  title: "Program Sewa Hak Milik 720 Hari",
  subtitle: "Sewa Harian Jadi Hak Milik Penuh Tanpa DP Berat",
  description:
    "Solusi kepemilikan motor listrik untuk seluruh unit Volta (401, Eagle, Mandala). Cukup sewa harian selama 720 hari, unit resmi menjadi hak milik Anda dengan BPKB & STNK lengkap.",
  benefits: [
    "100% Hak Milik: Unit motor berpindah kepemilikan resmi atas nama Anda setelah 720 hari.",
    "Bebas DP Berat: Cukup bayar sewa harian flat tanpa bunga leasing konvensional.",
    "Dukungan 29 Titik SGB: Bebas tukar baterai di 29 titik Stasiun Ganti Baterai (SGB) di Bali.",
    "Perawatan & Servis: Konsultasi servis berkala dan suku cadang orisinal dari pabrik Volta.",
  ],
  pricingTable: [
    {
      motor: "Volta 401",
      dailyRate: 60000,
      slug: "volta-401",
      bestFor: "Paling hemat untuk pekerja harian & ojek online",
    },
    {
      motor: "Volta Eagle",
      dailyRate: 65000,
      slug: "volta-eagle",
      bestFor: "Gaya sporty & handling lincah perkotaan",
    },
    {
      motor: "Volta Mandala",
      dailyRate: 70000,
      slug: "volta-mandala",
      bestFor: "Desain retro Eropa elegan & paling nyaman",
    },
  ],
};

export const FLEET_SPECS_BY_SLUG: Record<string, FleetSpec> = {
  "volta-401": {
    tagline: "Tangguh, Ekonomis & Siap Kerja Seharian",
    targetPersona: "Favorit Pekerja Lokal & Driver Ojol",
    badge: "Paling Hemat",
    maxRangeKm: "120 km (Dual Slot Baterai)",
    maxSpeedKmh: "60 km/jam",
    batteryType: "LiFePO4 60V 23Ah SGB (Tahan Panas)",
    motorPower: "1.500 Watt Brushless DC",
    maxLoadKg: "200 kg",
    chargingTime: "Tukar SGB < 1 Menit / Charge 4-5 Jam",
    rentToOwnDaily: 60000,
    rentToOwnNote: "Tersedia Program Hak Milik 720 Hari",
    features: [
      "Dek kaki ekstra luas & rak belakang kokoh untuk barang",
      "Layar speedometer LCD digital penuh",
      "2 Slot baterai SGB LiFePO4 jarak tempuh hingga 120 km",
      "Tombol percepatan 3-Speed, Reverse (mundur), & Parkir aman",
    ],
    includedItems: [
      "Baterai LiFePO4 SGB Terpasang & Siap Jalan",
      "Akses 29 Titik Stasiun Ganti Baterai (SGB) Bali",
      "STNK & Dokumen Legalitas Kendaraan Resmi",
    ],
    description:
      "Volta 401 dirancang untuk daya tahan ekstra di jalanan Bali. Dengan daya angkut hingga 200 kg dan tarif paling ekonomis Rp 60.000/hari, unit ini menjadi andalan pekerja harian, kurir, maupun komuter jarak jauh. Pengambilan mandiri di garasi Sidakarya, Denpasar Selatan.",
  },
  "volta-eagle": {
    tagline: "Lincah, Sporty & Responsif di Segala Medan",
    targetPersona: "Komuter Dinamis & Penjelajah Kota",
    badge: "Best Value",
    maxRangeKm: "120 km (Dual Slot Baterai)",
    maxSpeedKmh: "60 km/jam",
    batteryType: "LiFePO4 60V 23Ah SGB Dual-Ready",
    motorPower: "1.500 Watt High-Torque BLDC",
    maxLoadKg: "180 kg",
    chargingTime: "Tukar SGB < 1 Menit / Charge 4-5 Jam",
    rentToOwnDaily: 65000,
    rentToOwnNote: "Tersedia Program Hak Milik 720 Hari",
    features: [
      "Desain bodi aerodinamis agresif dengan lampu Dual Hawk-Eye LED",
      "Suspensi belakang ganda empuk untuk kenyamanan berkendara",
      "Rem cakram (Disc Brake) depan & belakang yang pakem",
      "Handling ringan dan responsif menembus kepadatan lalu lintas",
    ],
    includedItems: [
      "Baterai LiFePO4 SGB Terpasang & Siap Jalan",
      "Akses 29 Titik Stasiun Ganti Baterai (SGB) Bali",
      "STNK & Dokumen Legalitas Kendaraan Resmi",
    ],
    description:
      "Volta Eagle memadukan ergonomi berkendara yang sporty dengan efisiensi motor listrik modern. Sangat nyaman dipakai bermanuver di jalur padat dengan handling lincah. Pengambilan mandiri di garasi Sidakarya, Denpasar Selatan.",
  },
  "volta-mandala": {
    tagline: "Gaya Klasik Retro-Modern untuk Eksplorasi Bali",
    targetPersona: "Favorit Wisatawan & Digital Nomad",
    badge: "Paling Stylish",
    maxRangeKm: "130 km (Dual Slot Baterai)",
    maxSpeedKmh: "55 km/jam",
    batteryType: "LiFePO4 60V 23Ah SGB Dual-Ready",
    motorPower: "1.000 Watt Smooth-Cruising BLDC",
    maxLoadKg: "150 kg",
    chargingTime: "Tukar SGB < 1 Menit / Charge 4-5 Jam",
    rentToOwnDaily: 70000,
    rentToOwnNote: "Tersedia Program Hak Milik 720 Hari",
    features: [
      "Siluet skuter retro Eropa yang estetik & elegan",
      "Jok kulit sintetis lebar super empuk untuk berboncengan",
      "Lampu utama LED bulat klasik dengan DRL terang",
      "Akselerasi halus & senyap untuk cruising santai",
    ],
    includedItems: [
      "Baterai LiFePO4 SGB Terpasang & Siap Jalan",
      "Akses 29 Titik Stasiun Ganti Baterai (SGB) Bali",
      "STNK & Dokumen Legalitas Kendaraan Resmi",
    ],
    description:
      "Volta Mandala adalah pilihan utama wisatawan dan digital nomad yang menginginkan tampilan elegan ala skuter klasik Eropa namun bebas polusi dan suara bising saat menjelajahi Bali. Pengambilan mandiri di garasi Sidakarya, Denpasar Selatan.",
  },
};

export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.slice(0, 10).split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const monthName = months[parseInt(m, 10) - 1] || m;
    return `${parseInt(d, 10)} ${monthName} ${y}`;
  } catch {
    return dateStr;
  }
}

export function calculateRentalDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export function getAssetUrl(assetPath: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!assetPath) return "";
  if (assetPath.startsWith("http") || (basePath && assetPath.startsWith(basePath))) {
    return assetPath;
  }
  return `${basePath}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
}

export const DEFAULT_PRODUCTS: ProductWithAvailability[] = [
  {
    id: 1,
    name: "Volta 401",
    slug: "volta-401",
    price_per_day: 60000,
    min_days: 3,
    total_stock: 6,
    available_stock: 6,
    booked_count: 0,
    is_available: true,
    image_url: "/images/volta-401.svg",
    is_active: 1,
    specs: FLEET_SPECS_BY_SLUG["volta-401"],
  },
  {
    id: 2,
    name: "Volta Eagle",
    slug: "volta-eagle",
    price_per_day: 65000,
    min_days: 3,
    total_stock: 5,
    available_stock: 5,
    booked_count: 0,
    is_available: true,
    image_url: "/images/volta-eagle.svg",
    is_active: 1,
    specs: FLEET_SPECS_BY_SLUG["volta-eagle"],
  },
  {
    id: 3,
    name: "Volta Mandala",
    slug: "volta-mandala",
    price_per_day: 70000,
    min_days: 3,
    total_stock: 4,
    available_stock: 4,
    booked_count: 0,
    is_available: true,
    image_url: "/images/volta-mandala.svg",
    is_active: 1,
    specs: FLEET_SPECS_BY_SLUG["volta-mandala"],
  },
];

