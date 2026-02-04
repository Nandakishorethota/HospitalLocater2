import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-4 ">
            <img src="pin.png" className="w-10" />
            Hospital Locator
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/hospitals" className="text-gray-700 hover:text-blue-600">
              Find Hospitals
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </a>

          
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <a href="/" className="block text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a
            href="/hospitals"
            className="block text-gray-700 hover:text-blue-600"
          >
            Find Hospitals
          </a>
          <a href="/about" className="block text-gray-700 hover:text-blue-600">
            About
          </a>
          
        </div>
      )}
    </nav>
  );
}
