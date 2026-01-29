/**
 * Geographic data structures for location-based content
 */

/**
 * District information
 */
export interface District {
  id: string;
  name: string;
  code?: string;
}

/**
 * State information with districts
 */
export interface State {
  id: string;
  name: string;
  code?: string;
  districts: District[];
}

/**
 * Country information with states
 */
export interface Country {
  id: string;
  name: string;
  code?: string;
  states: State[];
}

/**
 * Complete geographic hierarchy
 */
export interface GeographicHierarchy {
  countries: Country[];
}

/**
 * Geographic breadcrumb for navigation
 */
export interface GeographicBreadcrumb {
  country?: string;
  state?: string;
  district?: string;
}

/**
 * Resolve a geographic path to a breadcrumb
 */
export function resolveGeographicPath(
  hierarchy: GeographicHierarchy,
  path: string
): GeographicBreadcrumb | null {
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length === 0) return null;
  
  const countryName = parts[0];
  const country = hierarchy.countries.find(c => 
    c.name.toLowerCase() === countryName.toLowerCase() || 
    c.id.toLowerCase() === countryName.toLowerCase()
  );
  
  if (!country) return null;
  
  const breadcrumb: GeographicBreadcrumb = {
    country: country.name
  };
  
  if (parts.length > 1) {
    const stateName = parts[1];
    const state = country.states.find(s => 
      s.name.toLowerCase() === stateName.toLowerCase() || 
      s.id.toLowerCase() === stateName.toLowerCase()
    );
    
    if (state) {
      breadcrumb.state = state.name;
      
      if (parts.length > 2) {
        const districtName = parts[2];
        const district = state.districts.find(d => 
          d.name.toLowerCase() === districtName.toLowerCase() || 
          d.id.toLowerCase() === districtName.toLowerCase()
        );
        
        if (district) {
          breadcrumb.district = district.name;
        }
      }
    }
  }
  
  return breadcrumb;
}

/**
 * Find all districts in a state
 */
export function getDistrictsInState(
  hierarchy: GeographicHierarchy,
  countryId: string,
  stateId: string
): District[] {
  const country = hierarchy.countries.find(c => c.id === countryId);
  if (!country) return [];
  
  const state = country.states.find(s => s.id === stateId);
  if (!state) return [];
  
  return state.districts;
}

/**
 * Find all states in a country
 */
export function getStatesInCountry(
  hierarchy: GeographicHierarchy,
  countryId: string
): State[] {
  const country = hierarchy.countries.find(c => c.id === countryId);
  return country ? country.states : [];
}
