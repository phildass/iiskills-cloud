/**
 * Geography Lesson Media Map
 *
 * Maps module IDs to relevant map images and photos served from Wikimedia Commons
 * (public-domain / CC-licensed URLs that require no API key).
 *
 * Structure:
 *   [moduleId]: {
 *     mapUrl:    string  – static map relevant to the module topic
 *     mapAlt:    string  – accessible alt text for the map
 *     photos:    [{ url, alt, caption }]  – 1-3 illustrative photos
 *   }
 *
 * To add more visuals: extend the relevant module entry or add a new one.
 */

const geographyMedia = {
  // Module 1 – Physical Geography
  1: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png',
    mapAlt: 'Blank political world map showing all continents and countries',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/480px-The_Earth_seen_from_Apollo_17.jpg',
        alt: 'The Blue Marble – Earth photographed from Apollo 17',
        caption: 'Earth from space (Apollo 17)',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/480px-24701-nature-natural-beauty.jpg',
        alt: 'Mountain landscape with river valley',
        caption: 'Landforms shaped by erosion and tectonic forces',
      },
    ],
  },

  // Module 2 – Indian Geography
  2: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/India_relief_location_map.jpg/800px-India_relief_location_map.jpg',
    mapAlt: 'Relief map of India showing major physical features',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kangchenjunga_from_Tiger_Hill.jpg/480px-Kangchenjunga_from_Tiger_Hill.jpg',
        alt: 'Kangchenjunga peak in the Himalayas viewed from Tiger Hill',
        caption: 'The Himalayas – northern boundary of India',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ganges_River_at_Varanasi.jpg/480px-Ganges_River_at_Varanasi.jpg',
        alt: 'The Ganges River at Varanasi, Uttar Pradesh',
        caption: 'The Gangetic Plain – most densely populated region of India',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/India_map_blank.svg/640px-India_map_blank.svg.png',
        alt: 'Blank outline map of India',
        caption: 'India: 28 states and 8 Union Territories',
      },
    ],
  },

  // Module 3 – World Geography
  3: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Whole_world_-_land_and_oceans.jpg/1280px-Whole_world_-_land_and_oceans.jpg',
    mapAlt: 'World map showing continents and oceans',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mount_Everest_as_seen_from_Drukair2_PLW_edit.jpg/480px-Mount_Everest_as_seen_from_Drukair2_PLW_edit.jpg',
        alt: 'Mount Everest – highest peak on Earth',
        caption: 'Mount Everest (8,848 m) in the Himalayas',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Rotating_earth_%28large%29.gif/240px-Rotating_earth_%28large%29.gif',
        alt: 'Animated rotating globe',
        caption: 'Our rotating planet',
      },
    ],
  },

  // Module 4 – Economic Geography
  4: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/World_trade_map_2011.png/1280px-World_trade_map_2011.png',
    mapAlt: 'World trade flow map',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/OPEC_share_of_world_oil_reserves_2018.png/480px-OPEC_share_of_world_oil_reserves_2018.png',
        alt: 'Pie chart of OPEC share of world oil reserves',
        caption: 'Global oil reserves distribution',
      },
    ],
  },

  // Module 5 – Population Geography
  5: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/World_population_density_map.PNG/1280px-World_population_density_map.PNG',
    mapAlt: 'World population density map',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Cities_of_the_world.jpg/480px-Cities_of_the_world.jpg',
        alt: 'Aerial view of a dense urban city',
        caption: 'Rapid urbanisation is reshaping human geography',
      },
    ],
  },

  // Module 6 – Environmental Geography
  6: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/The_Amazon_basin.jpg/1280px-The_Amazon_basin.jpg',
    mapAlt: 'The Amazon River basin in South America',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Amazon_forest.jpg/480px-Amazon_forest.jpg',
        alt: 'Amazon rainforest canopy',
        caption: 'The Amazon: home to 10% of all species on Earth',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Climate_change_attribution.png/480px-Climate_change_attribution.png',
        alt: 'Chart showing human vs natural causes of climate change',
        caption: 'Human activity is the dominant driver of recent warming',
      },
    ],
  },

  // Module 7 – Geopolitics
  7: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/United_Nations_Members.svg/1280px-United_Nations_Members.svg.png',
    mapAlt: 'World map showing UN member states',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UN_General_Assembly.jpg/480px-UN_General_Assembly.jpg',
        alt: 'United Nations General Assembly hall in New York',
        caption: 'United Nations General Assembly',
      },
    ],
  },

  // Module 8 – Urban Geography
  8: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Earthlights_dmsp.jpg/1280px-Earthlights_dmsp.jpg',
    mapAlt: 'Earth at night from space showing city lights',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/New_York_City_at_night_HDR_desat.jpg/480px-New_York_City_at_night_HDR_desat.jpg',
        alt: 'New York City skyline at night',
        caption: 'World cities concentrate capital, culture and commerce',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Dharavi_Mumbai_India.jpg/480px-Dharavi_Mumbai_India.jpg',
        alt: 'Aerial view of Dharavi informal settlement in Mumbai',
        caption: 'Informal settlements house over 1 billion people globally',
      },
    ],
  },

  // Module 9 – GIS & Mapping
  9: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Topographic_map_example.png/1280px-Topographic_map_example.png',
    mapAlt: 'Topographic map showing contour lines and elevation',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Cartography_illustration.jpg/480px-Cartography_illustration.jpg',
        alt: 'Cartographer working on a detailed map',
        caption: 'Cartography: the science and art of map-making',
      },
    ],
  },

  // Module 10 – Exam Preparation
  10: {
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png',
    mapAlt: 'World map for exam revision',
    photos: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/India_relief_location_map.jpg/480px-India_relief_location_map.jpg',
        alt: 'Relief map of India',
        caption: 'India relief map – a common exam reference',
      },
    ],
  },
};

/**
 * Returns media for a given module ID (integer or string).
 * Falls back to module 1 defaults if the module has no dedicated entry.
 */
export function getModuleMedia(moduleId) {
  const id = parseInt(moduleId, 10);
  return geographyMedia[id] || geographyMedia[1] || null;
}

export default geographyMedia;
