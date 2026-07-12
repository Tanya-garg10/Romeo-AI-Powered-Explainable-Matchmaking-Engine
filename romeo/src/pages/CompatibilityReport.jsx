/**
 * Compatibility Report Page
 * Deep-dive into a specific match with scores, insights, and tools
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Sparkles, Heart, MessageCircle,
    TrendingUp, AlertTriangle, Star, ChevronRight, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RadarChart from '../components/RadarChart';
import LoveMeter from '../components/LoveMeter';
import RedFlagDetector from '../components/RedFlagDetector';
import ScoreRing from '../components/ScoreRing';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateInsights, detectRedFlags } from '../utils/matchEngine';
import { generateConversationStarters, generateDetailedReport } from '../utils/geminiService';

export default function CompatibilityReport() {
    const { selectedProfile, selectedMatch } = useApp();
    const navigate = useNavigate();
    const reportRef = useRef(null);

    const [starters, setStarters] = useState([]);
    const [startersLoading, setStartersLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [aiReport, setAiReport] = useState(null);
    const [aiReportLoading, setAiReportLoading] = useState(false);

    useEffect(() => {
        if (!selectedProfile || !selectedMatch) {
            navigate('/matches');
        }
    }, [selectedProfile, selectedMatch, navigate]);

    useEffect(() => {
        if (selectedProfile && selectedMatch) {
            loadStarters();
        }
    }, [selectedProfile, selectedMatch]);

    async function loadStarters() {
        setStartersLoading(true);
        try {
            const data = await generateConversationStarters(selectedProfile, selectedMatch.profile);
            setStarters(data);
        } catch (err) {
            console.error(err);
        } finally {
            setStartersLoading(false);
        }
    }

    async function loadAiReport() {
        if (aiReport) return; // don't reload if already fetched
        setAiReportLoading(true);
        try {
            const { profile: match, score, breakdown } = selectedMatch;
            const data = await generateDetailedReport(selectedProfile, match, score, breakdown);
            setAiReport(data);
        } catch (err) {
            console.error(err);
        } finally {
            setAiReportLoading(false);
        }
    }

    // Load AI report when that tab becomes active
    useEffect(() => {
        if (activeSection === 'ai-report' && selectedProfile && selectedMatch) {
            loadAiReport();
        }
    }, [activeSection]);
    async function handleDownloadPDF() {
        try {
            const { default: html2canvas } = await import('html2canvas');
            const { jsPDF } = await import('jspdf');
            const canvas = await html2canvas(reportRef.current, {
                backgroundColor: '#0f0f1a',
                scale: 1.5,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * pageWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
            pdf.save(`Romeo_Report_${selectedProfile.name}_x_${selectedMatch.profile.name}.pdf`);
        } catch (err) {
            console.error('PDF error:', err);
            alert('PDF export failed. Try again.');
        }
    }

    if (!selectedProfile || !selectedMatch) return null;

    const { profile: match, score, breakdown } = selectedMatch;
    const insights = generateInsights(selectedProfile, match, breakdown);
    const redFlags = detectRedFlags(selectedProfile, match);

    const SCORE_CATEGORIES = [
        { key: 'hobbies', label: 'Shared Interests', icon: '🎯', desc: 'Common hobbies and activities' },
        { key: 'values', label: 'Values Alignment', icon: '💎', desc: 'Core life values match' },
        { key: 'personality', label: 'Personality Fit', icon: '🧠', desc: 'MBTI compatibility' },
        { key: 'lifestyle', label: 'Lifestyle Match', icon: '🌿', desc: 'Smoking, drinking, pets' },
        { key: 'goals', label: 'Relationship Goals', icon: '💑', desc: 'Long-term vision alignment' },
        { key: 'location', label: 'Location Proximity', icon: '📍', desc: 'Geographic compatibility' },
        { key: 'languages', label: 'Communication', icon: '🗣️', desc: 'Shared languages' },
    ];

    const SECTIONS = ['overview', 'breakdown', 'insights', 'starters'];

    return (
        <div className="min-h-screen animated-bg pt-20 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <button
                            onClick={() => navigate('/matches')}
                            className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Matches
                        </button>
                        <h1 className="text-3xl font-black text-white">
                            Compatibility Report
                        </h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </motion.button>
                </motion.div>

                {/* Section nav */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {SECTIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => setActiveSection(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeSection === s
                                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                                : 'glass border border-white/10 text-gray-400 hover:text-white'
                                }`}
                        >
                            {s === 'starters' ? 'Conversation Starters' : s}
                        </button>
                    ))}
                </div>

                <div ref={reportRef}>
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Match header card */}
                            <div className="glass rounded-3xl p-8"
                                style={{ border: '1px solid rgba(233,30,140,0.3)' }}>
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    {/* Target */}
                                    <div className="text-center">
                                        <img
                                            src={selectedProfile.avatar}
                                            alt={selectedProfile.name}
                                            className="w-24 h-24 rounded-2xl object-cover mx-auto mb-3 ring-2 ring-purple-500"
                                            onError={e => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProfile.name)}&background=1a1a2e&color=7c3aed&size=96`;
                                            }}
                                        />
                                        <p className="font-bold text-white">{selectedProfile.name}</p>
                                        <p className="text-gray-400 text-xs">{selectedProfile.personality} • {selectedProfile.profession}</p>
                                    </div>

                                    {/* Score center */}
                                    <div className="flex-1 text-center">
                                        <ScoreRing score={score} size={100} strokeWidth={6} />
                                        <p className="text-2xl font-black gradient-text mt-3">{score}% Match</p>
                                        <p className="text-gray-400 text-sm">
                                            {score >= 80 ? 'Exceptional Compatibility' :
                                                score >= 65 ? 'Strong Compatibility' : 'Good Compatibility'}
                                        </p>
                                    </div>

                                    {/* Match */}
                                    <div className="text-center">
                                        <img
                                            src={match.avatar}
                                            alt={match.name}
                                            className="w-24 h-24 rounded-2xl object-cover mx-auto mb-3 ring-2 ring-pink-500"
                                            onError={e => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.name)}&background=1a1a2e&color=e91e8c&size=96`;
                                            }}
                                        />
                                        <p className="font-bold text-white">{match.name}</p>
                                        <p className="text-gray-400 text-xs">{match.personality} • {match.profession}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Love Meter + Red Flags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <LoveMeter score={score} />
                                <RedFlagDetector flags={redFlags} />
                            </div>

                            {/* Relationship strengths & risks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="glass rounded-2xl p-5">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        Relationship Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {insights.strengths.map((s, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-sm text-gray-300"
                                            >
                                                <span className="text-green-400 mt-0.5">✓</span> {s}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="glass rounded-2xl p-5">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                                        Risk Factors
                                    </h3>
                                    <ul className="space-y-2">
                                        {insights.risks.map((r, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-sm text-gray-300"
                                            >
                                                <span className="text-orange-400 mt-0.5">⚠</span> {r}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate('/parallel-hearts')}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Explore Parallel Hearts
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Breakdown Section */}
                    {activeSection === 'breakdown' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Radar Chart */}
                            <div className="glass rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-cyan-400" />
                                    Compatibility Radar
                                </h3>
                                <RadarChart breakdown={breakdown} />
                            </div>

                            {/* Category bars */}
                            <div className="glass rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Category Breakdown</h3>
                                <div className="space-y-5">
                                    {SCORE_CATEGORIES.map((cat, i) => (
                                        <motion.div
                                            key={cat.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{cat.icon}</span>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{cat.label}</p>
                                                        <p className="text-xs text-gray-500">{cat.desc}</p>
                                                    </div>
                                                </div>
                                                <span className="text-white font-bold">{breakdown[cat.key]}%</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${breakdown[cat.key]}%` }}
                                                    transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: breakdown[cat.key] >= 70
                                                            ? 'linear-gradient(90deg, #22c55e, #10b981)'
                                                            : breakdown[cat.key] >= 50
                                                                ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                                                                : 'linear-gradient(90deg, #e91e8c, #7c3aed)',
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Insights Section */}
                    {activeSection === 'insights' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-5"
                        >
                            {[
                                { title: '✅ Pros', items: insights.pros, color: 'green', bg: 'bg-green-500/10 border-green-500/30' },
                                { title: '⚠️ Cons', items: insights.cons, color: 'yellow', bg: 'bg-yellow-500/10 border-yellow-500/30' },
                                { title: '⚖️ Trade-offs', items: insights.tradeoffs, color: 'blue', bg: 'bg-blue-500/10 border-blue-500/30' },
                            ].map(section => (
                                <div key={section.title} className={`rounded-2xl p-5 border ${section.bg}`}>
                                    <h3 className="text-lg font-bold text-white mb-4">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.items.map((item, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="flex items-start gap-3 text-gray-300 text-sm"
                                            >
                                                <span className="text-gray-500 mt-0.5">•</span>
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Conversation Starters Section */}
                    {activeSection === 'starters' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="glass rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-pink-500/20">
                                        <MessageCircle className="w-5 h-5 text-pink-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">AI Conversation Starters</h3>
                                        <p className="text-gray-400 text-sm">Personalized openers for {match.name}</p>
                                    </div>
                                </div>

                                {startersLoading ? (
                                    <LoadingSpinner text="Crafting perfect conversation starters..." />
                                ) : (
                                    <div className="space-y-3">
                                        {starters.map((starter, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="p-4 rounded-xl glass border border-white/8 hover:border-pink-500/30 transition-all group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl flex-shrink-0">{starter.emoji}</span>
                                                    <div className="flex-1">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1 block">
                                                            {starter.type?.replace('-', ' ')}
                                                        </span>
                                                        <p className="text-gray-200 text-sm leading-relaxed">"{starter.text}"</p>
                                                    </div>
                                                    <button
                                                        onClick={() => navigator.clipboard?.writeText(starter.text)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 hover:text-pink-400 px-2 py-1 rounded-lg glass"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
