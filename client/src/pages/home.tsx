import { Link } from "wouter";
import NavigationHeader from "../components/navigation-header";
import LeftSidebar from "../components/left-sidebar";
import MainFeed from "../components/main-feed";
import RightSidebar from "../components/right-sidebar";
import AIAssistant from "../components/ai-assistant";
import BusinessDashboard from "../components/business-dashboard";
import SocialMediaIntegration from "../components/social-media-integration";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      {/* Enhanced Hero Section */}
      <section className="gradient-bg text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  ⚡ AI-Powered Business Network
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Small Business.
                <span className="block text-secondary">Big Impact.</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                The only platform that combines social networking, AI business insights, and real collaboration opportunities designed specifically for entrepreneurs and small business owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/login">
                  <button 
                    className="btn-primary bg-white text-primary hover:bg-gray-100"
                    data-testid="button-join-community"
                  >
                    🚀 Join the Community
                  </button>
                </Link>
                <Link href="/ai-assistant">
                  <button 
                    className="btn-ai border-2 border-white/50 text-white hover:bg-white/10"
                    data-testid="button-try-ai"
                  >
                    🤖 Try AI Assistant
                  </button>
                </Link>
              </div>
              <div className="flex items-center space-x-6 text-sm text-white/80">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                  2,847 Active Members
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                  489 Business Partnerships
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Background Image */}
              <div className="relative z-0">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Modern small business collaboration" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  data-testid="img-hero"
                />
              </div>
              
              {/* AI-Enhanced Floating Cards - Higher z-index to float on top */}
              <Link href="/ai-assistant">
                <div className="absolute -top-6 -left-6 professional-card p-4 animate-float cursor-pointer hover:shadow-xl transition-shadow z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ai-purple rounded-xl flex items-center justify-center">
                      🤖
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">AI Insights</p>
                      <p className="text-xs text-gray-600">+32% engagement boost</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="absolute -bottom-6 -right-6 ai-enhanced-card p-4 animate-float z-20" style={{animationDelay: '1s'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
                    🤝
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Smart Matching</p>
                    <p className="text-xs text-gray-600">5 new partnerships</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-4 professional-card p-3 animate-float z-20" style={{animationDelay: '2s'}}>
                <div className="text-center">
                  <div className="text-2xl mb-1">📈</div>
                  <p className="text-xs font-semibold text-gray-900">Growth Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Dashboard Section */}
      <BusinessDashboard />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>
          
          <div className="lg:col-span-6 space-y-8">
            <MainFeed />
          </div>
          
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Social Media Integration Section */}
      <SocialMediaIntegration />

      {/* AI Assistant */}
      <AIAssistant />

      {/* Enhanced Footer */}
      <footer className="bg-dark-gray text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-bold text-xl">ShareSmallBiz</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                The world's first AI-powered social platform designed specifically for small business owners. Connect, collaborate, and grow with intelligent insights and real opportunities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">💼</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">📸</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">📹</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Business Feed</a></li>
                <li><Link href="/ai-assistant"><a href="#" className="hover:text-white transition-colors">AI Insights</a></Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Local Groups</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">AI Tools</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/ai-assistant"><a href="#" className="hover:text-white transition-colors">Business Assistant</a></Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Growth Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Matching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Content Optimizer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trend Predictor</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 ShareSmallBiz. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                All systems operational
              </span>
              <span>•</span>
              <span>Microsoft Web API Connected</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
