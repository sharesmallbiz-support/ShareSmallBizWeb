import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface BusinessAdviceRequest {
  message: string;
  userContext?: {
    businessName?: string;
    businessType?: string;
    location?: string;
    challenges?: string[];
  };
}

export interface BusinessAdviceResponse {
  response: string;
  suggestions?: string[];
  actionItems?: string[];
}

export async function getBusinessAdvice(request: BusinessAdviceRequest): Promise<BusinessAdviceResponse> {
  try {
    const contextInfo = request.userContext ? 
      `User's business context: Business Name: ${request.userContext.businessName || 'N/A'}, Type: ${request.userContext.businessType || 'N/A'}, Location: ${request.userContext.location || 'N/A'}` : '';

    const prompt = `You are an expert small business advisor with years of experience helping entrepreneurs grow their businesses. 
    
${contextInfo}

User's question: ${request.message}

Provide helpful, actionable advice tailored to small businesses. Include specific suggestions and action items when relevant. 
Respond in JSON format with the following structure:
{
  "response": "main advice response",
  "suggestions": ["specific suggestion 1", "specific suggestion 2"],
  "actionItems": ["actionable step 1", "actionable step 2"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI business assistant specialized in small business growth, marketing, and operations. Always provide practical, actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      response: result.response || "I'd be happy to help with your business question. Could you provide more details?",
      suggestions: result.suggestions || [],
      actionItems: result.actionItems || []
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      response: "I'm currently experiencing technical difficulties. Please try again later or contact support if the issue persists.",
      suggestions: [],
      actionItems: []
    };
  }
}

export async function generatePostSuggestions(businessType?: string, recentPosts?: string[]): Promise<string[]> {
  try {
    const context = businessType ? `for a ${businessType} business` : 'for a small business';
    const recentContext = recentPosts?.length ? 
      `Recent posts have covered: ${recentPosts.join(', ')}. Suggest different topics.` : '';

    const prompt = `Generate 5 engaging social media post ideas ${context} that would work well in a small business community platform. ${recentContext}

Focus on:
- Networking and collaboration opportunities
- Business tips and insights
- Community engagement
- Success stories
- Industry trends

Respond in JSON format: { "suggestions": ["post idea 1", "post idea 2", ...] }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.suggestions || [];
  } catch (error) {
    console.error("OpenAI post suggestions error:", error);
    return [];
  }
}

export async function analyzePostEngagement(postContent: string, likesCount: number, commentsCount: number): Promise<string> {
  try {
    const prompt = `Analyze this business community post's engagement:

Content: "${postContent}"
Likes: ${likesCount}
Comments: ${commentsCount}

Provide a brief insight about the engagement performance and suggest improvements for future posts.
Respond in JSON format: { "insight": "your analysis and suggestion" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.insight || "This post shows good engagement with the community.";
  } catch (error) {
    console.error("OpenAI engagement analysis error:", error);
    return "Unable to analyze engagement at this time.";
  }
}
