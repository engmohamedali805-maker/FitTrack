import { GoogleGenAI, Content, Part } from "@google/genai";
import { ChatMessage, Targets, DailyLog, NutritionData, History } from "../types";

const BASE_SYSTEM_PROMPT = `
أنت مساعد تغذية ذكي وظيفتك متابعة السعرات والماكروز خلال اليوم اعتمادًا على صور الطعام التي يرسلها المستخدم أو الأوامر النصية.
يجب أن تكون إجابتك باللغة العربية، ودودة، ومحفزة.
قم بتقدير المكونات الغذائية بدقة (سعرات، بروتين، كارب، دهون، ألياف، سكر، صوديوم).
إذا أرسل المستخدم صورة، حللها واذكر محتوياتها وتقديرك لكل جزء منها.
`;

const TECHNICAL_INSTRUCTION = `
IMPORTANT SYSTEM INSTRUCTION FOR DATA PARSING:
At the very end of your response, absolutely MUST append a JSON block containing the *updated cumulative* Daily Totals AND Supplement Status.
Use this exact format for the JSON block:
\`\`\`json
{
  "dailyTotals": {
    "calories": 1200,
    "protein": 80,
    "carbs": 150,
    "fat": 40,
    "fiber": 20,
    "sugar": 30,
    "sodium": 1500
  },
  "supplements": {
    "creatine": true,
    "multivitamin": false
  }
}
\`\`\`
Do not include any other text after this JSON block.
`;

export const analyzeFood = async (
  currentHistory: ChatMessage[],
  newMessage: string,
  image?: string,
  targets?: Targets,
  currentLog?: DailyLog
): Promise<{ text: string; json?: Partial<DailyLog> }> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contextString = `
    [SYSTEM CONTEXT]
    Current User Targets: ${JSON.stringify(targets)}
    Current Cumulative Daily Log: ${JSON.stringify(currentLog)}
    Date: ${new Date().toISOString().split('T')[0]}
  `;

  const contents: Content[] = currentHistory.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }, ...(msg.image ? [{ inlineData: { mimeType: "image/jpeg", data: msg.image } }] : [])],
  }));

  const newParts: Part[] = [{ text: newMessage }, ...(image ? [{ inlineData: { mimeType: "image/jpeg", data: image } }] : [])];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...contents, { role: "user", parts: newParts }],
      config: {
        systemInstruction: BASE_SYSTEM_PROMPT + "\n" + TECHNICAL_INSTRUCTION + "\n" + contextString,
        temperature: 0.7,
      },
    });

    const fullText = response.text || "";
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonData: any;
    let cleanText = fullText;

    if (jsonMatch) {
      try {
        jsonData = JSON.parse(jsonMatch[1]);
        cleanText = fullText.replace(jsonMatch[0], "").trim();
      } catch (e) { console.error(e); }
    }

    return {
      text: cleanText,
      json: jsonData ? { ...jsonData.dailyTotals, supplements: jsonData.supplements } : undefined,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * New Service: Analyze Workout Performance
 */
export const analyzeWorkoutPerformance = async (history: History): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Extract only workout data to keep context small
  const workoutHistory = Object.entries(history)
    .filter(([_, log]) => log.workout && log.workout.exercises.length > 0)
    .map(([date, log]) => ({
      date,
      exercises: log.workout?.exercises.map(ex => ({
        name: ex.name,
        muscle: ex.muscle,
        sets: ex.sets.filter(s => s.completed).map(s => ({
          w: s.weight,
          r: s.reps,
          t: s.time,
          s: s.speed,
          i: s.incline
        }))
      }))
    }));

  const prompt = `
    بصفتك مدرب رياضي محترف (Personal Trainer)، قم بتحليل سجل التمارين التالي للمستخدم لآخر 30 يوم:
    ${JSON.stringify(workoutHistory)}

    المطلوب:
    1. تحليل التطور (Progressive Overload): هل هناك زيادة ملحوظة في الأوزان أو العدات؟
    2. توازن العضلات: هل هناك عضلات يتم تمرينها أكثر من غيرها؟
    3. الكارديو: هل مستوى الكارديو كافٍ؟
    4. تقييم الالتزام: كم مرة تمرن المستخدم في الأسبوع؟
    5. نصيحة ذهبية: رشح للمستخدم تعديلاً واحداً لزيادة النتائج (مثلاً زيادة الوزن في تمرين معين أو إضافة تمرين جديد).

    اجعل الأسلوب حماسي، مهني، وباللغة العربية. استخدم الإيموجي المناسبة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { 
        thinkingConfig: { thinkingBudget: 4000 },
        temperature: 0.8 
      },
    });
    return response.text || "لم أتمكن من تحليل البيانات حالياً.";
  } catch (error) {
    console.error(error);
    return "حدث خطأ أثناء التواصل مع المدرب الذكي. تأكد من وجود سجلات كافية للتحليل.";
  }
};