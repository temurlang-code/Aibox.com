import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-dark">
      <div className="border-t border-gray-800"></div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="ml-2 text-xl font-bold text-white">AIBox</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your comprehensive AI tool catalog, curated for every need.
            </p>
            <div className="mt-4 flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about">
                  <a className="hover:text-primary transition-colors">About Us</a>
                </Link>
              </li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary transition-colors">Contact</a>
                </Link>
              </li>
              <li><a href="#" className="hover:text-primary transition-colors">Media Kit</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} AIBox. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-primary text-sm hover:underline">
              Suggest a new AI tool
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
