import { useEffect, useState } from "react";

/* Explicit location fallback */
const getExplicitLocation = (tags = {}) =>
  tags["addr:city"] ||
  tags["addr:suburb"] ||
  tags["addr:district"] ||
  tags["addr:state"] ||
  "Nearby area";

export default function FindHospitals() {
  const [query, setQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [coords, setCoords] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Fetch hospitals by coordinates */
  const fetchHospitals = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");

      const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${lat},${lon});
          node["amenity"="clinic"](around:5000,${lat},${lon});
        );
        out body;
      `;

      const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        { method: "POST", body: overpassQuery }
      );

      const data = await res.json();
      setHospitals(data.elements);
    } catch {
      setError("Failed to fetch hospitals.");
    } finally {
      setLoading(false);
    }
  };

  /* 1️⃣ On page load → get user location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });

        /* Reverse geocode user location */
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setLocationLabel(data.display_name);

        fetchHospitals(latitude, longitude);
      },
      () => {
        setError("Location access denied. Please search manually.");
        setLoading(false);
      }
    );
  }, []);

  /* 2️⃣ Search location manually */
  const handleSearch = async () => {
    if (!query) return;

    try {
      setLoading(true);
      setHospitals([]);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();

      if (!data.length) {
        setError("Location not found.");
        setLoading(false);
        return;
      }

      const { lat, lon, display_name } = data[0];
      setCoords({ lat, lon });
      setLocationLabel(display_name);

      fetchHospitals(lat, lon);
    } catch {
      setError("Search failed.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Hospitals
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, area, or location"
            className="flex-1 px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Location Label */}
        {locationLabel && (
          <p className="text-gray-600 mb-4">
            Showing hospitals near{" "}
            <span className="font-semibold">{locationLabel}</span>
          </p>
        )}

        {/* States */}
        {loading && <p className="text-gray-600">Loading hospitals...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Hospital Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((h) => (
            <div
              key={h.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {h.tags?.name || "Unnamed Hospital"}
              </h2>

              <p className="text-gray-600 mt-2">
                {getExplicitLocation(h.tags)}
              </p>

              <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
                {h.tags?.amenity}
              </span>

              <div className="mt-4 flex justify-between">
                <a
                  href={`https://www.google.com/maps?q=${h.lat},${h.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                Directions
                </a>

                {h.tags?.phone && (
                  <a
                    href={`tel:${h.tags.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && hospitals.length === 0 && !error && (
          <p className="text-gray-600 mt-6">
            No hospitals found nearby.
          </p>
        )}
      </div>
    </section>
  );
}
