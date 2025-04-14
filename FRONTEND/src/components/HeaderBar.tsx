//import { useState } from 'react';
import logo from '../images/catlogo1.png';
import { Link } from 'react-router-dom';

const HeaderBar = () => {
//  const [isMenuOpen, setIsMenuOpen] = useState(false);

//  const toggleMenu = () => {
//    setIsMenuOpen(!isMenuOpen);
//  };

//  const handleLogin = () => {
//    console.log('Login button clicked');
//  };

//  const handleRegister = () => {
//    console.log('Register button clicked');
//  };

  return (
    <header className="bg-[rgba(30, 64, 175, 0.9)] fixed top-0 left-0 w-full z-50 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link to="/"  className="block text-teal-600 dark:text-white">
              <span className="sr-only">Home</span>
              <img src={logo} alt="Logo" className="h-24" />
            </Link>
          </div>

          {/* Login/Register Buttons */}
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                to="/login"
                className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-teal-500"
              >
                Login
              </Link>

            <div className="hidden sm:flex">
              <Link
                to="/signup"
                className="rounded-md px-5 py-2.5 text-sm font-medium bg-gray-800 text-white hover:bg-gray-600"
              >
                Sign Up
              </Link>
             </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
