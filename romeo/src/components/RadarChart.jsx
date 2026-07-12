/**
 * Compatibility Radar Chart
 * Built with recharts — shows category-wise scores
 */
import {
    RadarChart as RechartsRadar,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const LABELS = {
    hobbies: 'Hobbies',
    values: 'Values',
    personality: 'Personality',
    lifestyle: 'Lifestyle',
    goals: 'Goals',
    location: 'Location',
    languages: 'Languages',
};

export default function RadarChart({ breakdown }) {
    const data = Object.entries(breakdown || {}).map(([key, val]) => ({
        subject: LABELS[key] || key,
        score: val,
        fullMark: 100,
    }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <RechartsRadar data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid
                    stroke="rgba(255,255,255,0.1)"
                    gridType="polygon"
                />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <Radar
                    name="Compatibility"
                    dataKey="score"
                    stroke="#e91e8c"
                    fill="#e91e8c"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    dot={{ fill: '#e91e8c', r: 3 }}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(15,15,26,0.95)',
                        border: '1px solid rgba(233,30,140,0.3)',
                        borderRadius: 12,
                        color: '#fff',
                    }}
                    formatter={(val) => [`${val}%`, 'Score']}
                />
            </RechartsRadar>
        </ResponsiveContainer>
    );
}
