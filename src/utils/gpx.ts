export type Coordinate = [number, number];

export function calculateDistance(points: Coordinate[]): number {
  const earthRadiusKm = 6371;
  let total = 0;

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  for (let index = 1; index < points.length; index++) {
    const [lat1, lon1] = points[index - 1];
    const [lat2, lon2] = points[index];

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    total += earthRadiusKm * c;
  }

  return total;
}
