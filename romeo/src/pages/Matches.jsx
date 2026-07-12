/**
 * Matches Page
 * Shows top 10 match results and AI final recommendation
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Trophy, ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreRing from '../components/ScoreRing';
import { generateFinalRecommendation } from '../utils/geminiService';

export default function Matches() {
    const { selectedProfile, matches, isLoading, setRecommendation, recommendation, runMatching } = useApp();
    const navigate = useNavigate();
    const [aiLoading, setAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'recommendation'

    // Redirect if no profile selected
    useEffect(() => {
        if (!selectedProfile) {
            navigate('/dataset');
        }
    }, [selectedProfile, navigate]);

    // Auto-run matching if no matches yet
    useEffect(() => {
        if (selectedProfile && matches.length === 0 && !isLoading) {
            runMatching();
        }
    }, [selectedProfile]);

    // Generate AI recommendation when matches load
    useEffect(() => {
        if (matches.length >= 3 && !recommendation) {
            generateRecommendation();
        }
    }, [matches]);

    async function generateRecommendation() {
        setAiLoading(true);
        try {
            const rec = await generateFinalRecommendation(selectedProfile, matches);
            setRecommendation(rec);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    }

    if (!selectedProfile) return null;

    return (
        <div className="min-h-screen animated-bg pt-20 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <button
                            onClick={() => navigate('/dataset')}
                            className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Profiles
                        </button>
                        <h1 className="text-3xl sm:text-4xl font-black text-white">
                            Matches for <span className="gradient-text">{selectedProfile.name}</span>
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {matches.length} compatible matches found • Powered by Romeo AI
                        </p>
                    </div>

                    {/* Target profile mini card */}
                    <div className="glass rounded-2xl p-4 flex items-center gap-3">
                        <img
                            src={selectedProfile.avatar}
                            alt={selectedProfile.name}
                            className="w-12 h-12 rounded-xl object-cover"
                            onError={e => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProfile.name)}&background=1a1a2e&color=e91e8c`;
                            }}
                        />
                        <div>
                            <p className="text-xs text-gray-500">Matching as</p>
                            <p className="text-white font-bold text-sm">{selectedProfile.name}</p>
                            <p className="text-gray-400 text-xs">{selectedProfile.personality} • {selectedProfile.city}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {[
                        { id: 'matches', label: `Top ${matches.length} Matches`, icon: Heart },
                        { id: 'recommendation', label: 'AI Recommendation', icon: Sparkles },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                                        : 'glass border border-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Loading state */}
                {isLoading && <LoadingSpinner text="Analyzing compatibility across 7 dimensions..." />}

                {/* Matches tab */}
                <AnimatePresence mode="wait">
                    {!isLoading && activeTab === 'matches' && (
                        <motion.div
                            key="matches"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {matches.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-5xl mb-4">💔</div>
                                    <p className="text-gray-400 text-lg">No compatible matches found</p>
                                    <p className="text-gray-600 text-sm mt-2">Try selecting a different profile</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {matches.map((match, i) => (
                                        <MatchCard key={match.profile.id} match={match} rank={i + 1} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* AI Recommendation tab */}
                    {activeTab === 'recommendation' && (
                        <motion.div
                            key="recommendation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {aiLoading ? (
                                <LoadingSpinner text="Gemini AI is analyzing your top 3 matches..." />
                            ) : recommendation ? (
                                <RecommendationView
                                    rec={recommendation}
                                    matches={matches}
                                    target={selectedProfile}
                                />
                            ) : (
                                <div className="text-center py-20">
                                    <div className="text-5xl mb-4">🤖</div>
                                    <p className="text-gray-400">Waiting for matches to generate AI recommendation...</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Recommendation View ──────────────────────────────────────────────────────
function RecommendationView({ rec, matches, target }) {
    const navigate = useNavigate();
    const { selectMatch } = useApp();

    // Find the recommended match object
    const chosenMatch = matches.find(m => m.profile.id === rec.selectedMatchId) || matches[0];
    const others = matches.filter(m => m.profile.id !== rec.selectedMatchId).slice(0, 2);

    function handleViewReport() {
        if (chosenMatch) {
            selectMatch(chosenMatch);
            navigate('/compatibility-report');
        }
    }

    function handleParallelHearts() {
        if (chosenMatch) {
            selectMatch(chosenMatch);
            navigate('/parallel-hearts');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Trophy banner */}
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="glass rounded-3xl p-8 text-center relative overflow-hidden"
                style={{ border: '1px solid rgba(233,30,140,0.4)' }}
            >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none" />

                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="text-6xl mb-4"
                >
                    🏆
                </motion.div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Romeo's Final Recommendation
                </div>

                <h2 className="text-4xl font-black text-white mb-2">
                    {rec.headline || `${rec.selectedMatchName} is Your Best Match`}
                </h2>

                <div className="flex items-center justify-center gap-4 mt-4">
                    {chosenMatch && (
                        <div className="flex items-center gap-3">
                            <img
                                src={chosenMatch.profile.avatar}
                                alt={chosenMatch.profile.name}
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-500"
                                onError={e => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chosenMatch.profile.name)}&background=1a1a2e&color=e91e8c`;
                                }}
                            />
                            <div className="text-left">
                                <p className="font-bold text-white">{chosenMatch.profile.name}</p>
                                <p className="text-gray-400 text-sm">{chosenMatch.profile.profession}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-4xl">💞</div>

                    <div className="flex items-center gap-3">
                        <img
                            src={target.avatar}
                            alt={target.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500"
                            onError={e => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(target.name)}&background=1a1a2e&color=7c3aed`;
                            }}
                        />
                        <div className="text-left">
                            <p className="font-bold text-white">{target.name}</p>
                            <p className="text-gray-400 text-sm">{target.profession}</p>
                        </div>
                    </div>
                </div>

                {/* Confidence meter */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <span className="text-gray-400 text-sm">AI Confidence</span>
                    <div className="flex-1 max-w-xs h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.confidence}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                        />
                    </div>
                    <span className="text-white font-bold">{rec.confidence}%</span>
                </div>
            </motion.div>

            {/* Reasoning */}
            <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    AI Reasoning
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{rec.reasoning}</p>
            </div>

            {/* Why not others */}
            {rec.whyNotOthers?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Why Not The Others?</h3>
                    <div className="space-y-3">
                        {rec.whyNotOthers.map((item, i) => {
                            const matchObj = matches.find(m => m.profile.name === item.name);
                            return (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                                    {matchObj && (
                                        <img
                                            src={matchObj.profile.avatar}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                                            onError={e => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1a1a2e&color=e91e8c`;
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-white">{item.name}</p>
                                        <p className="text-gray-400 text-sm mt-1">{item.reason}</p>
                                    </div>
                                    {matchObj && (
                                        <div className="ml-auto flex-shrink-0">
                                            <ScoreRing score={matchObj.score} size={44} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Future outlook */}
            {rec.futureOutlook && (
                <div className="glass rounded-2xl p-6 text-center"
                    style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}>
                    <div className="text-3xl mb-3">🌟</div>
                    <h3 className="text-lg font-bold text-white mb-2">Future Outlook</h3>
                    <p className="text-gray-300 italic">"{rec.futureOutlook}"</p>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleViewReport}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
                >
                    <Trophy className="w-5 h-5" />
                    View Full Compatibility Report
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleParallelHearts}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 py-4"
                >
                    <Sparkles className="w-5 h-5" />
                    Explore Parallel Hearts
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
