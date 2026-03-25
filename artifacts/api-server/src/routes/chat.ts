import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy",
});

const CATALOG = `
MOVIES:
The Night Agent (2023, Series, Action/Drama/Thriller, ⭐7.4)
Wolf King (2025, Series, Animation/Adventure, ⭐6.5)
Rebel Ridge (2024, Movie, Action/Crime, ⭐6.8)
The Perfect Couple (2024, Series, Crime/Drama, ⭐6.5)
Knuckles (2024, Series, Action/Adventure, ⭐6.1)
Predator: Badlands (2025, Movie, Action/Adventure, ⭐7.3)
The Accountant 2 (2025, Movie, Action/Crime, ⭐6.6)
Deadpool & Wolverine (2024, Movie, Action/Adventure, ⭐7.5)
Inception (2010, Movie, Action/Sci-Fi/Thriller, ⭐8.8)
Interstellar (2014, Movie, Adventure/Drama/Sci-Fi, ⭐8.7)
The Dark Knight (2008, Movie, Action/Crime/Drama, ⭐9.0)
Oppenheimer (2023, Movie, Drama/History/Thriller, ⭐8.3)
Dune: Part Two (2024, Movie, Action/Adventure/Sci-Fi, ⭐8.5)
John Wick: Chapter 4 (2023, Movie, Action/Crime/Thriller, ⭐7.7)
Top Gun: Maverick (2022, Movie, Action/Drama, ⭐8.3)
Spider-Man: No Way Home (2021, Movie, Action/Adventure/Sci-Fi, ⭐8.3)
The Batman (2022, Movie, Action/Crime/Drama, ⭐7.8)
Joker (2019, Movie, Crime/Drama/Thriller, ⭐8.4)
Barbie (2023, Movie, Adventure/Comedy, ⭐6.9)
The Shawshank Redemption (1994, Movie, Drama, ⭐9.3)
Pulp Fiction (1994, Movie, Crime/Drama/Thriller, ⭐8.9)
The Matrix (1999, Movie, Action/Sci-Fi, ⭐8.7)
Fight Club (1999, Movie, Drama/Mystery/Thriller, ⭐8.8)
Forrest Gump (1994, Movie, Drama/Romance, ⭐8.8)
Goodfellas (1990, Movie, Crime/Drama, ⭐8.7)
Gladiator II (2024, Movie, Action/Adventure/Drama, ⭐7.1)
Alien: Romulus (2024, Movie, Horror/Sci-Fi/Thriller, ⭐7.3)
Bullet Train (2022, Movie, Action/Comedy/Thriller, ⭐7.3)
Extraction 2 (2023, Movie, Action/Thriller, ⭐7.0)
Wonka (2023, Movie, Adventure/Comedy/Fantasy, ⭐7.0)
Mission: Impossible – Dead Reckoning (2023, Movie, Action/Adventure/Thriller, ⭐7.7)
Inside Out 2 (2024, Movie, Animation/Adventure/Comedy, ⭐7.8)
Moana 2 (2024, Movie, Animation/Adventure/Comedy, ⭐7.0)
Furiosa (2024, Movie, Action/Adventure/Sci-Fi, ⭐7.8)
The Gorge (2025, Movie, Action/Adventure, ⭐6.7)
The Bluff (2026, Movie, Action/Adventure, ⭐7.1)
Smile 2 (2024, Movie, Horror/Mystery/Thriller, ⭐6.9)
Poor Things (2023, Movie, Comedy/Drama/Sci-Fi, ⭐7.8)
Saltburn (2023, Movie, Drama/Mystery/Thriller, ⭐7.4)
Killers of the Flower Moon (2023, Movie, Crime/Drama/History, ⭐7.6)
Avatar: The Way of Water (2022, Movie, Action/Adventure/Sci-Fi, ⭐7.6)
Scream 7 (2026, Movie, Horror/Mystery, ⭐5.7)
War Machine (2026, Movie, Action/Sci-Fi, ⭐6.5)
Shadow Force (2025, Movie, Action/Drama, ⭐4.7)
Canary Black (2024, Movie, Action/Drama, ⭐5.4)
Good Luck Have Fun Don't Die (2026, Movie, Action/Adventure, ⭐7.3)
Shelter (2026, Movie, Action/Thriller, ⭐6.3)
Cold Storage (2026, Movie, Comedy/Horror, ⭐6.4)
TV SERIES:
Breaking Bad (2008, Series, Crime/Drama/Thriller, ⭐9.5)
Succession (2018, Series, Drama, ⭐8.9)
Better Call Saul (2015, Series, Crime/Drama, ⭐9.0)
The Last of Us (2023, Series, Action/Adventure/Drama, ⭐8.8)
Peaky Blinders (2013, Series, Crime/Drama, ⭐8.8)
Ted Lasso (2020, Series, Comedy/Drama, ⭐8.8)
Dark (2017, Series, Crime/Drama/Mystery, ⭐8.8)
Stranger Things (2016, Series, Drama/Fantasy/Horror, ⭐8.7)
The Boys (2019, Series, Action/Comedy/Crime, ⭐8.7)
The Mandalorian (2019, Series, Action/Adventure/Sci-Fi, ⭐8.7)
Yellowstone (2018, Series, Drama, ⭐8.7)
Severance (2022, Series, Drama/Mystery/Sci-Fi, ⭐8.7)
The Bear (2022, Series, Comedy/Drama, ⭐8.6)
Cobra Kai (2018, Series, Action/Drama, ⭐8.5)
Ozark (2017, Series, Crime/Drama/Thriller, ⭐8.5)
1923 (2022, Series, Drama, ⭐8.6)
House of the Dragon (2022, Series, Action/Adventure/Drama, ⭐8.4)
Person of Interest (2011, Series, Action/Crime/Sci-Fi, ⭐8.4)
Euphoria (2019, Series, Drama, ⭐8.4)
Andor (2022, Series, Action/Adventure/Drama, ⭐8.4)
Squid Game (2021, Series, Action/Drama/Mystery, ⭐8.0)
The White Lotus (2021, Series, Comedy/Drama/Mystery, ⭐7.9)
Ghost Doctor (2022, Series, Comedy/Fantasy, ⭐7.9)
The Crown (2016, Series, Drama/History, ⭐8.7)
Bridgerton (2020, Series, Drama/Romance, ⭐7.3)
One Piece (2023, Series, Action/Adventure, ⭐8.3)
Game of Thrones (2011, Series, Action/Adventure, ⭐9.2)
Prison Break (2005, Series, Action/Crime, ⭐8.3)
Wednesday (2022, Series, Comedy/Mystery/Sci-Fi, ⭐7.4)
Slow Horses (2022, Series, Crime/Drama/Thriller, ⭐8.0)
All of Us Are Dead (2022, Series, Action/Drama/Horror, ⭐7.5)
Outer Banks (2020, Series, Action/Adventure/Mystery, ⭐7.6)
Who Rules the World (2022, Series, Action/Drama, ⭐8.2)
Mushoku Tensei (2022, Series, Anime/Action, ⭐8.2)
The Vampire Diaries (2009, Series, Drama/Fantasy, ⭐7.7)
The Escape of the Seven (2023, Series, Drama/Mystery, ⭐6.2)
Industry (2020, Series, Drama/Thriller, ⭐7.8)
Sistas (2019, Series, Comedy/Drama, ⭐5.7)
The Rings of Power (2022, Series, Action/Adventure/Drama, ⭐6.9)
Emily in Paris (2020, Series, Comedy/Drama/Romance, ⭐6.9)
Fatal Seduction (2023, Series, Crime/Drama, ⭐5.0)
Teen Wolf (2011, Series, Action/Drama, ⭐7.7)
Beauty in Black (2024, Series, Drama, ⭐5.8)
`;

const SYSTEM_PROMPT = `You are a smart, friendly AI assistant for "Courtney's ENT" — a fast movie and TV streaming site.

Your job: help users find and start watching content instantly. Be short, fun, and direct.

Rules:
- Keep responses under 80 words unless listing multiple titles
- When suggesting titles, always bold them: **Title Name**
- Include year and one short punchy description per title (max 8 words)
- End suggestions with a quick action line like "Tap to play instantly"
- Never mention loading, errors, technical issues, or delays
- Always act like everything plays instantly and perfectly
- If asked for something not in the catalog, suggest the closest match you have

Full catalog available on this platform:
${CATALOG}

Only recommend titles from this catalog. When you bold a title, match its spelling exactly as listed above.`;

router.post("/api/chat", async (req, res) => {
  const { messages } = req.body as { messages: { role: string; content: string }[] };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5-nano",
      max_completion_tokens: 350,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-12).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "AI unavailable", done: true })}\n\n`);
  }
  res.end();
});

export default router;
