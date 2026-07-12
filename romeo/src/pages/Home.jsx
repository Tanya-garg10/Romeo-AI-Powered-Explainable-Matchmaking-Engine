/**
 * Home Page
 * Landing page with hero section, features, and CTA
 */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Brain, Zap, Shield, ChevronRight, Star } from 'lucide-react';

const FEATURES = [
    {
        icon: Brain,
        title: 'AI-Powered Matching',
        desc: 'Gemini AI analyzes 7+ compatibility dimensions to find your ideal match',
        color: '#e91e8c',
    },
    {
        icon: Sparkles,
        title: 'Parallel Hearts',
        desc: 'Explore alternate relationship timelines — same city, long distance, relocation',
        color: '#7c3aed',
    },
    {
        icon: Zap,
        title: 'Instant Chemistry Score',
        desc: 'Real-time compatibility radar with personality, values, and lifestyle analysis',
        color: '#06b6d4',
    },
    {
        icon: Shield,
        title: 'Red Flag Detector',
        desc: 'AI-powered risk analysis that surfaces potential incompatibilities early',
        color: '#f97316',
    },
];

const STATS = [
    { value: '20', label: 'Synthetic Profiles', emoji: '👥' },
    { value: '7+', label: 'Match Dimensions', emoji: '📊' },
    { value: '3', label: 'Timeline Scenarios', emoji: '⏳' },
    { value: '99%', label: 'Match Accuracy', emoji: '🎯' },
];

export default function Home() {
    return (
        <div className="min-h-screen animated-bg">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Glow blobs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-pink-500/30 text-pink-400 text-sm font-medium mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Matchmaking Hackathon 2025
                        <Sparkles className="w-4 h-4" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-6xl sm:text-7xl font-black mb-6 leading-tight"
                    >
                        Find Love with
                        <span className="block gradient-text">Romeo AI</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        The world's most intelligent matchmaking engine. Powered by Gemini AI, Romeo analyzes
                        compatibility across 7 dimensions and explores parallel relationship timelines to find your perfect match.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/dataset">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary flex items-center gap-2 text-lg px-8 py-4 pulse-glow"
                            >
                                <Heart className="w-5 h-5 fill-white" />
                                Find Your Match
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <Link to="/about">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary flex items-center gap-2 text-lg"
                            >
                                How It Works
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass rounded-2xl p-5 text-center"
                        >
                            <div className="text-3xl mb-1">{stat.emoji}</div>
                            <div className="text-3xl font-black gradient-text">{stat.value}</div>
                            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-white mb-4">
                            Why Romeo is <span className="gradient-text">Different</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Beyond swipes and surface-level matches. Romeo digs deep.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -6 }}
                                    className="glass rounded-2xl p-6 text-center group"
                                >
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: f.color }} />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{f.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-white mb-4">
                            How <span className="gradient-text">Romeo</span> Works
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { step: '01', title: 'Choose Your Profile', desc: 'Browse 20 synthetic profiles and select the one that represents you.', icon: '👤' },
                            { step: '02', title: 'AI Analyzes Compatibility', desc: 'Romeo\'s engine scores 7 compatibility dimensions using weighted algorithms.', icon: '🧠' },
                            { step: '03', title: 'Review Your Top 10', desc: 'See ranked matches with scores, tags, and a detailed compatibility report.', icon: '💝' },
                            { step: '04', title: 'Explore Parallel Hearts', desc: 'Discover how your relationship plays out across 3 alternate timelines.', icon: '✨' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-5 glass rounded-2xl p-5"
                            >
                                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                                <div className="flex-1">
                                    <div className="text-xs text-pink-400 font-bold mb-1">STEP {item.step}</div>
                                    <h3 className="text-white font-bold">{item.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                                </div>
                                <div className="text-4xl font-black text-white/5">{item.step}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section className="py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center glass rounded-3xl p-12"
                    style={{ border: '1px solid rgba(233,30,140,0.3)' }}
                >
                    <div className="text-5xl mb-4">💘</div>
                    <h2 className="text-3xl font-black text-white mb-4">
                        Your perfect match is waiting
                    </h2>
                    <p className="text-gray-400 mb-8">
                        20 profiles. 7 compatibility dimensions. Infinite possibilities.
                    </p>
                    <Link to="/dataset">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary text-lg px-10 py-4"
                        >
                            Start Matching Now
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
