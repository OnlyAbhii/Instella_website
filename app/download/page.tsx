"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Download, Info, Calendar, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import { FaInstagram } from "react-icons/fa"
import Link from "next/link"

type Asset = {
  name: string
  browser_download_url: string
  size: number
}

type GitHubRelease = {
  tag_name: string
  name: string
  published_at: string
  assets: Asset[]
  body: string
}

type Version = {
  version: string
  date: string
  size: string
  features: string[]
  isLatest?: boolean
  downloadUrl: string
}

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchReleases = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://api.github.com/repos/OnlyAbhii/instella_app/releases")

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const releases: GitHubRelease[] = await response.json()

      if (releases.length === 0) {
        setVersions([])
        setLoading(false)
        return
      }

      // Process releases to extract version information
      const processedVersions = processReleases(releases)
      setVersions(processedVersions)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Failed to fetch releases:", err)
      setError("Failed to fetch releases. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const processReleases = (releases: GitHubRelease[]): Version[] => {
    const processedVersions: Version[] = []

    // Sort releases by published date (newest first)
    const sortedReleases = [...releases].sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )

    for (const release of sortedReleases) {
      // Filter assets to find APK files
      const apkAssets = release.assets.filter((asset) => asset.name.toLowerCase().endsWith(".apk"))

      // Group APKs by type (64bit, 32bit, clone, etc.)
      const bit64 = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("64bit") && !asset.name.toLowerCase().includes("clone"),
      )
      const bit64Clone = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("64bit") && asset.name.toLowerCase().includes("clone"),
      )
      const bit32 = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("32bit") && !asset.name.toLowerCase().includes("clone"),
      )
      const bit32Clone = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("32bit") && asset.name.toLowerCase().includes("clone"),
      )

      // Extract features from release body
      const features = release.body
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- ") || line.startsWith("* "))
        .map((line) => line.substring(2).trim())
        .filter((line) => line.length > 0)
        .slice(0, 5) // Limit to 5 features

      // If no features found, add a default one
      if (features.length === 0) {
        features.push(`Base Update: ${release.tag_name}`)
      }

      // Format date
      const releaseDate = new Date(release.published_at)
      const formattedDate = releaseDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Add versions based on available assets
      if (bit64) {
        processedVersions.push({
          version: "64 Bit",
          date: formattedDate,
          size: formatFileSize(bit64.size),
          features: [...features],
          isLatest: processedVersions.length === 0,
          downloadUrl: bit64.browser_download_url,
        })
      }

      if (bit64Clone) {
        processedVersions.push({
          version: "64 Bit Clone",
          date: formattedDate,
          size: formatFileSize(bit64Clone.size),
          features: [...features, "Clone functionality", "Run multiple accounts"],
          downloadUrl: bit64Clone.browser_download_url,
        })
      }

      if (bit32Clone) {
        processedVersions.push({
          version: "32 Bit Clone",
          date: formattedDate,
          size: formatFileSize(bit32Clone.size),
          features: [...features, "Clone functionality for older devices", "Optimized for 32-bit processors"],
          downloadUrl: bit32Clone.browser_download_url,
        })
      }

      if (bit32) {
        processedVersions.push({
          version: "32 Bit",
          date: formattedDate,
          size: formatFileSize(bit32.size),
          features: [...features, "Compatible with older devices", "Optimized for 32-bit processors"],
          downloadUrl: bit32.browser_download_url,
        })
      }
    }

    // Ensure we have at most one of each version type
    const uniqueVersions: Version[] = []
    const versionTypes = ["64 Bit", "64 Bit Clone", "32 Bit Clone", "32 Bit"]

    for (const type of versionTypes) {
      const version = processedVersions.find((v) => v.version === type)
      if (version) {
        uniqueVersions.push(version)
      }
    }

    // Mark the first version as latest
    if (uniqueVersions.length > 0) {
      uniqueVersions[0].isLatest = true
    }

    return uniqueVersions
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

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

  const handleRefresh = () => {
    fetchReleases()
  }

  useEffect(() => {
    fetchReleases()

    // Set up background position tracking
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setBackgroundPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Fallback versions in case GitHub API fails
  const fallbackVersions: Version[] = [
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

  // Use fallback versions if API fails or no versions are found
  const displayVersions = versions.length > 0 ? versions : fallbackVersions

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
          <motion.div className="flex justify-between items-center mb-8">
            <motion.h1
              className="text-center text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Download Instella
            </motion.h1>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {lastUpdated && (
                <span className="text-xs text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={loading}
                className="text-white hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </motion.div>
          </motion.div>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2 border-white/20">
                Try Again
              </Button>
            </motion.div>
          )}

          {loading && displayVersions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-white animate-spin mb-4"></div>
              <p className="text-white/70">Loading available versions...</p>
            </div>
          ) : (
            <>
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
                            {displayVersions[0].version}
                          </motion.h3>
                          <motion.div
                            className="flex items-center text-sm text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                          >
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>Released on {displayVersions[0].date}</span>
                          </motion.div>
                        </div>
                        <motion.p
                          className="text-sm text-gray-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          {displayVersions[0].size}
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
                          {displayVersions[0].features.map((feature, index) => (
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
                            key={downloading === displayVersions[0].version ? "downloading" : "download"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              onClick={() => handleDownload(displayVersions[0].version)}
                              disabled={downloading === displayVersions[0].version}
                              className="w-full bg-white text-black hover:bg-gray-200 relative overflow-hidden"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {downloading === displayVersions[0].version ? (
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
                Other Version 
              </motion.h2>

              {displayVersions.slice(1).map((version, index) => (
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
            </>
          )}
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
