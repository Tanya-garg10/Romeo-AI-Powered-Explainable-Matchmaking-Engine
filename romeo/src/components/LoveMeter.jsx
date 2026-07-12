/**
 * Love Meter Component
 * Animated love meter bar with heart pulsing effect
 */
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

function getLoveTier(score) {
    if (score >= 90) return { label: 'Soulmates', color: '#e91e8c', emoji: '💞' };
    if (score >= 80) return { label: 'Perfect Match', color: '#f97316', emoji: '💖' };
    if (score >= 70) return { label: 'Great Chemistry', color: '#eab308', emoji: '💛' };
    if (score >= 60) return { label: 'Good Potential', color: '#22c55e', emoji: '💚' };
    if (score >= 50) return { label: 'Interesting', color: '#06b6d4', emoji: '💙' };
    return { label: 'Worth Exploring', color: '#8b5cf6', emoji: '💜' };
}

export default function LoveMeter({ score }) {
    const tier = getLoveTier(score);

    return (
        <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-white text-lg">Love Meter</h3>
                    <p className="text-gray-400 text-sm">Emotional compatibility gauge</p>
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                    <Heart className="w-8 h-8 fill-pink-500 text-pink-500" />
                </motion.div>
            </div>

            {/* Meter track */}
            <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden mb-3">
                {/* Animated fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                        background: `linear-gradient(90deg, #7c3aed, ${tier.color}, #e91e8c)`,
                    }}
                >
                    {/* Shimmer */}
                    <motion.div
                        className="absolute inset-0 opacity-40"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    />
                </motion.div>

                {/* Score label inside */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white mix-blend-difference">
                        {score}% {tier.emoji}
                    </span>
                </div>
            </div>

            {/* Tier segments */}
            <div className="flex justify-between text-xs text-gray-600 mb-3 px-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
            </div>

            {/* Tier badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl"
                style={{ background: `${tier.color}20`, border: `1px solid ${tier.color}40` }}
            >
                <span className="text-lg">{tier.emoji}</span>
                <span className="font-bold text-white">{tier.label}</span>
            </motion.div>

            {/* Heart ticks */}
            <div className="flex justify-between mt-3 px-1">
                {[20, 40, 60, 80, 100].map(mark => (
                    <motion.div
                        key={mark}
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: score >= mark ? 1 : 0.15 }}
                        transition={{ delay: 0.3 + mark / 100 }}
                    >
                        <Heart
                            className="w-4 h-4"
                            style={{ color: score >= mark ? tier.color : '#374151' }}
                            fill={score >= mark ? tier.color : 'transparent'}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
