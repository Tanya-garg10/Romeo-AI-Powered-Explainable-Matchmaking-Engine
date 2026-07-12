/**
 * Profile Card Component
 * Displays a user profile with avatar and basic info
 */
import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';

const PERSONALITY_COLORS = {
    INTJ: '#6366f1', INFJ: '#8b5cf6', INTP: '#a855f7', INFP: '#ec4899',
    ENTJ: '#ef4444', ENFJ: '#f97316', ENTP: '#eab308', ENFP: '#22c55e',
    ISTJ: '#14b8a6', ISFJ: '#06b6d4', ISTP: '#3b82f6', ISFP: '#6366f1',
    ESTJ: '#f43f5e', ESFJ: '#f59e0b', ESTP: '#10b981', ESFP: '#84cc16',
};

export default function ProfileCard({ profile, onClick, isSelected, showSelect }) {
    const color = PERSONALITY_COLORS[profile.personality] || '#e91e8c';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`relative cursor-pointer rounded-2xl overflow-hidden card-hover transition-all duration-300 ${isSelected
                    ? 'ring-2 ring-pink-500 shadow-lg shadow-pink-500/30'
                    : 'glass hover:shadow-xl hover:shadow-purple-500/10'
                }`}
        >
            {/* Selected badge */}
            {isSelected && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Selected
                </div>
            )}

            {/* Top gradient bar */}
            <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${color}, #e91e8c)` }}
            />

            <div className="p-5">
                {/* Avatar + name */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-16 h-16 rounded-2xl object-cover bg-gray-800"
                            onError={e => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1a1a2e&color=e91e8c&bold=true&size=64`;
                            }}
                        />
                        <span
                            className="absolute -bottom-1 -right-1 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: color }}
                        >
                            {profile.personality}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white truncate">{profile.name}</h3>
                        <p className="text-gray-400 text-sm">{profile.age} years old</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {profile.hobbies?.slice(0, 2).map(h => (
                                <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                    {h}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info rows */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                        <span className="truncate">{profile.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Briefcase className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{profile.profession}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{profile.education}</span>
                    </div>
                </div>

                {/* Bio snippet */}
                <p className="text-gray-500 text-xs mt-3 line-clamp-2">{profile.bio}</p>

                {/* Goal tag */}
                <div className="mt-3 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-xs text-pink-400 capitalize">{profile.relationshipGoal?.replace('-', ' ')}</span>
                </div>

                {/* Select button */}
                {showSelect && (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full mt-4 py-2 rounded-xl text-sm font-semibold transition-all ${isSelected
                                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                                : 'glass border border-pink-500/30 text-pink-400 hover:border-pink-500 hover:bg-pink-500/10'
                            }`}
                    >
                        {isSelected ? '✓ Selected' : 'Select Profile'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
