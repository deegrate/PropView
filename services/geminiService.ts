import { GoogleGenAI, Type } from "@google/genai";
import { Property, FinancialAnalysis, AIAnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDealWithGemini = async (
  property: Property,
  financials: FinancialAnalysis
): Promise<AIAnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash';

    const prompt = `
      Act as a world-class real estate investment analyst. Analyze the following property deal based on the provided data.
      
      Property Details:
      Address: ${property.address}, ${property.city}, ${property.state}
      Price: $${property.price}
      Est. Value (ARV): $${property.estimatedValue || property.price * 1.05}
      Type: ${property.propertyType}
      Beds/Baths: ${property.beds}/${property.baths}
      Sqft: ${property.sqft}
      Year Built: ${property.yearBuilt}
      Condition/Desc: ${property.description}
      
      Financial Metrics (Calculated):
      Estimated Rent: $${property.estimatedRent}/mo
      Total Monthly Expenses: $${financials.monthlyExpenses.toFixed(0)}
      Projected Cash Flow: $${financials.cashFlow.toFixed(0)}/mo
      Cap Rate: ${financials.capRate}%
      Cash on Cash Return: ${financials.cashOnCash}%
      Total Cash Needed: $${financials.totalInvestment.toFixed(0)}

      Expense Breakdown (Monthly):
      - Mortgage: $${financials.breakdown.mortgage.toFixed(0)}
      - Taxes: $${financials.breakdown.taxes.toFixed(0)}
      - Insurance: $${financials.breakdown.insurance.toFixed(0)}
      - HOA: $${financials.breakdown.hoa.toFixed(0)}
      - Vacancy: $${financials.breakdown.vacancy.toFixed(0)}
      - Maintenance: $${financials.breakdown.maintenance.toFixed(0)}
      - Management: $${financials.breakdown.management.toFixed(0)}
      
      Provide a structured analysis in JSON format with:
      1. A deal score from 0-100 (where 100 is an amazing deal).
      2. A concise summary of the investment potential (max 2 sentences).
      3. Top 3 pros.
      4. Top 3 cons/risks (specifically comment on if expense ratios seem realistic).
      5. Recommended strategy (e.g., "Buy & Hold", "Fix & Flip", "Pass").
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                summary: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                strategy: { type: Type.STRING },
            },
            required: ["score", "summary", "pros", "cons", "strategy"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);

    return {
      score: result.score,
      summary: result.summary,
      pros: result.pros,
      cons: result.cons,
      strategy: result.strategy,
      isLoading: false,
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      score: 0,
      summary: "Failed to analyze deal. Please check API key configuration.",
      pros: [],
      cons: [],
      strategy: "Error",
      isLoading: false,
    };
  }
};

export const findDealsWithGemini = async (market: string, strategy: string): Promise<Property[]> => {
  try {
     const model = 'gemini-2.5-flash';
     const prompt = `
        Generate 3 realistic real estate investment property leads in ${market} specifically suitable for a "${strategy}" strategy.
        
        The properties should be realistic for the current market but show potential (e.g., slightly undervalued, needs work, or high rent area).
        
        Return a JSON array of objects. Each object must match this exact structure:
        {
          "address": "Street Address",
          "city": "City",
          "state": "State Code",
          "zip": "Zip Code",
          "price": number (purchase price),
          "estimatedValue": number (current market value or ARV),
          "beds": number,
          "baths": number,
          "sqft": number,
          "lotSize": number,
          "yearBuilt": number,
          "propertyType": "Single Family" | "Multi Family" | "Condo" | "Townhouse",
          "estimatedRent": number,
          "description": "Short marketing description highlighting investment potential",
          "features": ["feature1", "feature2", "feature3"],
          "lastSoldDate": "YYYY-MM-DD" (approximate),
          "lastSoldPrice": number
        }

        Do not wrap the JSON in markdown code blocks. Just return the raw JSON.
     `;

     const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawProperties = JSON.parse(text);

    // Hydrate with client-side only fields (images, coords, IDs)
    return rawProperties.map((p: any, index: number) => ({
        ...p,
        id: `gen-${Date.now()}-${index}`,
        status: 'For Sale',
        imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
        coordinates: { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 },
    }));

  } catch (error) {
      console.error("Gemini Scan Error:", error);
      return [];
  }
};

export const findWholesaleDealsWithGemini = async (market: string): Promise<Property[]> => {
  try {
     const model = 'gemini-2.5-flash';
     const prompt = `
        Generate 2 realistic "Off-Market" or "Distressed" wholesale property leads in ${market}.
        
        CRITICAL: Each property MUST have at least $50,000 in potential equity. 
        This means the "estimatedValue" (ARV) minus the "price" (Purchase Price) must be >= $50,000.
        
        Return a JSON array of objects. Each object must match this exact structure:
        {
          "address": "Street Address",
          "city": "City",
          "state": "State Code",
          "zip": "Zip Code",
          "price": number (This is the discounted purchase price),
          "estimatedValue": number (This is the ARV/Market Value - must be at least 50k higher than price),
          "beds": number,
          "baths": number,
          "sqft": number,
          "lotSize": number,
          "yearBuilt": number,
          "propertyType": "Single Family" | "Multi Family",
          "estimatedRent": number,
          "description": "Description emphasizing the equity spread and renovation potential.",
          "features": ["feature1", "feature2", "feature3"],
          "lastSoldDate": "YYYY-MM-DD",
          "lastSoldPrice": number
        }

        Do not wrap the JSON in markdown code blocks. Just return the raw JSON.
     `;

     const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawProperties = JSON.parse(text);

    return rawProperties.map((p: any, index: number) => ({
        ...p,
        id: `wholesale-${Date.now()}-${index}`,
        status: 'Foreclosure', // Wholesale often implies distress
        imageUrl: `https://picsum.photos/800/600?grayscale&random=${Math.floor(Math.random() * 1000)}`, // Grayscale for "distressed" look
        coordinates: { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 },
    }));

  } catch (error) {
      console.error("Gemini Wholesale Scan Error:", error);
      return [];
  }
};