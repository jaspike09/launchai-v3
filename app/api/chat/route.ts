import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the Board
    const boardRoles = [
      { name: "CMO (Marketing)", focus: "Virality and acquisition." },
      { name: "CPO (Product)", focus: "Features and MVP build." },
      { name: "CFO (Finance)", focus: "Budget and revenue." }
    ];

    // Parallel Board Meeting
    const boardResponses = await Promise.all(
      boardRoles.map(async (role) => {
        const result = await model.generateContent(`Role: ${role.name}. Analyze this Idea: ${prompt}`);
        return { role: role.name, feedback: result.response.text() };
      })
    );

    // Architect Synthesis
    const architectResult = await model.generateContent(
      `You are the Lead Business Architect. Create a master 5-step execution plan based on these notes: ${JSON.stringify(boardResponses)}`
    );

    return NextResponse.json({
      architect: architectResult.response.text(),
      board: boardResponses
    });

  } catch (error) {
    return NextResponse.json({ error: "System Offline" }, { status: 500 });
  }
}
