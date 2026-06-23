/**
 * Requests the browser's current geolocation coordinates via the W3C Geolocation API.
 * @returns {Promise<{lat: number, lng: number}>} Current latitude and longitude.
 * @throws {Error} When geolocation is unavailable or permission is denied.
 */
export function requestCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is unavailable in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => reject(new Error("Location permission was denied.")),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  });
}

/**
 * Formats coordinates into a short human-readable neighborhood label.
 * @param {{lat: number, lng: number}} coords Coordinates to format.
 * @returns {string} Display label for the current area.
 */
export function labelForCoordinates(coords) {
  const lat = coords.lat.toFixed(3);
  const lng = coords.lng.toFixed(3);
  return `Current area (${lat}, ${lng})`;
}
