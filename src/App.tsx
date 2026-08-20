import React, { useState, useEffect } from 'react';

const HouseTourLogoIcon = ({ className = "w-10 h-10" }) => (
  <img 
    src="https://lh3.googleusercontent.com/d/1kHEnYjy9jjBdYi3aGZoxntcQQgrHkW2l" 
    alt="HouseTour AI Logo" 
    className={`${className} object-contain`} 
  />
);

const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChatIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const KeyIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

export default function App() {
  const [activePortalTab, setActivePortalTab] = useState('upload'); // 'upload' or 'analytics'
  const [activeAudience, setActiveAudience] = useState('renters');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waitlistRole, setWaitlistRole] = useState('renter');
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Set website favicon to the official logo (TypeScript fixed)
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = "https://lh3.googleusercontent.com/d/1kHEnYjy9jjBdYi3aGZoxntcQQgrHkW2l";
  }, []);

  // Selected room for Live AI Vision Demo
  const [activeVisionRoom, setActiveVisionRoom] = useState('living-kitchen');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmailInput('');
      setIsModalOpen(false);
    }, 2500);
  };

  const roomVisionData = {
    'living-kitchen': {
      title: "Main Living & Kitchen Area",
      image: "https://lh3.googleusercontent.com/d/1nvQUcH5iiASGwF97d49nRfkZNcH-sfkj",
      speech: "This is the open kitchen and main living room. Features stainless steel appliances, quartz countertops, and a 16x12 ft layout.",
      tags: [
        { label: "Kitchen Island 16' x 12'", top: "52%", left: "32%" },
        { label: "Living Area 18' x 14'", top: "45%", left: "72%" },
        { label: "Dining Nook 10' x 9'", top: "68%", left: "50%" },
      ]
    },
    'bedroom': {
      title: "Basement / Primary Bedroom",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80",
      speech: "This bedroom is 10 x 12 feet. It easily fits a queen size bed, and has a private walk-out door leading straight to the backyard.",
      tags: [
        { label: "Bedroom 10' x 12'", top: "48%", left: "45%" },
        { label: "Private Walk-out Exit", top: "35%", left: "18%" },
        { label: "Built-in Closet", top: "58%", left: "78%" }
      ]
    },
    'bathroom': {
      title: "Ensuite Bathroom",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80",
      speech: "Modern ensuite bathroom with rain showerhead, quartz vanity, and energy-efficient lighting. Water heating is included in rent.",
      tags: [
        { label: "Vanity & Mirror", top: "40%", left: "35%" },
        { label: "Walk-in Shower", top: "45%", left: "70%" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      
      {}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <HouseTourLogoIcon className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-[#1d1d1f]">
              House Tour <span className="text-[#0071e3]">AI</span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
            <a href="#hero-section" className="hover:text-[#0071e3] transition-colors">Home</a>
            <a href="#ai-vision-demo" className="hover:text-[#0071e3] transition-colors">Live AI Vision</a>
            <a href="#verification-flow" className="hover:text-[#0071e3] transition-colors">How It Works</a>
            <a href="#landlord-portal" className="hover:text-[#0071e3] transition-colors">Landlord Studio</a>
            <a href="#faq" className="hover:text-[#0071e3] transition-colors">FAQ</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
            >
              Book a Tour
            </button>
            <button 
              onClick={() => {
                setWaitlistRole('landlord');
                setIsModalOpen(true);
              }}
              className="hidden sm:inline-flex bg-white hover:bg-gray-100 text-[#1d1d1f] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full border border-gray-300 transition-all"
            >
              List Your Property
            </button>
          </div>
        </div>
      </header>

      {}
      <section id="hero-section" className="pt-10 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs">
              <SparklesIcon className="w-4 h-4 text-[#0071e3]" />
              <span>Smarter. Easier. Faster Property Tours.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1d1d1f] tracking-tight leading-[1.1]">
              Self-Guided Home Tours, Anytime. <br />
              <span className="text-[#0071e3]">Guided by Kira AI.</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Meet Kira, your AI home tour assistant. Experience an AI guided room tour with instant answers on property details, rent, utilities, and neighborhood insights—whenever it suits you.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-base px-7 py-3.5 rounded-full transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Book a Tour</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                  setWaitlistRole('landlord');
                  setIsModalOpen(true);
                }}
                className="bg-white hover:bg-gray-50 text-[#1d1d1f] font-bold text-base px-7 py-3.5 rounded-full border border-gray-300 transition-all shadow-2xs flex items-center justify-center"
              >
                List Your Property
              </button>
            </div>

            {/* Quick Feature Badges Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-white p-3 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <ClockIcon className="w-5 h-5 text-[#0071e3] mx-auto mb-1" />
                <div className="text-xs font-bold text-[#1d1d1f]">Flexible Hours</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <ChatIcon className="w-5 h-5 text-[#34c759] mx-auto mb-1" />
                <div className="text-xs font-bold text-[#1d1d1f]">Instant Answers</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <HomeIcon className="w-5 h-5 text-[#0071e3] mx-auto mb-1" />
                <div className="text-xs font-bold text-[#1d1d1f]">Guided Tours</div>
              </div>
            </div>

          </div>

          {/* Right Visual Frame (Hero Open Living Space + Floating Kira Widget) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-[36px] overflow-hidden border-4 border-white shadow-2xl bg-gray-900 group">
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80" 
                alt="Vacant modern living space" 
                className="w-full h-[460px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

              {/* Floating Kira Chat Overlay Card */}
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60 max-w-xs">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    K
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#1d1d1f]">Kira AI</div>
                    <div className="text-[11px] text-gray-500 font-semibold">Your AI Home Tour Assistant</div>
                  </div>
                </div>
                <p className="text-xs text-gray-700 font-medium mb-3">
                  Hi! I'm Kira. Ready to explore this vacant 2-bedroom home?
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold py-2 rounded-xl transition-all shadow-xs"
                >
                  Let's start the tour
                </button>
              </div>

              {/* Bottom Info Pill */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl text-white flex items-center justify-between text-xs font-semibold border border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse"></span>
                  <span>Kira is viewing this space in real-time</span>
                </div>
                <span className="text-gray-300">Vacant • Living Area</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {}
      <section id="ai-vision-demo" className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-200/80">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-2">Real-Time Vision & Spatial AR</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f]">Live AI Recognition in Action</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3">
            As you walk through empty rooms, Kira highlights key spots on your screen, shows your position on the floor plan, and answers your questions by voice.
          </p>

          {/* Room Selector Pills */}
          <div className="flex justify-center space-x-3 mt-6">
            <button 
              onClick={() => setActiveVisionRoom('living-kitchen')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeVisionRoom === 'living-kitchen' 
                  ? 'bg-[#0071e3] text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Living & Kitchen
            </button>
            <button 
              onClick={() => setActiveVisionRoom('bedroom')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeVisionRoom === 'bedroom' 
                  ? 'bg-[#0071e3] text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Primary Bedroom
            </button>
            <button 
              onClick={() => setActiveVisionRoom('bathroom')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeVisionRoom === 'bathroom' 
                  ? 'bg-[#0071e3] text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Ensuite Bathroom
            </button>
          </div>
        </div>

        {/* Vision Viewport Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900 max-w-5xl mx-auto">
          <img 
            src={roomVisionData[activeVisionRoom].image} 
            alt={roomVisionData[activeVisionRoom].title}
            className="w-full h-[520px] object-cover opacity-90 transition-all duration-500"
          />

          {/* AR Room Bounding Tags */}
          {roomVisionData[activeVisionRoom].tags.map((tag, idx) => (
            <div 
              key={idx}
              style={{ top: tag.top, left: tag.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#0071e3]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-white/30 animate-pulse"
            >
              {tag.label}
            </div>
          ))}

          {/* Floor Plan Minimap Overlay (Top Left) */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/60 text-left w-44 hidden sm:block">
            <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Floor Plan Location</div>
            <div className="w-full h-20 bg-gray-200 rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-300">
              <span className="text-[10px] text-gray-500 font-bold">Interactive Plan</span>
              <div className="absolute w-3 h-3 bg-[#0071e3] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ring-4 ring-[#0071e3]/30 animate-ping"></div>
            </div>
          </div>

          {/* Bottom Live Speech Caption Box */}
          <div className="absolute bottom-6 left-6 right-6 bg-black/75 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white text-left flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#0071e3] flex-shrink-0 flex items-center justify-center font-bold text-sm">
              K
            </div>
            <div>
              <div className="text-xs font-bold text-gray-300">Kira AI Voice Assistant</div>
              <p className="text-xs sm:text-sm font-medium mt-0.5 text-gray-100">
                "{roomVisionData[activeVisionRoom].speech}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="verification-flow" className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-200/80">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-2">Seamless Walkthrough</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f]">Simple. Instant. Hassle-Free.</h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto mt-2">
            Experience complete freedom to tour empty homes on your own schedule using simple lockbox key access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071e3] font-extrabold text-base flex items-center justify-center mb-4">1</div>
              <h3 className="font-bold text-base text-[#1d1d1f] mb-1">ID Verification in App</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Verify your government ID directly through the app before booking your tour.
              </p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-gray-200 text-left space-y-2">
              <div className="text-[11px] font-bold text-gray-700">In-App Verification</div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-[10px] text-gray-600 flex items-center space-x-2">
                <UserCheckIcon className="w-4 h-4 text-[#34c759]" />
                <span>ID Verification Complete</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071e3] font-extrabold text-base flex items-center justify-center mb-4">2</div>
              <h3 className="font-bold text-base text-[#1d1d1f] mb-1">GPS & Face Check at Entrance</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                When you arrive at the entrance of the property, the app confirms your GPS location and completes a quick face check.
              </p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-gray-200 text-left space-y-2">
              <div className="text-[11px] font-bold text-gray-700">Property Entrance</div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-[10px] text-gray-600 flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-[#0071e3]" />
                <span>GPS & Face Verified</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071e3] font-extrabold text-base flex items-center justify-center mb-4">3</div>
              <h3 className="font-bold text-base text-[#1d1d1f] mb-1">Access Property</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                The app reveals the lockbox code to retrieve the key and enter. Works with simple lockboxes or digital keypads.
              </p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-gray-200 text-left space-y-2">
              <div className="text-[11px] font-bold text-gray-700">Lockbox Key Access</div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-[10px] text-gray-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <KeyIcon className="w-4 h-4 text-[#0071e3]" />
                  <span>Code: <strong>8492</strong></span>
                </div>
                <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Key Ready</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071e3] font-extrabold text-base flex items-center justify-center mb-4">4</div>
              <h3 className="font-bold text-base text-[#1d1d1f] mb-1">Start Your Tour</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Explore each vacant room at your own pace while Kira guides you.
              </p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-gray-200 text-left space-y-3">
              <div className="text-[11px] font-bold text-gray-700">AI Tour Active</div>
              <div className="w-full h-24 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=80" alt="Vacant Bedroom Tour" className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-2 left-2 bg-[#0071e3] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Kira AI Active
                </div>
              </div>
              <div className="bg-gray-200 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full text-center">
                Ask Questions Anytime
              </div>
            </div>
          </div>

        </div>
      </section>

      {}
      <section id="landlord-portal" className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-200/80">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-2">For Property Owners & Brokers</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f]">Landlord Management Studio</h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto mt-2">
            Upload vacant flat details once and let Kira handle all tenant viewings automatically.
          </p>

          <div className="flex justify-center space-x-2 mt-6">
            <button 
              onClick={() => setActivePortalTab('upload')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activePortalTab === 'upload' ? 'bg-[#0071e3] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Add New Property
            </button>
            <button 
              onClick={() => setActivePortalTab('analytics')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activePortalTab === 'analytics' ? 'bg-[#0071e3] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Performance Analytics
            </button>
          </div>
        </div>

        {/* Dashboard Frame */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden max-w-5xl mx-auto p-6 text-left">
          {activePortalTab === 'upload' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#1d1d1f]">Add New Property</h3>
                  <p className="text-xs text-gray-500">Educate Kira with room dimensions, rent, lockbox code, and rules</p>
                </div>
                <button className="bg-[#0071e3] text-white text-xs font-bold px-4 py-2 rounded-full">Save & Publish</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Property Title</label>
                    <input type="text" readOnly value="Modern 2BR Vacant Apartment" className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Rent ($)</label>
                    <input type="text" readOnly value="$3,800 / month" className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Lockbox Access Code</label>
                    <input type="text" readOnly value="Box Code: 8492 (Front Door Railing)" className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 font-mono font-bold text-[#0071e3]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description & House Rules</label>
                    <textarea readOnly rows={2} value="Spacious 2-bedroom vacant flat. Heating included, pets allowed with deposit. Max 3 occupants." className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 resize-none"></textarea>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <label className="block text-xs font-bold text-gray-700 mb-3">Upload Property Photos</label>
                  <div className="grid grid-cols-3 gap-3">
                    <img src="https://lh3.googleusercontent.com/d/1nvQUcH5iiASGwF97d49nRfkZNcH-sfkj" alt="Empty Open Kitchen" className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                    <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80" alt="Kitchen Counter" className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                    <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=80" alt="Empty Bedroom" className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                    <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80" alt="Empty Bathroom" className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80" alt="Exterior" className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                    <div className="w-full h-28 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-xs text-gray-400 hover:bg-gray-100 cursor-pointer">
                      <span>+ Upload More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500">Total Properties</div>
                  <div className="text-2xl font-extrabold text-[#1d1d1f] mt-1">128</div>
                  <div className="text-[10px] text-[#34c759] font-bold mt-1">+12% this month</div>
                </div>
                <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500">Total Tours Completed</div>
                  <div className="text-2xl font-extrabold text-[#1d1d1f] mt-1">576</div>
                  <div className="text-[10px] text-[#34c759] font-bold mt-1">+18% this month</div>
                </div>
                <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500">Qualified Leads</div>
                  <div className="text-2xl font-extrabold text-[#1d1d1f] mt-1">243</div>
                  <div className="text-[10px] text-[#34c759] font-bold mt-1">+24% this month</div>
                </div>
                <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500">Lease Conversion Rate</div>
                  <div className="text-2xl font-extrabold text-[#1d1d1f] mt-1">42%</div>
                  <div className="text-[10px] text-[#34c759] font-bold mt-1">+8% this month</div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
                <div className="text-xs font-bold text-gray-400 mb-2">Tour Volume Trend</div>
                <div className="h-28 flex items-end justify-between space-x-2 pt-4">
                  {[40, 55, 30, 65, 80, 75, 90, 85, 100].map((val, i) => (
                    <div key={i} className="flex-1 bg-[#0071e3] rounded-t-lg transition-all" style={{ height: `${val}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-200/80">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-2">Designed For Everyone</div>
          <h2 className="text-3xl font-extrabold text-[#1d1d1f]">Built for Every Stakeholder</h2>

          <div className="flex justify-center space-x-2 mt-6">
            <button 
              onClick={() => setActiveAudience('renters')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeAudience === 'renters' ? 'bg-[#0071e3] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              For Renters & Buyers
            </button>
            <button 
              onClick={() => setActiveAudience('landlords')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeAudience === 'landlords' ? 'bg-[#0071e3] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              For Landlords
            </button>
            <button 
              onClick={() => setActiveAudience('realtors')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeAudience === 'realtors' ? 'bg-[#0071e3] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              For Licensed Realtors
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm max-w-4xl mx-auto text-left">
          {activeAudience === 'renters' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <ClockIcon className="w-8 h-8 text-[#0071e3] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Tour Whenever You Want</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Book a self-guided tour whenever suits you best. View properties at times that fit your schedule without waiting for open houses.
                </p>
              </div>
              <div>
                <ChatIcon className="w-8 h-8 text-[#34c759] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Instant Answers via Kira</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ask Kira about bed fit, rent breakdowns, included utilities, or nearby metro stops and get instant voice answers.
                </p>
              </div>
              <div>
                <KeyIcon className="w-8 h-8 text-[#0071e3] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Simple Lockbox Code Access</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  When you arrive at the property entrance, the app delivers your secure lockbox code to grab the key and step right in.
                </p>
              </div>
            </div>
          )}

          {activeAudience === 'landlords' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <TrendingUpIcon className="w-8 h-8 text-[#34c759] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">10x Showing Volume</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Offer self-guided tours around the clock without traveling or standing in empty units waiting for no-shows.
                </p>
              </div>
              <div>
                <LockIcon className="w-8 h-8 text-[#0071e3] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Low-Cost Lockbox Integration</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  No need for expensive smart locks. Simply attach a standard lockbox and let the app manage code distribution securely.
                </p>
              </div>
              <div>
                <SparklesIcon className="w-8 h-8 text-[#34c759] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Instant Property Ingestion</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload photos and rent notes once. Kira learns details instantly and answers questions accurately.
                </p>
              </div>
            </div>
          )}

          {activeAudience === 'realtors' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <UsersIcon className="w-8 h-8 text-[#0071e3] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Focus on Qualified Buyers</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Let Kira handle initial walkthroughs so you spend high-value time negotiating deals and closing transactions.
                </p>
              </div>
              <div>
                <TrendingUpIcon className="w-8 h-8 text-[#34c759] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Faster Lease Closings</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Prospects tour immediately while interest is high, reducing vacancy periods drastically.
                </p>
              </div>
              <div>
                <ChatIcon className="w-8 h-8 text-[#0071e3] mb-3" />
                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Real-Time Lead Activity</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Receive activity notifications and feedback reports right after each self-guided tour concludes.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0071e3] text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Experience AI Property Touring?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Be the first to tour vacant homes privately or automate your property showings with Kira.
          </p>

          <form onSubmit={handleFormSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex bg-white/10 p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setWaitlistRole('renter')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  waitlistRole === 'renter' ? 'bg-white text-[#0071e3]' : 'text-white hover:bg-white/10'
                }`}
              >
                Renter / Buyer
              </button>
              <button
                type="button"
                onClick={() => setWaitlistRole('landlord')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  waitlistRole === 'landlord' ? 'bg-white text-[#0071e3]' : 'text-white hover:bg-white/10'
                }`}
              >
                Landlord
              </button>
              <button
                type="button"
                onClick={() => setWaitlistRole('realtor')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  waitlistRole === 'realtor' ? 'bg-white text-[#0071e3]' : 'text-white hover:bg-white/10'
                }`}
              >
                Realtor
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-full text-sm text-[#1d1d1f] placeholder-gray-400 focus:outline-none bg-white font-medium"
              />
              <button
                type="submit"
                className="bg-[#1d1d1f] hover:bg-black text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-md"
              >
                Request Beta
              </button>
            </div>

            {isSubmitted && (
              <div className="text-xs font-bold text-[#34c759] bg-white p-2.5 rounded-full shadow-sm">
                ✓ You're on the early access beta list!
              </div>
            )}
          </form>
        </div>
      </section>

      {}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-gray-200/80 text-left">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-2">Got Questions?</div>
          <h2 className="text-3xl font-extrabold text-[#1d1d1f]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="text-base font-bold text-[#1d1d1f] mb-2">How do I access the property when I arrive?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              When you arrive at the property entrance, the app verifies your GPS location and completes a quick face check. Once confirmed, your screen displays the lockbox code so you can retrieve the key and open the door.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="text-base font-bold text-[#1d1d1f] mb-2">Does HouseTour AI replace a real estate agent?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              No. HouseTour AI is a technology platform that enhances the touring experience. Licensed real estate professionals continue to provide representation, advice, and negotiations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="text-base font-bold text-[#1d1d1f] mb-2">Can I ask questions live during the tour?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes! Kira answers property-specific questions by voice using the information uploaded for that listing (like bed size fit, included appliances, heating controls, or nearby metro stops).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="text-base font-bold text-[#1d1d1f] mb-2">Who can use HouseTour AI?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Renters, home buyers, landlords, property managers, and licensed realtors can all use HouseTour AI to streamline property viewings.
            </p>
          </div>
        </div>
      </section>

      {}
      <footer className="bg-white border-t border-gray-200/80 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start space-y-1.5">
            <div className="flex items-center space-x-3">
              <HouseTourLogoIcon className="w-10 h-10" />
              <span className="font-extrabold text-xl text-[#1d1d1f]">
                House Tour <span className="text-[#0071e3]">AI</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
            <a href="#hero-section" className="hover:text-[#0071e3]">Home</a>
            <a href="#ai-vision-demo" className="hover:text-[#0071e3]">Live AI Vision</a>
            <a href="#verification-flow" className="hover:text-[#0071e3]">How It Works</a>
            <a href="#landlord-portal" className="hover:text-[#0071e3]">Landlord Studio</a>
            <a href="#faq" className="hover:text-[#0071e3]">Privacy Policy</a>
          </div>

          <div className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} HouseTour AI. All rights reserved. Powered by Kira.
          </div>
        </div>
      </footer>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-gray-200 shadow-2xl relative text-left">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 text-sm font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-extrabold text-[#1d1d1f] mb-1">Book a Self-Guided Tour</h3>
            <p className="text-xs text-gray-500 mb-6">
              Get early beta access to tour homes with Kira in your city.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWaitlistRole('renter')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      waitlistRole === 'renter' ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Renter
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaitlistRole('landlord')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      waitlistRole === 'landlord' ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Landlord
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaitlistRole('realtor')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      waitlistRole === 'realtor' ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Realtor
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0071e3] font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-sm"
              >
                Submit Access Request
              </button>

              {isSubmitted && (
                <div className="text-xs text-center font-bold text-[#34c759] pt-2">
                  ✓ Request received! We will invite you shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}