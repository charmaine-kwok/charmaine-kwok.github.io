export type Coordinate = [number, number];

/**
 * Calculate the total distance of a sequence of coordinates
 * using the Haversine formula.
 *
 * This should always receive the original GPX points,
 * not simplified map points.
 */
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

/**
 * Calculate the perpendicular distance from a point
 * to a line segment.
 *
 * Coordinates are projected approximately into metres
 * before measuring the distance.
 */
function perpendicularDistance(
  point: Coordinate,
  lineStart: Coordinate,
  lineEnd: Coordinate
): number {
  const [lat, lon] = point;
  const [startLat, startLon] = lineStart;
  const [endLat, endLon] = lineEnd;

  /*
   * Approximate conversion from latitude/longitude
   * into local Cartesian metres.
   *
   * Longitude distance varies with latitude, so use
   * the average latitude of the segment.
   */
  const averageLat = ((startLat + endLat) / 2) * (Math.PI / 180);

  const metresPerDegreeLat = 111_320;
  const metresPerDegreeLon = 111_320 * Math.cos(averageLat);

  const pointX = (lon - startLon) * metresPerDegreeLon;
  const pointY = (lat - startLat) * metresPerDegreeLat;

  const endX = (endLon - startLon) * metresPerDegreeLon;
  const endY = (endLat - startLat) * metresPerDegreeLat;

  const segmentLengthSquared = endX * endX + endY * endY;

  if (segmentLengthSquared === 0) {
    return Math.sqrt(pointX * pointX + pointY * pointY);
  }

  /*
   * Project the point onto the line segment.
   *
   * Clamp t to [0, 1] so that we're measuring
   * distance to the segment rather than the
   * infinitely extended line.
   */
  const t = Math.max(
    0,
    Math.min(1, (pointX * endX + pointY * endY) / segmentLengthSquared)
  );

  const projectedX = t * endX;
  const projectedY = t * endY;

  const differenceX = pointX - projectedX;
  const differenceY = pointY - projectedY;

  return Math.sqrt(differenceX * differenceX + differenceY * differenceY);
}

/**
 * Simplify a route using the
 * Ramer-Douglas-Peucker algorithm.
 *
 * toleranceMetres controls how much detail is removed.
 *
 * A value around 10–20 metres is a good starting
 * point for a Camino overview map.
 */
export function simplifyCoordinates(
  points: Coordinate[],
  toleranceMetres = 15
): Coordinate[] {
  if (points.length <= 2) {
    return points;
  }

  let maximumDistance = 0;
  let maximumIndex = 0;

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  for (let index = 1; index < points.length - 1; index++) {
    const distance = perpendicularDistance(
      points[index],
      firstPoint,
      lastPoint
    );

    if (distance > maximumDistance) {
      maximumDistance = distance;
      maximumIndex = index;
    }
  }

  /*
   * If a point deviates sufficiently from the
   * start → end line, retain it and recursively
   * simplify both sides.
   */
  if (maximumDistance > toleranceMetres) {
    const firstSection = simplifyCoordinates(
      points.slice(0, maximumIndex + 1),
      toleranceMetres
    );

    const secondSection = simplifyCoordinates(
      points.slice(maximumIndex),
      toleranceMetres
    );

    /*
     * Both sections contain the splitting point,
     * so remove one copy.
     */
    return [...firstSection.slice(0, -1), ...secondSection];
  }

  /*
   * Everything between the start and end is
   * sufficiently close to a straight line.
   */
  return [firstPoint, lastPoint];
}
