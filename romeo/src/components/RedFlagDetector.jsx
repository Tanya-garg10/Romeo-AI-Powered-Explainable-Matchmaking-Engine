/**
 * Red Flag Detector Component
 * Highlights potential compatibility issues
 */
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const SEVERITY_CONFIG = {
    high: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'High Risk' },
    medium: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Medium Risk' },
    low: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'Low Risk' },
};

export default function RedFlagDetector({ flags }) {
    if (!flags?.length) {
        return (
            <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Red Flag Detector</h3>
                        <p className="text-gray-400 text-xs">AI-powered risk analysis</p>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                        <p className="text-green-300 font-medium">No major red flags detected</p>
                        <p className="text-green-400/70 text-xs mt-0.5">This match appears well-aligned on key factors</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Red Flag Detector</h3>
                    <p className="text-gray-400 text-xs">{flags.length} potential concern{flags.length > 1 ? 's' : ''} found</p>
                </div>
                <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {flags.filter(f => f.severity === 'high').length} critical
                </span>
            </div>

            <div className="space-y-2">
                {flags.map((flag, i) => {
                    const config = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.low;
                    const Icon = config.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-xl border ${config.bg}`}
                        >
                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                            <div className="flex-1">
                                <p className="text-white text-sm">{flag.label}</p>
                                <span className={`text-xs ${config.color} font-medium`}>{config.label}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-gray-600 text-xs mt-3 text-center">
                Red flags are indicators, not dealbreakers. Human judgment always prevails.
            </p>
        </div>
    );
}
