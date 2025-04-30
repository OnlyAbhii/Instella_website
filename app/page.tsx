"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle2, Download, Shield, Zap, Code, Star, Heart, MessageCircle } from "lucide-react"
import { FaInstagram, FaTelegram } from "react-icons/fa"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const features = [
    {
      icon: <Download className="h-12 w-12 text-white" />,
      title: "Clone Support",
      description: "Use Instella alongside your original Instagram app without conflicts.",
      delay: 0,
    },
    {
      icon: <Shield className="h-12 w-12 text-white" />,
      title: "Ad Free",
      description: "Enjoy a completely ad-free Instagram experience without interruptions.",
      delay: 0.1,
    },
    {
      icon: <Zap className="h-12 w-12 text-white" />,
      title: "Faster Updates",
      description: "Get the latest features and improvements before anyone else.",
      delay: 0.2,
    },
    {
      icon: <Code className="h-12 w-12 text-white" />,
      title: "Open Source",
      description: "Transparent development with community contributions welcome.",
      delay: 0.3,
    },
    {
      icon: <Star className="h-12 w-12 text-white" />,
      title: "Enhanced Features",
      description: "Access premium features that enhance your social media experience.",
      delay: 0.4,
    },
    {
      icon: <Heart className="h-12 w-12 text-white" />,
      title: "Community Driven",
      description: "Built with feedback from users like you to create the perfect experience.",
      delay: 0.5,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Particles */}
          <AnimatePresence>
            {isVisible && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                      duration: 10 + Math.random() * 20,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 5,
                    }}
                    className="absolute h-1 w-1 rounded-full bg-white"
                    style={{
                      boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.3)",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Curved Lines */}
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad3" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {/* Top Curves */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
              }}
              d="M 100 100 Q 300 0 500 100 T 900 100"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
            />
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
                delay: 0.5,
              }}
              d="M 0 200 Q 200 100 400 200 T 800 200"
              fill="none"
              stroke="url(#grad2)"
              strokeWidth="1"
            />
            {/* Bottom Curves */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
                delay: 1,
              }}
              d="M 100 600 Q 300 500 500 600 T 900 600"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
            />

            {/* Circular path for the Instagram icon */}
            <motion.path
              d="M400,300 a100,100 0 1,0 200,0 a100,100 0 1,0 -200,0"
              fill="none"
              stroke="url(#grad3)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            />
          </svg>

          {/* Straight Lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: "-100%",
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: 3.5,
                  delay: i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "linear",
                }}
                className="absolute right-0"
                style={{
                  top: `${10 + i * 15}%`,
                  height: "1px",
                  width: "100%",
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "#ffffff" : "#06b6d4"}60, transparent)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 z-[1]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2 }}
            className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -right-1/4 top-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-3xl"
            style={{
              transform: `translateY(${scrollY * -0.05}px)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="container relative z-[3] px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <motion.div
              className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 opacity-70"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <FaInstagram className="relative z-10 h-16 w-16 text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Instella
              </span>
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-gray-400 sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Ultimate Instagram Enhancement for Android. Experience Instagram like never before with advanced
              features and a seamless interface.
            </motion.p>
            <motion.div
              className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/download">
                <Button className="group relative w-full overflow-hidden bg-gradient-to-r from-violet-500 to-cyan-500 text-black hover:from-violet-600 hover:to-cyan-600 sm:w-auto">
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative flex items-center">
                    Download Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="/backup">
                <Button
                  variant="outline"
                  className="group w-full border-white/20 text-white hover:border-white/40 hover:bg-white/5 sm:w-auto"
                >
                  <span className="flex items-center">
                    Backup Library
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <motion.div
            className="h-14 w-8 rounded-full border-2 border-white/30 p-1"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-white"
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 border-t border-white/10 bg-black py-24">
        <div className="container px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Instella Features
              </span>
            </h2>
            <p className="mt-4 text-gray-400">Discover what makes Instella the best Instagram mod available</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-4 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 p-3 text-white"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 border-t border-white/10 bg-black py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/50 to-cyan-950/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-violet-500/10 md:p-12 lg:p-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-6 flex justify-center"
            >
              <FaTelegram className="h-16 w-16 text-cyan-400" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Telegram Group</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Join our Telegram group to stay updated on the latest news, get support, and connect with other Instella
              users.
            </p>
            <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
              <motion.li
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                <span>Get Backup files and latest updates</span>
              </motion.li>
              <motion.li
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                <span>Get support 24/7 from our community</span>
              </motion.li>
              <motion.li
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                <span>Experience new features before official release</span>
              </motion.li>
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <a href="https://t.me/instellacommunity" target="_blank" rel="noopener noreferrer">
                <Button className="group relative mt-8 overflow-hidden bg-gradient-to-r from-cyan-400 to-violet-500 text-lg text-black hover:from-cyan-500 hover:to-violet-600">
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative flex items-center">
                    Join Now
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8">
        <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 200 }}
                className="rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 p-2"
              >
                <FaInstagram className="h-6 w-6 text-white" />
              </motion.div>
            </Link>
            <span className="font-bold">Instella</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Instella All rights reserved.</p>
          <div className="flex space-x-6">
            <Link className="group text-sm text-gray-400 transition-colors hover:text-white" href="/backup">
              <span className="relative">
                Backup
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link className="group text-sm text-gray-400 transition-colors hover:text-white" href="/download">
              <span className="relative">
                Download
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link className="group text-sm text-gray-400 transition-colors hover:text-white" href="/about">
              <span className="relative">
                About
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
