/**
 * Score Ring Component
 * Animated circular score indicator
 */
import { motion } from 'framer-motion';

export default function ScoreRing({ score, size = 60, strokeWidth = 4 }) {
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    function getColor(s) {
        if (s >= 80) return ['#22c55e', '#10b981'];
        if (s >= 65) return ['#f59e0b', '#f97316'];
        return ['#e91e8c', '#7c3aed'];
    }

    const [c1, c2] = getColor(score);
    const gradId = `scoreGrad-${score}-${size}`;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={c1} />
                        <stop offset="100%" stopColor={c2} />
                    </linearGradient>
                </defs>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                />
                {/* Score arc */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{score}%</span>
            </div>
        </div>
    );
}
