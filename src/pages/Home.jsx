export default function Home() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Find Nearby Hospitals <br />
              <span className="text-blue-600">Fast & Easily</span>
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Search hospitals, clinics, and emergency centers around you. Get
              directions, contact details, and availability instantly.
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your location or hospital name"
                className="flex-1 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Search
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Find Hospitals
              </button>
              <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                Emergency Help
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
              alt="Hospital"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
