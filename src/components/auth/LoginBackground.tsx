import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";

export const LoginBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen
      // Range: -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const icons = [
    // Top section
    {
      Icon: GraduationCap,
      style: { top: "5%", left: "5%" },
      rotate: 12,
      delay: 0,
    },
    {
      Icon: BookOpen,
      style: { top: "10%", left: "25%" },
      rotate: -6,
      delay: 0.1,
    },
    {
      Icon: Briefcase,
      style: { top: "8%", right: "25%" },
      rotate: 12,
      delay: 0.2,
    },
    { Icon: Users, style: { top: "5%", right: "5%" }, rotate: -12, delay: 0.3 },

    // Middle section (sides)
    {
      Icon: Megaphone,
      style: { top: "40%", left: "2%" },
      rotate: 45,
      delay: 0.4,
    },
    {
      Icon: GraduationCap,
      style: { top: "35%", right: "2%" },
      rotate: -12,
      delay: 0.5,
    },
    {
      Icon: BookOpen,
      style: { top: "60%", left: "5%" },
      rotate: 12,
      delay: 0.6,
    },
    {
      Icon: Briefcase,
      style: { top: "55%", right: "5%" },
      rotate: -6,
      delay: 0.7,
    },

    // Bottom section
    {
      Icon: Users,
      style: { bottom: "10%", left: "10%" },
      rotate: 6,
      delay: 0.8,
    },
    {
      Icon: Megaphone,
      style: { bottom: "5%", left: "30%" },
      rotate: -12,
      delay: 0.9,
    },
    {
      Icon: GraduationCap,
      style: { bottom: "8%", right: "30%" },
      rotate: 12,
      delay: 1.0,
    },
    {
      Icon: BookOpen,
      style: { bottom: "5%", right: "10%" },
      rotate: -6,
      delay: 1.1,
    },

    // Fillers
    {
      Icon: Briefcase,
      style: { top: "20%", left: "15%" },
      rotate: -12,
      delay: 1.2,
    },
    { Icon: Users, style: { top: "25%", right: "15%" }, rotate: 6, delay: 1.3 },
    {
      Icon: Megaphone,
      style: { bottom: "25%", left: "20%" },
      rotate: -12,
      delay: 1.4,
    },
    {
      Icon: GraduationCap,
      style: { bottom: "20%", right: "20%" },
      rotate: 12,
      delay: 1.5,
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50/80 dark:bg-zinc-950/80">
      <div className="absolute inset-0 blur-sm">
        {icons.map(({ Icon, style, rotate, delay }, index) => {
          // Create a unique movement factor for each icon to create depth
          const depthFactor = 20 + (index % 5) * 10;

          return (
            <motion.div
              key={index}
              className="absolute text-gray-900/5 dark:text-white/5"
              style={style}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mousePos.x * depthFactor,
                y: mousePos.y * depthFactor,
                rotate: rotate,
              }}
              transition={{
                opacity: { duration: 0.8, delay },
                scale: { duration: 0.8, delay },
                x: { type: "spring", stiffness: 50, damping: 30 },
                y: { type: "spring", stiffness: 50, damping: 30 },
                rotate: { duration: 0 }, // Don't animate rotation changes
              }}
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4 + (index % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              >
                <Icon size={96} strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
