import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { env } from 'node:process';

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Each flashcard should have a clear question on one side and a brief, accurate answer on the other. Focus on key concepts, definitions, and important facts. Avoid creating overly complex or ambiguous flashcards. Ensure that the information is accurate and presented in a way that facilitates learning and retention. When creating flashcards:

1. Keep questions clear and specific.
2. Provide concise answers that capture the essential information.
3. Use simple language to enhance understanding.
4. Cover a range of difficulty levels, from basic recall to application of knowledge.
5. For subjects with visual elements, suggest including diagrams or images where appropriate.
6. Create a balanced mix of question types (e.g., multiple choice, fill-in-the-blank, true/false).
7. Avoid using exact wording from the source material to encourage deeper understanding.
8. For language learning, include pronunciation guides where relevant.
9. For mathematical or scientific concepts, include formula-based flashcards.
10. Ensure that each flashcard stands alone and doesn't rely on information from other cards.

Return the flashcards in the following JSON format:

{
  "flashcards": [
        {
        "front": "Front of the flashcard",
        "back": "Back of the flashcard"
        }
  ]
}

`


export async function POST(req) {
  try {
    const openai = new OpenAI();

    const { text } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: text },
      ],
    });

    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error in POST /api/generate:", error.message);
    console.error(error.stack); // Log the error stack for more details

    // Respond with a 500 error and the error message
    return new Response("Internal Server Error: " + error.message, {
      status: 500,
    });
  }

  // Return the flashcards as a JSON response
}

