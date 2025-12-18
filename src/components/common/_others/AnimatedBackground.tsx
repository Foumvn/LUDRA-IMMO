"use client"
import { motion } from "framer-motion"
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 80, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="w-[600px] h-[600px] bg-secondary/15 rounded-full blur-3xl absolute -top-48 -left-48"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, -60, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="w-[500px] h-[500px] bg-primary/15 rounded-full blur-2xl absolute -bottom-32 -right-32"
      />
    </div>
  )
}