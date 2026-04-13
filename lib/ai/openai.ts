import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const FAST_MODEL = "gpt-4o-mini"
export const QUALITY_MODEL = "gpt-4o"

export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  model: "fast" | "quality" = "fast",
  temperature: number = 0.7
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: model === "fast" ? FAST_MODEL : QUALITY_MODEL,
    temperature,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  })

  return response.choices[0]?.message?.content ?? ""
}

export async function callAIJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  model: "fast" | "quality" = "fast",
  temperature: number = 0.3
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: model === "fast" ? FAST_MODEL : QUALITY_MODEL,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  })

  const content = response.choices[0]?.message?.content ?? "{}"
  return JSON.parse(content) as T
}