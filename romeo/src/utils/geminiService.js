/**
 * Gemini API Service
 * Handles all AI-powered features: reasoning, parallel hearts, conversation starters
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Core API call to Gemini
 */
async function callGemini(prompt) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured. Add VITE_GEMINI_API_KEY to your .env file.');
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Parse JSON from Gemini response (handles markdown code blocks)
 */
function parseJSON(text) {
    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
}

/**
 * Generate final recommendation comparing top 3 matches
 */
export async function generateFinalRecommendation(target, topMatches) {
    const top3 = topMatches.slice(0, 3);

    const prompt = `You are Romeo, an expert AI matchmaking analyst. Compare these top 3 matches for ${target.name} (${target.age}, ${target.profession} from ${target.city}).

TARGET PROFILE:
- Personality: ${target.personality}
- Values: ${target.values?.join(', ')}
- Hobbies: ${target.hobbies?.join(', ')}
- Relationship Goal: ${target.relationshipGoal}
- Bio: ${target.bio}

TOP 3 MATCHES:
${top3.map((m, i) => `
Match ${i + 1}: ${m.profile.name} (${m.profile.age}, ${m.profile.profession} from ${m.profile.city})
- Score: ${m.score}%
- Personality: ${m.profile.personality}
- Values: ${m.profile.values?.join(', ')}
- Hobbies: ${m.profile.hobbies?.join(', ')}
- Bio: ${m.profile.bio}
- Score Breakdown: Hobbies ${m.breakdown.hobbies}%, Values ${m.breakdown.values}%, Personality ${m.breakdown.personality}%, Lifestyle ${m.breakdown.lifestyle}%, Goals ${m.breakdown.goals}%
`).join('\n')}

Analyze deeply and choose the BEST overall match. Do NOT just pick the highest score — consider emotional depth, long-term compatibility, and human nuance. 

Return ONLY valid JSON:
{
  "selectedMatchId": <id of chosen profile>,
  "selectedMatchName": "<name>",
  "confidence": <60-99>,
  "headline": "<one compelling headline for this match>",
  "reasoning": "<3-4 paragraphs of deep reasoning explaining why this person is the best match, why the others are good but not ideal>",
  "whyNotOthers": [
    {"name": "<match2 name>", "reason": "<why not ideal despite good score>"},
    {"name": "<match3 name>", "reason": "<why not ideal despite good score>"}
  ],
  "futureOutlook": "<1-2 sentences painting a picture of their potential future together>"
}`;

    try {
        const text = await callGemini(prompt);
        const parsed = parseJSON(text);
        return parsed;
    } catch (err) {
        console.error('Gemini recommendation error:', err);
        // Fallback to top scorer
        return {
            selectedMatchId: top3[0]?.profile.id,
            selectedMatchName: top3[0]?.profile.name,
            confidence: 78,
            headline: `${top3[0]?.profile.name} is your most compatible match`,
            reasoning: `Based on the compatibility analysis, ${top3[0]?.profile.name} scores highest across multiple dimensions. Their shared values and personality complement yours exceptionally well. While the other matches have merit, the depth of alignment here stands out.`,
            whyNotOthers: top3.slice(1).map(m => ({
                name: m.profile.name,
                reason: 'Strong compatibility but slightly less alignment in core values and relationship goals.'
            })),
            futureOutlook: 'Together, you could build something deeply meaningful and lasting.',
        };
    }
}

/**
 * Generate Parallel Hearts timelines + "What Changed?" comparison section
 */
export async function generateParallelHearts(target, match) {
    const prompt = `You are Romeo, a romantic AI storyteller. Generate three alternate relationship timeline stories for:

Person 1: ${target.name} (${target.age}, ${target.profession} in ${target.city})
- Hobbies: ${target.hobbies?.join(', ')}
- Personality: ${target.personality}
- Values: ${target.values?.join(', ')}
- Deal Breakers: ${target.dealBreakers?.join(', ')}

Person 2: ${match.name} (${match.age}, ${match.profession} in ${match.city})
- Hobbies: ${match.hobbies?.join(', ')}
- Personality: ${match.personality}
- Values: ${match.values?.join(', ')}
- Deal Breakers: ${match.dealBreakers?.join(', ')}

Create three vivid, emotionally rich timelines and a "What Changed?" comparison that shows how moving between timelines shifts the relationship. The overall compatibility is the baseline — each timeline raises or lowers it based on the scenario.

Return ONLY valid JSON (no markdown):
{
  "timelines": [
    {
      "id": 1,
      "title": "Same City",
      "emoji": "🏙️",
      "story": "<Rich 3-4 sentence story using their actual professions and hobbies>",
      "compatibilityScore": <baseline score adjusted for same-city context, 60-99>,
      "metrics": {
        "communication": <0-100>,
        "trust": <0-100>,
        "conflict": <0-100>,
        "growth": <0-100>,
        "longTermSuccess": <0-100>
      },
      "aiExplanation": "<2 sentences>",
      "keyMoments": ["<moment 1>", "<moment 2>", "<moment 3>"]
    },
    {
      "id": 2,
      "title": "Long Distance",
      "emoji": "✈️",
      "story": "<Poignant story of love across cities>",
      "compatibilityScore": <adjusted score for long-distance, typically lower than same-city>,
      "metrics": {
        "communication": <0-100>,
        "trust": <0-100>,
        "conflict": <0-100>,
        "growth": <0-100>,
        "longTermSuccess": <0-100>
      },
      "aiExplanation": "<2 sentences>",
      "keyMoments": ["<moment 1>", "<moment 2>", "<moment 3>"]
    },
    {
      "id": 3,
      "title": "Career Relocation",
      "emoji": "🚀",
      "story": "<Story of relocation — sacrifice, growth, love>",
      "compatibilityScore": <adjusted score — may be higher or lower than baseline depending on profiles>,
      "metrics": {
        "communication": <0-100>,
        "trust": <0-100>,
        "conflict": <0-100>,
        "growth": <0-100>,
        "longTermSuccess": <0-100>
      },
      "aiExplanation": "<2 sentences>",
      "keyMoments": ["<moment 1>", "<moment 2>", "<moment 3>"]
    }
  ],
  "whatChanged": [
    {
      "from": "Original Match",
      "to": "Same City",
      "fromScore": <original match score — use timelines[1].compatibilityScore as reference>,
      "toScore": <same city score>,
      "direction": "up" or "down" or "same",
      "reason": "<1 sentence explaining the specific score change — reference their professions/hobbies/deal-breakers>"
    },
    {
      "from": "Same City",
      "to": "Long Distance",
      "fromScore": <same city score>,
      "toScore": <long distance score>,
      "direction": "up" or "down" or "same",
      "reason": "<1 sentence — what specifically suffers or improves in long distance for this pair>"
    },
    {
      "from": "Long Distance",
      "to": "Career Relocation",
      "fromScore": <long distance score>,
      "toScore": <career relocation score>,
      "direction": "up" or "down" or "same",
      "reason": "<1 sentence — why relocation changes things for this specific pair>"
    }
  ]
}`;

    try {
        const text = await callGemini(prompt);
        const parsed = parseJSON(text);
        if (parsed?.timelines) return parsed;
        return getFallbackTimelines(target, match);
    } catch (err) {
        console.error('Gemini parallel hearts error:', err);
        return getFallbackTimelines(target, match);
    }
}

/**
 * Generate AI conversation starters
 */
export async function generateConversationStarters(target, match) {
    const prompt = `You are Romeo, a witty and romantic AI. Generate 5 unique conversation starters for:

${target.name} (${target.profession}, loves ${target.hobbies?.slice(0, 3).join(', ')}) 
wants to start a conversation with 
${match.name} (${match.profession}, loves ${match.hobbies?.slice(0, 3).join(', ')}).

Common interests: ${target.hobbies?.filter(h => match.hobbies?.includes(h)).join(', ') || 'travel and life'}

Make them creative, specific to their profiles, not generic. Mix playful and thoughtful.

Return ONLY valid JSON:
{
  "starters": [
    {"type": "playful", "text": "<opener>", "emoji": "<emoji>"},
    {"type": "intellectual", "text": "<opener>", "emoji": "<emoji>"},
    {"type": "shared-interest", "text": "<opener>", "emoji": "<emoji>"},
    {"type": "deep", "text": "<opener>", "emoji": "<emoji>"},
    {"type": "funny", "text": "<opener>", "emoji": "<emoji>"}
  ]
}`;

    try {
        const text = await callGemini(prompt);
        const parsed = parseJSON(text);
        return parsed?.starters || getDefaultStarters(target, match);
    } catch (err) {
        console.error('Gemini conversation starters error:', err);
        return getDefaultStarters(target, match);
    }
}

/**
 * Generate full structured compatibility report (PS1 requirement)
 * Returns: summary, pros (3), cons (3), tradeoffs, advice, verdict — all as JSON
 */
export async function generateDetailedReport(target, match, score, breakdown) {
    const sharedHobbies = (target.hobbies || []).filter(h =>
        (match.hobbies || []).map(x => x.toLowerCase()).includes(h.toLowerCase())
    );
    const sharedValues = (target.values || []).filter(v =>
        (match.values || []).map(x => x.toLowerCase()).includes(v.toLowerCase())
    );

    const prompt = `You are Romeo, an expert AI relationship analyst. Analyze the compatibility between these two people and return a detailed report.

PERSON 1: ${target.name} (${target.age}, ${target.profession}, ${target.city})
- Personality: ${target.personality}
- Values: ${target.values?.join(', ')}
- Hobbies: ${target.hobbies?.join(', ')}
- Relationship Goal: ${target.relationshipGoal}
- Drinking: ${target.drinking} | Smoking: ${target.smoking} | Pets: ${target.pets}
- Deal Breakers: ${target.dealBreakers?.join(', ')}
- Bio: ${target.bio}

PERSON 2: ${match.name} (${match.age}, ${match.profession}, ${match.city})
- Personality: ${match.personality}
- Values: ${match.values?.join(', ')}
- Hobbies: ${match.hobbies?.join(', ')}
- Relationship Goal: ${match.relationshipGoal}
- Drinking: ${match.drinking} | Smoking: ${match.smoking} | Pets: ${match.pets}
- Deal Breakers: ${match.dealBreakers?.join(', ')}
- Bio: ${match.bio}

COMPATIBILITY SCORES:
- Overall: ${score}%
- Hobbies: ${breakdown.hobbies}% | Values: ${breakdown.values}% | Personality: ${breakdown.personality}%
- Lifestyle: ${breakdown.lifestyle}% | Goals: ${breakdown.goals}% | Location: ${breakdown.location}%
- Shared hobbies: ${sharedHobbies.join(', ') || 'none'}
- Shared values: ${sharedValues.join(', ') || 'none'}

Generate a deeply human, specific, non-generic report. Reference their actual professions, hobbies, and deal breakers.

Return ONLY valid JSON (no markdown):
{
  "summary": "<2–3 sentence compelling summary of why these two people are a ${score}% match — specific, warm, referencing their actual profiles>",
  "pros": [
    "<Pro 1 — specific to their profiles, not generic>",
    "<Pro 2>",
    "<Pro 3>"
  ],
  "cons": [
    "<Con 1 — honest, specific>",
    "<Con 2>",
    "<Con 3>"
  ],
  "tradeoffs": [
    "<Trade-off 1 — a genuine tension that requires conscious compromise>",
    "<Trade-off 2>"
  ],
  "relationshipAdvice": "<3–4 sentences of practical, specific relationship advice for this exact pair — what they should watch out for, how to leverage their strengths, what conversations to have early>",
  "verdict": "<One definitive sentence — the final Romeo verdict on this match. Bold, direct, warm.>",
  "verdictScore": <overall score as integer>,
  "verdictEmoji": "<single emoji that captures this match>"
}`;

    try {
        const text = await callGemini(prompt);
        const parsed = parseJSON(text);
        if (parsed) return parsed;
        throw new Error('Invalid JSON response');
    } catch (err) {
        console.error('Gemini detailed report error:', err);
        // Deterministic fallback built from real profile data
        return buildFallbackReport(target, match, score, breakdown, sharedHobbies, sharedValues);
    }
}

/**
 * Build a rich fallback report without the API
 */
function buildFallbackReport(target, match, score, breakdown, sharedHobbies, sharedValues) {
    const pros = [];
    const cons = [];
    const tradeoffs = [];

    // Pros — specific
    if (sharedValues.length >= 2)
        pros.push(`Both value ${sharedValues.slice(0, 2).join(' and ')}, giving this relationship a strong philosophical backbone from day one.`);
    else if (breakdown.values >= 60)
        pros.push('Overlapping core values mean fewer fundamental disagreements about what matters in life.');

    if (sharedHobbies.length >= 2)
        pros.push(`Shared love of ${sharedHobbies.slice(0, 2).join(' and ')} gives them ready-made quality time that feels natural, not forced.`);
    else if (breakdown.hobbies >= 40)
        pros.push('Enough common interests to fill weekends without either person sacrificing their passions.');

    if (breakdown.personality >= 75)
        pros.push(`${target.personality} and ${match.personality} are classically complementary — one brings the energy the other needs most.`);
    else if (breakdown.lifestyle >= 70)
        pros.push(`Compatible lifestyles (smoking: ${target.smoking === match.smoking ? 'matched' : 'close'}, drinking habits aligned) reduce daily friction significantly.`);
    else
        pros.push('A ${score}% overall compatibility score indicates genuine potential across multiple key dimensions.');

    while (pros.length < 3)
        pros.push(['Mutual respect forms a solid base for growth.', 'Both show emotional maturity in their bios.', 'Different professional backgrounds create interesting cross-pollination of ideas.'][pros.length - 1] || 'Strong overall alignment on what makes a relationship work.');

    // Cons — specific
    if (target.city !== match.city)
        cons.push(`${target.city} vs ${match.city} — geography is the first real test. Closing the distance requires a concrete plan, not just good intentions.`);

    if (target.relationshipGoal !== match.relationshipGoal)
        cons.push(`${target.name} wants ${target.relationshipGoal.replace('-', ' ')} while ${match.name} is seeking ${match.relationshipGoal.replace('-', ' ')} — this timeline mismatch needs an honest early conversation.`);
    else if (breakdown.lifestyle < 55)
        cons.push('Lifestyle differences in drinking habits and daily routines could surface as low-grade friction over time.');

    if (breakdown.personality < 65)
        cons.push(`${target.personality} vs ${match.personality} — their communication styles differ enough that misreads are likely early on. Intentional patience helps.`);
    else
        cons.push('Individual independence levels differ and will need negotiation around personal space vs. togetherness.');

    while (cons.length < 3)
        cons.push(['Different social energy levels may require compromise on weekend plans.', 'Career ambitions could pull in different directions without aligned long-term vision.', 'Different love languages may mean effort feels invisible to the other person initially.'][cons.length - 1] || 'Adjustment period expected as with any real relationship.');

    // Tradeoffs
    if (breakdown.values >= 60 && breakdown.hobbies < 45)
        tradeoffs.push(`Deep values alignment (${breakdown.values}%) compensates for fewer shared hobbies — they\'ll connect more through conversation than activity.`);
    if (breakdown.personality >= 70 && breakdown.lifestyle < 60)
        tradeoffs.push('Excellent personality fit comes with some lifestyle mismatches — the chemistry is real but daily habits need alignment.');
    if (tradeoffs.length === 0)
        tradeoffs.push(`At ${score}% overall, the strongest areas (${breakdown.values >= breakdown.hobbies ? 'values' : 'hobbies'} at ${Math.max(breakdown.values, breakdown.hobbies)}%) carry the weaker ones — which is exactly how real compatibility works.`);
    tradeoffs.push(`${target.name}\'s ${target.personality} independence and ${match.name}\'s ${match.personality} tendencies will sometimes pull against each other — and that tension, managed well, is actually healthy.`);

    const advice = `${target.name} and ${match.name} should have the goals conversation early — not to pressure each other, but to ensure they\'re walking in the same direction. Lean into the shared ${sharedHobbies[0] || 'interests'} as your bonding ground while you build trust. ${breakdown.personality < 70 ? `Watch for communication style clashes between ${target.personality} and ${match.personality} — they\'re real but very workable. ` : ''}The deal breakers on both sides are reasonable, which means neither person is hiding a fundamental incompatibility.`;

    const verdictMap = {
        90: ['This is the rare kind of match worth taking seriously from the start.', '🔥'],
        80: ['Strong, real, and worth every bit of effort — this one has legs.', '💘'],
        70: ['More than good enough to build something meaningful on — go in with open eyes.', '💛'],
        60: ['Promising but not effortless — which, honestly, is how the best relationships start.', '🤝'],
    };
    const tier = Object.keys(verdictMap).reverse().find(t => score >= Number(t)) || '60';
    const [verdict, verdictEmoji] = verdictMap[tier];

    return { summary: `${target.name} and ${match.name} connect on ${score}% of the dimensions that matter most — particularly ${sharedValues.length ? sharedValues.slice(0, 2).join(' and ') : 'personality and lifestyle'}. ${sharedHobbies.length ? `Their shared passion for ${sharedHobbies[0]} is a natural starting point for something real.` : 'While their hobbies differ, their deeper motivations are well-aligned.'} This isn't a perfect match on paper — it's better: it's a match with honest potential.`, pros: pros.slice(0, 3), cons: cons.slice(0, 3), tradeoffs: tradeoffs.slice(0, 2), relationshipAdvice: advice, verdict, verdictScore: score, verdictEmoji };
}

/**
 * Generate compatibility summary text
 */
export async function generateCompatibilitySummary(target, match, score) {
    const prompt = `You are Romeo, an AI matchmaker. Write a 2-sentence compelling summary of why ${target.name} and ${match.name} are a ${score}% match. 
They share: ${target.hobbies?.filter(h => match.hobbies?.includes(h)).slice(0, 3).join(', ') || 'similar values'}.
${target.name} is a ${target.profession} and ${match.name} is a ${match.profession}.
Keep it warm, specific, and uplifting. No more than 50 words total.`;

    try {
        const text = await callGemini(prompt);
        return text.trim().replace(/^["']|["']$/g, '');
    } catch {
        return `${target.name} and ${match.name} share a ${score}% compatibility built on aligned values and complementary personalities. Their connection has the depth to grow into something truly meaningful.`;
    }
}

// ─── Fallback data (when API unavailable) ─────────────────────────────────────

function getFallbackTimelines(target, match) {
    const s1 = 84, s2 = 68, s3 = 79; // same-city, long-distance, relocation scores
    return {
        timelines: [
            {
                id: 1,
                title: 'Same City',
                emoji: '🏙️',
                compatibilityScore: s1,
                story: `In the same city, ${target.name} and ${match.name} discover each other through a mutual friend. Their first coffee date runs to three hours — then four. Shared ${(target.hobbies?.filter(h => match.hobbies?.includes(h))[0]) || 'interests'} become weekend rituals, and quiet Sunday mornings start to feel like home.`,
                metrics: { communication: 88, trust: 85, conflict: 25, growth: 82, longTermSuccess: 86 },
                aiExplanation: 'Physical proximity amplifies their natural chemistry. Organic daily moments build a bond that deliberate effort rarely matches.',
                keyMoments: ['First accidental meeting', 'Moving in together after 18 months', '5-year anniversary road trip'],
            },
            {
                id: 2,
                title: 'Long Distance',
                emoji: '✈️',
                compatibilityScore: s2,
                story: `Miles apart, ${target.name} and ${match.name} build their relationship through late-night calls and meticulously planned visits. Every reunion feels like a first date — heightened and luminous. Distance sharpens their communication but the emotional weight of goodbye accumulates with each flight.`,
                metrics: { communication: 79, trust: 72, conflict: 45, growth: 68, longTermSuccess: 61 },
                aiExplanation: 'Distance forces intentional communication but starves the relationship of the ordinary moments that build lasting trust. A concrete plan to close the gap is essential.',
                keyMoments: ['First video call that lasted until 3am', 'Surprise airport visit', 'The conversation about who moves'],
            },
            {
                id: 3,
                title: 'Career Relocation',
                emoji: '🚀',
                compatibilityScore: s3,
                story: `When ${match.name} lands a career-defining opportunity in a new city, ${target.name} faces the hardest decision of their life. They choose love — and the sacrifice reshapes both of them. A new city, a shared apartment, and the quiet courage of starting over together becomes the foundation neither expected to need.`,
                metrics: { communication: 84, trust: 80, conflict: 38, growth: 91, longTermSuccess: 78 },
                aiExplanation: 'The shared sacrifice deepens commitment and trust in ways that comfortable proximity rarely demands. Personal growth accelerates because both people are navigating newness together.',
                keyMoments: ['The difficult honest conversation', 'First night in the new apartment', 'Realizing home is a person, not a place'],
            },
        ],
        whatChanged: [
            {
                from: 'Original Match',
                to: 'Same City',
                fromScore: 75,
                toScore: s1,
                direction: 'up',
                reason: `Shared city removes logistical friction — more spontaneous time together amplifies what already works between a ${target.personality} and ${match.personality} pairing.`,
            },
            {
                from: 'Same City',
                to: 'Long Distance',
                fromScore: s1,
                toScore: s2,
                direction: 'down',
                reason: `Communication frequency drops and the organic daily bonding disappears — ${target.name}'s and ${match.name}'s connection relies on presence more than most.`,
            },
            {
                from: 'Long Distance',
                to: 'Career Relocation',
                fromScore: s2,
                toScore: s3,
                direction: 'up',
                reason: `Relocation resolves the distance tension and the shared act of sacrifice strengthens trust — though adapting to a new environment adds short-term conflict.`,
            },
        ],
    };
}

function getDefaultStarters(target, match) {
    const shared = target.hobbies?.filter(h => match.hobbies?.includes(h)) || [];
    return [
        { type: 'playful', text: `If you had to choose between a perfect ${shared[0] || 'adventure'} trip or a perfect lazy Sunday, which wins?`, emoji: '😄' },
        { type: 'intellectual', text: `I read that ${match.profession}s see the world differently. What's one thing about your work that changed how you think?`, emoji: '🧠' },
        { type: 'shared-interest', text: `I noticed we both love ${shared[0] || 'travel'}. What's the most underrated place you've been?`, emoji: '✨' },
        { type: 'deep', text: `What does a perfect Saturday look like for you — not the Instagram version, the real one?`, emoji: '💭' },
        { type: 'funny', text: `Hot take: ${shared[0] ? shared[0] + ' and' : ''} good conversation are the real love languages. Agree or fight me?`, emoji: '😂' },
    ];
}
