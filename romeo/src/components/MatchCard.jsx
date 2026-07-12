/**
 * Match Card Component
 * Displays a match result with score, tags, and summary
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, ChevronRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScoreRing from './ScoreRing';

const TAG_COLORS = {
    hobby: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    value: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    location: 'bg-green-500/20 text-green-300 border-green-500/30',
    goal: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    language: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

export default function MatchCard({ match, rank, onSelect }) {
    const { selectMatch } = useApp();
    const navigate = useNavigate();

    const { profile, score, tags, breakdown } = match;

    function handleViewReport() {
        selectMatch(match);
        navigate('/compatibility-report');
    }

    function getScoreColor(s) {
        if (s >= 80) return 'from-green-400 to-emerald-500';
        if (s >= 60) return 'from-yellow-400 to-orange-500';
        return 'from-red-400 to-rose-500';
    }

    function getScoreLabel(s) {
        if (s >= 85) return 'Exceptional Match';
        if (s >= 75) return 'Great Match';
        if (s >= 65) return 'Good Match';
        if (s >= 55) return 'Decent Match';
        return 'Potential Match';
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.07 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
            onClick={handleViewReport}
        >
            {/* Rank badge + score bar */}
            <div className="relative">
                <div
                    className={`h-1 bg-gradient-to-r ${getScoreColor(score)}`}
                    style={{ width: `${score}%` }}
                />
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    #{rank}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-16 h-16 rounded-2xl object-cover bg-gray-800"
                            onError={e => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1a1a2e&color=e91e8c&bold=true&size=64`;
                            }}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-white text-lg">{profile.name}</h3>
                                <p className="text-gray-400 text-sm">{profile.age} • {profile.personality}</p>
                            </div>
                            {/* Score ring */}
                            <ScoreRing score={score} size={52} />
                        </div>

                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{profile.city}
                            </span>
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />{profile.profession}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Score label */}
                <div className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor(score)} text-white`}>
                    {getScoreLabel(score)} • {score}%
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className={`text-xs px-2.5 py-1 rounded-full border ${TAG_COLORS[tag.type] || TAG_COLORS.hobby}`}
                        >
                            {tag.label}
                        </span>
                    ))}
                </div>

                {/* Score breakdown mini bars */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                        { key: 'values', label: 'Values' },
                        { key: 'personality', label: 'Personality' },
                        { key: 'lifestyle', label: 'Lifestyle' },
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <div className="text-xs text-gray-500 mb-1">{label}</div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${breakdown[key]}%` }}
                                    transition={{ delay: rank * 0.07 + 0.3, duration: 0.8 }}
                                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <motion.button
                    whileHover={{ x: 4 }}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-pink-500/30 text-pink-400 text-sm font-medium hover:bg-pink-500/10 transition-colors group-hover:border-pink-500"
                    onClick={(e) => { e.stopPropagation(); handleViewReport(); }}
                >
                    View Compatibility Report
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
