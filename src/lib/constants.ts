export const SITE = {
  name: "Skyline Airport Transfers",
  tagline: "Fixed Price Transfers, 24/7",
  phone: "01632 960 123",
  phoneTel: "01632960123",
  whatsapp: "+44 7700 900123",
  whatsappTel: "447700900123",
  whatsappMessage: "Hi, I'd like to book an airport transfer.",
  email: "support@example.com",
  address: "Luton, Bedfordshire, UK",
  founded: 2019,
  rating: 4.8,
  reviewCount: 250,
  company: "Skyline Transfers Demo Ltd",
  companyNo: "00000000",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const NAV_LINKS = [
  { href: "/airport-transfers", label: "Airport transfers" },
  { href: "/transfers", label: "Areas" },
  { href: "/services", label: "Services" },
  { href: "/corporate-airport-transfers", label: "Business" },
  { href: "/luton-taxi", label: "Luton local" },
  { href: "/about-us", label: "About" },
  { href: "/about-us/faqs", label: "Help" },
  { href: "/contact-us", label: "Contact us" },
];

export const AIRPORTS = [
  { code: "LTN", name: "Luton", slug: "luton-airport", fullName: "London Luton Airport", href: "/airport-transfers/luton" },
  { code: "LHR", name: "Heathrow", slug: "heathrow-airport", fullName: "London Heathrow Airport", href: "/airport-transfers/heathrow" },
  { code: "LGW", name: "Gatwick", slug: "gatwick-airport", fullName: "London Gatwick Airport", href: "/airport-transfers/gatwick" },
  { code: "STN", name: "Stansted", slug: "stansted-airport", fullName: "London Stansted Airport", href: "/airport-transfers/stansted" },
  { code: "LCY", name: "London City", slug: "london-city-airport", fullName: "London City Airport", href: "/airport-transfers/london-city" },
  { code: "SEN", name: "Southend", slug: "southend-airport", fullName: "London Southend Airport", href: "/airport-transfers/southend" },
];

export const UK_LOCATIONS = [
  { name: "Central London", slug: "central-london", lat: 51.5074, lng: -0.1278 },
  { name: "Cambridge", slug: "cambridge", lat: 52.2053, lng: 0.1218 },
  { name: "Oxford", slug: "oxford", lat: 51.752, lng: -1.2577 },
  { name: "Milton Keynes", slug: "milton-keynes", lat: 52.0406, lng: -0.7594 },
  { name: "Birmingham", slug: "birmingham", lat: 52.4862, lng: -1.8904 },
  { name: "Manchester", slug: "manchester", lat: 53.4808, lng: -2.2426 },
];

export const VEHICLES = [
  { name: "Saloon", example: "Toyota Prius or similar", image: "/img/vehicles/saloon.png", passengers: 4, luggage: 2, hand: 2, premium: false, slug: "saloon" },
  { name: "Estate", example: "Skoda Superb or similar", image: "/img/vehicles/estate.png", passengers: 4, luggage: 4, hand: 2, premium: false, slug: "estate" },
  { name: "MPV", example: "Ford Galaxy or similar", image: "/img/vehicles/mpv.png", passengers: 6, luggage: 4, hand: 4, premium: false, slug: "mpv" },
  { name: "Business Class", example: "Mercedes E-Class", image: "/img/vehicles/Business.png", passengers: 4, luggage: 2, hand: 2, premium: true, slug: "business" },
  { name: "8-Seater", example: "Ford Tourneo or similar", image: "/img/vehicles/minibus.png", passengers: 8, luggage: 6, hand: 6, premium: false, slug: "8-seater" },
];

export const FAQ_ITEMS = [
  { q: "What is Skyline Airport Transfers?", a: "We're a Luton-based licensed operator (since 2019) connecting you with vetted local drivers for door-to-door airport transfers. Same drivers, same cars, every time — no app required.", open: true },
  { q: "Can I book a return trip?", a: "Yes. When booking, choose 'Return' and pick your outbound and return dates and times. You'll get a single confirmation covering both legs." },
  { q: "What's your cancellation policy?", a: "Free cancellation any time before we dispatch the driver — usually 30 minutes before a Luton-airport pickup, longer for out-of-town pickups depending on distance. No questions asked. After dispatch we'll charge a fair fee to cover the driver's allocated time." },
  { q: "How do I book?", a: "Enter your pickup and drop-off in the quote widget at the top of any page. Pick a date and time, choose your vehicle, and pay online or to the driver. The whole thing takes about 60 seconds." },
  { q: "Will my luggage fit?", a: "Saloon: 2 large + 2 hand. Estate: 4 large + 2 hand. MPV/Business: 4 large + 4 hand. 8-seater: 6 large + 6 hand. Tell us what you're carrying when booking and we'll right-size the vehicle." },
  { q: "Do you provide child car seats?", a: "Yes — booster, child or infant seats at no extra charge. Just let us know during booking and the driver will fit the right seats before pickup." },
];

export const REVIEW_COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#dc2626", "#6366f1", "#f97316", "#14b8a6", "#ec4899", "#8b5cf6", "#64748b"];

export const REVIEWS = [
  { author_name: "Emma Hartley", rating: 5, text: "Early-morning pickup from north London, the driver arrived on time and was friendly and professional.", relative_time_description: "a day ago" },
  { author_name: "Daniel Okoro", rating: 5, text: "Used the service several times now. Good communication, clean cars and always prompt.", relative_time_description: "a week ago" },
  { author_name: "Priya Nair", rating: 5, text: "Great service. We booked a return and both cars were on time, with a message when the driver set off.", relative_time_description: "a week ago" },
  { author_name: "Tom Whitfield", rating: 5, text: "Our family uses Skyline Airport Transfers for airport runs every month. Reliable and fairly priced.", relative_time_description: "a month ago" },
  { author_name: "Sofia Marin", rating: 5, text: "Efficient and quick to reply, and the drivers were helpful with our bags.", relative_time_description: "3 months ago" },
  { author_name: "Liam Doyle", rating: 5, text: "Excellent service, polite driver and a smooth journey. Would recommend.", relative_time_description: "4 months ago" },
  { author_name: "Hannah Cole", rating: 5, text: "Great value for a minibus for several families, and a good return service.", relative_time_description: "8 months ago" },
  { author_name: "George Palmer", rating: 5, text: "Regular trips to the airport for years. Competitive, friendly and punctual.", relative_time_description: "3 weeks ago" },
  { author_name: "Chloe Barnes", rating: 5, text: "Always a quick response to any call or message.", relative_time_description: "3 weeks ago" },
  { author_name: "Marcus Reid", rating: 5, text: "Professional, reliable and highly recommended.", relative_time_description: "a week ago" },
];

export const POPULAR_ROUTES = [
  "Houghton Regis", "Dunstable", "Harpenden", "Flitwick", "Leighton Buzzard",
  "St Albans", "Hitchin", "Hemel Hempstead", "Letchworth", "Welwyn GC",
  "Stevenage", "Hatfield", "Watford", "Tring", "Bedford",
  "Milton Keynes", "Aylesbury", "Cambridge", "Heathrow", "Central London",
  "St Pancras / King's Cross", "Oxford", "Northampton", "Baldock",
];
