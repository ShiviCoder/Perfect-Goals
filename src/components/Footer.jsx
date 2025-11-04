export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-blue-300 via-blue-500 to-blue-800 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-4 gap-12">
        {/* About */}
        <div>
          <h4 className="font-bold text-xl mb-4">Perfect Your Goals</h4>
          <p className="text-sm text-gray-200">
            We are a data entry jobs website serving job seekers in India for over 4 years.
          </p>
        </div>

        {/* Sitemap */}
        <div>
          <h4 className="font-bold mb-4">SITEMAP</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#" className="hover:text-orange-400">Home</a></li>
            <li><a href="#" className="hover:text-orange-400">About</a></li>
            <li><a href="#" className="hover:text-orange-400">Services</a></li>
            <li><a href="#" className="hover:text-orange-400">Contact</a></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold mb-4">INFO</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>Advertisers</li>
            <li>Developers</li>
            <li>Company</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4">EMAIL US</h4>
          <p className="text-sm">Yourgoalperfect@gmail.com</p>
          <p className="text-sm">Phone: Std 99999</p>
          <p className="text-sm">Office Timing</p>
          <p className="text-sm">10:30 AM - 6:30 PM <br />Monday to Saturday</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-300 py-6 border-t border-blue-400/40">
        © 2024 Perfect your Goals. All Rights Reserved.
      </div>
    </footer>
  );
}
