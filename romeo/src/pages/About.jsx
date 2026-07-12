/**
 * About Page
 * Technical details, team, and project info
 */
import { motion } from 'framer-motion';
import { Heart, Brain, Sparkles, Code, ExternalLink, Zap } from 'lucide-react';

const TECH_STACK = [
    { name: 'React + Vite', desc: 'Lightning-fast frontend', icon: '⚛️' },
    { name: 'Tailwind CSS', desc: 'Utility-first styling', icon: '🎨' },
    { name: 'Framer Motion', desc: 'Fluid animations', icon: '✨' },
    { name: 'Gemini AI', desc: 'Reasoning & generation', icon: '🤖' },
    { name: 'Recharts', desc: 'Data visualization', icon: '📊' },
    { name: 'Express.js', desc: 'Backend ready', icon: '⚡' },
];

const PS_FEATURES = [
    {
        ps: 'PS1',
        title: 'Intelligent Matchmaker Engine',
        color: '#e91e8c',
        features: [
            '20 synthetic profiles with 17 attributes each',
            'Multi-factor filtering: age, gender, deal breakers, goals',
            'Weighted compatibility scoring (7 dimensions)',
            'Top 10 match ranking with tags and summaries',
            'Detailed compatibility reports with pros/cons/tradeoffs',
            'AI final recommendation comparing Top 3 matches',
        ],
    },
    {
        ps: 'PS2',
        title: 'Parallel Hearts',
        color: '#7c3aed',
        features: [
            'Alternate reality relationship simulator',
            'Three timeline scenarios: Same City, Long Distance, Career Relocation',
            'Story generation powered by Gemini AI',
            'Relationship metrics: communication, trust, conflict, growth',
            'Long-term success probability per timeline',
            'Timeline comparison table',
        ],
    },
];

const EXTRA_FEATURES = [
    { name: 'Love Meter', emoji: '💕', desc: 'Animated love gauge with tier labels' },
    { name: 'Compatibility Radar', emoji: '📡', desc: 'Multi-axis recharts radar visualization' },
    { name: 'AI Conversation Starters', emoji: '💬', desc: 'Gemini-personalized openers' },
    { name: 'Red Flag Detector', emoji: '🚩', desc: 'AI risk analysis with severity levels' },
    { name: 'Download PDF Report', emoji: '📄', desc: 'html2canvas + jsPDF export' },
    { name: 'Dark/Light Mode', emoji: '🌗', desc: 'Toggleable theme system' },
];

export default function About() {
    return (
        <div className="min-h-screen animated-bg pt-20 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-6xl mb-4"
                    >
                        💘
                    </motion.div>
                    <h1 className="text-5xl font-black text-white mb-4">
                        About <span className="gradient-text">Romeo</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        A production-ready AI matchmaking app built for the AI Matchmaking Hackathon.
                        Romeo combines intelligent algorithms with Gemini AI to find meaningful connections.
                    </p>
                </motion.div>

                {/* PS Features */}
                <div className="space-y-5 mb-10">
                    {PS_FEATURES.map((ps, i) => (
                        <motion.div
                            key={ps.ps}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-2xl p-6"
                            style={{ border: `1px solid ${ps.color}30` }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span
                                    className="text-xs font-black px-3 py-1.5 rounded-full"
                                    style={{ background: `${ps.color}20`, color: ps.color, border: `1px solid ${ps.color}40` }}
                                >
                                    {ps.ps}
                                </span>
                                <h2 className="text-xl font-bold text-white">{ps.title}</h2>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {ps.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span style={{ color: ps.color }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Extra Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-6 mb-10"
                >
                    <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Extra Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {EXTRA_FEATURES.map((f, i) => (
                            <motion.div
                                key={f.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className="p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all"
                            >
                                <div className="text-3xl mb-2">{f.emoji}</div>
                                <h3 className="font-bold text-white text-sm">{f.name}</h3>
                                <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-6 mb-10"
                >
                    <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                        <Code className="w-5 h-5 text-cyan-400" />
                        Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TECH_STACK.map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8"
                            >
                                <span className="text-2xl">{tech.icon}</span>
                                <div>
                                    <p className="text-white font-medium text-sm">{tech.name}</p>
                                    <p className="text-gray-500 text-xs">{tech.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Gemini Setup */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-6 mb-10"
                    style={{ border: '1px solid rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.03)' }}
                >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-cyan-400" />
                        Gemini AI Setup
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Romeo uses Gemini 2.0 Flash for AI reasoning. To enable AI features:
                    </p>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
                        <p className="text-gray-500"># Create .env file in /romeo</p>
                        <p className="text-cyan-400">VITE_GEMINI_API_KEY=your_key_here</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-3">
                        Get your free API key at <span className="text-cyan-400">aistudio.google.com</span>.
                        Without a key, Romeo uses intelligent fallback data for all AI features.
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center py-8"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Heart className="w-8 h-8 fill-pink-500 text-pink-500 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-gray-400 text-sm">
                        Built with ❤️ for the AI Matchmaking Hackathon
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                        Romeo — Finding Love with Intelligence
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
