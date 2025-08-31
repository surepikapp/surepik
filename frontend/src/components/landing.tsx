import { useState } from 'react';
import { ShoppingBag, Shield, Zap, Users, CheckCircle, ArrowRight, Smartphone, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SurepikLanding() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate()

  const UserLoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Login to your SurePik account</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email or Phone
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email or phone"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            onClick={() => alert('Login functionality would be implemented here')}
          >
            Login
          </button>
          
          <div className="text-center">
            <button className="text-emerald-500 text-sm hover:underline bg-transparent border-none">
              Forgot your password?
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentPage('home')}
          className="mt-6 text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );

  const DriverDashboard = () => (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-600">SurePik Driver</h1>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-slate-500 hover:text-slate-700"
          >
            Back to Home
          </button>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Today's Earnings</p>
                <p className="text-2xl font-bold text-slate-800">$127.50 USDC</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Deliveries</p>
                <p className="text-2xl font-bold text-slate-800">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Rating</p>
                <p className="text-2xl font-bold text-slate-800">4.9</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Available Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800">Grocery Run #{order + 100}</p>
                    <p className="text-sm text-slate-500">Downtown Market → 2.3km away</p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">Est. $15.50 USDC</p>
                  </div>
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (currentPage === 'login') return <UserLoginPage />;
  if (currentPage === 'driver') return <DriverDashboard />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img src="/logo.svg" alt="SurePik Logo" className="w-8 h-8" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                Sure<span className="text-emerald-400">Pik</span>
              </div>
            </div>
            <nav className="hidden md:flex gap-6 lg:gap-8 text-white/80">
              <a href="#how" className="hover:text-emerald-400 transition-colors duration-300 font-medium text-sm lg:text-base">How It Works</a>
              <a href="#riders" className="hover:text-emerald-400 transition-colors duration-300 font-medium text-sm lg:text-base">For Drivers</a>
              <a href="#contact" className="hover:text-emerald-400 transition-colors duration-300 font-medium text-sm lg:text-base">Contact</a>
            </nav>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white/80 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-reverse"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-emerald-400/20 rounded-full blur-3xl animate-float-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8 animate-fade-in-up">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-xs sm:text-sm font-medium">Next-Gen Crypto Delivery Platform</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight animate-fade-in-up animation-delay-200 font-display">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-white">
                SurePik
              </span>
              <span className="block text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-orange-400 mt-2 sm:mt-4">
                Delivery Reimagined
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 animate-fade-in-up animation-delay-400">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed px-4">
              Experience the future of delivery with blockchain technology
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-4">
              Lightning-fast deliveries • Crypto payments • NFT reputation system • Transparent escrow
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20 animate-fade-in-up animation-delay-600 px-4">
            <button 
              onClick={() => navigate('/user')}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl font-semibold text-base sm:text-lg text-white shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 justify-center">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/rider')}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-semibold text-base sm:text-lg text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Drive & Earn</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-800 px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">10K+</div>
              <div className="text-white/70 text-xs sm:text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">5min</div>
              <div className="text-white/70 text-xs sm:text-sm">Avg Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-white/70 text-xs sm:text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">100%</div>
              <div className="text-white/70 text-xs sm:text-sm">Secure</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Side decorations */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="w-1 h-32 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"></div>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="w-1 h-32 bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 font-display px-4">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">SurePik</span> Works
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              From order to doorstep in minutes, powered by blockchain technology for ultimate security and transparency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: ShoppingBag, 
                title: "Place Your Order", 
                desc: "Choose from thousands of local stores and restaurants. Add items to your cart with just a few taps.",
                color: "emerald",
                step: "01"
              },
              { 
                icon: Shield, 
                title: "Secure Payment", 
                desc: "Pay with crypto through our secure escrow system. Your funds are protected until delivery confirmation.",
                color: "blue",
                step: "02"
              },
              { 
                icon: Zap, 
                title: "Real-Time Tracking", 
                desc: "Watch your driver's progress on our live map. Get updates every step of the way.",
                color: "orange",
                step: "03"
              },
              { 
                icon: CheckCircle, 
                title: "Confirm & Rate", 
                desc: "Receive your order and rate your experience. Drivers earn NFT reputation badges for great service.",
                color: "purple",
                step: "04"
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-slate-200 transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${
                    step.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                    step.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    step.color === 'orange' ? 'from-orange-400 to-orange-600' :
                    'from-purple-400 to-purple-600'
                  } rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-center">{step.desc}</p>
                  
                  {/* Connecting Line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent transform -translate-y-1/2 z-10"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16">
            <button 
              onClick={() => navigate('/user')}
              className="group bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Start Your First Order
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Why MorphRide */}
      <section className="py-32 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 font-display">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Delivery</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience delivery like never before with SurePik's cutting-edge technology and unmatched reliability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Instant Payments", 
                desc: "Drivers get paid in crypto immediately after delivery confirmation. No waiting, no delays.", 
                color: "emerald",
                icon: Zap
              },
              { 
                title: "Trust & Security", 
                desc: "Escrow-backed transactions and blockchain technology ensure complete transparency.", 
                color: "blue",
                icon: Shield
              },
              { 
                title: "Local Network", 
                desc: "Serving your neighborhood with carefully vetted and trained drivers.", 
                color: "orange",
                icon: Users
              },
              { 
                title: "NFT Reputation", 
                desc: "Drivers earn valuable NFT badges that unlock better opportunities and higher earnings.", 
                color: "purple",
                icon: Star
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-slate-200 transform hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${
                    feature.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                    feature.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    feature.color === 'orange' ? 'from-orange-400 to-orange-600' :
                    'from-purple-400 to-purple-600'
                  } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Drivers */}
      <section id="riders" className="py-32 bg-gradient-to-br from-orange-500 via-emerald-500 to-blue-500 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-reverse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Driver Opportunities</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-display">
              Drive. Earn. <span className="text-orange-200">Thrive.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed">
              Join the future of delivery and build your reputation while earning crypto
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
              Instant payments • NFT reputation system • Flexible schedule • Premium earning opportunities
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">$25+</div>
              <div className="text-white/80 text-sm">Per Hour Average</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 text-sm">Flexible Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80 text-sm">Active Drivers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">⚡</div>
              <div className="text-white/80 text-sm">Instant Payouts</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/rider')}
              className="group relative px-10 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Start Driving Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl font-semibold text-lg text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}