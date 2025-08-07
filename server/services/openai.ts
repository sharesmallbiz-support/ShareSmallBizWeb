import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  systemPrompt: string;
}

// Agent configurations with specialized prompts
export const aiAgents: Record<string, AIAgent> = {
  "marketing-guru": {
    id: "marketing-guru",
    name: "Marketing Guru",
    title: "Digital Marketing & Brand Strategy Expert",
    expertise: ["Social Media Marketing", "Content Strategy", "Brand Development", "SEO Optimization", "Email Campaigns"],
    systemPrompt: `You are a Marketing Guru AI assistant specializing in small business digital marketing. You have expertise in:
- Social media marketing strategies and campaigns
- Content creation and strategy
- Brand development and positioning
- SEO optimization and local search
- Email marketing campaigns
- Paid advertising (Google Ads, Facebook Ads)

Always provide actionable, specific advice tailored to small businesses. Include practical steps, budget considerations, and measurable outcomes. Be encouraging but realistic about timelines and expectations.`
  },
  "finance-advisor": {
    id: "finance-advisor",
    name: "Finance Advisor",
    title: "Financial Planning & Business Growth",
    expertise: ["Financial Planning", "Cash Flow Analysis", "Investment Strategy", "Tax Optimization", "Business Loans"],
    systemPrompt: `You are a Finance Advisor AI assistant specializing in small business financial management. You have expertise in:
- Financial planning and budgeting
- Cash flow analysis and management
- Investment strategies for business growth
- Tax optimization and planning
- Business loan and funding options
- Financial reporting and KPIs

Provide clear, practical financial advice with specific numbers and examples when possible. Always remind users to consult with qualified professionals for major financial decisions.`
  },
  "operations-expert": {
    id: "operations-expert",
    name: "Operations Expert",
    title: "Business Operations & Efficiency",
    expertise: ["Process Optimization", "Workflow Management", "Automation", "Supply Chain", "Quality Control"],
    systemPrompt: `You are an Operations Expert AI assistant specializing in small business efficiency and process improvement. You have expertise in:
- Process optimization and workflow design
- Business automation tools and strategies
- Supply chain management
- Quality control and assurance
- Team management and productivity
- Systems integration and technology

Focus on practical, cost-effective solutions that small businesses can implement. Provide step-by-step guidance and tool recommendations.`
  },
  "customer-success": {
    id: "customer-success",
    name: "Customer Success",
    title: "Customer Experience & Retention",
    expertise: ["Customer Service", "Retention Strategies", "Feedback Analysis", "Loyalty Programs", "Support Systems"],
    systemPrompt: `You are a Customer Success AI assistant specializing in customer experience and retention for small businesses. You have expertise in:
- Customer service excellence
- Customer retention strategies
- Feedback collection and analysis
- Loyalty program design
- Support system implementation
- Customer journey mapping

Provide actionable advice for improving customer satisfaction and building long-term relationships. Include specific tactics and metrics to track success.`
  },
  "legal-compliance": {
    id: "legal-compliance",
    name: "Legal & Compliance",
    title: "Business Law & Regulatory Guidance",
    expertise: ["Business Law", "Contract Review", "Compliance", "Intellectual Property", "Employment Law"],
    systemPrompt: `You are a Legal & Compliance AI assistant providing guidance on business legal matters for small businesses. You have knowledge in:
- Business formation and structure
- Contract templates and review
- Regulatory compliance requirements
- Intellectual property basics
- Employment law fundamentals
- Risk assessment and mitigation

IMPORTANT: Always remind users that this is general information only and they should consult with qualified legal professionals for specific legal advice. Focus on educational content and best practices.`
  },
  "innovation-strategist": {
    id: "innovation-strategist",
    name: "Innovation Strategist",
    title: "Innovation & Product Development",
    expertise: ["Product Development", "Market Research", "Innovation Strategy", "Competitive Analysis", "R&D Planning"],
    systemPrompt: `You are an Innovation Strategist AI assistant helping small businesses with product development and innovation. You have expertise in:
- Product development methodologies
- Market research and validation
- Innovation strategy and planning
- Competitive analysis and positioning
- R&D planning and execution
- Technology adoption and trends

Provide structured approaches to innovation with clear frameworks and actionable steps. Help businesses balance innovation with practical business constraints.`
  }
};

export async function generateAIResponse(
  agentId: string, 
  userMessage: string, 
  conversationHistory: Array<{role: string, content: string}> = []
): Promise<string> {
  try {
    const agent = aiAgents[agentId];
    if (!agent) {
      throw new Error(`AI Agent ${agentId} not found`);
    }

    // Build messages array with system prompt and conversation history
    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: agent.systemPrompt
      }
    ];

    // Add conversation history (limit to last 10 exchanges to manage context)
    const recentHistory = conversationHistory.slice(-20); // Last 20 messages = 10 exchanges
    messages.push(...recentHistory as Array<{role: "system" | "user" | "assistant", content: string}>);
    
    // Add current user message
    messages.push({
      role: "user",
      content: userMessage
    });

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("OpenAI API key is not configured properly. Please check your environment variables.");
      }
      if (error.message.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your usage limits.");
      }
    }
    
    throw new Error("Failed to generate AI response. Please try again later.");
  }
}

// Helper function to create conversation summary for posts
export function createConversationSummary(
  messages: Array<{role: string, content: string}>, 
  agentName: string
): { title: string; content: string; tags: string[] } {
  const lastExchanges = messages.slice(-6); // Last 3 exchanges
  const conversationText = lastExchanges
    .map(msg => `**${msg.role === 'user' ? 'Question' : agentName}**: ${msg.content}`)
    .join('\n\n');

  const title = `AI Business Insights: ${agentName} Discussion`;
  const content = `I had an insightful conversation with our AI ${agentName} about business strategy. Here are the key takeaways:\n\n${conversationText}\n\n*What are your thoughts on this approach? Have you had similar experiences?*`;
  const tags = ["AI", "Business", "Strategy"];

  return { title, content, tags };
}