/**
 * Animated Particle Background
 * Floating hearts and dots for ambient effect
 */
import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const particles = [];
        const count = 20;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const isHeart = Math.random() > 0.5;
            const size = Math.random() * 20 + 8;

            el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.15 + 0.03};
        animation: float ${Math.random() * 8 + 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        font-size: ${size}px;
        color: ${Math.random() > 0.5 ? '#e91e8c' : '#7c3aed'};
      `;

            el.textContent = isHeart ? '♥' : '✦';
            container.appendChild(el);
            particles.push(el);
        }

        return () => {
            particles.forEach(p => p.remove());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
