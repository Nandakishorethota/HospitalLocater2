export default function About() {
  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            About <span className="text-blue-600">HospitalLocator</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Helping people find nearby hospitals, clinics, and emergency
            services quickly and reliably.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              HospitalLocator is designed to make healthcare access easier.
              Our mission is to help users locate nearby hospitals, view
              essential details, and get directions during both routine
              visits and emergencies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What We Offer
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Search hospitals by location or name</li>
              <li>• Emergency and specialty hospital listings</li>
              <li>• Accurate directions and contact information</li>
              <li>• User-friendly and mobile-first design</li>
            </ul>
          </div>

          {/* Image Section */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118"
              alt="Healthcare team"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-3xl font-bold text-blue-600">10,000+</h3>
            <p className="text-gray-600 mt-2">Hospitals Listed</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-3xl font-bold text-blue-600">50+</h3>
            <p className="text-gray-600 mt-2">Cities Covered</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
            <p className="text-gray-600 mt-2">Emergency Access</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Health, One Click Away
          </h2>
          <p className="mt-3 text-gray-600">
            Start searching for nearby hospitals and get the care you need.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Find Hospitals
          </button>
        </div>

      </div>
    </section>
  );
}
