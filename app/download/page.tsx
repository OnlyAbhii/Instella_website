"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Info, Calendar, RefreshCw, ArrowLeft, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
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
  appName?: string
  versionCode?: string
  versionName?: string
}

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [versions, setVersions] = useState<{
    bit64: Version[]
    bit64Clone: Version[]
    bit32: Version[]
    bit32Clone: Version[]
  }>({
    bit64: [],
    bit64Clone: [],
    bit32: [],
    bit32Clone: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [bitType, setBitType] = useState<"64" | "32">("64")
  const [cloneType, setCloneType] = useState<"normal" | "clone">("normal")
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [step, setStep] = useState<"bitSelect" | "cloneSelect" | "versionSelect" | "versionDetail">("bitSelect")

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
        setVersions({
          bit64: [],
          bit64Clone: [],
          bit32: [],
          bit32Clone: [],
        })
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

  const processReleases = (releases: GitHubRelease[]) => {
    const bit64: Version[] = []
    const bit64Clone: Version[] = []
    const bit32: Version[] = []
    const bit32Clone: Version[] = []

    // Sort releases by published date (newest first)
    const sortedReleases = [...releases].sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )

    for (const release of sortedReleases) {
      // Filter assets to find APK files
      const apkAssets = release.assets.filter((asset) => asset.name.toLowerCase().endsWith(".apk"))

      // Group APKs by type (64bit, 32bit, clone, etc.)
      const bit64Asset = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("64bit") && !asset.name.toLowerCase().includes("clone"),
      )
      const bit64CloneAsset = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("64bit") && asset.name.toLowerCase().includes("clone"),
      )
      const bit32Asset = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("32bit") && !asset.name.toLowerCase().includes("clone"),
      )
      const bit32CloneAsset = apkAssets.find(
        (asset) => asset.name.toLowerCase().includes("32bit") && asset.name.toLowerCase().includes("clone"),
      )

      // Extract features from release body
      const features = release.body
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- ") || line.startsWith("* "))
        .map((line) => line.substring(2).trim())
        .filter((line) => line.length > 0)

      // If no features found, add a default one
      const finalFeatures = features.length > 0 ? features : [`Base Update: ${release.tag_name}`]

      // Format date
      const releaseDate = new Date(release.published_at)
      const formattedDate = releaseDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Extract version info from release name
      const versionMatch =
        release.name?.match(/v?(\d+\.\d+(\.\d+)*)/) || release.tag_name?.match(/v?(\d+\.\d+(\.\d+)*)/)
      const versionName = versionMatch ? versionMatch[0] : release.tag_name
      const versionCode = release.tag_name?.replace(/\D/g, "") || "Unknown"

      // Add versions based on available assets
      if (bit64Asset) {
        bit64.push({
          version: "64 Bit",
          date: formattedDate,
          size: formatFileSize(bit64Asset.size),
          features: [...finalFeatures],
          isLatest: bit64.length === 0,
          downloadUrl: bit64Asset.browser_download_url,
          appName: "Instella",
          versionName,
          versionCode,
        })
      }

      if (bit64CloneAsset) {
        bit64Clone.push({
          version: "64 Bit Clone",
          date: formattedDate,
          size: formatFileSize(bit64CloneAsset.size),
          features: [...finalFeatures],
          isLatest: bit64Clone.length === 0,
          downloadUrl: bit64CloneAsset.browser_download_url,
          appName: "Instella Clone",
          versionName,
          versionCode,
        })
      }

      if (bit32Asset) {
        bit32.push({
          version: "32 Bit",
          date: formattedDate,
          size: formatFileSize(bit32Asset.size),
          features: [...finalFeatures],
          isLatest: bit32.length === 0,
          downloadUrl: bit32Asset.browser_download_url,
          appName: "Instella",
          versionName,
          versionCode,
        })
      }

      if (bit32CloneAsset) {
        bit32Clone.push({
          version: "32 Bit Clone",
          date: formattedDate,
          size: formatFileSize(bit32CloneAsset.size),
          features: [...finalFeatures],
          isLatest: bit32Clone.length === 0,
          downloadUrl: bit32CloneAsset.browser_download_url,
          appName: "Instella Clone",
          versionName,
          versionCode,
        })
      }
    }

    return { bit64, bit64Clone, bit32, bit32Clone }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const handleDownload = (version: Version) => {
    setDownloading(version.version)

    try {
      const link = document.createElement("a")
      link.href = version.downloadUrl
      link.setAttribute("download", `instella-${version.version}.apk`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        setDownloading(null)
        setDownloadSuccess(version.version)

        setTimeout(() => {
          setDownloadSuccess(null)
        }, 3000)
      }, 1000)
    } catch (err) {
      setDownloading(null)
      console.error(err)
    }
  }

  const handleRefresh = () => {
    fetchReleases()
  }

  const handleBitSelect = (bit: "64" | "32") => {
    setBitType(bit)
    setStep("cloneSelect")
  }

  const handleCloneSelect = (clone: "normal" | "clone") => {
    setCloneType(clone)
    setStep("versionSelect")
  }

  const handleVersionSelect = (version: Version) => {
    setSelectedVersion(version)
    setStep("versionDetail")
  }

  const handleBack = () => {
    if (step === "versionDetail") {
      setStep("versionSelect")
      setSelectedVersion(null)
    } else if (step === "versionSelect") {
      setStep("cloneSelect")
    } else if (step === "cloneSelect") {
      setStep("bitSelect")
    }
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

  // Get current versions based on selected bit and clone type
  const getCurrentVersions = () => {
    if (bitType === "64" && cloneType === "normal") return versions.bit64
    if (bitType === "64" && cloneType === "clone") return versions.bit64Clone
    if (bitType === "32" && cloneType === "normal") return versions.bit32
    if (bitType === "32" && cloneType === "clone") return versions.bit32Clone
    return []
  }

  const currentVersions = getCurrentVersions()

  // Fallback versions in case GitHub API fails
  const fallbackVersions = {
    bit64: [
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
        appName: "Instella",
        versionName: "v6.0",
        versionCode: "600",
      },
    ],
    bit64Clone: [
      {
        version: "64 Bit Clone",
        date: "April 28, 2025",
        size: "91.2 MB",
        features: [
          "Base Update: v379.0.0.0.44",
          "Clone functionality",
          "Run multiple accounts",
          "Enhanced performance",
        ],
        isLatest: true,
        downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.64Bit.Clone.apk",
        appName: "Instella Clone",
        versionName: "v6.0",
        versionCode: "600",
      },
    ],
    bit32: [
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
        isLatest: true,
        downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.32Bit.apk",
        appName: "Instella",
        versionName: "v6.0",
        versionCode: "600",
      },
    ],
    bit32Clone: [
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
        isLatest: true,
        downloadUrl: "https://github.com/OnlyAbhii/instella_app/releases/download/V6.0/Instella.V6.32Bit.Clone.apk",
        appName: "Instella Clone",
        versionName: "v6.0",
        versionCode: "600",
      },
    ],
  }

  // Use fallback versions if API fails or no versions are found
  const displayVersions =
    currentVersions.length > 0
      ? currentVersions
      : bitType === "64" && cloneType === "normal"
        ? fallbackVersions.bit64
        : bitType === "64" && cloneType === "clone"
          ? fallbackVersions.bit64Clone
          : bitType === "32" && cloneType === "normal"
            ? fallbackVersions.bit32
            : fallbackVersions.bit32Clone

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
            <div className="flex items-center">
              {step !== "bitSelect" && (
                <Button variant="ghost" className="mr-4 text-white hover:bg-white/10" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <motion.h1
                className="text-center text-3xl font-bold sm:text-4xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Download Instella
              </motion.h1>
            </div>

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
              className="mb-6 p-4 bg-black/50 border border-red-700 rounded-lg text-white backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2 border-white/20">
                Try Again
              </Button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "bitSelect" && (
              <motion.div
                key="bitSelect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8 border border-white/10 bg-black/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-xl font-semibold text-center">Select Device Architecture</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className="border border-white/10 bg-black/50 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                          onClick={() => handleBitSelect("64")}
                        >
                          <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">64 Bit</h3>
                            <p className="text-gray-400">For modern devices (recommended)</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className="border border-white/10 bg-black/50 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                          onClick={() => handleBitSelect("32")}
                        >
                          <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">32 Bit</h3>
                            <p className="text-gray-400">For older devices</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "cloneSelect" && (
              <motion.div
                key="cloneSelect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8 border border-white/10 bg-black/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-xl font-semibold text-center">Select Version Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className="border border-white/10 bg-black/50 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                          onClick={() => handleCloneSelect("normal")}
                        >
                          <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">Standard</h3>
                            <p className="text-gray-400">Replaces original Instagram app</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className="border border-white/10 bg-black/50 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                          onClick={() => handleCloneSelect("clone")}
                        >
                          <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">Clone</h3>
                            <p className="text-gray-400">Install alongside original Instagram</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "versionSelect" && (
              <motion.div
                key="versionSelect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8 border border-white/10 bg-black/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-xl font-semibold text-center">
                      Select Version ({bitType} Bit {cloneType === "clone" ? "Clone" : ""})
                    </h2>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-4 h-12 w-12">
                          <motion.div
                            className="h-full w-full rounded-full border-4 border-t-transparent border-white"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                        </div>
                        <p className="text-gray-400">Loading available versions...</p>
                      </div>
                    ) : displayVersions.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
                        <h3 className="text-xl font-medium mb-2">No Versions Available</h3>
                        <p className="text-gray-400">
                          There are currently no versions available for this configuration.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {displayVersions.map((version, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Card
                              className="border border-white/10 bg-black/50 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                              onClick={() => handleVersionSelect(version)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="text-lg font-medium">{version.versionName}</h3>
                                      {version.isLatest && <Badge className="ml-2 bg-white text-black">Latest</Badge>}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-400">
                                      <Calendar className="mr-1 h-4 w-4" />
                                      <span>{version.date}</span>
                                      <span className="mx-2">•</span>
                                      <span>{version.size}</span>
                                    </div>
                                  </div>
                                  <ArrowRight className="h-5 w-5 text-gray-400" />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "versionDetail" && selectedVersion && (
              <motion.div
                key="versionDetail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8 border border-white/10 bg-black/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{selectedVersion.appName}</h2>
                        {selectedVersion.isLatest && <Badge className="bg-white text-black">Latest</Badge>}
                      </div>
                      <div className="mt-2 grid gap-4 md:grid-cols-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Version Name</h3>
                          <p>{selectedVersion.versionName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Version Code</h3>
                          <p>{selectedVersion.versionCode}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Size</h3>
                          <p>{selectedVersion.size}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-2 text-sm font-medium text-gray-400">Release Date</h3>
                      <p>{selectedVersion.date}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-2 text-sm font-medium text-gray-400">Changelog</h3>
                      <div className="rounded-lg bg-white/5 p-4">
                        <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
                          {selectedVersion.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDownload(selectedVersion)}
                      disabled={downloading === selectedVersion.version}
                      className="w-full bg-white text-black hover:bg-gray-200"
                    >
                      {downloading === selectedVersion.version ? (
                        <span className="flex items-center">
                          <motion.div
                            className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-black"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          Downloading...
                        </span>
                      ) : downloadSuccess === selectedVersion.version ? (
                        <span className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Downloaded!
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Download {selectedVersion.appName} {selectedVersion.versionName}
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-white/10 bg-black/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-400">
                      <Info className="mr-2 h-4 w-4" />
                      <p>Make sure to backup your data before installing a new version.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
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
          <div className="flex space-x-6">
            <Link className="text-sm text-gray-400 hover:text-white" href="/backup">
              Backup
            </Link>
            <Link className="text-sm text-gray-400 hover:text-white" href="/about">
              About
            </Link>
            <Link className="text-sm text-gray-400 hover:text-white" href="/">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
