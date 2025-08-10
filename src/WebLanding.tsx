import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from './SimpleNavigation';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import BenefitsSection from './BenefitsSection';
import TargetUsersSection from './TargetUsersSection';
import TrustSafetySection from './TrustSafetySection';
import Footer from './Footer';


const menuItems = [
  { label: 'Post a Task', type: 'button', route: 'PostTask' },
  { label: 'Browse Tasks', icon: true },
  { label: 'How it works' },
  { label: 'Benefits' },
  { label: 'Login', route: 'Login' },
  { label: 'Signup', route: 'SignUp' },
  { label: 'Become a Tasker', type: 'button', route: 'BecomeTasker' },
];

const categories = [
  "Accountants", "Admin", "Alterations", "Appliances", "Assembly", "Auto Electricians", "Bakers", "Barbers", "Beauticians", "Bicycle Service", "Bricklaying", "Building & Construction", "Business", "Car Body Work", "Car Detailing", "Car Repair", "Car Service", "Carpentry", "Cat Care", "Catering", "Chef", "Cladding", "Cleaning", "Computers & IT", "Concreting", "Decking", "Delivery", "Design", "Dog Care", "Draftsman", "Driving", "Electricians", "Entertainment", "Events", "Fencing", "Flooring", "Florist", "Furniture Assembly", "Gardening", "Gate Installation", "Hairdressers", "Handyman", "Heating & Cooling", "Home", "Automation And Security", "Home Theatre", "Interior Designer", "Landscaping", "Laundry", "Lawn Care", "Lessons", "Locksmith", "Makeup Artist", "Marketing", "Mobile Mechanic", "Painting", "Paving", "Pet Care", "Photographers", "Plasterer", "Plumbing", "Pool Maintenance", "Removals", "Roofing", "Sharpening", "Staffing", "Tailors", "Tattoo Artists", "Tiling", "Tradesman", "Tutoring", "Wall Hanging & Mounting", "Wallpapering", "Waterproofing", "Web", "Wheel & Tyre Service", "Writing"
];

const Header = ({ onNavigate }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCategories) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCategories]);

  useEffect(() => {
    function handleClick(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMobileMenu]);

  const handleNavigate = (item) => {
    setActiveItem(item.label);
    if (item?.label === 'How it works') {
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (item?.label === 'Benefits') {
      const el = document.getElementById('benefits');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (item?.route && onNavigate) {
      onNavigate(item.route);
    }
    setShowCategories(false);
    setShowMobileMenu(false);
  };

  const centerMenu = menuItems.slice(0, 4);
  const rightMenu = menuItems.slice(4);

  return (
    <div className="header-container" style={{
      width: '100%',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      background: '#fff',
      position: 'relative',
      zIndex: 1000,
      marginTop: -4,
      boxSizing: 'border-box',
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={require('../assets/images/logo.png')} alt="Extrahand Logo" style={{ height: 32, width: 32, marginRight: 8 }} />
        <span style={{ fontSize: 18, fontWeight: 700, color: 'hsl(220 13% 18%)', fontFamily: 'Inter, sans-serif' }}>Extrahand</span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="mobile-menu-button"
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          padding: 8,
          marginRight: 0,
          minWidth: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1001,
        }}
      >
        ☰
      </button>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        alignItems: 'center',
        height: 48,
        flex: 1,
        marginLeft: 24,
        marginRight: 24,
      }}>
        {centerMenu.map((item, index) =>
          item.label === "Browse Tasks" ? (
            <div key={index} style={{ position: "relative", display: 'flex', alignItems: 'center', height: 40 }} ref={dropdownRef}>
              <button
                onClick={() => setShowCategories((prev) => !prev)}
                style={{
                  position: 'relative',
                  background: item.type === 'button' ? '#ffcc30' : 'transparent',
                  color: item.type === 'button' ? '#111827' : (activeItem === item.label ? '#374151' : '#6b7280'),
                  fontWeight: item.type === 'button' ? 600 : 500,
                  fontSize: 16,
                  border: 'none',
                  borderRadius: item.type === 'button' ? 8 : 0,
                  padding: item.type === 'button' ? '12px 20px' : '0',
                  marginRight: 0,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span>{item.label}</span>
                {item.icon && (
                  <span style={{ marginLeft: 6, fontSize: 14, color: '#6b7280', verticalAlign: 'middle' }}></span>
                )}
                {(activeItem === item.label || showCategories) && (
                  <span style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: -8,
                    width: '100%',
                    height: 2,
                    background: '#6b7280',
                    borderRadius: 1,
                    display: 'block',
                  }} />
                )}
              </button>
              {showCategories && (
                <div className="categories-dropdown" style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 8,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  zIndex: 100,
                  padding: 24,
                  minWidth: 650,
                  maxHeight: 350,
                  overflowY: "auto",
                  display: "flex",
                  gap: 32,
                }}>
                  {Array.from({ length: 4 }).map((_, colIdx) => (
                    <ul key={colIdx} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {categories
                        .slice(
                          Math.floor((categories.length / 4) * colIdx),
                          Math.floor((categories.length / 4) * (colIdx + 1))
                        )
                        .map((cat) => (
                          <li key={cat}>
                            <a href="#" style={{
                              display: "block",
                              color: "#374151",
                              textDecoration: "none",
                              padding: "4px 0",
                              fontSize: 14,
                              borderRadius: 4,
                              fontFamily: 'Inter, sans-serif',
                            }}>{cat}</a>
                          </li>
                        ))}
                    </ul>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              key={index}
              onClick={() => handleNavigate(item)}
              style={{
                position: 'relative',
                background: item.type === 'button' ? '#ffcc30' : 'transparent',
                color: item.type === 'button' ? '#111827' : (activeItem === item.label ? '#374151' : '#6b7280'),
                fontWeight: item.type === 'button' ? 550 : 450,
                fontSize: 15,
                border: 'none',
                borderRadius: item.type === 'button' ? 8 : 0,
                padding: item.type === 'button' ? '12px 20px' : '0',
                marginRight: 0,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                height: 40,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{item.label}</span>
              {item.icon && (
                <span style={{ marginLeft: 6, fontSize: 14, color: '#6b7280' }}>⌄</span>
              )}
              {activeItem === item.label && (
                <span style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: -8,
                  width: '100%',
                  height: 2,
                  background: '#6b7280',
                  borderRadius: 1,
                  display: 'block',
                }} />
              )}
            </button>
          )
        )}
      </div>

      {/* Desktop Right Menu */}
      <div className="desktop-right-menu" style={{
        display: 'flex',
        gap: 20,
      }}>
        {rightMenu.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigate(item)}
            style={{
              position: 'relative',
              background: item.type === 'button' ? '#ffcc30' : 'transparent',
              color: item.type === 'button' ? '#111827' : (activeItem === item.label ? '#111827' : '#111827'),
              fontWeight: item.type === 'button' ? 550 : 400,
              fontSize: 15,
              border: 'none',
              borderRadius: item.type === 'button' ? 8 : 0,
              padding: item.type === 'button' ? '12px 12px' : '0',
              marginRight: 5,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
            }}
          >
            <span>{item.label}</span>
            {item.icon && (
              <span style={{ marginTop:-6, marginLeft: 6, fontSize: 14, color: '#111827', verticalAlign: 'top' }}>⌄</span>
            )}
            {activeItem === item.label && (
              <span style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: -8,
                width: '100%',
                height: 2,
                background: '#6b7280',
                borderRadius: 1,
                display: 'block',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            borderTop: '1px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 1000,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(item)}
              style={{
                background: item.type === 'button' ? '#ffcc30' : 'transparent',
                color: item.type === 'button' ? '#111827' : '#6b7280',
                fontWeight: item.type === 'button' ? 600 : 500,
                fontSize: 18,
                border: 'none',
                borderRadius: item.type === 'button' ? 8 : 0,
                padding: item.type === 'button' ? '12px 24px' : '12px 0',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                textAlign: 'left',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{item.label}</span>
              {item.icon && (
                <span style={{ fontSize: 14, color: '#6b7280' }}></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const WebLanding = () => {
  const navigation = useNavigation();

  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif', 
      background: '#fff', 
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <Header onNavigate={handleNavigate} />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TargetUsersSection />
      <TrustSafetySection />
      <Footer />
      
      {/* Responsive CSS */}
      <style>
        {`
          @media (min-width: 769px) {
            .mobile-menu-button {
              display: none !important;
            }
          }
          
          @media (max-width: 768px) {
            .mobile-menu-button {
              display: flex !important;
              margin-right: 8px !important;
            }
            
            .desktop-menu {
              display: none !important;
            }
            
            .desktop-right-menu {
              display: none !important;
            }
            
            .categories-dropdown {
              min-width: 300px !important;
              flex-direction: column !important;
              gap: 16px !important;
            }
            
            body {
              font-size: 14px;
            }
          }
          
          @media (max-width: 480px) {
            .header-container {
              padding: 12px 16px !important;
            }
            
            .mobile-menu-button {
              display: flex !important;
              margin-right: 4px !important;
              min-width: 44px !important;
              height: 44px !important;
            }
            
            body {
              font-size: 12px;
            }
          }
          
          @media (max-width: 360px) {
            .header-container {
              padding: 8px 12px !important;
            }
            
            .mobile-menu-button {
              margin-right: 2px !important;
              min-width: 48px !important;
              height: 48px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WebLanding;