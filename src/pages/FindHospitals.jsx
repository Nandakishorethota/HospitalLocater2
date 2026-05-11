import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/* Location Fallback */
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

  const [searchParams] = useSearchParams();

  /* Fetch Hospitals */
  const fetchHospitals = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");

      const radius = 5000;

      const overpassQuery = `
        [out:json][timeout:8];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="clinic"](around:${radius},${lat},${lon});
        );
        out body 15;
      `;

      const res = await fetch(
        "https://overpass.kumi.systems/api/interpreter",
        {
          method: "POST",
          body: overpassQuery,
        }
      );

      if (!res.ok) {
        throw new Error("Failed");
      }

      const data = await res.json();

      setHospitals(data.elements || []);

    } catch (err) {
      console.log(err);

      setError("Unable to fetch hospitals.");
    } finally {
      setLoading(false);
    }
  };

  /* Search Function */
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setHospitals([]);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`
      );

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();

      if (!data.length) {
        setError("Location not found.");
        setLoading(false);
        return;
      }

      const { lat, lon, display_name } = data[0];

      setCoords({ lat, lon });

      setLocationLabel(display_name);

      await fetchHospitals(lat, lon);

    } catch (err) {
      console.log(err);

      setError("Search failed.");
      setLoading(false);
    }
  };

  /* Auto Load Nearby Hospitals */
  useEffect(() => {
    const search = searchParams.get("search");

    if (search) {
      setQuery(search);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setCoords({
          lat: latitude,
          lon: longitude,
        });

        setLocationLabel("Nearby Hospitals");

        await fetchHospitals(latitude, longitude);
      },

      async () => {
        /* Default Hyderabad Location */
        const defaultLat = 17.385;
        const defaultLon = 78.4867;

        setLocationLabel("Hyderabad");

        await fetchHospitals(defaultLat, defaultLon);
      },

      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000,
      }
    );

  }, []);

  /* Auto Search Query */
  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  return (
    <section className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Hospitals
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
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

        {/* Location */}
        {locationLabel && (
          <p className="text-gray-600 mb-6">
            Showing hospitals near{" "}
            <span className="font-semibold">
              {locationLabel}
            </span>
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow animate-pulse"
              >

                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                <div className="h-4 bg-gray-200 rounded mt-4"></div>

                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>

                <div className="h-10 bg-gray-200 rounded mt-6"></div>

              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6">

            <p className="text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>

          </div>
        )}

        {/* Hospital Cards */}
        {!loading &&
          hospitals.length > 0 && (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {hospitals.map((h) => (

              <div
                key={h.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
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

                <div className="mt-5 flex justify-between items-center">

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
        )}

        {/* Empty State */}
        {!loading &&
          hospitals.length === 0 &&
          !error && (
            <p className="text-gray-600 mt-6">
              No hospitals found nearby.
            </p>
          )}

      </div>
    </section>
  );
}