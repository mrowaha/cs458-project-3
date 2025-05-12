"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
    text,
    duration,
}: {
    text: string;
    duration?: number;
    automatic?: boolean;
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
    const [, setFontsLoaded] = useState(false);

    // Load custom font
    useEffect(() => {
        // Check if the font is loaded
        document.fonts.ready.then(() => {
            const fontFaceSet = document.fonts;
            const isNowLoaded = Array.from(fontFaceSet).some(
                (fontFace) => fontFace.family === 'Now' && fontFace.status === 'loaded'
            );
            setFontsLoaded(isNowLoaded);

            if (!isNowLoaded) {
                console.warn("Now font not loaded, using fallback");
            }
        });
    }, []);


    useEffect(() => {
        if (svgRef.current && cursor.x !== null && cursor.y !== null) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
            const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
            setMaskPosition({
                cx: `${cxPercentage}%`,
                cy: `${cyPercentage}%`,
            });
        }
    }, [cursor]);

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
            className="select-none"
        >
            <defs>
                <linearGradient
                    id="textGradient"
                    gradientUnits="userSpaceOnUse"
                    cx="50%"
                    cy="50%"
                    r="25%"
                >
                    {/* Colors are now always visible regardless of hover state */}
                    <stop offset="0%" stopColor={hovered ? "#ff99cc" : "#ff99cc"} />
                    <stop offset="25%" stopColor={hovered ? "#ff0080" : "#990062"} />
                    <stop offset="50%" stopColor={hovered ? "#ff0080" : "#990062"} />
                    <stop offset="75%" stopColor={hovered ? "#ff0080" : "#990062"} />
                    <stop offset="100%" stopColor={hovered ? "#ff0080" : "#990062"} />
                    {/* <stop offset="50%" stopColor={hovered ? "#8a9cff" : "#686fc5"} />
                    <stop offset="75%" stopColor={hovered ? "#0de8ff" : "#06b6d4"} />
                    <stop offset="100%" stopColor={hovered ? "#a78bfa" : "#8b5cf6"} /> */}
                </linearGradient>

                <motion.radialGradient
                    id="revealMask"
                    gradientUnits="userSpaceOnUse"
                    r="40%"
                    initial={{ cx: "50%", cy: "50%" }}
                    animate={maskPosition}
                    transition={{ duration: duration ?? 0, ease: "easeOut" }}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </motion.radialGradient>
                <mask id="textMask">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#revealMask)"
                    />
                </mask>
            </defs>
            {/* Text outline that appears on hover with opacity */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.1"
                className="fill-transparent stroke-neutral-200 font-[Now] text-7xl font-bold dark:stroke-neutral-800"
                style={{ opacity: hovered ? 0.7 : 0 }}
            >
                {text}
            </text>
            {/* Animated text outline that draws in */}
            <motion.text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.1"
                className="fill-transparent stroke-neutral-200 font-[Now] text-7xl font-bold dark:stroke-neutral-800"
                initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
                animate={{
                    strokeDashoffset: 0,
                    strokeDasharray: 1000,
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut",
                }}
            >
                {text}
            </motion.text>
            {/* Main gradient text with mask */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="url(#textGradient)"
                strokeWidth={hovered ? "0.2" : "0.1"} // Increase stroke width on hover for brighter effect
                mask="url(#textMask)"
                className={`fill-transparent font-[Now] text-7xl font-bold ${hovered ? "filter-brightness-150" : ""}`}
                style={{
                    filter: hovered ? "drop-shadow(0 0 5px rgba(255,255,255,0.7))" : "none" // Add glow effect on hover
                }}
            >
                {text}
            </text>
            {/* Add an additional glow effect on hover */}
            {hovered && (
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    stroke="url(#textGradient)"
                    strokeWidth="2"
                    mask="url(#textMask)"
                    className="fill-transparent font-[Now] text-7xl font-bold opacity-50"
                    style={{
                        filter: "blur(3px)"
                    }}
                >
                    {text}
                </text>
            )}
        </svg>
    );
};