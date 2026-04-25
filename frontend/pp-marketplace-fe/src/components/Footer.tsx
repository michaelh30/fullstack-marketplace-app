export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-gaming-purple font-bold mb-4">About</h3>
            <p className="text-gray-400 text-sm">Gaming Marketplace - Your source for in-game currency and items.</p>
          </div>
          <div>
            <h3 className="text-gaming-purple font-bold mb-4">Support</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-gaming-cyan">Help Center</a></li>
              <li><a href="#" className="hover:text-gaming-cyan">Contact Us</a></li>
              <li><a href="#" className="hover:text-gaming-cyan">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gaming-purple font-bold mb-4">Legal</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-gaming-cyan">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gaming-cyan">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gaming-purple font-bold mb-4">Follow</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-gaming-cyan">Twitter</a></li>
              <li><a href="#" className="hover:text-gaming-cyan">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Gaming Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
