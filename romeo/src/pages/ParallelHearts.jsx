/**
 * Parallel Hearts Page
 * Alternate Reality Relationship Simulator
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, RotateCcw, TrendingUp, MessageCircle, Shield, Zap, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateParallelHearts } from '../utils/geminiService';

const METRIC_CONFIG = {
    communication: { label: 'Communication', icon: MessageCircle, color: '#06b6d4' },
    trust: { label: 'Trust', icon: Shield, color: '#22c55e' },
    conflict: { label: 'Conflict Level', icon: Zap, color: '#ef4444', inverted: true },
    growth: { label: 'Personal Growth', icon: TrendingUp, color: '#a855f7' },
    longTermSuccess: { label: 'Long-term Success', icon: Target, color: '#f59e0b' },
};

const TIMELINE_GRADIENTS = [
    'from-blue-600/20 to-cyan-600/20',
    'from-purple-600/20 to-pink-600/20',
    'from-orange-600/20 to-red-600/20',
];

const TIMELINE_BORDERS = [
    'border-blue-500/30',
    'border-purple-500/30',
    'border-orange-500/30',
];

export default function ParallelHearts() {
    const { selectedProfile, selectedMatch } = useApp();
    const navigate = useNavigate();

    const [timelines, setTimelines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTimeline, setActiveTimeline] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!selectedProfile || !selectedMatch) {
            navigate('/matches');
            return;
        }
        if (!hasLoaded) {
            loadTimelines();
        }
    }, [selectedProfile, selectedMatch]);

    async function loadTimelines() {
        setLoading(true);
        setHasLoaded(true);
        try {
            const data = await generateParallelHearts(selectedProfile, selectedMatch.profile);
            setTimelines(data);
            setActiveTimeline(data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (!selectedProfile || !selectedMatch) return null;

    return (
        <div className="min-h-screen animated-bg pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/compatibility-report')}
                        className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Report
                    </button>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-pink-500/30 text-pink-400 text-sm font-medium mb-3">
                                <Sparkles className="w-4 h-4" />
                                Parallel Hearts — Alternate Reality Simulator
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white">
                                <span className="gradient-text">{selectedProfile.name}</span> & <span className="gradient-text">{selectedMatch.profile.name}</span>
                            </h1>
                            <p className="text-gray-400 mt-1">Three alternate timelines. One love story. Infinite possibilities.</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={loadTimelines}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-gray-300 hover:text-white text-sm"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Regenerate
                        </motion.button>
                    </div>
                </motion.div>

                {/* Profile pair */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-5 mb-8 flex items-center justify-center gap-6"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={selectedProfile.avatar}
                            alt={selectedProfile.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500"
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProfile.name)}&background=1a1a2e&color=7c3aed`; }}
                        />
                        <div>
                            <p className="font-bold text-white">{selectedProfile.name}</p>
                            <p className="text-gray-400 text-xs">{selectedProfile.profession} · {selectedProfile.city}</p>
                        </div>
                    </div>

                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="text-4xl"
                    >
                        💞
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-bold text-white">{selectedMatch.profile.name}</p>
                            <p className="text-gray-400 text-xs">{selectedMatch.profile.profession} · {selectedMatch.profile.city}</p>
                        </div>
                        <img
                            src={selectedMatch.profile.avatar}
                            alt={selectedMatch.profile.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-500"
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMatch.profile.name)}&background=1a1a2e&color=e91e8c`; }}
                        />
                    </div>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <LoadingSpinner text="Gemini AI is writing your alternate love stories..." />
                )}

                {/* Timeline Cards */}
                {!loading && timelines.length > 0 && (
                    <>
                        {/* Timeline selector */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {timelines.map((tl, i) => (
                                <motion.button
                                    key={tl.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setActiveTimeline(tl)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTimeline?.id === tl.id
                                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                            : 'glass border border-white/10 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <span className="text-xl">{tl.emoji}</span>
                                    {tl.title}
                                </motion.button>
                            ))}
                        </div>

                        {/* Active timeline detail */}
                        <AnimatePresence mode="wait">
                            {activeTimeline && (
                                <motion.div
                                    key={activeTimeline.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-5"
                                >
                                    {/* Story card */}
                                    <div
                                        className={`rounded-3xl p-8 bg-gradient-to-br ${TIMELINE_GRADIENTS[activeTimeline.id - 1]} border ${TIMELINE_BORDERS[activeTimeline.id - 1]} relative overflow-hidden`}
                                    >
                                        {/* Decorative glow */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl -translate-y-32 translate-x-32" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-5">
                                                <span className="text-5xl">{activeTimeline.emoji}</span>
                                                <div>
                                                    <h2 className="text-2xl font-black text-white">Timeline {activeTimeline.id}: {activeTimeline.title}</h2>
                                                    <p className="text-gray-400 text-sm">Alternate Reality Scenario</p>
                                                </div>
                                            </div>

                                            <p className="text-gray-200 text-lg leading-relaxed font-light">
                                                {activeTimeline.story}
                                            </p>

                                            {/* Key moments */}
                                            {activeTimeline.keyMoments?.length > 0 && (
                                                <div className="mt-6">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Key Moments</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {activeTimeline.keyMoments.map((moment, i) => (
                                                            <motion.span
                                                                key={i}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="text-sm px-3 py-1.5 rounded-full glass border border-white/10 text-gray-300"
                                                            >
                                                                ✨ {moment}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="glass rounded-2xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-6">Relationship Metrics</h3>
                                        <div className="space-y-5">
                                            {Object.entries(METRIC_CONFIG).map(([key, config], i) => {
                                                const val = activeTimeline.metrics?.[key] || 0;
                                                const Icon = config.icon;
                                                const displayVal = config.inverted ? (100 - val) : val;
                                                const barWidth = config.inverted ? (100 - val) : val;

                                                return (
                                                    <motion.div
                                                        key={key}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4" style={{ color: config.color }} />
                                                                <span className="text-sm font-medium text-white">{config.label}</span>
                                                                {config.inverted && (
                                                                    <span className="text-xs text-gray-500">(lower is better)</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-white font-bold text-sm">{val}%</span>
                                                                <div
                                                                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                                    style={{
                                                                        color: config.color,
                                                                        background: `${config.color}20`,
                                                                        border: `1px solid ${config.color}40`,
                                                                    }}
                                                                >
                                                                    {displayVal >= 70 ? 'High' : displayVal >= 50 ? 'Medium' : 'Low'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${val}%` }}
                                                                transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                                                                className="h-full rounded-full"
                                                                style={{ background: config.color }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* AI Explanation */}
                                    <div className="glass rounded-2xl p-5"
                                        style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                            <h3 className="font-bold text-white">AI Analysis</h3>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{activeTimeline.aiExplanation}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* All timelines comparison */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 glass rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-5">Timeline Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                            <td className="pb-3 pr-4">Metric</td>
                                            {timelines.map(tl => (
                                                <td key={tl.id} className="pb-3 px-3 text-center">
                                                    {tl.emoji} {tl.title}
                                                </td>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="space-y-2">
                                        {Object.entries(METRIC_CONFIG).map(([key, config]) => (
                                            <tr key={key} className="border-t border-white/5">
                                                <td className="py-3 pr-4">
                                                    <span className="text-gray-400">{config.label}</span>
                                                </td>
                                                {timelines.map(tl => {
                                                    const val = tl.metrics?.[key] || 0;
                                                    return (
                                                        <td key={tl.id} className="py-3 px-3 text-center">
                                                            <span
                                                                className="font-bold"
                                                                style={{
                                                                    color: val >= 70 ? '#22c55e' : val >= 50 ? '#f59e0b' : '#ef4444',
                                                                }}
                                                            >
                                                                {val}%
                                                            </span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
