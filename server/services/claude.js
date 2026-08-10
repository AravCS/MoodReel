import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You translate a viewer's mood words (and optionally titles they've watched and liked) into structured movie search parameters.

If titles are provided, use them as taste signals, infer the tone, genre, and style from what those titles are actually like, don't just repeat the mood words back.

Respond with ONLY valid JSON, no prose, no markdown code fences. Use exactly this shape:
{
  "genres": ["Comedy", "Drama"],
  "keywords": ["heartwarming", "slow-burn"],
  "blurb": "One short sentence describing the kind of watch this is."
}

"genres" must only contain values from this exact list: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, TV Movie, Thriller, War, Western.`;

export async function moodToSearchParams(moods, watchedTitles = []) {
    let userContent = `Moods/genres: ${moods.join(', ')}`
    if (watchedTitles.length > 0) {
        userContent += `\nTitles they've watched and liked: ${watchedTitles.join(', ')}`
    }
    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{role: 'user', content: userContent}],
    })

    let text = message.content[0].text.trim();
    // Claude wraps its response in JSON mark code down fences
    text = text.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
    return JSON.parse(text);
}