import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

// Validate Groq API key at startup
const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
  console.error("GROQ_API_KEY environment variable is not set!");
}

// Initialize Groq
const groq = new Groq({
  apiKey: groqApiKey || "",
});

export async function POST(req: Request) {
  try {
    const { banReason, appealText } = await req.json();

    if (!banReason || !appealText) {
      return NextResponse.json(
        { error: "Missing ban reason or appeal text" },
        { status: 400 }
      );
    }

    const prompt = `
      You are the "Ban Appeal Judge". A user has been banned and is appealing.
      
      Ban Reason: "${banReason}"
      Appeal Text: "${appealText}"

      Analyze this appeal. The "Copium Index" measures how much the person is coping/making excuses vs being genuine.
      
      Look for:
      1. AI Writing (Does it sound like ChatGPT wrote it?) → HIGH COPIUM
      2. Blame Shifting ("my brother did it", "I was hacked") → HIGH COPIUM  
      3. Emotional Manipulation (guilt-tripping, playing victim) → HIGH COPIUM
      4. Clichés ("I have learned my lesson") → HIGH COPIUM
      5. Taking Real Responsibility → LOW COPIUM
      6. Specific acknowledgment of wrongdoing → LOW COPIUM

      Return a JSON response strictly in this format:
      {
        "verdict": "DENIED" or "GRANTED",
        "copiumIndex": number (0-100, where 100 = maximum cope/excuses, 0 = completely genuine),
        "redFlag": "If DENIED: quote the most cope-filled/suspicious part. If GRANTED: quote the most genuine part",
        "reasoning": "2-3 sentence explanation of your verdict",
        "styles": ["List applicable flags like: AI Written, Blame Shifter, Manipulative, Cliché Abuser, Takes Responsibility, Genuinely Remorseful, Maximum Cope"]
      }
      
      GUIDELINES:
      - Copium 70%+ = DENIED (too much cope)
      - Copium 40-70% = borderline, use judgment
      - Copium below 40% = likely GRANTED (genuine)
      - "My brother/sister/friend did it" = instant 80%+ copium
      - Taking full responsibility with specifics = 20-30% copium
      
      ONLY return valid JSON, nothing else.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    
    // Clean up markdown code blocks if present
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let judgment;
    try {
      judgment = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Groq response:", responseText);
      return NextResponse.json({ error: "AI Malfunction" }, { status: 500 });
    }

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('judgments')
      .insert([
        { 
          ban_reason: banReason, 
          appeal_text: appealText, 
          verdict: judgment.verdict,
          bs_score: judgment.copiumIndex,
          detected_lie: judgment.redFlag,
          full_response: judgment
        }
      ]);

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    return NextResponse.json(judgment);

  } catch (error: any) {
    console.error("=== API Error Details ===");
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error status:", error?.status);
    console.error("Error stack:", error?.stack);
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    // Check for specific Groq errors
    if (error?.status === 401 || error?.message?.includes("API key") || error?.message?.includes("Invalid")) {
      return NextResponse.json(
        { error: "AI configuration error: Invalid API key." },
        { status: 500 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Please try again in a moment." },
        { status: 429 }
      );
    }
    
    if (error?.name === "APIConnectionError" || error?.message?.includes("Connection")) {
      return NextResponse.json(
        { error: "Could not connect to AI service. Please try again." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
