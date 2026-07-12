/**
 * Romeo Matchmaking Engine
 * Handles compatibility scoring, filtering, and ranking logic
 */

// ─── Personality compatibility matrix ────────────────────────────────────────
const PERSONALITY_COMPAT = {
    INTJ: { ENFP: 0.95, ENTP: 0.90, INFJ: 0.85, ENTJ: 0.80, INTJ: 0.70, INFP: 0.75 },
    ENFP: { INTJ: 0.95, INFJ: 0.90, ENTP: 0.85, INFP: 0.80, ENFJ: 0.75, ENFP: 0.70 },
    INFJ: { ENFP: 0.90, ENTP: 0.85, INTJ: 0.85, INFP: 0.80, ENFJ: 0.90, INFJ: 0.70 },
    ENTP: { INFJ: 0.85, INTJ: 0.90, ENFP: 0.85, ENTJ: 0.80, INTP: 0.80, ENTP: 0.70 },
    ENTJ: { INFP: 0.85, INTP: 0.85, INTJ: 0.80, ENTP: 0.80, ISFP: 0.75, ENTJ: 0.65 },
    INFP: { ENFJ: 0.90, ENTJ: 0.85, INFJ: 0.80, ENFP: 0.80, INFP: 0.70, ISFJ: 0.75 },
    ENFJ: { INFP: 0.90, ISFP: 0.85, INFJ: 0.90, ENFP: 0.75, ENFJ: 0.65, ISFJ: 0.80 },
    ISFJ: { ESFP: 0.85, ESTP: 0.80, ENFJ: 0.80, INFP: 0.75, ISFJ: 0.70, ISTJ: 0.80 },
    ESFP: { ISFJ: 0.85, ISTJ: 0.80, ISFP: 0.75, ESFJ: 0.75, ESFP: 0.65, ENFP: 0.75 },
    ISTJ: { ESFP: 0.80, ESTP: 0.80, ESFJ: 0.85, ISFJ: 0.80, ISTJ: 0.70, ESTJ: 0.75 },
    ESTJ: { ISFP: 0.75, ISTP: 0.75, ISTJ: 0.75, ESFJ: 0.80, ESTJ: 0.65, ENTJ: 0.70 },
    INTP: { ENTJ: 0.85, ENTP: 0.80, INTJ: 0.80, INFJ: 0.75, INTP: 0.70, ISTP: 0.75 },
    ISTP: { ESTJ: 0.75, ENTJ: 0.70, ISFJ: 0.70, ESFJ: 0.75, ISTP: 0.65, ISTJ: 0.70 },
    ISFP: { ENFJ: 0.85, ESTJ: 0.75, ESFJ: 0.80, ISFJ: 0.75, ISFP: 0.65, INFJ: 0.75 },
    ESFJ: { ISTJ: 0.85, ISTP: 0.75, ISFP: 0.80, ESFJ: 0.65, ISFJ: 0.80, ENFJ: 0.75 },
};

/**
 * Get personality compatibility score (0–1)
 */
function getPersonalityScore(p1, p2) {
    if (!p1 || !p2) return 0.5;
    const score = PERSONALITY_COMPAT[p1]?.[p2] ?? PERSONALITY_COMPAT[p2]?.[p1] ?? 0.5;
    return score;
}

/**
 * Shared hobbies score (0–1)
 */
function getHobbyScore(hobbies1, hobbies2) {
    if (!hobbies1?.length || !hobbies2?.length) return 0;
    const set1 = new Set(hobbies1.map(h => h.toLowerCase()));
    const shared = hobbies2.filter(h => set1.has(h.toLowerCase())).length;
    const maxPossible = Math.max(hobbies1.length, hobbies2.length);
    return Math.min(shared / maxPossible, 1);
}

/**
 * Values alignment score (0–1)
 */
function getValuesScore(values1, values2) {
    if (!values1?.length || !values2?.length) return 0;
    const set1 = new Set(values1.map(v => v.toLowerCase()));
    const shared = values2.filter(v => set1.has(v.toLowerCase())).length;
    const maxPossible = Math.max(values1.length, values2.length);
    return Math.min(shared / maxPossible, 1);
}

/**
 * Lifestyle compatibility score (0–1)
 * Considers smoking, drinking, pets
 */
function getLifestyleScore(p1, p2) {
    let score = 1;
    let factors = 0;

    // Smoking match
    if (p1.smoking !== undefined && p2.smoking !== undefined) {
        score += p1.smoking === p2.smoking ? 1 : 0;
        factors++;
    }

    // Drinking match (exact or close)
    const drinkMap = { false: 0, 'rarely': 1, 'occasionally': 2, 'socially': 3, 'regularly': 4 };
    if (p1.drinking !== undefined && p2.drinking !== undefined) {
        const d1 = drinkMap[p1.drinking] ?? 0;
        const d2 = drinkMap[p2.drinking] ?? 0;
        const diff = Math.abs(d1 - d2);
        score += diff === 0 ? 1 : diff === 1 ? 0.7 : diff === 2 ? 0.4 : 0.1;
        factors++;
    }

    // Pets
    if (p1.pets !== undefined && p2.pets !== undefined) {
        score += p1.pets === p2.pets ? 1 : 0.5;
        factors++;
    }

    return factors > 0 ? (score - 1) / factors : 0.5;
}

/**
 * Location proximity score (0–1)
 */
function getLocationScore(city1, city2) {
    if (!city1 || !city2) return 0.5;
    if (city1.toLowerCase() === city2.toLowerCase()) return 1;
    // Same metro region bonus
    const metros = [
        ['Mumbai', 'Pune', 'Nashik'],
        ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
        ['Bangalore', 'Mysore', 'Mangalore'],
        ['Hyderabad', 'Secunderabad'],
        ['Chennai', 'Coimbatore'],
        ['Kolkata', 'Howrah'],
    ];
    for (const metro of metros) {
        const in1 = metro.some(c => city1.toLowerCase().includes(c.toLowerCase()));
        const in2 = metro.some(c => city2.toLowerCase().includes(c.toLowerCase()));
        if (in1 && in2) return 0.75;
    }
    return 0.3;
}

/**
 * Relationship goal compatibility (0–1)
 */
function getGoalScore(goal1, goal2) {
    if (!goal1 || !goal2) return 0.5;
    if (goal1 === goal2) return 1;
    const compatible = {
        'long-term': ['marriage', 'casual-to-serious'],
        'marriage': ['long-term'],
        'casual-to-serious': ['long-term'],
        'casual': ['casual'],
    };
    return compatible[goal1]?.includes(goal2) ? 0.75 : 0.2;
}

/**
 * Language overlap score (0–1)
 */
function getLanguageScore(lang1, lang2) {
    if (!lang1?.length || !lang2?.length) return 0.5;
    const set1 = new Set(lang1.map(l => l.toLowerCase()));
    const shared = lang2.filter(l => set1.has(l.toLowerCase())).length;
    return shared > 0 ? Math.min(shared / 2, 1) : 0.1;
}

/**
 * Deal breaker check — returns true if profiles are incompatible
 */
function hasDealBreaker(target, candidate) {
    if (!target.dealBreakers?.length) return false;
    const breakers = target.dealBreakers.map(d => d.toLowerCase());

    // Check smoking
    if (breakers.includes('smoking') && candidate.smoking === true) return true;

    // Check drinking
    if (breakers.includes('heavy drinking') || breakers.includes('drinking heavily')) {
        if (candidate.drinking === 'regularly') return true;
    }

    // Check no ambition / lack of ambition
    const noAmbitionBreaker = breakers.some(b => b.includes('ambition'));
    if (noAmbitionBreaker) {
        const lowAmbitionJobs = ['student', 'unemployed'];
        if (lowAmbitionJobs.includes(candidate.profession?.toLowerCase())) return true;
    }

    return false;
}

/**
 * Age range check — ±5 years leniency if no explicit pref
 */
function isAgeCompatible(target, candidate) {
    const diff = Math.abs(target.age - candidate.age);
    return diff <= 7;
}

/**
 * Gender preference check
 */
function isGenderCompatible(target, candidate) {
    if (!target.interestedIn || !candidate.interestedIn) return false;
    const targetWants = target.interestedIn.toLowerCase();
    const candidateGender = candidate.gender.toLowerCase();
    const candidateWants = candidate.interestedIn.toLowerCase();
    const targetGender = target.gender.toLowerCase();

    return targetWants === candidateGender && candidateWants === targetGender;
}

// ─── Scoring weights ──────────────────────────────────────────────────────────
const WEIGHTS = {
    hobbies: 0.20,
    values: 0.20,
    personality: 0.18,
    lifestyle: 0.14,
    goals: 0.14,
    location: 0.08,
    languages: 0.06,
};

/**
 * Calculate full compatibility between target and candidate
 * Returns detailed score breakdown
 */
export function calculateCompatibility(target, candidate) {
    const scores = {
        hobbies: getHobbyScore(target.hobbies, candidate.hobbies),
        values: getValuesScore(target.values, candidate.values),
        personality: getPersonalityScore(target.personality, candidate.personality),
        lifestyle: getLifestyleScore(target, candidate),
        goals: getGoalScore(target.relationshipGoal, candidate.relationshipGoal),
        location: getLocationScore(target.city, candidate.city),
        languages: getLanguageScore(target.languages, candidate.languages),
    };

    const overall = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => {
        return sum + (scores[key] || 0) * weight;
    }, 0);

    return {
        overall: Math.round(overall * 100),
        breakdown: {
            hobbies: Math.round(scores.hobbies * 100),
            values: Math.round(scores.values * 100),
            personality: Math.round(scores.personality * 100),
            lifestyle: Math.round(scores.lifestyle * 100),
            goals: Math.round(scores.goals * 100),
            location: Math.round(scores.location * 100),
            languages: Math.round(scores.languages * 100),
        },
    };
}

/**
 * Get shared tags between two profiles
 */
export function getSharedTags(target, candidate) {
    const tags = [];
    const sharedHobbies = (target.hobbies || []).filter(h =>
        (candidate.hobbies || []).map(x => x.toLowerCase()).includes(h.toLowerCase())
    );
    const sharedValues = (target.values || []).filter(v =>
        (candidate.values || []).map(x => x.toLowerCase()).includes(v.toLowerCase())
    );
    const sharedLangs = (target.languages || []).filter(l =>
        (candidate.languages || []).map(x => x.toLowerCase()).includes(l.toLowerCase())
    );

    sharedHobbies.slice(0, 3).forEach(h => tags.push({ label: h, type: 'hobby' }));
    sharedValues.slice(0, 2).forEach(v => tags.push({ label: v, type: 'value' }));
    if (target.city === candidate.city) tags.push({ label: 'Same City', type: 'location' });
    if (target.relationshipGoal === candidate.relationshipGoal)
        tags.push({ label: 'Same Goal', type: 'goal' });
    sharedLangs.slice(0, 1).forEach(l => tags.push({ label: l, type: 'language' }));

    return tags.slice(0, 6);
}

/**
 * Filter and rank matches for a target profile
 * Returns Top 10 compatible matches with scores
 */
export function findMatches(target, allProfiles) {
    const candidates = allProfiles.filter(p => {
        if (p.id === target.id) return false;
        if (!isGenderCompatible(target, p)) return false;
        if (!isAgeCompatible(target, p)) return false;
        if (hasDealBreaker(target, p)) return false;
        if (hasDealBreaker(p, target)) return false;
        return true;
    });

    const scored = candidates.map(candidate => {
        const compat = calculateCompatibility(target, candidate);
        const tags = getSharedTags(target, candidate);
        return {
            profile: candidate,
            score: compat.overall,
            breakdown: compat.breakdown,
            tags,
        };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 10);
}

/**
 * Generate pros/cons/tradeoffs from score breakdown
 */
export function generateInsights(target, candidate, breakdown) {
    const pros = [];
    const cons = [];
    const tradeoffs = [];
    const strengths = [];
    const risks = [];

    if (breakdown.values >= 60) pros.push('Strong shared values create a solid foundation');
    if (breakdown.hobbies >= 50) pros.push(`Common interests in ${getSharedTags(target, candidate).filter(t => t.type === 'hobby').map(t => t.label).join(', ') || 'multiple areas'}`);
    if (breakdown.personality >= 75) pros.push('Personality types are highly complementary');
    if (breakdown.lifestyle >= 70) pros.push('Compatible lifestyle choices reduce daily friction');
    if (breakdown.goals === 100) pros.push('Identical relationship goals align your futures');
    if (breakdown.location === 100) pros.push('Same city means convenience and more quality time');
    if (breakdown.languages >= 70) pros.push('Shared languages enable deeper communication');

    if (breakdown.values < 40) cons.push('Different core values may cause philosophical conflicts');
    if (breakdown.hobbies < 30) cons.push('Few shared hobbies may limit quality time activities');
    if (breakdown.lifestyle < 50) cons.push('Lifestyle differences could create day-to-day tension');
    if (breakdown.goals < 70) cons.push('Slightly different relationship timelines may need negotiation');
    if (breakdown.location < 50) cons.push('Distance requires effort and intentional planning');
    if (breakdown.personality < 60) cons.push('Personality differences may require extra understanding');

    if (breakdown.values >= 50 && breakdown.hobbies < 40) tradeoffs.push('Deep values match compensates for fewer shared activities');
    if (breakdown.personality >= 70 && breakdown.lifestyle < 60) tradeoffs.push('Great personality fit may require lifestyle compromises');
    if (breakdown.location < 50 && breakdown.goals === 100) tradeoffs.push('Distance is the main hurdle despite aligned life goals');

    if (breakdown.values >= 60 && breakdown.personality >= 70) strengths.push('Emotional and intellectual compatibility is strong');
    if (breakdown.hobbies >= 50 && breakdown.lifestyle >= 60) strengths.push('Shared activities and habits will make everyday life enjoyable');
    if (breakdown.goals >= 75) strengths.push('Aligned futures reduce long-term uncertainty');

    if (breakdown.lifestyle < 50) risks.push('Lifestyle differences may escalate over time');
    if (breakdown.location < 40) risks.push('Long-distance requires exceptional communication skills');
    if (breakdown.values < 40) risks.push('Value misalignment can surface in major life decisions');

    return {
        pros: pros.length ? pros : ['Compatible enough to build something meaningful'],
        cons: cons.length ? cons : ['No major incompatibilities detected'],
        tradeoffs: tradeoffs.length ? tradeoffs : ['Minor adjustments expected in any relationship'],
        strengths: strengths.length ? strengths : ['Mutual respect forms the base of this connection'],
        risks: risks.length ? risks : ['Low risk profile with manageable challenges'],
    };
}

/**
 * Red flags detector
 */
export function detectRedFlags(target, candidate) {
    const flags = [];

    if (candidate.smoking && target.dealBreakers?.includes('smoking'))
        flags.push({ severity: 'high', label: 'Smoking habit conflicts with your deal breaker' });

    const drinkLevels = { false: 0, rarely: 1, occasionally: 2, socially: 3, regularly: 4 };
    const diff = Math.abs((drinkLevels[target.drinking] ?? 0) - (drinkLevels[candidate.drinking] ?? 0));
    if (diff >= 3) flags.push({ severity: 'medium', label: 'Significant drinking habit difference' });

    if (target.relationshipGoal !== candidate.relationshipGoal)
        flags.push({ severity: 'medium', label: `Different goals: you want ${target.relationshipGoal}, they want ${candidate.relationshipGoal}` });

    const ageDiff = Math.abs(target.age - candidate.age);
    if (ageDiff >= 5) flags.push({ severity: 'low', label: `Age gap of ${ageDiff} years — minor consideration` });

    if (target.city !== candidate.city)
        flags.push({ severity: 'low', label: `Different cities (${target.city} vs ${candidate.city})` });

    return flags;
}
