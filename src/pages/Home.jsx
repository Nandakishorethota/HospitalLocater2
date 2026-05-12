"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Ambulance,
  Search,
} from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState("Nearby Hospitals");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  /* DISTANCE CALCULATOR */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  /* FETCH HOSPITALS */
  const fetchHospitals = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");

      const radius = 7000;

      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="clinic"](around:${radius},${lat},${lon});
          way["amenity"="hospital"](around:${radius},${lat},${lon});
          relation["amenity"="hospital"](around:${radius},${lat},${lon});
        );
        out center 30;
      `;

      const servers = [
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://z.overpass-api.de/api/interpreter",
      ];

      let success = false;

      for (const server of servers) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12000);

          const res = await fetch(server, {
            method: "POST",
            body: overpassQuery,
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!res.ok) continue;

          const data = await res.json();

          if (data.elements?.length > 0) {
            setHospitals(data.elements);
            success = true;
            break;
          }
        } catch (err) {
          console.log("Server failed:", server);
          continue;
        }
      }

      if (!success) {
        throw new Error("All servers failed or returned no results");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load hospitals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* AUTO FETCH LOCATION */
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation({ lat: latitude, lon: longitude });
        setLocationLabel("Nearby Hospitals");
        await fetchHospitals(latitude, longitude);
      },
      () => {
        setError("Location permission denied.");
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  /* SEARCH LOCATION */
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        { headers: { "Accept-Language": "en" } }
      );

      const data = await res.json();

      if (!data.length) {
        setError("Location not found.");
        setLoading(false);
        return;
      }

      const { lat, lon, display_name } = data[0];
      setLocationLabel(display_name);
      await fetchHospitals(lat, lon);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              <Ambulance size={16} />
              Emergency Healthcare Support
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900">
              Find Nearby Hospitals
              <span className="block text-blue-600">Fast & Smart</span>
            </h1>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Discover nearby hospitals, emergency centers, and clinics with
              real-time location support, quick directions, and emergency
              assistance.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Search city or location"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg"
              >
                Search
              </button>
            </div>

            {/* LOCATION LABEL */}
            <div className="mt-6 flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <p>
                Showing hospitals near{" "}
                <span className="font-semibold text-gray-900">
                  {locationLabel}
                </span>
              </p>
            </div>

            {/* STATS */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow">
                <h2 className="text-3xl font-bold text-blue-600">
                  {hospitals.length}
                </h2>
                <p className="text-gray-600 mt-1">Hospitals</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow">
                <h2 className="text-3xl font-bold text-green-600">24/7</h2>
                <p className="text-gray-600 mt-1">Emergency</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow">
                <h2 className="text-3xl font-bold text-red-500">SOS</h2>
                <p className="text-gray-600 mt-1">Support</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800"
              alt="Hospital"
              className="rounded-3xl shadow-2xl h-[550px] w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-white p-5 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-semibold text-gray-800">
                  Emergency Services Active
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* LOADING SKELETONS */}
        {loading && (
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mt-4"></div>
                <div className="h-4 bg-gray-200 rounded mt-4"></div>
                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-10 bg-red-100 border border-red-200 text-red-700 p-5 rounded-xl">
            <p>{error}</p>
            <button
              onClick={() => {
                if (currentLocation) {
                  fetchHospitals(currentLocation.lat, currentLocation.lon);
                }
              }}
              className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* HOSPITAL LIST */}
        {!loading && hospitals.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Nearby Hospitals
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((h) => {
                const hospitalLat = h.lat || h.center?.lat;
                const hospitalLon = h.lon || h.center?.lon;

                const distance =
                  currentLocation && hospitalLat && hospitalLon
                    ? calculateDistance(
                        Number(currentLocation.lat),
                        Number(currentLocation.lon),
                        Number(hospitalLat),
                        Number(hospitalLon)
                      )
                    : null;

                return (
                  <div
                    key={h.id}
                    className="bg-white rounded-3xl shadow hover:shadow-2xl transition overflow-hidden group"
                  >
                    {/* HOSPITAL ICON BANNER */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-blue-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                            <line x1="12" y1="8" x2="12" y2="8" />
                            <line x1="10" y1="10" x2="14" y2="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-white text-green-600 text-sm font-semibold px-3 py-1 rounded-full shadow">
                        Open
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                        {h.tags?.name || "Unnamed Hospital"}
                      </h3>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={18} />
                          <p>
                            {h.tags?.["addr:city"] ||
                              h.tags?.["addr:suburb"] ||
                              h.tags?.["addr:district"] ||
                              "Nearby area"}
                          </p>
                        </div>

                        {distance && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Navigation size={18} />
                            <p>{distance} KM Away</p>
                          </div>
                        )}
                      </div>

                      {/* BADGES */}
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Emergency
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          ICU Available
                        </span>
                      </div>

                      {/* BUTTONS */}
                      <div className="mt-6 flex gap-3">
                        <a
                          href={`https://www.google.com/maps?q=${hospitalLat},${hospitalLon}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-center hover:bg-blue-700 transition"
                        >
                          Directions
                        </a>

                        {h.tags?.phone && (
                          <a
                            href={`tel:${h.tags.phone}`}
                            className="w-14 flex items-center justify-center border rounded-xl hover:bg-gray-100"
                          >
                            <Phone size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}