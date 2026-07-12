/**
 * Loading Spinner Component
 * Animated heart loader for async operations
 */
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LoadingSpinner({ text = 'Finding your matches...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="relative">
                {/* Orbit ring */}
                <motion.div
                    className="w-20 h-20 rounded-full border-2 border-pink-500/30"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
                {/* Orbiting dot */}
                <motion.div
                    className="absolute top-0 left-1/2 w-3 h-3 bg-pink-500 rounded-full -translate-x-1/2 -translate-y-1.5"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    style={{ transformOrigin: '50% 52px' }}
                />
                {/* Center heart */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                    <Heart className="w-8 h-8 fill-pink-500 text-pink-500" />
                </motion.div>
            </div>

            <div className="text-center">
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-gray-300 font-medium"
                >
                    {text}
                </motion.p>
                <div className="flex justify-center gap-1 mt-2">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-pink-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
