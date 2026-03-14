/**
 * countriesData.js
 *
 * Central data store for the "Learn About Countries" section.
 * Each entry contains an overview, interesting facts, key statistics,
 * image/map suggestions, and sections for easy future expansion.
 *
 * Flag images: https://flagcdn.com/w320/{code}.png  (public domain)
 * Map embeds:  OpenStreetMap iframe using lat/lon/zoom
 */

// ---------------------------------------------------------------------------
// ALL_COUNTRIES — lightweight list for the index/search page
// ---------------------------------------------------------------------------
export const ALL_COUNTRIES = [
  { code: "us", name: "United States of America", continent: "North America", emoji: "🇺🇸" },
  { code: "in", name: "India", continent: "Asia", emoji: "🇮🇳" },
  { code: "cn", name: "China", continent: "Asia", emoji: "🇨🇳" },
  { code: "de", name: "Germany", continent: "Europe", emoji: "🇩🇪" },
  { code: "ke", name: "Kenya", continent: "Africa", emoji: "🇰🇪" },
  { code: "br", name: "Brazil", continent: "South America", emoji: "🇧🇷" },
  { code: "au", name: "Australia", continent: "Oceania", emoji: "🇦🇺" },
  { code: "ca", name: "Canada", continent: "North America", emoji: "🇨🇦" },
  { code: "fr", name: "France", continent: "Europe", emoji: "🇫🇷" },
  { code: "jp", name: "Japan", continent: "Asia", emoji: "🇯🇵" },
  { code: "za", name: "South Africa", continent: "Africa", emoji: "🇿🇦" },
];

// ---------------------------------------------------------------------------
// COUNTRY_DETAILS — rich content keyed by ISO 3166-1 alpha-2 code
// ---------------------------------------------------------------------------
export const COUNTRY_DETAILS = {
  // -----------------------------------------------------------------------
  us: {
    code: "us",
    name: "United States of America",
    emoji: "🇺🇸",
    continent: "North America",
    flagUrl: "https://flagcdn.com/w320/us.png",
    flagAlt: "Flag of the United States — red, white and blue with 50 stars",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-130%2C23%2C-60%2C50&layer=mapnik",
    mapAlt: "OpenStreetMap showing the contiguous United States",

    overview: `The United States of America is a federal republic spanning 50 states across North America
(plus Alaska and Hawaii). With an area of nearly 9.8 million km² it is the world's
third-largest country by total area. Its Pacific and Atlantic coastlines stretch for
thousands of kilometres, and the interior is dominated by the Great Plains, the Rocky
Mountains, and the Mississippi-Missouri river system. The US has the world's largest
economy by nominal GDP and exerts enormous cultural influence globally through film,
music, technology and sport.`,

    keyFacts: [
      { label: "Capital", value: "Washington, D.C." },
      { label: "Largest City", value: "New York City" },
      { label: "Population", value: "~332 million (2022)" },
      { label: "Area", value: "9,833,517 km²" },
      { label: "Official Language", value: "English (de facto)" },
      { label: "Currency", value: "US Dollar (USD $)" },
      { label: "Government", value: "Federal presidential constitutional republic" },
      { label: "Independence", value: "4 July 1776 (from Great Britain)" },
      { label: "Neighbours", value: "Canada (north), Mexico (south)" },
      { label: "GDP (nominal)", value: "~$27 trillion (2023, world's largest)" },
      { label: "Time Zones", value: "UTC−4 to UTC−12 (4 mainland zones)" },
    ],

    interestingFacts: [
      "The US has won more Olympic medals than any other country in history.",
      "Yellowstone, established in 1872, was the world's first national park.",
      "The Grand Canyon in Arizona is 446 km long and up to 29 km wide.",
      "Silicon Valley in California is the global hub of technology innovation, home to Apple, Google, Meta and many other tech giants.",
      "The US invented the internet (ARPANET, 1969) and the World Wide Web was developed at CERN by a British scientist, but the US drove its commercial expansion.",
      "America has the world's third-largest population and third-largest land area.",
      "New York City's subway system has 472 stations — the most of any metro system in the world.",
      "More than 40 million Americans trace their ancestry to Ireland, making them the second-largest ancestry group.",
    ],

    sections: {
      geography: `The continental US (the 48 contiguous states) is bordered by Canada to the north and Mexico to the south.
Alaska is separated by Canada and faces the Arctic Ocean, while Hawaii is a volcanic archipelago in the central Pacific.
Major mountain ranges include the Rockies in the west and the Appalachians in the east.
The Mississippi River — the fourth-longest river in the world — drains much of the interior.`,

      culture: `American culture is shaped by Indigenous traditions, successive waves of immigration,
and the mixing of European, African, Latin American and Asian influences.
Hollywood dominates global film; Nashville is the heart of country music; New York is the world's
premier financial and arts capital. American cuisine is as diverse as its people: from Tex-Mex to
New England clam chowder and Louisiana gumbo.`,

      economy: `The US has the world's largest economy, driven by services (finance, healthcare, technology),
manufacturing, and agriculture. It is the world's largest producer of natural gas and oil.
Major companies headquartered in the US include Apple, Amazon, Microsoft, Alphabet and Tesla.`,

      landmarks: [
        { name: "Statue of Liberty", location: "New York Harbor, New York" },
        { name: "Grand Canyon", location: "Arizona" },
        { name: "Yellowstone National Park", location: "Wyoming / Montana / Idaho" },
        { name: "Golden Gate Bridge", location: "San Francisco, California" },
        { name: "White House", location: "Washington, D.C." },
        { name: "Mount Rushmore", location: "South Dakota" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  in: {
    code: "in",
    name: "India",
    emoji: "🇮🇳",
    continent: "Asia",
    flagUrl: "https://flagcdn.com/w320/in.png",
    flagAlt: "Flag of India — saffron, white and green with the Ashoka Chakra",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=68%2C7%2C97%2C36&layer=mapnik",
    mapAlt: "OpenStreetMap showing India",

    overview: `India is the world's most populous country and the seventh-largest by area, covering
3.29 million km² in South Asia. It is home to an extraordinary diversity of languages,
religions, cultures and ecosystems — from the Himalayan peaks in the north to tropical
beaches in the south. India is one of the world's fastest-growing major economies and a
leading democracy. Its civilisation is one of the oldest in the world, with the Indus Valley
Civilisation dating back over 4,500 years.`,

    keyFacts: [
      { label: "Capital", value: "New Delhi" },
      { label: "Largest City", value: "Mumbai" },
      { label: "Population", value: "~1.43 billion (2023, world's largest)" },
      { label: "Area", value: "3,287,263 km²" },
      { label: "Official Languages", value: "Hindi, English (+ 21 other scheduled languages)" },
      { label: "Currency", value: "Indian Rupee (INR ₹)" },
      { label: "Government", value: "Federal parliamentary constitutional republic" },
      { label: "Independence", value: "15 August 1947 (from Britain)" },
      { label: "Neighbours", value: "Pakistan, China, Nepal, Bhutan, Bangladesh, Myanmar" },
      { label: "GDP (nominal)", value: "~$3.7 trillion (2023, 5th largest)" },
      { label: "National Emblem", value: "Lion Capital of Ashoka" },
    ],

    interestingFacts: [
      "India is home to the world's largest film industry by number of films produced — Bollywood (Hindi cinema) alone releases 1,000–2,000 films per year.",
      "The game of Chess (Chaturanga) was invented in India around the 6th century AD.",
      "India has the world's largest school-meal programme, feeding over 120 million children daily.",
      "The Taj Mahal in Agra is one of the Seven Wonders of the Modern World, built by Emperor Shah Jahan in memory of his wife.",
      "India launched its first Moon mission (Chandrayaan-1) in 2008 and successfully landed a rover near the lunar south pole in 2023 with Chandrayaan-3.",
      "Over 1,600 languages are spoken in India; the Constitution recognises 22 officially.",
      "The Kumbh Mela pilgrimage is the world's largest human gathering, attracting hundreds of millions over several weeks.",
    ],

    sections: {
      geography: `India is a peninsula jutting into the Indian Ocean, bounded by the Arabian Sea to the west and
the Bay of Bengal to the east. The Himalayas form a dramatic northern border.
The Deccan Plateau dominates central and southern India, while the Gangetic Plain in the north
is one of the most fertile and densely populated regions on Earth.`,

      culture: `Indian culture spans thousands of years and has given the world yoga, meditation, Ayurvedic medicine,
classical dance forms such as Bharatanatyam and Kathak, and a rich literary tradition in Sanskrit.
Hinduism, Buddhism, Jainism and Sikhism all originated in India. Indian cuisine — from spicy curries
to biryanis, dosas and street chaat — is beloved worldwide.`,

      economy: `India is the world's fifth-largest economy and one of the fastest-growing. Its major sectors include
IT and software services, pharmaceuticals, agriculture, textiles and manufacturing.
Cities such as Bengaluru (Bangalore) are globally recognised technology hubs.`,

      landmarks: [
        { name: "Taj Mahal", location: "Agra, Uttar Pradesh" },
        { name: "Red Fort", location: "Delhi" },
        { name: "Qutb Minar", location: "Delhi" },
        { name: "Kerala Backwaters", location: "Kerala" },
        { name: "Varanasi (Benares)", location: "Uttar Pradesh" },
        { name: "Jim Corbett National Park", location: "Uttarakhand" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  cn: {
    code: "cn",
    name: "China",
    emoji: "🇨🇳",
    continent: "Asia",
    flagUrl: "https://flagcdn.com/w320/cn.png",
    flagAlt: "Flag of China — red with yellow stars",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=72%2C17%2C136%2C54&layer=mapnik",
    mapAlt: "OpenStreetMap showing China",

    overview: `China (officially the People's Republic of China) is the world's second-most-populous nation (1.4 billion,
after India overtook it in 2023) and the third-largest country by total area (9.6 million km²). Situated in East Asia, it stretches
from the Himalayas in the south-west to the Pacific coast in the east. China is one of the world's
oldest continuous civilisations and the world's second-largest economy. It is a major global trading
partner and a permanent member of the UN Security Council.`,

    keyFacts: [
      { label: "Capital", value: "Beijing" },
      { label: "Largest City", value: "Shanghai" },
      { label: "Population", value: "~1.41 billion (2023)" },
      { label: "Area", value: "9,596,960 km²" },
      { label: "Official Language", value: "Standard Chinese (Mandarin / Putonghua)" },
      { label: "Currency", value: "Renminbi (CNY ¥)" },
      { label: "Government", value: "Unitary one-party socialist republic" },
      { label: "Founded", value: "People's Republic proclaimed 1 October 1949" },
      {
        label: "Neighbours",
        value: "Russia, Mongolia, Kazakhstan, India, Pakistan, Vietnam, and 11 others",
      },
      { label: "GDP (nominal)", value: "~$17.7 trillion (2023, 2nd largest)" },
    ],

    interestingFacts: [
      "The Great Wall of China, built over many centuries, stretches over 21,000 km — though only about 8,850 km is original Ming-dynasty wall.",
      "China invented paper, printing, gunpowder, and the compass — four of history's most transformative technologies.",
      "China is the world's largest producer and consumer of tea.",
      "The Giant Panda, found only in south-central China, is one of the world's most recognised endangered species.",
      "The Yangtze River (6,300 km) is the longest river in Asia and the world's third-longest.",
      "China has more UNESCO World Heritage Sites than any other country (57 as of 2023).",
      "China launched the world's first quantum communication satellite (Micius) in 2016.",
    ],

    sections: {
      geography: `China's landscape is enormously varied. The Tibetan Plateau — the world's highest plateau — sits in the
south-west. The Gobi Desert spans the north. Fertile river plains along the Yellow and Yangtze rivers
support hundreds of millions of people. The eastern coastline has many natural harbours and has been a
centre of trade for millennia.`,

      culture: `Chinese civilisation is among the world's oldest, tracing back over 5,000 years.
It gave the world Confucianism, Taoism, Buddhism, Chinese traditional medicine, tea culture,
calligraphy and extraordinary art forms. The Chinese New Year (Spring Festival) is the world's
largest annual human migration. Chinese cuisine varies enormously by region: Sichuan, Cantonese,
Shanghainese and Beijing styles are all world-famous.`,

      economy: `China is the world's manufacturing powerhouse and the largest exporter of goods. It is also
the largest trading partner of more countries than any other nation. Major industries include
electronics, steel, automobiles, textiles and renewable energy (China leads globally in solar and
wind power capacity).`,

      landmarks: [
        { name: "Great Wall of China", location: "Northern China" },
        { name: "Forbidden City", location: "Beijing" },
        { name: "Terracotta Army", location: "Xi'an, Shaanxi" },
        { name: "Zhangjiajie National Forest Park", location: "Hunan" },
        { name: "Li River", location: "Guangxi" },
        { name: "The Bund", location: "Shanghai" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  de: {
    code: "de",
    name: "Germany",
    emoji: "🇩🇪",
    continent: "Europe",
    flagUrl: "https://flagcdn.com/w320/de.png",
    flagAlt: "Flag of Germany — black, red and gold horizontal stripes",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=5%2C47%2C16%2C55&layer=mapnik",
    mapAlt: "OpenStreetMap showing Germany",

    overview: `Germany is a federal parliamentary republic in the heart of Central Europe, sharing borders with
nine countries. With 84 million inhabitants, it is the most populous country in the European Union.
Germany is Europe's largest economy and a global leader in engineering, manufacturing, science
and technology. Despite its turbulent 20th-century history, modern Germany stands as a beacon of
liberal democracy, environmental leadership and cultural vitality.`,

    keyFacts: [
      { label: "Capital", value: "Berlin" },
      { label: "Largest City", value: "Berlin" },
      { label: "Population", value: "~84 million (2023)" },
      { label: "Area", value: "357,114 km²" },
      { label: "Official Language", value: "German" },
      { label: "Currency", value: "Euro (EUR €)" },
      { label: "Government", value: "Federal parliamentary republic" },
      { label: "Reunification", value: "3 October 1990" },
      {
        label: "Neighbours",
        value:
          "France, Poland, Czech Republic, Austria, Switzerland, Netherlands, Belgium, Luxembourg, Denmark",
      },
      { label: "GDP (nominal)", value: "~$4.4 trillion (2023, 3rd largest in world)" },
    ],

    interestingFacts: [
      "Germany is home to over 1,500 different types of beer and about 1,300 breweries — the Reinheitsgebot (Beer Purity Law) of 1516 is one of the world's oldest food regulations.",
      "The printing press, invented by Johannes Gutenberg in Mainz around 1450, revolutionised the world.",
      "Germany has the world's fourth-largest economy and is Europe's largest.",
      "The Autobahn network has sections with no general speed limit — though the recommended speed is 130 km/h.",
      "Germany produces more than 300 types of bread; bread culture was added to UNESCO's Intangible Cultural Heritage list.",
      "Max Planck, Albert Einstein, Werner Heisenberg and many other great physicists were German, shaping modern physics.",
      "Germany recycles around 65% of its waste — one of the highest recycling rates in the world.",
    ],

    sections: {
      geography: `Germany spans the North European Plain in the north, the Central German Uplands in the middle, and
the Alps in the south (with Germany's highest peak, the Zugspitze, at 2,962 m).
The Rhine, Danube and Elbe are its major rivers. Germany's central position in Europe has made it a
crossroads of trade and culture for centuries.`,

      culture: `Germany produced some of history's greatest composers — Bach, Beethoven, Brahms and Wagner.
Philosophers such as Kant, Hegel, Nietzsche and Marx profoundly shaped Western thought.
Oktoberfest (Munich) is the world's largest folk festival. German engineering — from Mercedes-Benz
and BMW to precision tools — is renowned globally. Christmas markets (Weihnachtsmärkte) are a beloved
tradition across the country.`,

      economy: `Germany is the engine of the European economy. Key sectors include automobiles (Volkswagen, BMW, Mercedes),
machinery, chemicals (BASF, Bayer), and financial services. It is a major exporter worldwide and a founding
member of the EU, NATO and the G7.`,

      landmarks: [
        { name: "Brandenburg Gate", location: "Berlin" },
        { name: "Neuschwanstein Castle", location: "Bavaria" },
        { name: "Cologne Cathedral", location: "Cologne" },
        { name: "Berlin Wall Memorial", location: "Berlin" },
        { name: "Black Forest (Schwarzwald)", location: "Baden-Württemberg" },
        { name: "Rothenburg ob der Tauber", location: "Bavaria" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  ke: {
    code: "ke",
    name: "Kenya",
    emoji: "🇰🇪",
    continent: "Africa",
    flagUrl: "https://flagcdn.com/w320/ke.png",
    flagAlt: "Flag of Kenya — black, red and green with a Maasai shield and spears",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=33%2C-5%2C42%2C5&layer=mapnik",
    mapAlt: "OpenStreetMap showing Kenya",

    overview: `Kenya is a country in East Africa straddling the equator, renowned for its spectacular wildlife,
diverse cultures and dramatic landscapes — from the white-sand beaches of the Indian Ocean coast to
the snow-capped summit of Mount Kenya (5,199 m). It is home to the Maasai Mara, one of Africa's
finest wildlife reserves, and the Great Rift Valley, a geological wonder running north–south through
the country. Nairobi is the largest city in East Africa and a major hub for technology, finance and
international organisations.`,

    keyFacts: [
      { label: "Capital", value: "Nairobi" },
      { label: "Largest City", value: "Nairobi" },
      { label: "Population", value: "~55 million (2023)" },
      { label: "Area", value: "580,367 km²" },
      { label: "Official Languages", value: "Swahili (Kiswahili), English" },
      { label: "Currency", value: "Kenyan Shilling (KES)" },
      { label: "Government", value: "Presidential constitutional republic" },
      { label: "Independence", value: "12 December 1963 (from Britain)" },
      { label: "Neighbours", value: "Ethiopia, Somalia, Tanzania, Uganda, South Sudan" },
      {
        label: "Famous For",
        value: "Safari, Maasai Mara, Great Rift Valley, long-distance running",
      },
    ],

    interestingFacts: [
      "Kenya is the birthplace of the world's greatest long-distance runners; Kenyan athletes have dominated Olympic marathon and track events for decades.",
      "The Maasai Mara hosts the Great Migration — the annual movement of over 1.5 million wildebeest and 500,000 zebra from Tanzania, considered one of nature's greatest spectacles.",
      "Kenya has 42 recognised ethnic communities, the largest being the Kikuyu, Luhya, Luo and Kalenjin.",
      "Lake Turkana in northern Kenya is the world's largest permanent desert lake and a UNESCO World Heritage Site.",
      "Nairobi is the only city in the world with a national park within its boundaries — Nairobi National Park.",
      "Kenya is one of Africa's leading flower exporters; cut flowers grown in the highlands around Lake Naivasha supply European markets.",
      "The mobile money platform M-Pesa, launched in Kenya in 2007, pioneered the global mobile banking revolution.",
    ],

    sections: {
      geography: `Kenya's terrain includes coastal lowlands, semi-arid northern and eastern regions, the fertile Central
Highlands and the Great Rift Valley. The Rift Valley has created a chain of lakes — Naivasha, Nakuru
and Bogoria — famous for their flamingo populations. Mount Kenya, the country's highest peak, is Africa's
second-tallest mountain.`,

      culture: `Kenya's culture is rich and diverse, reflecting its 42+ ethnic groups. Traditional music, dance and crafts
vary widely — from the Maasai warriors' jumping dance (Adumu) to the coastal Swahili architecture and cuisine.
Kenyan literature gained global recognition with Nobel-shortlisted author Ngũgĩ wa Thiong'o.
Safari tourism is both an economic pillar and a cultural symbol of Kenya's relationship with wildlife.`,

      economy: `Agriculture (especially tea, coffee, flowers and horticulture), tourism and a growing technology sector
drive Kenya's economy. Nairobi's "Silicon Savannah" has become Africa's leading tech hub.
Kenya is a regional financial centre and hosts the African headquarters of many multinationals.`,

      landmarks: [
        { name: "Maasai Mara National Reserve", location: "Narok County" },
        { name: "Mount Kenya", location: "Central Kenya" },
        { name: "Great Rift Valley viewpoint", location: "Near Nairobi" },
        { name: "Amboseli National Park", location: "Kajiado County" },
        { name: "Fort Jesus", location: "Mombasa" },
        { name: "Lamu Old Town", location: "Lamu Island (UNESCO World Heritage Site)" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  br: {
    code: "br",
    name: "Brazil",
    emoji: "🇧🇷",
    continent: "South America",
    flagUrl: "https://flagcdn.com/w320/br.png",
    flagAlt: "Flag of Brazil — green with a yellow diamond and blue globe with stars",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-74%2C-34%2C-28%2C6&layer=mapnik",
    mapAlt: "OpenStreetMap showing Brazil",

    overview: `Brazil is the largest country in South America and the fifth-largest in the world by area
(8.5 million km²). It is home to the Amazon Rainforest — the world's largest tropical rainforest —
which covers more than 60% of the country. Brazil has the largest economy in Latin America and is
one of the world's great emerging markets. Its culture, a vibrant blend of indigenous, European and
African traditions, has gifted the world with football (soccer), samba, bossa nova and Carnival.`,

    keyFacts: [
      { label: "Capital", value: "Brasília" },
      { label: "Largest City", value: "São Paulo" },
      { label: "Population", value: "~215 million (2023)" },
      { label: "Area", value: "8,515,767 km²" },
      { label: "Official Language", value: "Portuguese" },
      { label: "Currency", value: "Brazilian Real (BRL R$)" },
      { label: "Government", value: "Federal presidential constitutional republic" },
      { label: "Independence", value: "7 September 1822 (from Portugal)" },
      {
        label: "Neighbours",
        value: "Argentina, Bolivia, Colombia, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela",
      },
      { label: "Famous For", value: "Amazon, football, Carnival, Rio de Janeiro, biodiversity" },
    ],

    interestingFacts: [
      "Brazil has won the FIFA World Cup a record five times (1958, 1962, 1970, 1994, 2002).",
      "The Amazon River carries more water than any other river in the world — about 20% of all freshwater discharged into the world's oceans.",
      "Brazil is home to more plant and animal species than any other country — it is the world's most biodiverse nation.",
      "Brasília, the capital, was entirely designed and built from scratch in just 41 months (1956–1960), and is a UNESCO World Heritage Site for its modernist urban planning.",
      "Rio de Janeiro's Carnival is the world's largest carnival, attracting over 2 million people daily during its peak.",
      "Brazil is the world's largest producer of coffee and has been for over 150 years.",
      "The Christ the Redeemer statue atop Corcovado mountain is one of the New Seven Wonders of the World.",
    ],

    sections: {
      geography: `Brazil dominates South America, sharing borders with all but two of its neighbours (Ecuador and Chile).
The Amazon Basin in the north and west is the world's largest river basin.
The cerrado (tropical savanna) and Atlantic Forest are other key biomes.
The coastline stretches 7,491 km along the Atlantic Ocean.`,

      culture: `Brazilian culture is an exuberant fusion. Football is a national passion; Brazil has produced Pelé,
Ronaldo and Ronaldinho — legends of the global game. Music ranges from samba and bossa nova to axé and
forró. African heritage is especially strong in Bahia state. Brazilian cuisine is as diverse as its regions:
feijoada, churrasco (barbecue), açaí and brigadeiros are beloved nationwide.`,

      economy: `Brazil has the largest economy in Latin America and the 9th largest globally. It is a major producer
of soybeans, beef, sugar, orange juice and oil (pre-salt offshore reserves). Manufacturing and services
are centred in São Paulo, the economic capital. Brazil is a leading member of BRICS.`,

      landmarks: [
        { name: "Christ the Redeemer", location: "Rio de Janeiro" },
        { name: "Iguazu Falls", location: "Paraná / Misiones (Brazil-Argentina border)" },
        { name: "Amazon Rainforest", location: "Northern Brazil" },
        { name: "Carnival in Rio", location: "Rio de Janeiro" },
        { name: "Pantanal wetlands", location: "Mato Grosso / Mato Grosso do Sul" },
        { name: "Lençóis Maranhenses", location: "Maranhão" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  au: {
    code: "au",
    name: "Australia",
    emoji: "🇦🇺",
    continent: "Oceania",
    flagUrl: "https://flagcdn.com/w320/au.png",
    flagAlt: "Flag of Australia — blue with Union Jack and Southern Cross",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=112%2C-44%2C154%2C-9&layer=mapnik",
    mapAlt: "OpenStreetMap showing Australia",

    overview: `Australia is the world's sixth-largest country by total area (7.7 million km²) and the largest
country in Oceania. It occupies the entire continent of the same name and is a highly developed nation
known for its unique wildlife, stunning natural landscapes, multicultural cities and outdoor lifestyle.
Australia is one of the world's wealthiest countries per capita and a major exporter of minerals,
agricultural products and services.`,

    keyFacts: [
      { label: "Capital", value: "Canberra" },
      { label: "Largest City", value: "Sydney" },
      { label: "Population", value: "~26 million (2023)" },
      { label: "Area", value: "7,692,024 km²" },
      { label: "Official Language", value: "English (de facto)" },
      { label: "Currency", value: "Australian Dollar (AUD A$)" },
      { label: "Government", value: "Federal parliamentary constitutional monarchy" },
      { label: "Independence", value: "1 January 1901 (federation)" },
      {
        label: "Neighbours",
        value: "No land borders; sea neighbours include Indonesia, Papua New Guinea, New Zealand",
      },
      {
        label: "Famous For",
        value: "Kangaroos, koalas, Great Barrier Reef, Uluru, Sydney Opera House",
      },
    ],

    interestingFacts: [
      "Australia has around 80% of its animal species found nowhere else on Earth, including kangaroos, koalas, wombats, platypuses and echidnas.",
      "The Great Barrier Reef is the world's largest coral reef system, stretching 2,300 km and visible from space.",
      "Uluru (Ayers Rock), a sacred site for the Anangu people, is the world's largest monolith rising above the surrounding plain.",
      "Australia is one of only two countries that shares its name with a continent.",
      "Australia is the driest inhabited continent — about 70% is classified as arid or semi-arid.",
      "The Sydney Opera House is one of the world's most distinctive buildings and a UNESCO World Heritage Site.",
      "Australian English has over 4,000 unique slang terms and diminutives (e.g., 'arvo' for afternoon, 'brekkie' for breakfast).",
    ],

    sections: {
      geography: `Australia's terrain is dominated by the Outback — a vast, arid interior with red desert sands and rock formations.
The Great Dividing Range runs along the eastern coast, and the country has a diverse coastline of over 25,000 km.
The Wet Tropics of Queensland in the north contrast sharply with the temperate south.`,

      culture: `Indigenous Australians have lived on the continent for at least 65,000 years, making their culture one of
the world's oldest. Modern Australia is a multicultural society shaped by British colonisation and waves of
immigration from Asia, Europe and beyond. Sport — cricket, Australian Rules Football (AFL), rugby — is
central to Australian identity. The arts scene thrives in cities like Melbourne (street art, comedy) and Sydney.`,

      economy: `Australia's economy is driven by mining (iron ore, coal, gold, liquefied natural gas), agriculture
(wool, wheat, beef) and services. It has had one of the world's longest periods of continuous economic growth
(nearly 30 years without recession before COVID-19). Major trading partners are China, Japan and South Korea.`,

      landmarks: [
        { name: "Sydney Opera House", location: "Sydney, New South Wales" },
        { name: "Great Barrier Reef", location: "Queensland" },
        { name: "Uluru-Kata Tjuta National Park", location: "Northern Territory" },
        { name: "Twelve Apostles", location: "Victoria (Great Ocean Road)" },
        { name: "Daintree Rainforest", location: "Queensland" },
        { name: "Bondi Beach", location: "Sydney, New South Wales" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  ca: {
    code: "ca",
    name: "Canada",
    emoji: "🇨🇦",
    continent: "North America",
    flagUrl: "https://flagcdn.com/w320/ca.png",
    flagAlt: "Flag of Canada — red and white with a red maple leaf",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-141%2C42%2C-52%2C84&layer=mapnik",
    mapAlt: "OpenStreetMap showing Canada",

    overview: `Canada is the world's second-largest country by total area (10 million km²), stretching from
the Atlantic to the Pacific and north to the Arctic Ocean. Despite its enormous size, Canada has a
relatively small population (~38 million), mostly concentrated along the US border. It is a federal
parliamentary democracy and constitutional monarchy. Canada is consistently ranked among the world's
best countries to live in, with high standards of healthcare, education and quality of life.`,

    keyFacts: [
      { label: "Capital", value: "Ottawa" },
      { label: "Largest City", value: "Toronto" },
      { label: "Population", value: "~38 million (2023)" },
      { label: "Area", value: "9,984,670 km²" },
      { label: "Official Languages", value: "English, French" },
      { label: "Currency", value: "Canadian Dollar (CAD C$)" },
      { label: "Government", value: "Federal parliamentary constitutional monarchy" },
      { label: "Confederation", value: "1 July 1867" },
      { label: "Neighbours", value: "United States of America (south and north-west)" },
      {
        label: "Famous For",
        value: "Maple syrup, hockey, Niagara Falls, Rocky Mountains, multiculturalism",
      },
    ],

    interestingFacts: [
      "Canada has the world's longest coastline — over 202,080 km including its many islands.",
      "Canada has more lakes than the rest of the world combined, containing about 20% of the world's fresh surface water.",
      "Ice hockey was invented in Canada and is the country's national winter sport.",
      "Canada has 48 UNESCO World Heritage Sites, ranging from Banff National Park to the historic district of Old Québec.",
      "Canada is the world's largest producer of maple syrup, producing over 70% of the global supply.",
      "Toronto is one of the world's most multicultural cities — over 200 languages are spoken and more than half of its residents were born outside Canada.",
      "The Northern Lights (Aurora Borealis) can be seen throughout northern Canada, with Yukon and Northwest Territories offering some of the best viewing spots.",
    ],

    sections: {
      geography: `Canada is a vast country with extraordinarily diverse landscapes: the Rocky Mountains in the west,
the Arctic tundra in the north, the boreal forest (taiga) covering much of the interior, and the fertile
prairies of Alberta, Saskatchewan and Manitoba. The St Lawrence River and Great Lakes define its south-east.`,

      culture: `Canada's identity is shaped by its two founding European cultures — British and French — and by over a
century of immigration from around the world. Indigenous peoples (First Nations, Métis, Inuit) have
a profound and growing presence in Canadian culture. Contributions to global culture include Celine Dion,
Justin Bieber, Drake, Arcade Fire, and iconic artists such as Group of Seven painters.`,

      economy: `Canada has the 9th-largest economy globally. Key industries include oil sands and petroleum (Alberta),
automotive (Ontario), aerospace, technology, banking and financial services.
Canada is a member of the G7, G20, NATO and the Commonwealth.`,

      landmarks: [
        { name: "Niagara Falls", location: "Ontario (on the US-Canada border)" },
        { name: "Banff National Park", location: "Alberta" },
        { name: "CN Tower", location: "Toronto, Ontario" },
        { name: "Old Québec City", location: "Québec" },
        { name: "Aurora Borealis", location: "Yukon / Northwest Territories" },
        { name: "Bay of Fundy", location: "New Brunswick / Nova Scotia" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  fr: {
    code: "fr",
    name: "France",
    emoji: "🇫🇷",
    continent: "Europe",
    flagUrl: "https://flagcdn.com/w320/fr.png",
    flagAlt: "Flag of France — blue, white and red vertical stripes (Tricolore)",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-5%2C42%2C10%2C51&layer=mapnik",
    mapAlt: "OpenStreetMap showing France",

    overview: `France is a semi-presidential republic in Western Europe and the largest country in the EU by area
(551,695 km²). It is one of the world's most visited countries — Paris alone attracts over 30 million
tourists a year. France is a permanent member of the UN Security Council, a founding member of the EU
and NATO, and a global leader in fashion, gastronomy, art, literature and philosophy. Its motto is
"Liberté, Égalité, Fraternité" — Liberty, Equality, Fraternity.`,

    keyFacts: [
      { label: "Capital", value: "Paris" },
      { label: "Largest City", value: "Paris" },
      { label: "Population", value: "~68 million (2023)" },
      { label: "Area", value: "551,695 km² (metropolitan)" },
      { label: "Official Language", value: "French" },
      { label: "Currency", value: "Euro (EUR €)" },
      { label: "Government", value: "Unitary semi-presidential republic" },
      { label: "Republic Founded", value: "First Republic 1792; Fifth Republic 1958" },
      {
        label: "Neighbours",
        value: "Spain, Andorra, Monaco, Italy, Switzerland, Germany, Luxembourg, Belgium",
      },
      {
        label: "Famous For",
        value: "Eiffel Tower, wine, cheese, cuisine, fashion, art, the French Revolution",
      },
    ],

    interestingFacts: [
      "France is the world's most visited country, welcoming around 90 million tourists per year.",
      "The Louvre in Paris is the world's most visited art museum, home to the Mona Lisa and over 35,000 works of art.",
      "France produces over 1,200 types of cheese — General de Gaulle famously asked 'How can you govern a country which has 246 varieties of cheese?'",
      "The metric system was invented in France during the French Revolution in the 1790s and is now used by almost every country in the world.",
      "France has more Nobel Prize winners in Literature than any other country.",
      "The Tour de France, the world's most prestigious cycling race, has been held annually (with wartime exceptions) since 1903.",
      "France was the world's first country to ban supermarkets from throwing away unsold food, requiring them to donate it to charity (2016).",
    ],

    sections: {
      geography: `Metropolitan France spans from the English Channel and North Sea in the north to the Mediterranean in
the south, and from the Atlantic in the west to the Rhine and Alps in the east.
The Alps (with Mont Blanc, 4,808 m — Western Europe's highest peak), the Pyrenees and the Massif Central
are major mountain ranges. The Loire, Seine and Rhône are its principal rivers.`,

      culture: `French culture has profoundly shaped the Western world. The French Enlightenment (Voltaire, Rousseau,
Diderot) laid intellectual foundations for modern democracy and science. French cuisine is a UNESCO
Intangible Cultural Heritage. Paris sets global trends in fashion (Chanel, Dior, Louis Vuitton).
French cinema (Cannes Film Festival), literature (Victor Hugo, Marcel Proust) and visual art
(Impressionism — Monet, Renoir, Cézanne) are world-renowned.`,

      economy: `France has the world's 7th-largest economy. Key sectors include aerospace (Airbus), luxury goods (LVMH),
tourism, agriculture (wine, dairy, wheat) and services. France is a nuclear power and derives about 70%
of its electricity from nuclear energy — the highest share of any country.`,

      landmarks: [
        { name: "Eiffel Tower", location: "Paris" },
        { name: "The Louvre", location: "Paris" },
        { name: "Mont Saint-Michel", location: "Normandy" },
        { name: "Palace of Versailles", location: "Versailles, near Paris" },
        { name: "Mont Blanc", location: "Alps (France-Italy border)" },
        { name: "Loire Valley châteaux", location: "Loire Valley, central France" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  jp: {
    code: "jp",
    name: "Japan",
    emoji: "🇯🇵",
    continent: "Asia",
    flagUrl: "https://flagcdn.com/w320/jp.png",
    flagAlt: "Flag of Japan — white with a red circle (Rising Sun)",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=122%2C30%2C146%2C46&layer=mapnik",
    mapAlt: "OpenStreetMap showing Japan",

    overview: `Japan is an island nation in East Asia made up of 6,852 islands, with four main islands — Honshu,
Hokkaido, Kyushu and Shikoku. It has the world's third-largest economy and is a global leader in
technology, robotics, automotive manufacturing and popular culture (anime, manga, video games).
Japan is known for its extraordinary blend of ancient tradition and cutting-edge modernity, its
cuisine (sushi, ramen, tempura), the iconic cherry blossom (sakura) season, and meticulous craftsmanship.`,

    keyFacts: [
      { label: "Capital", value: "Tokyo" },
      { label: "Largest City", value: "Tokyo (world's most populous metropolitan area)" },
      { label: "Population", value: "~125 million (2023)" },
      { label: "Area", value: "377,975 km²" },
      { label: "Official Language", value: "Japanese" },
      { label: "Currency", value: "Japanese Yen (JPY ¥)" },
      { label: "Government", value: "Unitary parliamentary constitutional monarchy" },
      { label: "Emperor", value: "Emperor Naruhito (since 2019)" },
      { label: "Sea Neighbours", value: "China, South Korea, North Korea, Russia (across water)" },
      {
        label: "Famous For",
        value: "Mount Fuji, cherry blossoms, anime, sushi, bullet trains, technology",
      },
    ],

    interestingFacts: [
      "Japan has the world's oldest monarchy — Emperor Naruhito is the 126th emperor in an unbroken line stretching back over 1,500 years.",
      "The Shinkansen (bullet train) network, launched in 1964, has carried over 10 billion passengers without a single fatal accident due to derailment or collision.",
      "Japan has 3 of the world's 10 most populous metropolitan areas — Tokyo, Osaka and Nagoya.",
      "Japan is one of the world's most seismically active countries, experiencing around 1,500 earthquakes per year.",
      "The Japanese convenience store (konbini) is world-famous: there are over 55,000 stores across the country selling hot food, fresh meals, banking services and much more.",
      "Vending machines in Japan outnumber one per 23 people — they sell everything from hot ramen to umbrellas and fresh eggs.",
      "Japanese people have the world's longest life expectancy — about 84 years on average — and Okinawa is famous for its high number of centenarians.",
    ],

    sections: {
      geography: `Japan's islands arc along the Pacific Rim's Ring of Fire, making it highly prone to earthquakes and
volcanoes. Mount Fuji (3,776 m) is an iconic active volcano and Japan's highest peak.
The climate ranges from subarctic in Hokkaido to subtropical in Okinawa. About 73% of Japan is
mountainous forest, leaving limited flat land for the dense urban populations.`,

      culture: `Japan's culture is a unique fusion of ancient Shinto and Buddhist traditions with modernity.
The tea ceremony (chado), flower arrangement (ikebana), martial arts (judo, karate, kendo) and Noh theatre
are living traditions. Manga and anime have created a global fanbase. Japanese cuisine — declared a UNESCO
Intangible Cultural Heritage — emphasises seasonal ingredients, umami flavours and exquisite presentation.`,

      economy: `Japan has the world's third-largest economy. Key industries include automotive (Toyota, Honda, Nissan),
electronics (Sony, Panasonic, Canon), robotics, semiconductors and financial services.
Japan is a major investor globally and a member of the G7. Despite decades of slow growth, it remains a
highly advanced economy with world-leading levels of productivity and innovation.`,

      landmarks: [
        { name: "Mount Fuji", location: "Honshu (Shizuoka / Yamanashi prefectures)" },
        { name: "Fushimi Inari Taisha", location: "Kyoto" },
        { name: "Hiroshima Peace Memorial", location: "Hiroshima" },
        { name: "Tokyo Skytree", location: "Tokyo" },
        { name: "Arashiyama Bamboo Grove", location: "Kyoto" },
        { name: "Shinjuku Gyoen National Garden", location: "Tokyo" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },

  // -----------------------------------------------------------------------
  za: {
    code: "za",
    name: "South Africa",
    emoji: "🇿🇦",
    continent: "Africa",
    flagUrl: "https://flagcdn.com/w320/za.png",
    flagAlt: "Flag of South Africa — six colours including black, green and gold",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=16%2C-35%2C33%2C-22&layer=mapnik",
    mapAlt: "OpenStreetMap showing South Africa",

    overview: `South Africa is located at the southern tip of Africa, bordered by the Atlantic Ocean to the west and
the Indian Ocean to the south and east. It is the most industrialised country on the African continent
and a major emerging market. South Africa is famous for its extraordinary biodiversity, its complex
history of apartheid and the transition to democracy under Nelson Mandela (1994), its "Big Five" wildlife,
world-class wine regions and the multicultural "Rainbow Nation" culture.`,

    keyFacts: [
      { label: "Capital (Administrative)", value: "Pretoria" },
      { label: "Capital (Legislative)", value: "Cape Town" },
      { label: "Capital (Judicial)", value: "Bloemfontein" },
      { label: "Largest City", value: "Johannesburg" },
      { label: "Population", value: "~60 million (2023)" },
      { label: "Area", value: "1,219,090 km²" },
      {
        label: "Official Languages",
        value: "11 (Zulu, Xhosa, Afrikaans, English, Sotho, Tswana, and 5 others)",
      },
      { label: "Currency", value: "South African Rand (ZAR R)" },
      {
        label: "Government",
        value: "Unitary dominant-party parliamentary constitutional republic",
      },
      { label: "Democracy", value: "First multiracial elections: 27 April 1994" },
      { label: "Neighbours", value: "Namibia, Botswana, Zimbabwe, Mozambique, Swaziland, Lesotho" },
    ],

    interestingFacts: [
      "South Africa has 11 official languages — more than almost any other country in the world.",
      "Nelson Mandela, who led the fight against apartheid and became South Africa's first democratically elected president (1994), is one of the most admired leaders in history.",
      "South Africa is the only country to have voluntarily dismantled its nuclear weapons programme (in 1989).",
      "The Kruger National Park is one of Africa's largest game reserves and home to the Big Five: lion, leopard, elephant, rhinoceros and Cape buffalo.",
      "Cape Town's Table Mountain is a flat-topped mountain visible from 200 km at sea and was voted one of the New Seven Wonders of Nature.",
      "South Africa produces about 75% of the world's platinum and is a major producer of gold and diamonds.",
      "South Africa hosted the 2010 FIFA World Cup — the first ever held on the African continent.",
    ],

    sections: {
      geography: `South Africa has a diverse landscape: the Drakensberg mountain range in the east, the Karoo semi-desert
in the interior, the fertile Western Cape winelands, and the subtropical KwaZulu-Natal coast.
The Cape Floristic Region is one of the world's six major plant kingdoms and a UNESCO World Heritage Site,
home to over 9,000 plant species, 70% found nowhere else.`,

      culture: `South Africa calls itself the "Rainbow Nation" — a term coined by Archbishop Desmond Tutu to describe
the cultural diversity of its 11 official language groups. Zulu, Xhosa, Sotho and Tswana cultures are
rich in music, dance and oral tradition. Braai (barbecue) is a national institution. Afrikaans literature
and Cape Malay cuisine reflect the country's complex cultural heritage. South Africa has produced
world-class writers including J.M. Coetzee (Nobel Prize 2003) and Nadine Gordimer (Nobel Prize 1991).`,

      economy: `South Africa has the most industrialised economy on the African continent. Key sectors include mining
(platinum, gold, chrome, coal), manufacturing, financial services and tourism. Johannesburg is sub-Saharan
Africa's financial capital. South Africa is a member of BRICS and the G20.`,

      landmarks: [
        { name: "Table Mountain", location: "Cape Town" },
        { name: "Kruger National Park", location: "Limpopo / Mpumalanga" },
        { name: "Robben Island", location: "Cape Town (UNESCO World Heritage Site)" },
        { name: "Cape of Good Hope", location: "Cape Peninsula, Western Cape" },
        { name: "Drakensberg Mountains", location: "KwaZulu-Natal / Lesotho border" },
        { name: "Winelands (Stellenbosch / Franschhoek)", location: "Western Cape" },
      ],
    },

    imageCredit: "Flag: FlagCDN (public domain). Map: © OpenStreetMap contributors.",
  },
};
