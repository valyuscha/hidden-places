import { LocationValidationResult } from './types';

export const validateLocation = async (
  lat: number,
  lon: number,
  expectedCountry?: string,
  expectedCity?: string
): Promise<LocationValidationResult> => {
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return { valid: false, error: 'Invalid latitude or longitude' };
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();

    if (!data.address) {
      return { valid: false, error: 'No address found for these coordinates' };
    }

    const actualCountry = data.address.country;
    const actualCity =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet ||
      data.address.municipality ||
      data.address.suburb || '';

    const corrected: LocationValidationResult["corrected"] = {};
    let countryMismatch = false;
    let cityMismatch = false;

    if (
      expectedCountry &&
      actualCountry &&
      expectedCountry.trim().toLowerCase() !== actualCountry.trim().toLowerCase()
    ) {
      corrected.country = actualCountry;
      countryMismatch = true;
    }

    if (
      expectedCity &&
      actualCity &&
      expectedCity.trim().toLowerCase() !== actualCity.trim().toLowerCase()
    ) {
      corrected.city = actualCity;
      cityMismatch = true;
    }

    if (countryMismatch || cityMismatch) {
      return { valid: true, corrected };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'No address found for these coordinates' };
  }
};
