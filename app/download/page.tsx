"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Download, Info, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import { FaInstagram } from "react-icons/fa"
import Link from "next/link"

type Version = {
  version: string
  date: string
  size: string
  features: string[]
  isLatest?: boolean
  downloadUrl: string // Add this new property
}

const versions: Version[] = [
  {
    version: "64 Bit",
    date: "April 27, 2025",
    size: "90.4 MB",
    features: [
      "Base Update: v379.0.0.0.44",
      "Upgraded to latest base version",
      "Improved download speeds",
      "Enhanced privacy controls",
    ],
    isLatest: true,
    downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.64Bit.apk",
  },
  {
    version: "64 Bit Clone",
    date: "April 28, 2025",
    size: "91.2 MB",
    features: ["Base Update: v379.0.0.0.44", "Clone functionality", "Run multiple accounts", "Enhanced performance"],
    downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.64Bit.Clone.apk",
  },
  {
    version: "32 Bit Clone",
    date: "April 26, 2025",
    size: "89.5 MB",
    features: [
      "Base Update: v379.0.0.0.29",
      "Clone functionality for older devices",
      "Optimized for 32-bit processors",
      "Run multiple accounts",
    ],
    downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.32Bit.Clone.apk",
  },
  {
    version: "32 Bit",
    date: "April 25, 2025",
    size: "88.7 MB",
    features: [
      "Base Update: v379.0.0.0.29",
      "Optimized for 32-bit processors",
      "Compatible with older devices",
      "Reduced memory usage",
    ],
    downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.32Bit.apk",
  },
]

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })

  const handleDownload = (version: string) => {
    setDownloading(version)

    // Find the version object that matches the requested version
    const versionData = versions.find((v) => v.version === version)

    if (versionData) {
      // Create an anchor element to trigger the download
      const link = document.createElement("a")
      link.href = versionData.downloadUrl
      link.setAttribute("download", `instella-${version}.apk`)

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // Show downloading state for a short period
    setTimeout(() => {
      setDownloading(null)
    }, 3000)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setBackgroundPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(50, 50, 50, 0.2) 0%, rgba(0, 0, 0, 0) 50%)`,
      }}
    >
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <motion.h1
            className="mb-8 text-center text-3xl font-bold sm:text-4xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Download Instella
          </motion.h1>

          <Card className="mb-8 overflow-hidden border border-white/10 bg-black/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="border-b border-white/10 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <motion.h2
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Latest Version
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Badge className="bg-white text-black hover:bg-gray-200 relative overflow-hidden">
                      <motion.span
                        className="absolute inset-0 bg-white/30"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />
                      Latest
                    </Badge>
                  </motion.div>
                </div>

                <motion.div
                  className="rounded-lg border border-white/10 bg-white/5 p-6"
                  whileHover={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <motion.h3
                        className="text-lg font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        {versions[0].version}
                      </motion.h3>
                      <motion.div
                        className="flex items-center text-sm text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>Released on {versions[0].date}</span>
                      </motion.div>
                    </div>
                    <motion.p
                      className="text-sm text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {versions[0].size}
                    </motion.p>
                  </div>

                  <div className="mb-4">
                    <motion.h4
                      className="mb-2 text-sm font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      What's new:
                    </motion.h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                      {versions[0].features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          whileHover={{ x: 5, color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={downloading === versions[0].version ? "downloading" : "download"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          onClick={() => handleDownload(versions[0].version)}
                          disabled={downloading === versions[0].version}
                          className="w-full bg-white text-black hover:bg-gray-200 relative overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {downloading === versions[0].version ? (
                            <motion.span
                              className="flex items-center"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 3 }}
                            >
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                              Downloading...
                            </motion.span>
                          ) : (
                            <motion.span className="flex items-center" whileHover={{ y: -2 }}>
                              <Download className="mr-2 h-5 w-5" />
                              Download Latest Version
                            </motion.span>
                          )}
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>

              <div className="p-6">
                <motion.div
                  className="flex items-center rounded-lg bg-white/5 p-4 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <Info className="mr-2 h-5 w-5" />
                  <span className="text-sm">Make sure to backup your data before installing a new version.</span>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <motion.h2
            className="mb-4 text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            Previous Versions
          </motion.h2>

          {versions.slice(1).map((version, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.5 + index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{ y: -5 }}
            >
              <Card className="mb-4 border border-white/10 bg-black/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{version.version}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>Released on {version.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{version.size}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">What's new:</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                      {version.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          whileHover={{ x: 5, color: "rgba(255, 255, 255, 0.8)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={downloading === version.version ? "downloading" : "download"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(version.version)}
                        disabled={downloading === version.version}
                        className="w-full border-white/20 text-white hover:bg-white/10 relative overflow-hidden"
                        whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {downloading === version.version ? (
                          <motion.span
                            className="flex items-center"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                          >
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Downloading...
                          </motion.span>
                        ) : (
                          <motion.span className="flex items-center" whileHover={{ y: -2 }}>
                            <ArrowDown className="mr-2 h-5 w-5" />
                            Download {version.version}
                          </motion.span>
                        )}
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(50, 50, 50, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-sm py-8 relative z-10">
        <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/">
              <FaInstagram className="h-6 w-6 text-white transition-transform hover:scale-110" />
            </Link>
            <span className="font-bold">Instella</span>
          </motion.div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Instella All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
