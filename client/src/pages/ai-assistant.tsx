import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Megaphone, 
  Shield, 
  Lightbulb,
  ArrowRight,
  Star,
  MessageSquare,
  Zap
} from "lucide-react";

// AI Agent types and configurations
export interface AIAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  rating: number;
  interactions: number;
  specialties: string[];
}

// Export the agents array for use in other components
export const aiAgents: AIAgent[] = [
  {
    id: "marketing-guru",
    name: "Marketing Guru",
    title: "Digital Marketing & Brand Strategy Expert",
    description: "Specializes in digital marketing strategies, social media campaigns, content creation, and brand positioning for small businesses.",
    expertise: ["Social Media Marketing", "Content Strategy", "Brand Development", "SEO Optimization", "Email Campaigns"],
    color: "bg-purple-500",
    icon: Megaphone,
    rating: 4.8,
    interactions: 2847,
    specialties: ["Campaign Planning", "Analytics Review", "Content Ideas", "Brand Messaging"]
  },
  {
    id: "finance-advisor",
    name: "Finance Advisor",
    title: "Financial Planning & Business Growth",
    description: "Expert in financial planning, budgeting, cash flow management, and investment strategies for growing businesses.",
    expertise: ["Financial Planning", "Cash Flow Analysis", "Investment Strategy", "Tax Optimization", "Business Loans"],
    color: "bg-green-500",
    icon: DollarSign,
    rating: 4.9,
    interactions: 1923,
    specialties: ["Budget Planning", "Revenue Analysis", "Cost Optimization", "Growth Funding"]
  },
  {
    id: "operations-expert",
    name: "Operations Expert",
    title: "Business Operations & Efficiency",
    description: "Focuses on streamlining operations, improving efficiency, process automation, and scaling business operations.",
    expertise: ["Process Optimization", "Workflow Management", "Automation", "Supply Chain", "Quality Control"],
    color: "bg-blue-500",
    icon: TrendingUp,
    rating: 4.7,
    interactions: 1654,
    specialties: ["Process Improvement", "Team Management", "Productivity", "Systems Integration"]
  },
  {
    id: "customer-success",
    name: "Customer Success",
    title: "Customer Experience & Retention",
    description: "Specializes in customer relationship management, service excellence, retention strategies, and satisfaction improvement.",
    expertise: ["Customer Service", "Retention Strategies", "Feedback Analysis", "Loyalty Programs", "Support Systems"],
    color: "bg-orange-500",
    icon: Users,
    rating: 4.6,
    interactions: 2156,
    specialties: ["Service Training", "Customer Journey", "Satisfaction Surveys", "Retention Plans"]
  },
  {
    id: "legal-compliance",
    name: "Legal & Compliance",
    title: "Business Law & Regulatory Guidance",
    description: "Provides guidance on business legal matters, compliance requirements, contracts, and regulatory issues.",
    expertise: ["Business Law", "Contract Review", "Compliance", "Intellectual Property", "Employment Law"],
    color: "bg-red-500",
    icon: Shield,
    rating: 4.8,
    interactions: 987,
    specialties: ["Contract Templates", "Compliance Checklists", "Legal Risk Assessment", "Policy Development"]
  },
  {
    id: "innovation-strategist",
    name: "Innovation Strategist",
    title: "Innovation & Product Development",
    description: "Helps with product development, innovation strategies, market research, and competitive analysis.",
    expertise: ["Product Development", "Market Research", "Innovation Strategy", "Competitive Analysis", "R&D Planning"],
    color: "bg-indigo-500",
    icon: Lightbulb,
    rating: 4.5,
    interactions: 1342,
    specialties: ["Product Roadmap", "Market Validation", "Feature Planning", "Innovation Workshops"]
  }
];

export default function AIAssistant() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Agents", count: aiAgents.length },
    { id: "marketing", name: "Marketing", count: 1 },
    { id: "finance", name: "Finance", count: 1 },
    { id: "operations", name: "Operations", count: 1 },
    { id: "customer", name: "Customer", count: 1 },
    { id: "legal", name: "Legal", count: 1 },
    { id: "innovation", name: "Innovation", count: 1 }
  ];

  const filteredAgents = selectedCategory === "all" 
    ? aiAgents 
    : aiAgents.filter((agent: AIAgent) => agent.id.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bot className="h-8 w-8 text-primary" />
                AI Business Assistants
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Choose from specialized AI agents designed for small business success
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/ai-dashboard">
                <Button variant="default">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{aiAgents.length}</div>
              <div className="text-sm text-gray-600">Expert Agents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">12.9K+</div>
              <div className="text-sm text-gray-600">Conversations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.7</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
              data-testid={`category-${category.id}`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className={`${agent.color} h-12 w-12`}>
                        <AvatarFallback className="text-white">
                          <IconComponent className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <p className="text-sm text-gray-600">{agent.title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{agent.interactions.toLocaleString()}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {agent.description}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.slice(0, 3).map((specialty: string) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {agent.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{agent.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Link href={`/ai-chat/${agent.id}`}>
                    <Button className="w-full" data-testid={`start-chat-${agent.id}`}>
                      Start Conversation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Our AI assistants are trained on real business data and best practices. 
                Start a conversation with any specialist to get actionable insights for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/home">
                    View Community Posts
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  Learn More About AI Agents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}