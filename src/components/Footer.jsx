export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-blue-300 via-blue-500 to-blue-800 text-white relative overflow-hidden">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 text-center sm:text-left">
        
        {/* About */}
        <div>
          <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Perfect Your Goals</h4>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            We are a data entry jobs website serving job seekers in India for over 4 years.
          </p>
        </div>

        {/* Sitemap */}
        <div>
          <h4 className="font-bold text-lg mb-3 sm:mb-4">SITEMAP</h4>
          <ul className="space-y-2 text-sm sm:text-base text-gray-200">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold text-lg mb-3 sm:mb-4">INFO</h4>
          <ul className="space-y-2 text-sm sm:text-base text-gray-200">
            <li>Advertisers</li>
            <li>Developers</li>
            <li>Company</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-3 sm:mb-4">EMAIL US</h4>
          <p className="text-sm sm:text-base">Yourgoalperfect@gmail.com</p>
          <p className="text-sm sm:text-base mt-1">Phone: Std 99999</p>
          <div className="mt-3">
            <p className="text-sm sm:text-base">Office Timing</p>
            <p className="text-sm sm:text-base">
              10:30 AM - 6:30 PM <br /> Monday to Saturday
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs sm:text-sm text-gray-300 py-5 border-t border-blue-400/40 bg-blue-900/20">
        © {new Date().getFullYear()} Perfect Your Goals. All Rights Reserved.
      </div>
    </footer>
  );
}
