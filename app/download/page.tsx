"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
}

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const versions: Version[] = [
    {
      version: "v4",
      date: "April 27, 2025",
      size: "91.2 MB",
      features: [
        "Base Update: v379.0.0.0.29",
        "Upgraded to latest base version",
        "Improved download speeds",
        "New story viewer features",
        "Enhanced privacy controls",
      ],
      isLatest: true,
    },
    {
      version: "v3",
      date: "April 26, 2025",
      size: "91.2 MB",
      features: ["Base Update: v379.0.0.0.14", "Fixed login issues", "Improved performance", "Added new themes"],
    },
    {
      version: "v2",
      date: "April 26, 2025",
      size: "91.2 MB",
      features: ["Base Update: v379.0.0.0.10", "Updated core libraries", "Fixed crash on some devices"],
    },
    {
      version: "v1",
      date: "April 25, 2025",
      size: "90.6 MB",
      features: ["Base Update: v378.0.0.0.64", "Improved backup system", "New UI elements", "Performance optimizations"],
    },
  ]

  const handleDownload = (version: string) => {
    setDownloading(version)

    // Simulate download process
    setTimeout(() => {
      setDownloading(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
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

          <Card className="mb-8 overflow-hidden border border-white/10 bg-black">
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
                    <Badge className="bg-white text-black hover:bg-gray-200">Latest</Badge>
                  </motion.div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-6">
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
                    <Button
                      onClick={() => handleDownload(versions[0].version)}
                      disabled={downloading === versions[0].version}
                      className="w-full bg-white text-black hover:bg-gray-200"
                    >
                      {downloading === versions[0].version ? (
                        <span className="flex items-center">
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                          Downloading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Download className="mr-2 h-5 w-5" />
                          Download Latest Version
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="p-6">
                <motion.div
                  className="flex items-center rounded-lg bg-white/5 p-4 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  whileHover={{ scale: 1.02 }}
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
              transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="mb-4 border border-white/10 bg-black">
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
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleDownload(version.version)}
                    disabled={downloading === version.version}
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    {downloading === version.version ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Downloading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ArrowDown className="mr-2 h-5 w-5" />
                        Download {version.version}
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <FaInstagram className="h-6 w-6 text-white transition-transform hover:scale-110" />
            </Link>
            <span className="font-bold">Instella</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Instella All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
