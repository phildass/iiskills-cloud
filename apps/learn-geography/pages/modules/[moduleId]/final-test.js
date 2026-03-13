"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-geography";
const APP_DISPLAY = "Learn Geography";
const NO_BADGES_KEY = "learn-geography-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    { question: "What are the two fundamental questions at the heart of geography?", options: ["'When?' and 'Why?'", "'Where?' and 'Why there?'", "'Who?' and 'What?'", "'How?' and 'How many?'"], correct_answer: 1 },
    { question: "What branch of geography studies landforms, climate, and natural ecosystems?", options: ["Human geography", "Economic geography", "Physical geography", "Geopolitics"], correct_answer: 2 },
    { question: "What is the name of the imaginary line at 0° latitude dividing Earth into hemispheres?", options: ["Prime meridian", "Tropic of Cancer", "Equator", "Arctic Circle"], correct_answer: 2 },
    { question: "A plateau is best described as:", options: ["A deep ocean trench", "A flat elevated landform rising steeply above surrounding terrain", "A narrow strip of coastal sand", "A river floodplain"], correct_answer: 1 },
    { question: "Which process creates fold mountains such as the Alps?", options: ["Volcanic eruption along a mid-ocean ridge", "Collision of tectonic plates causing crustal compression", "Glacial erosion cutting deep valleys", "River deposition at a delta"], correct_answer: 1 },
    { question: "What does 'relief' refer to in physical geography?", options: ["Weather patterns across a region", "Variation in elevation across a landscape", "Distance between two cities", "The direction of prevailing winds"], correct_answer: 1 },
    { question: "Which type of rock is formed from cooled magma?", options: ["Sedimentary", "Metamorphic", "Igneous", "Alluvial"], correct_answer: 2 },
    { question: "An oxbow lake is formed when:", options: ["A glacier retreats, leaving a depression", "A river meander is cut off from the main channel", "Tectonic movement creates a rift valley", "Sea-level rise floods a coastal valley"], correct_answer: 1 },
    { question: "What is permafrost?", options: ["Soil that is permanently frozen below 0 °C", "A layer of rock beneath the ocean floor", "A type of desert crust", "Ice that never melts on polar peaks"], correct_answer: 0 },
    { question: "What external forces primarily shape Earth's surface over time?", options: ["Gravitational pull of the moon only", "Tectonic uplift only", "Weathering, erosion, and deposition by water, wind, and ice", "Volcanic activity only"], correct_answer: 2 },
    { question: "What is the difference between weather and climate?", options: ["They are the same thing measured differently", "Weather is short-term atmospheric conditions; climate is long-term patterns", "Climate is measured daily; weather is measured annually", "Weather only occurs near coasts"], correct_answer: 1 },
    { question: "A fjord is created by:", options: ["Wind erosion in arid regions", "Glacial erosion of a coastal valley later flooded by the sea", "Tectonic rifting at a plate boundary", "River delta formation"], correct_answer: 1 },
    { question: "Which layer of the Earth is primarily responsible for tectonic plate movement?", options: ["Inner core", "Outer core", "Mantle (asthenosphere)", "Crust"], correct_answer: 2 },
    { question: "What type of boundary occurs where two tectonic plates move apart?", options: ["Convergent boundary", "Transform boundary", "Divergent boundary", "Subduction zone"], correct_answer: 2 },
    { question: "What is a floodplain?", options: ["A plain formed by lava flows", "Flat land adjacent to a river that is periodically inundated", "A coastal plain below sea level", "A plateau eroded by glaciers"], correct_answer: 1 },
    { question: "GIS stands for:", options: ["Global Imaging Satellite", "Geographic Information Systems", "Geological Investigation Survey", "Geodetic Indexing Standard"], correct_answer: 1 },
    { question: "In which climate zone are tropical rainforests typically found?", options: ["Temperate zone", "Polar zone", "Equatorial zone", "Mediterranean zone"], correct_answer: 2 },
    { question: "What is the primary cause of erosion along coastlines?", options: ["Plate tectonics", "Wind and wave action", "River sediment discharge", "Groundwater movement"], correct_answer: 1 },
    { question: "Which feature is formed when a river deposits sediment at its mouth?", options: ["Meander", "Gorge", "Delta", "Alluvial fan"], correct_answer: 2 },
    { question: "What term describes the study of the shape and features of Earth's surface?", options: ["Cartography", "Topography", "Hydrology", "Meteorology"], correct_answer: 1 },
  ],
  2: [
    { question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], correct_answer: 2 },
    { question: "Which is the world's largest continent by area?", options: ["Africa", "North America", "Antarctica", "Asia"], correct_answer: 3 },
    { question: "Which continent contains the world's longest river, the Nile?", options: ["Asia", "South America", "Africa", "Europe"], correct_answer: 2 },
    { question: "The Amazon River is located on which continent?", options: ["Africa", "South America", "North America", "Asia"], correct_answer: 1 },
    { question: "Which mountain range is the longest in the world?", options: ["Himalayas", "Rockies", "Alps", "Andes"], correct_answer: 3 },
    { question: "Which continent has the highest average elevation?", options: ["Asia", "South America", "Antarctica", "Africa"], correct_answer: 2 },
    { question: "The Sahara Desert is located primarily on which continent?", options: ["Asia", "Australia", "Africa", "South America"], correct_answer: 2 },
    { question: "Which continent is completely within the Southern Hemisphere?", options: ["Africa", "Asia", "Australia", "Antarctica"], correct_answer: 3 },
    { question: "What separates Europe from Asia geographically?", options: ["The Mediterranean Sea", "The Ural Mountains and Caspian Sea", "The Caucasus Mountains only", "The Baltic Sea"], correct_answer: 1 },
    { question: "Which continent is home to the Congo rainforest, the world's second largest?", options: ["South America", "Africa", "Asia", "North America"], correct_answer: 1 },
    { question: "Mount Everest, the world's highest peak, is located in which continent?", options: ["Africa", "Europe", "Asia", "Antarctica"], correct_answer: 2 },
    { question: "Which continent has the most countries?", options: ["Asia", "Europe", "South America", "Africa"], correct_answer: 3 },
    { question: "The Great Barrier Reef is located off the coast of which continent?", options: ["Africa", "Asia", "Australia", "South America"], correct_answer: 2 },
    { question: "Which continent experiences the most seismic activity due to the 'Ring of Fire'?", options: ["Africa", "Europe", "Asia/Pacific rim", "North America alone"], correct_answer: 2 },
    { question: "What is the smallest continent by area?", options: ["Europe", "Antarctica", "Australia", "South America"], correct_answer: 2 },
    { question: "The Gobi Desert is located on which continent?", options: ["Africa", "North America", "Asia", "Australia"], correct_answer: 2 },
    { question: "Which continent has no permanent human residents?", options: ["Arctic region", "Greenland", "Antarctica", "Australia"], correct_answer: 2 },
    { question: "The Appalachian Mountains are located on which continent?", options: ["South America", "Europe", "Asia", "North America"], correct_answer: 3 },
    { question: "Which continent is surrounded entirely by ocean?", options: ["Australia", "Antarctica", "Europe", "Africa"], correct_answer: 0 },
    { question: "Lake Victoria, Africa's largest lake, borders which three countries?", options: ["Egypt, Sudan, Ethiopia", "Kenya, Uganda, Tanzania", "Nigeria, Cameroon, Chad", "Zambia, Zimbabwe, Mozambique"], correct_answer: 1 },
  ],
  3: [
    { question: "What percentage of Earth's surface is covered by oceans?", options: ["About 51%", "About 61%", "About 71%", "About 81%"], correct_answer: 2 },
    { question: "Which is the world's largest ocean?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], correct_answer: 3 },
    { question: "What is the deepest point in the world's oceans?", options: ["Puerto Rico Trench", "Mariana Trench (Challenger Deep)", "Java Trench", "South Sandwich Trench"], correct_answer: 1 },
    { question: "The Gulf Stream is a major:", options: ["Wind pattern in the North Atlantic", "Warm ocean current flowing northward along the eastern US coast", "Cold current running from the Arctic", "Tidal pattern in the Gulf of Mexico"], correct_answer: 1 },
    { question: "What is the thermocline?", options: ["The surface layer warmed by sunlight", "A distinct layer where ocean temperature drops rapidly with depth", "The boundary between saltwater and freshwater", "The zone of maximum wave activity"], correct_answer: 1 },
    { question: "What causes tides on Earth?", options: ["Solar wind pressure", "Earth's rotation alone", "The gravitational pull of the Moon (and Sun)", "Ocean temperature differences"], correct_answer: 2 },
    { question: "What is a gyre in oceanography?", options: ["A large whirlpool near a waterfall", "A large system of circular ocean currents", "A submarine volcanic ridge", "An underwater cave system"], correct_answer: 1 },
    { question: "The phenomenon El Niño involves the warming of surface waters in which ocean?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct_answer: 2 },
    { question: "What is the continental shelf?", options: ["A deep-sea plain far from land", "A shallow underwater extension of a continent", "A ridge of mountains on the ocean floor", "A coral reef system"], correct_answer: 1 },
    { question: "Salinity in the ocean is primarily caused by:", options: ["Rainfall dissolving atmospheric gases", "Rivers carrying dissolved minerals and salts into the sea", "Volcanic activity on the ocean floor only", "Evaporation of freshwater leaving air"], correct_answer: 1 },
    { question: "Which ocean is the shallowest and coldest?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], correct_answer: 3 },
    { question: "What is an atoll?", options: ["A type of deep-sea fish", "A ring-shaped coral reef enclosing a lagoon", "An underwater mountain chain", "A tsunami warning system"], correct_answer: 1 },
    { question: "Ocean dead zones are areas with very low oxygen levels caused mainly by:", options: ["Volcanic eruptions on the sea floor", "Excess nutrients from agriculture causing algal blooms (eutrophication)", "Deep-sea earthquakes", "Submarine glaciers melting"], correct_answer: 1 },
    { question: "What drives deep ocean circulation (thermohaline circulation)?", options: ["Winds on the ocean surface alone", "Differences in water temperature and salinity", "Tidal forces from the Moon", "Earth's magnetic field"], correct_answer: 1 },
    { question: "What is the intertidal zone?", options: ["The area between high tide and low tide marks on a shore", "The zone 200 m below the ocean surface", "The deep ocean floor", "The open ocean far from land"], correct_answer: 0 },
    { question: "Which sea is the world's saltiest body of water?", options: ["Red Sea", "Dead Sea", "Mediterranean Sea", "Caspian Sea"], correct_answer: 1 },
    { question: "A tsunami is most commonly caused by:", options: ["Hurricane winds", "Submarine earthquakes or landslides", "Unusually high tides", "Volcanic eruptions on land"], correct_answer: 1 },
    { question: "Ocean acidification is caused by oceans absorbing:", options: ["Nitrogen oxide from agriculture", "Carbon dioxide from the atmosphere", "Methane from wetlands", "Sulphur dioxide from volcanoes"], correct_answer: 1 },
    { question: "What is the photic zone?", options: ["The deepest part of the ocean", "The area where sunlight penetrates and photosynthesis occurs", "A zone of hydrothermal vents", "The polar sea-ice region"], correct_answer: 1 },
    { question: "The Strait of Malacca connects which two bodies of water?", options: ["Red Sea and Mediterranean Sea", "Pacific Ocean and Indian Ocean", "Indian Ocean and South China Sea", "Atlantic Ocean and Pacific Ocean"], correct_answer: 2 },
  ],
  4: [
    { question: "The Köppen Climate Classification divides the world into how many major climate zones?", options: ["3", "5", "7", "10"], correct_answer: 1 },
    { question: "What is the Intertropical Convergence Zone (ITCZ)?", options: ["A cold high-pressure belt at 30° latitude", "A zone near the equator where rising warm air creates high rainfall", "The boundary between Arctic and temperate air masses", "A band of desert stretching around 30° latitude"], correct_answer: 1 },
    { question: "What is a rain shadow?", options: ["Increased rainfall on the windward side of a mountain", "A dry area on the leeward side of a mountain range", "A seasonal monsoon pattern", "A coastal fog belt"], correct_answer: 1 },
    { question: "Mediterranean climates are characterised by:", options: ["Year-round rainfall and mild temperatures", "Hot dry summers and mild wet winters", "Cold wet summers and dry winters", "High rainfall throughout the year"], correct_answer: 1 },
    { question: "What primarily drives global atmospheric circulation?", options: ["Earth's magnetic field", "Differential solar heating between equator and poles", "Ocean tides", "Volcanic activity"], correct_answer: 1 },
    { question: "In which climate zone are tropical savanna grasslands typically found?", options: ["Equatorial zone", "Polar zone", "Tropical wet-and-dry zone", "Continental zone"], correct_answer: 2 },
    { question: "What are Hadley Cells?", options: ["Cold air masses near the poles", "Circular atmospheric circulation cells between the equator and ~30° latitude", "Rotating ocean currents", "Wind systems in temperate regions"], correct_answer: 1 },
    { question: "The orographic effect refers to:", options: ["Ocean temperature influence on coastal climates", "Precipitation caused by air rising over a mountain range", "Seasonal temperature swings in continental interiors", "The urban heat island effect"], correct_answer: 1 },
    { question: "Which climate type features the highest annual rainfall on Earth?", options: ["Semi-arid steppe", "Humid continental", "Tropical rainforest (equatorial)", "Oceanic temperate"], correct_answer: 2 },
    { question: "What is ENSO?", options: ["A type of polar vortex", "El Niño-Southern Oscillation — Pacific ocean-atmosphere interaction causing global weather disruption", "A European climate monitoring network", "An Arctic oscillation index"], correct_answer: 1 },
    { question: "Which letter denotes a desert climate in the Köppen system?", options: ["A", "B", "C", "D"], correct_answer: 1 },
    { question: "The monsoon climate is primarily driven by:", options: ["Permanent trade winds", "Seasonal reversal of land-sea temperature differences", "Jet stream position", "Polar front migration"], correct_answer: 1 },
    { question: "What is an urban heat island?", options: ["A tropical city in a hot zone", "Higher temperatures in urban areas compared to surrounding rural land", "A city built on volcanic rock", "A coastal city heated by warm ocean currents"], correct_answer: 1 },
    { question: "Tundra climate is characterised by:", options: ["No months above freezing", "One to three months above 0 °C but below 10 °C", "Warm summers and very cold winters with high snow", "Permanently frozen ground with year-round frost only at depth"], correct_answer: 1 },
    { question: "The trade winds blow from:", options: ["Polar regions toward the equator", "Sub-tropical high-pressure belts toward the equatorial low", "Equator toward the poles", "West to east across temperate zones"], correct_answer: 1 },
    { question: "What is the albedo effect?", options: ["Absorption of heat by dark ocean surfaces", "The reflectivity of a surface — high albedo reflects more solar radiation", "Greenhouse gas trapping of infrared radiation", "Ocean current distribution of heat"], correct_answer: 1 },
    { question: "Continental climates are characterised by:", options: ["Mild year-round temperatures due to ocean influence", "Extreme seasonal temperature differences with cold winters", "High year-round humidity", "Dry hot summers and warm wet winters"], correct_answer: 1 },
    { question: "What does 'arid' mean in climate classification?", options: ["Characterised by heavy and frequent rainfall", "Very dry with evaporation exceeding precipitation", "Cold with permanent ice cover", "Warm with seasonal rains"], correct_answer: 1 },
    { question: "Which climate zone occupies most of western Europe?", options: ["Mediterranean", "Semi-arid steppe", "Oceanic (Cfb in Köppen)", "Continental subarctic"], correct_answer: 2 },
    { question: "What is the permafrost line?", options: ["The latitude above which no trees grow", "The boundary below which ground remains permanently frozen", "The altitude at which glaciers form", "The temperature at which the sea freezes"], correct_answer: 1 },
  ],
  5: [
    { question: "What is human geography primarily concerned with?", options: ["The study of landforms and physical processes", "The relationship between people and their environments, including culture, economy, and society", "Ocean currents and marine biology", "Satellite imaging technology"], correct_answer: 1 },
    { question: "What is urbanisation?", options: ["Converting forest to farmland", "The movement of people from rural to urban areas", "Building infrastructure in coastal zones", "The study of city planning"], correct_answer: 1 },
    { question: "What is the demographic transition model?", options: ["A map of global migration routes", "A model showing how birth and death rates change as a country develops economically", "A system for classifying urban areas by size", "A model predicting rainfall patterns"], correct_answer: 1 },
    { question: "What is population density?", options: ["The total number of people in a country", "The number of people per unit area of land", "The rate at which a population grows", "The ratio of urban to rural residents"], correct_answer: 1 },
    { question: "Push factors in migration are:", options: ["Attractions drawing people to a new location", "Conditions at the origin that compel people to leave", "Government policies restricting movement", "Language barriers between countries"], correct_answer: 1 },
    { question: "What is a megacity?", options: ["A city with over 1 million inhabitants", "A city with a population exceeding 10 million", "A capital city of a continent", "An industrial city with major ports"], correct_answer: 1 },
    { question: "What does HDI (Human Development Index) measure?", options: ["A country's military power", "A composite measure of life expectancy, education, and per capita income", "The size of a country's GDP", "The level of urbanisation"], correct_answer: 1 },
    { question: "What is a primate city?", options: ["A city built around a royal palace", "A city that is disproportionately large compared to the next largest city in a country", "The first city established in a country", "A city specialising in manufacturing"], correct_answer: 1 },
    { question: "What is gentrification?", options: ["Conversion of industrial zones to nature reserves", "The transformation of a lower-income urban area as wealthier residents move in, raising property values", "Urban sprawl into rural fringe areas", "Rural-to-urban migration of elderly populations"], correct_answer: 1 },
    { question: "What is the global south?", options: ["The continent of Antarctica", "A term used to describe developing and emerging nations, many located in the Southern Hemisphere", "Countries south of the Tropic of Capricorn only", "The southern European nations"], correct_answer: 1 },
    { question: "What is a refugee as defined by the UN?", options: ["Anyone who moves across international borders", "A person forced to flee their country due to persecution, war, or violence", "An economic migrant seeking better employment", "A person displaced within their own country"], correct_answer: 1 },
    { question: "What is suburbanisation?", options: ["Movement of industries from cities to rural areas", "Growth of residential areas on the outskirts of cities", "Decline of city centres as businesses leave", "Rural population growth"], correct_answer: 1 },
    { question: "What is cultural geography?", options: ["The study of physical landscapes shaped by culture", "The study of how human cultures are distributed and how they shape and are shaped by place", "A form of economic analysis", "The mapping of religious buildings"], correct_answer: 1 },
    { question: "What is the fertility rate?", options: ["The number of immigrants entering a country per year", "The average number of children a woman is expected to have in her lifetime", "The percentage of the population under 15", "The ratio of births to deaths"], correct_answer: 1 },
    { question: "What is counter-urbanisation?", options: ["Decline of rural farming communities", "Movement of people and businesses from urban centres to rural and suburban areas", "Building new satellite cities", "Population growth in city centres"], correct_answer: 1 },
    { question: "What is an informal settlement?", options: ["A planned housing estate on city outskirts", "A housing area that has developed without legal ownership or formal planning, often lacking basic services", "A temporary military encampment", "A rural village that lacks electricity"], correct_answer: 1 },
    { question: "The natural increase rate of a population equals:", options: ["Birth rate minus death rate", "Total immigration minus emigration", "Birth rate plus immigration", "GDP growth divided by population"], correct_answer: 0 },
    { question: "What is the concept of 'sense of place'?", options: ["The precise GPS coordinates of a location", "The subjective meanings and emotional attachments people develop for particular places", "A cartographic technique for labelling maps", "The political significance of a territory"], correct_answer: 1 },
    { question: "What is a census?", options: ["A national election", "An official count and survey of a population and its characteristics", "A government tax assessment", "A mapping of economic zones"], correct_answer: 1 },
    { question: "What does 'brain drain' refer to in human geography?", options: ["Decline in educational standards in a country", "Emigration of highly educated or skilled individuals from a country", "Overpopulation in university cities", "Lack of investment in schools"], correct_answer: 1 },
  ],
  6: [
    { question: "What is economic geography?", options: ["The study of how money is printed", "The study of how economic activities are distributed across space and how geography influences economic processes", "A form of financial accounting", "The mapping of stock markets"], correct_answer: 1 },
    { question: "What is GDP?", options: ["A measure of a country's foreign debt", "Gross Domestic Product — the total monetary value of all goods and services produced in a country in a year", "The government's annual budget", "A measure of average income"], correct_answer: 1 },
    { question: "What is comparative advantage in trade?", options: ["A country's ability to produce everything cheaper than its neighbours", "The ability of a country to produce a good at a lower opportunity cost than another", "Having more natural resources than trading partners", "Controlling sea routes for trade"], correct_answer: 1 },
    { question: "What are primary industries?", options: ["The largest industries by revenue", "Industries that extract or harvest raw materials from the natural environment", "Industries producing finished consumer goods", "Service industries such as banking and retail"], correct_answer: 1 },
    { question: "What is FDI?", options: ["Federal Defence Initiative", "Foreign Direct Investment — investment made by a company in one country into business interests in another", "Fixed Deposit Interest", "Federal Development Index"], correct_answer: 1 },
    { question: "What is the Gini coefficient?", options: ["A measure of economic growth rate", "A statistical measure of income inequality within a country", "The ratio of exports to imports", "The level of government debt to GDP"], correct_answer: 1 },
    { question: "What is a free trade zone (FTZ)?", options: ["An area where all goods are free of charge", "A designated area where goods can be imported, stored, or manufactured with reduced tariffs and regulations", "A national park with no economic activity", "A treaty between countries removing all trade barriers globally"], correct_answer: 1 },
    { question: "What is deindustrialisation?", options: ["The process of building new factories", "The decline of manufacturing industries in a region, often replaced by service-sector growth", "Converting agricultural land to industry", "Privatisation of state-owned companies"], correct_answer: 1 },
    { question: "What does the term 'globalisation' mean in economic geography?", options: ["Countries becoming more independent economically", "The increasing interconnectedness of world economies through trade, investment, and technology", "The dominance of one country's economy over others", "Expansion of national borders"], correct_answer: 1 },
    { question: "What is a transnational corporation (TNC)?", options: ["A government agency operating in multiple countries", "A company that operates in multiple countries with headquarters typically in a developed nation", "An international trade agreement body", "A regional economic bloc like the EU"], correct_answer: 1 },
    { question: "What are tertiary industries?", options: ["Industries extracting raw materials", "Industries that process raw materials into manufactured goods", "Service industries such as retail, healthcare, and education", "The top three industries in a country by employment"], correct_answer: 2 },
    { question: "What is a trade deficit?", options: ["When a country exports more than it imports", "When a country imports more than it exports", "When a country's currency is devalued", "When a government spends more than it earns"], correct_answer: 1 },
    { question: "What is the significance of the BRICS countries in economic geography?", options: ["They are all located in the Southern Hemisphere", "They are major emerging economies (Brazil, Russia, India, China, South Africa) with significant global economic influence", "They are the five largest oil exporters", "They are the founding members of the WTO"], correct_answer: 1 },
    { question: "What is microfinance?", options: ["Government funding for large infrastructure", "Small loans provided to low-income individuals or groups to support entrepreneurship", "International aid for disaster relief", "Central bank monetary policy tools"], correct_answer: 1 },
    { question: "What is resource curse?", options: ["The negative economic and political outcomes sometimes experienced by resource-rich countries", "Environmental damage from mining", "The depletion of natural resources over time", "A decline in agricultural output"], correct_answer: 0 },
    { question: "What is sustainable development?", options: ["Development that meets current needs without compromising the ability of future generations to meet theirs", "Rapid economic growth using all available resources", "Development exclusively in urban areas", "Preservation of the environment with no economic development"], correct_answer: 0 },
    { question: "What are quaternary industries?", options: ["The fourth-largest industries by revenue", "Knowledge-based industries including IT, research, education, and financial planning", "Agriculture and fishing", "All service industries combined"], correct_answer: 1 },
    { question: "What is an export processing zone (EPZ)?", options: ["A customs inspection area at a national border", "A designated zone where goods are manufactured primarily for export, often with tax incentives", "A farming region that exports food", "A coastal fishing zone managed by the government"], correct_answer: 1 },
    { question: "What does the term 'economic multiplier effect' describe?", options: ["The increase in profit when a company expands", "How an initial injection of spending generates additional rounds of income and employment in the local economy", "The compound interest on government bonds", "The benefit of economies of scale in manufacturing"], correct_answer: 1 },
    { question: "What is offshoring?", options: ["Moving a company's headquarters abroad for tax purposes only", "Relocating business processes or production to another country, typically to reduce costs", "Investing in offshore oil fields", "Trading commodities on international markets"], correct_answer: 1 },
  ],
  7: [
    { question: "What is the greenhouse effect?", options: ["Ozone depletion over polar regions", "The process by which atmospheric gases trap heat from the Sun, warming Earth's surface", "Acid rain damaging forests", "Urban heat islands warming cities"], correct_answer: 1 },
    { question: "Which greenhouse gas is produced in the largest quantity by human activity?", options: ["Methane (CH₄)", "Nitrous oxide (N₂O)", "Carbon dioxide (CO₂)", "Water vapour (H₂O)"], correct_answer: 2 },
    { question: "What is deforestation?", options: ["The replanting of trees in cleared areas", "The large-scale removal of forests, often for agriculture or timber", "The natural die-back of forests in winter", "Forest management through controlled burning"], correct_answer: 1 },
    { question: "What does the Paris Agreement aim to achieve?", options: ["Limit global temperature rise to well below 2 °C above pre-industrial levels", "Ban all fossil fuels by 2030", "Fund developing countries exclusively", "Establish a global carbon tax"], correct_answer: 0 },
    { question: "What is ocean acidification?", options: ["Warming of ocean surface waters", "Reduction in ocean pH as the ocean absorbs CO₂ from the atmosphere", "Increase in ocean salinity", "Pollution from industrial waste in coastal waters"], correct_answer: 1 },
    { question: "What is biodiversity loss?", options: ["The reduction in number and variety of species in an ecosystem", "An increase in invasive species", "The extinction of a single species", "Seasonal population changes in wildlife"], correct_answer: 0 },
    { question: "What is eutrophication?", options: ["Desertification of tropical forests", "Excessive plant and algal growth in water bodies due to nutrient runoff, depleting oxygen", "Saltwater intrusion into freshwater aquifers", "Acid rain damage to freshwater lakes"], correct_answer: 1 },
    { question: "What is the ozone layer and why is it important?", options: ["A layer of oxygen at ground level that prevents fires", "A layer of ozone in the stratosphere that absorbs harmful ultraviolet radiation from the Sun", "A cloud layer that reflects solar heat back into space", "A layer of smog over industrial cities"], correct_answer: 1 },
    { question: "What is desertification?", options: ["The natural formation of new deserts over geological time", "The degradation of land in arid and semi-arid areas, often caused by human activities and climate change", "Flooding of coastal deserts", "The cooling and drying of tropical forests"], correct_answer: 1 },
    { question: "What does the term 'carbon footprint' mean?", options: ["The area of land needed to absorb CO₂ emissions", "The total amount of greenhouse gases emitted directly or indirectly by an individual, product, or organisation", "The carbon stored in forests and soils", "The physical damage caused by coal mining"], correct_answer: 1 },
    { question: "What is renewable energy?", options: ["Energy derived from fossil fuels that can be reused", "Energy from naturally replenishing sources such as solar, wind, and hydropower", "Nuclear energy from uranium", "Energy stored in batteries"], correct_answer: 1 },
    { question: "What is the significance of the Amazon rainforest for global climate?", options: ["It has no significant effect on global climate", "It acts as a massive carbon sink and drives atmospheric circulation patterns", "It is the primary source of the world's freshwater supply", "It regulates oceanic thermohaline circulation"], correct_answer: 1 },
    { question: "What is acid rain?", options: ["Rain that is too acidic to support plant life naturally", "Precipitation made acidic by atmospheric pollution, particularly from sulphur dioxide and nitrogen oxides", "Heavy rain in industrial regions", "Rain that dissolves limestone in karst landscapes"], correct_answer: 1 },
    { question: "What is the albedo feedback loop in climate change?", options: ["Warming causes less ice, reducing reflectivity, causing more warming", "Ice formation reflects more sunlight, cooling the planet", "Ocean warming increases precipitation", "Forests release carbon when temperatures rise"], correct_answer: 0 },
    { question: "What is circular economy?", options: ["A global trade loop connecting all countries", "An economic system aimed at eliminating waste through reuse, repair, and recycling", "A financial model based on compound interest", "An agricultural rotation system"], correct_answer: 1 },
    { question: "What are the main threats to coral reefs?", options: ["Deep-sea earthquakes and tsunamis", "Ocean warming, acidification, and pollution", "Overfishing of non-reef species", "Tidal changes and lunar cycles"], correct_answer: 1 },
    { question: "What is sustainability?", options: ["Economic growth at any cost", "Meeting the needs of the present without compromising the ability of future generations to meet their own needs", "Preservation of all natural areas from human use", "Reducing global population"], correct_answer: 1 },
    { question: "What is the role of wetlands in the environment?", options: ["They are wastelands with no ecological value", "They filter water, store carbon, reduce flooding, and provide critical wildlife habitat", "They are responsible for methane emissions only", "They are only significant in tropical regions"], correct_answer: 1 },
    { question: "What does COP stand for in climate negotiations?", options: ["Committee on Pollution", "Conference of the Parties — the annual UN climate change summit", "Carbon Output Protocol", "Council on Pollution"], correct_answer: 1 },
    { question: "What is the main driver of current global biodiversity loss?", options: ["Natural climate cycles", "Habitat destruction and land-use change driven by human activity", "Asteroid impacts", "Polar ice expansion"], correct_answer: 1 },
  ],
  8: [
    { question: "What is geopolitics?", options: ["The geography of populated areas", "The study of how geographic factors influence politics and international relations", "The management of national parks", "Economic planning for developing nations"], correct_answer: 1 },
    { question: "What is an Exclusive Economic Zone (EEZ)?", options: ["A land area reserved for economic development near borders", "A maritime zone extending 200 nautical miles from a state's coastline within which it has rights to natural resources", "A free trade area established by international treaty", "A region designated for international shipping lanes"], correct_answer: 1 },
    { question: "What is a buffer state?", options: ["A country with a large military", "A small neutral country situated between two larger rival powers", "A country that stores international grain reserves", "A nation with no external alliances"], correct_answer: 1 },
    { question: "What is the United Nations Security Council?", options: ["The main forum for international trade disputes", "The body of the UN responsible for maintaining international peace and security, with five permanent members", "An international court for human rights", "The economic development arm of the UN"], correct_answer: 1 },
    { question: "What is the Heartland Theory?", options: ["A theory that coastal nations dominate world power", "Mackinder's theory that the nation controlling the Eurasian heartland controls the world", "A concept in urban geography about city centres", "The idea that island nations are safest from conflict"], correct_answer: 1 },
    { question: "What does NATO stand for?", options: ["National Atlantic Trade Organisation", "North Atlantic Treaty Organisation — a military alliance among Western nations", "North American Transport Office", "Nordic and Atlantic Ocean authority"], correct_answer: 1 },
    { question: "What is a failed state?", options: ["A state that lost a war", "A state that can no longer perform basic functions of governance and security for its citizens", "A state with high debt levels", "A state without a democratic government"], correct_answer: 1 },
    { question: "What is the Responsibility to Protect (R2P) doctrine?", options: ["A country's right to defend its borders", "The international norm that states have a responsibility to protect their populations from genocide and mass atrocities, and the international community can intervene if they fail", "A trade agreement protecting intellectual property", "A UN resolution on refugee rights"], correct_answer: 1 },
    { question: "What is a supranational organisation?", options: ["An organisation run by the world's largest nation", "An organisation that operates above national governments, with member states ceding some sovereignty", "A military alliance between neighbouring states", "A charity operating across multiple countries"], correct_answer: 1 },
    { question: "What is the significance of the Strait of Hormuz?", options: ["It is the world's busiest container shipping lane", "It is a critical chokepoint through which much of the world's oil supply passes", "It connects the Mediterranean to the Red Sea", "It is a major freshwater shipping route"], correct_answer: 1 },
    { question: "What is soft power?", options: ["Military force used in peacetime", "The ability to influence other countries through culture, values, and diplomacy rather than coercion", "Economic sanctions imposed on rival states", "Intelligence operations conducted abroad"], correct_answer: 1 },
    { question: "What is a landlocked country?", options: ["A country with limited access to the sea due to shallow coastline", "A country surrounded entirely by land with no access to the ocean", "A country with a large interior desert", "A country that does not permit foreign ships in its waters"], correct_answer: 1 },
    { question: "What is the purpose of the International Court of Justice (ICJ)?", options: ["Prosecuting individuals for war crimes", "Settling legal disputes between states and giving advisory opinions on international law", "Managing global trade rules", "Overseeing UN peacekeeping missions"], correct_answer: 1 },
    { question: "What is irredentism?", options: ["A political policy of isolationism", "A political movement to incorporate into one state territory historically or ethnically related but currently under foreign control", "The international recognition of newly independent states", "A form of government that combines federal and unitary systems"], correct_answer: 1 },
    { question: "What is a non-state actor in international relations?", options: ["A stateless nation", "An entity such as an NGO, multinational corporation, or terrorist group that plays a role in international relations but is not a government", "A neutral country in an armed conflict", "An international media organisation"], correct_answer: 1 },
    { question: "What is the Antarctic Treaty?", options: ["A treaty dividing Antarctic resources among polar nations", "An international agreement preserving Antarctica for peaceful scientific research and prohibiting military activity there", "A treaty managing fishing rights in the Southern Ocean", "An agreement on climate change targets for polar regions"], correct_answer: 1 },
    { question: "What is a sphere of influence?", options: ["The area a country can reach with its military", "An area where a great power exerts significant political, economic, or cultural dominance over weaker states", "The territory within a country's EEZ", "A country's cultural exports"], correct_answer: 1 },
    { question: "What does the UNCLOS treaty govern?", options: ["International aviation rights", "The rights and responsibilities of nations with respect to their use of the world's oceans", "Global nuclear non-proliferation", "Trade in endangered species"], correct_answer: 1 },
    { question: "What is balkanisation?", options: ["Integration of small states into larger unions", "The fragmentation of a region or state into smaller, often hostile units", "Border disputes in the Balkans specifically", "Economic decline in Eastern Europe"], correct_answer: 1 },
    { question: "What is the primary purpose of economic sanctions?", options: ["To provide financial aid to struggling economies", "To pressure a country to change its behaviour by restricting trade or financial transactions", "To create free trade between allies", "To punish individual citizens of a state"], correct_answer: 1 },
  ],
  9: [
    { question: "What does GIS stand for?", options: ["Global Imaging Satellite", "Geographic Information Systems", "Geological Investigation Survey", "Geo-Indexed Spatial data"], correct_answer: 1 },
    { question: "What is the difference between vector and raster data in GIS?", options: ["Vector uses pixels; raster uses points and lines", "Vector represents features as points, lines, and polygons; raster represents data as a grid of cells (pixels)", "They are different file formats for the same data type", "Vector is used for images; raster for measurements"], correct_answer: 1 },
    { question: "What is georeferencing?", options: ["Naming geographic features on a map", "Assigning real-world coordinate locations to data or an image so it aligns correctly on a map", "Creating a 3D model from satellite images", "Converting analog maps to digital format only"], correct_answer: 1 },
    { question: "What is remote sensing?", options: ["Using a drone within visual range to survey land", "Acquiring information about an object or area from a distance, typically using satellites or aircraft", "Internet-based mapping services", "Automated street-level photography"], correct_answer: 1 },
    { question: "What is GPS?", options: ["A digital photography system", "Global Positioning System — a satellite-based navigation system providing location and time information", "A geographic projection standard", "A global property survey system"], correct_answer: 1 },
    { question: "What is spatial analysis in GIS?", options: ["Creating visually attractive maps", "Examining the locations and relationships of geographic features to understand patterns and processes", "Digitising paper maps into computer files", "Collecting field survey data"], correct_answer: 1 },
    { question: "What is a digital elevation model (DEM)?", options: ["A 2D map of land ownership boundaries", "A 3D representation of terrain surface elevations", "A model predicting urban growth", "A satellite image of a city"], correct_answer: 1 },
    { question: "What is LiDAR?", options: ["A type of satellite image sensor", "Light Detection and Ranging — a remote sensing method using laser pulses to measure distances and create precise 3D maps", "A land use categorisation system", "A geographic database format"], correct_answer: 1 },
    { question: "What is NDVI used for?", options: ["Measuring ocean depth from satellites", "Normalised Difference Vegetation Index — assessing vegetation health and cover using satellite imagery", "Calculating distances between cities", "Mapping underground water sources"], correct_answer: 1 },
    { question: "What is map projection?", options: ["The process of printing maps", "A systematic method of representing the curved surface of Earth on a flat surface", "The scale at which a map is drawn", "The legend or key on a map"], correct_answer: 1 },
    { question: "What is the Mercator projection known for?", options: ["Accurately representing area at all latitudes", "Preserving shapes (conformal) but distorting area, particularly enlarging polar regions", "Being the most accurate projection for large-scale maps", "Showing continents without any distortion"], correct_answer: 1 },
    { question: "What is topology in GIS?", options: ["The physical height of terrain", "The rules governing spatial relationships between features, such as adjacency and connectivity", "A type of 3D visualisation", "The colour scheme applied to a map"], correct_answer: 1 },
    { question: "What is attribute data in GIS?", options: ["The physical location of a feature", "Non-spatial information linked to a geographic feature, such as population or land use type", "The coordinate system used", "The resolution of satellite imagery"], correct_answer: 1 },
    { question: "What is open-source GIS?", options: ["GIS data freely available from governments", "GIS software with freely available source code, such as QGIS", "Mapping data that can be edited by anyone", "Satellite imagery available without a licence"], correct_answer: 1 },
    { question: "What is a buffer zone in GIS?", options: ["A no-data area around the edge of a map", "An area of defined width created around a geographic feature to identify proximity relationships", "A temporary data storage area", "A boundary between two geographic datasets"], correct_answer: 1 },
    { question: "What is WebGIS?", options: ["Internet security for mapping systems", "GIS delivered over the internet through web browsers, enabling interactive online mapping", "A global wireless GPS network", "An online geography dictionary"], correct_answer: 1 },
    { question: "What is a coordinate reference system (CRS)?", options: ["A system for naming places on a map", "A framework defining how geographic coordinates are related to real locations on Earth", "The printing standards for maps", "A method of compressing GIS files"], correct_answer: 1 },
    { question: "What is crowdsourced geographic data?", options: ["Satellite data purchased from commercial providers", "Geographic data contributed by a large number of individuals, such as OpenStreetMap", "Data collected by government field surveyors", "Weather data from automated monitoring stations"], correct_answer: 1 },
    { question: "What is geostatistics?", options: ["The collection of national geographic statistics", "Statistical methods that account for spatial relationships and variation across geographic space", "Statistics about the size of countries and populations", "The study of geological formations using mathematical models"], correct_answer: 1 },
    { question: "What is the primary advantage of GIS over traditional paper maps?", options: ["GIS maps are always more accurate than paper maps", "GIS enables layers of data to be combined, analysed, and updated dynamically to answer spatial questions", "GIS maps are cheaper to produce", "GIS eliminates the need for field surveys"], correct_answer: 1 },
  ],
  10: [
    { question: "What is remote sensing in advanced geospatial analysis?", options: ["Face-to-face interviews with remote communities", "Acquiring data about Earth's surface using sensors on satellites or aircraft without physical contact", "GPS tracking of field researchers", "Phone surveys conducted at a distance"], correct_answer: 1 },
    { question: "What is SAR (Synthetic Aperture Radar)?", options: ["A type of high-resolution optical camera", "A remote sensing technique using radar waves that can penetrate clouds and work day or night", "A seismic monitoring system", "A sonar system for ocean mapping"], correct_answer: 1 },
    { question: "What is spatial autocorrelation?", options: ["A random distribution of values across a map", "The tendency for nearby locations to have more similar attribute values than distant locations (Tobler's First Law)", "A correlation between two unrelated datasets", "The accuracy of GPS coordinates"], correct_answer: 1 },
    { question: "What is Tobler's First Law of Geography?", options: ["All places on Earth are equally connected", "Everything is related to everything else, but near things are more related than distant things", "Geography determines human destiny", "Maps always simplify reality"], correct_answer: 1 },
    { question: "What is the Modifiable Areal Unit Problem (MAUP)?", options: ["Difficulty in measuring ocean areas precisely", "The statistical bias that occurs when the same data produces different results depending on how geographic areas are defined or scaled", "Problems caused by inaccurate GPS positioning", "Errors in converting between coordinate systems"], correct_answer: 1 },
    { question: "What is kriging in spatial analysis?", options: ["A method of drawing contour lines by hand", "A geostatistical interpolation technique that estimates values at unsampled locations using spatial autocorrelation", "A terrain analysis tool in GIS", "A satellite image classification method"], correct_answer: 1 },
    { question: "What is InSAR?", options: ["An infrared satellite imaging system", "Interferometric Synthetic Aperture Radar — used to measure ground deformation and displacement with millimetre precision", "A type of radar weather mapping", "Integrated Satellite and Radio navigation system"], correct_answer: 1 },
    { question: "What is machine learning used for in modern geospatial analysis?", options: ["Only for GPS accuracy improvements", "Classifying land cover, detecting changes in satellite imagery, and predicting spatial patterns from large datasets", "Creating paper map reproductions", "Measuring tidal patterns"], correct_answer: 1 },
    { question: "What is agent-based modelling in geography?", options: ["Modelling done by government agents", "A simulation method where individual autonomous agents interact within a spatial environment to produce emergent geographic patterns", "A type of survey conducted by field agents", "AI-based cartographic design"], correct_answer: 1 },
    { question: "What is volunteered geographic information (VGI)?", options: ["Paid surveys of geographic preferences", "Geographic data created and shared by members of the public, such as GPS tracks and map edits on OpenStreetMap", "Government-mandated geographic reporting", "Data contributed by professional surveyors voluntarily"], correct_answer: 1 },
    { question: "What is multi-spectral imaging in remote sensing?", options: ["Combining multiple maps at different scales", "Capturing image data at multiple wavelength ranges beyond the visible spectrum, enabling analysis of vegetation, water, and minerals", "A 3D modelling technique", "Simultaneous imaging from multiple satellites"], correct_answer: 1 },
    { question: "What is urban morphology?", options: ["The study of urban air quality", "The study of the physical form, structure, and spatial organisation of urban settlements", "Analysis of urban traffic patterns", "The demographic composition of city populations"], correct_answer: 1 },
    { question: "What is a gravity model in geography?", options: ["A model for predicting mountain erosion", "A model predicting interaction between places based on their size and distance — larger and closer places interact more", "A seismic risk assessment tool", "A hydrology model for river flow"], correct_answer: 1 },
    { question: "What is point pattern analysis?", options: ["Counting the number of dots on a map", "Statistical methods for analysing the spatial distribution of point features to determine if they are clustered, dispersed, or random", "A technique for identifying river sources", "Measuring population density at specific locations"], correct_answer: 1 },
    { question: "What is land surface temperature (LST) measured by?", options: ["Ground-based weather stations only", "Thermal infrared sensors on satellites detecting the thermal emission from Earth's surface", "Rain gauges and barometers", "Seismographs measuring heat-related ground movement"], correct_answer: 1 },
    { question: "What is geodemographics?", options: ["The geography of very old populations", "The classification of residential areas based on the demographic and social characteristics of their inhabitants", "Census data collection methods", "The study of population changes in deserts"], correct_answer: 1 },
    { question: "What is hydrological modelling?", options: ["Creating physical scale models of rivers", "Mathematical simulation of water movement through watersheds, rivers, and groundwater systems", "Historical analysis of flood records", "Mapping of ocean tides"], correct_answer: 1 },
    { question: "What is the significance of big data in modern geography?", options: ["Big data has little relevance to geography", "Large datasets from GPS, social media, and sensors enable new spatial insights about human behaviour and environmental change", "Big data only applies to national statistics", "It replaces all traditional geographic methods"], correct_answer: 1 },
    { question: "What is digital twin technology in urban geography?", options: ["Copying maps digitally", "A virtual replica of a physical city updated in real time, enabling simulation of changes and planning decisions", "Building identical cities in different countries", "A method for duplicating satellite imagery"], correct_answer: 1 },
    { question: "What is participatory GIS (PGIS)?", options: ["GIS software that requires no training", "An approach integrating local and indigenous knowledge into GIS mapping through community participation", "A commercial GIS product for governments", "Automated mapping using crowdsourced data alone"], correct_answer: 1 },
  ],
};

function generateFinalTestQuestions(moduleId) {
  const id = parseInt(moduleId, 10);
  if (!FINAL_TEST_QUESTIONS[id]) {
    console.warn(`No final test questions found for module ${moduleId}, falling back to module 1`);
  }
  return FINAL_TEST_QUESTIONS[id] || FINAL_TEST_QUESTIONS[1];
}

export default function ModuleFinalTestPage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [noBadges, setNoBadges] = useState(false);

  // Load noBadges flag from localStorage on mount
  useEffect(() => {
    try {
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true");
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleComplete = async (testPassed, score) => {
    setPassed(testPassed);
    if (user) {
      try {
        await fetch("/api/module-final-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, appKey: APP_KEY, score, userId: user.id }),
        });
      } catch (err) {
        console.error("Error saving final test result:", err);
      }
    }
  };

  const goToNextModule = () => {
    const nextModuleId = parseInt(moduleId) + 1;
    if (nextModuleId <= 10) {
      router.push(`/modules/${nextModuleId}/lesson/1`);
    } else {
      router.push("/curriculum");
    }
  };

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextModule();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Module {moduleId} Final Test – {APP_DISPLAY}
        </title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Skip-mode banner */}
          {noBadges && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
            >
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but
              you won&apos;t earn badges for this course.
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push(`/modules/${moduleId}/lesson/1`)}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Module
            </button>
          </div>

          <div className="card mb-8">
            <h1 className="text-3xl font-bold mb-2">Module {moduleId} – Final Test</h1>
            <p className="text-gray-600">
              Complete all 20 questions. You need to score 14/20 or higher to pass and unlock the
              next level.
            </p>
          </div>

          <ModuleFinalTestComponent
            questions={generateFinalTestQuestions(moduleId)}
            moduleId={moduleId}
            appKey={APP_KEY}
            onComplete={handleComplete}
          />

          {/* Skip quiz button — shown below test when not yet passed */}
          {!passed && !noBadges && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSkipDialog(true)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Skip quiz and continue
              </button>
            </div>
          )}

          {/* Skip mode: Continue without taking the test */}
          {noBadges && !passed && (
            <div className="card bg-yellow-50 border-2 border-yellow-400 mt-6">
              <p className="text-gray-700 mb-4">Continue to the next module.</p>
              <button onClick={goToNextModule} className="btn-primary">
                Continue to Next Module
              </button>
            </div>
          )}

          {passed && (
            <div className="card bg-green-50 border-2 border-green-500 mt-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Module Complete – Next Level Unlocked!
              </h3>
              <button onClick={() => router.push("/curriculum")} className="btn-primary">
                Continue to Curriculum
              </button>
            </div>
          )}

          {/* Skip confirmation dialog */}
          {showSkipDialog && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">
                  Skip quizzes?
                </h2>
                <p className="text-gray-700 mb-6">
                  You can continue to the next module, but you won&apos;t earn badges for this course. <strong>This cannot be undone.</strong>
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmSkip} className="btn-primary">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
