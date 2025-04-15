// src/utils/locationHelpers.js
import { countries } from '../constants/countries';

/**
 * Attempts to match a location string to a country code.
 * @param {string} location - e.g. "Ciudad Obregón, Sonora, Mexico"
 * @returns {{ name: string, code: string }|null} - e.g. "Mexico, MX"
 */
export function getCountryFromLocation(location) {
  if (!location) return null;

  const locationLower = location.toLowerCase();

  return countries.find(country =>
    locationLower.includes(country.name.toLowerCase())
  ) || null;
}

