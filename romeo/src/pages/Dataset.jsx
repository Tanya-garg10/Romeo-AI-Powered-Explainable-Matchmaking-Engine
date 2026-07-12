/**
 * Dataset Page
 * Browse all profiles and select a target user
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Users, Heart, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProfileCard from '../components/ProfileCard';

const FILTER_OPTIONS = {
    gender: ['All', 'male', 'female'],
    city: ['All', 'Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai', 'Lucknow', 'Jaipur'],
    goal: ['All', 'long-term', 'marriage', 'casual-to-serious'],
};

export default function Dataset() {
    const { profiles, selectedProfile, selectProfile, runMatching } = useApp();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ gender: 'All', city: 'All', goal: 'All' });
    const [showFilters, setShowFilters] = useState(false);

    // Filter profiles
    const filtered = profiles.filter(p => {
        const matchesSearch =
            !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.profession.toLowerCase().includes(search.toLowerCase()) ||
            p.city.toLowerCase().includes(search.toLowerCase());

        const matchesGender = filters.gender === 'All' || p.gender === filters.gender;
        const matchesCity = filters.city === 'All' || p.city === filters.city;
        const matchesGoal = filters.goal === 'All' || p.relationshipGoal === filters.goal;

        return matchesSearch && matchesGender && matchesCity && matchesGoal;
    });

    function handleSelectAndMatch(profile) {
        selectProfile(profile);
    }

    function handleFindMatches() {
        if (!selectedProfile) return;
        runMatching();
        navigate('/matches');
    }

    return (
        <div className="min-h-screen animated-bg pt-20 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
                        <Users className="w-4 h-4" />
                        {profiles.length} Profiles Available
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
                        Choose <span className="gradient-text">Your Profile</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Select a profile that represents you. Romeo will find your top compatible matches using AI.
                    </p>
                </motion.div>

                {/* Search & Filter bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-3 mb-6"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, profession, city..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/8 transition-all"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${showFilters ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'glass border-white/10 text-gray-400 hover:border-white/20'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </motion.button>
                </motion.div>

                {/* Filter panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 glass rounded-2xl p-5 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
                                    <div key={key}>
                                        <label className="block text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                                            {key}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {options.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setFilters(f => ({ ...f, [key]: opt }))}
                                                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${filters[key] === opt
                                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                                            : 'glass border border-white/10 text-gray-400 hover:border-white/30'
                                                        }`}
                                                >
                                                    {opt === 'All' ? 'All' : opt.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results count */}
                <div className="flex items-center justify-between mb-5">
                    <p className="text-gray-500 text-sm">
                        Showing <span className="text-white font-medium">{filtered.length}</span> profiles
                    </p>
                    {selectedProfile && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Selected:</span>
                            <span className="text-pink-400 font-medium">{selectedProfile.name}</span>
                        </div>
                    )}
                </div>

                {/* Profile grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    <AnimatePresence>
                        {filtered.map((profile, i) => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                isSelected={selectedProfile?.id === profile.id}
                                showSelect={true}
                                onClick={() => handleSelectAndMatch(profile)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-gray-400 text-lg">No profiles found</p>
                        <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>

            {/* Sticky CTA */}
            <AnimatePresence>
                {selectedProfile && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
                    >
                        <div className="glass-dark rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl"
                            style={{ border: '1px solid rgba(233,30,140,0.4)' }}>
                            <img
                                src={selectedProfile.avatar}
                                alt={selectedProfile.name}
                                className="w-10 h-10 rounded-xl object-cover"
                                onError={e => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProfile.name)}&background=1a1a2e&color=e91e8c`;
                                }}
                            />
                            <div>
                                <p className="text-xs text-gray-400">Matching as</p>
                                <p className="text-white font-bold">{selectedProfile.name}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFindMatches}
                                className="btn-primary flex items-center gap-2 ml-2"
                            >
                                <Heart className="w-4 h-4 fill-white" />
                                Find My Matches
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
