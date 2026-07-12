/**
 * Global App Context
 * Manages selected user, match results, and app state
 */
import { createContext, useContext, useState, useCallback } from 'react';
import profilesData from '../data/profiles.json';
import { findMatches } from '../utils/matchEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
    const [isLoading, setIsLoading] = useState(false);

    const profiles = profilesData;

    /** Select a target profile and compute matches */
    const selectProfile = useCallback((profile) => {
        setSelectedProfile(profile);
        setMatches([]);
        setSelectedMatch(null);
        setRecommendation(null);
    }, []);

    /** Run the matching engine */
    const runMatching = useCallback(() => {
        if (!selectedProfile) return;
        setIsLoading(true);
        // Simulate slight delay for UX
        setTimeout(() => {
            const results = findMatches(selectedProfile, profiles);
            setMatches(results);
            setIsLoading(false);
        }, 800);
    }, [selectedProfile, profiles]);

    /** Select a specific match to view report */
    const selectMatch = useCallback((match) => {
        setSelectedMatch(match);
    }, []);

    /** Toggle theme */
    const toggleTheme = useCallback(() => {
        setTheme(t => t === 'dark' ? 'light' : 'dark');
    }, []);

    return (
        <AppContext.Provider value={{
            profiles,
            selectedProfile,
            matches,
            selectedMatch,
            recommendation,
            theme,
            isLoading,
            selectProfile,
            runMatching,
            selectMatch,
            setRecommendation,
            toggleTheme,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
