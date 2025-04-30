"use client"

import { useEffect, useState } from "react"
import { Calendar, FileText, Download, CheckCircle, AlertCircle, Info, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { FaInstagram } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type BackupFile = {
  name: string
  tagName: string
  date: string
  size: string
  changes: string[]
  isLatest?: boolean
  downloadUrl: string
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    async function fetchReleases() {
      try {
        setLoading(true)
        const res = await fetch("https://api.github.com/repos/OnlyAbhii/instella_app/releases")

        if (!res.ok) {
          throw new Error("Failed to fetch releases")
        }

        const releases = await res.json()
        const allBackups: BackupFile[] = []

        for (const release of releases) {
          for (const asset of release.assets) {
            if (asset.name.endsWith(".json")) {
              allBackups.push({
                name: asset.name,
                tagName: release.tag_name || "Untitled",
                date: new Date(asset.created_at).toLocaleDateString(),
                size: (asset.size / 1024).toFixed(2) + " kB",
                changes: release.body?.split("\n").filter(Boolean) || ["No changelog provided"],
                isLatest: releases[0].id === release.id,
                downloadUrl: asset.browser_download_url,
              })
            }
          }
        }

        setBackups(allBackups)
        setLoading(false)
      } catch (err) {
        setError("Failed to load backup files. Please try again later.")
        setLoading(false)
        console.error(err)
      }
    }

    fetchReleases()
  }, [])

  const handleDownload = (file: BackupFile) => {
    setDownloading(file.name)

    try {
      const a = document.createElement("a")
      a.href = file.downloadUrl
      a.setAttribute("download", file.name)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setTimeout(() => {
        setDownloading(null)
        setDownloadSuccess(file.name)

        setTimeout(() => {
          setDownloadSuccess(null)
        }, 3000)
      }, 1000)
    } catch (err) {
      setDownloading(null)
      console.error(err)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <motion.div
          className="absolute top-3/4 -right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
          style={{
            transform: `translateY(${scrollY * -0.05}px)`,
          }}
        />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
          <motion.div className="mb-8 text-center">
            <motion.h1
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Library Backup Files
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Download backup files to restore your Instella settings and preferences
            </motion.p>
          </motion.div>

          {loading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-4 h-12 w-12">
                <motion.div
                  className="h-full w-full rounded-full border-4 border-t-violet-500 border-r-transparent border-b-cyan-500 border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
              <p className="text-gray-400">Loading backup files...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
              <h3 className="mb-2 text-xl font-medium text-red-400">Error Loading Backups</h3>
              <p className="text-gray-400">{error}</p>
              <Button
                className="mt-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-black hover:from-violet-600 hover:to-cyan-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </motion.div>
          ) : backups.length === 0 ? (
            <motion.div
              className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Info className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
              <h3 className="mb-2 text-xl font-medium text-yellow-400">No Backup Files Found</h3>
              <p className="text-gray-400">There are currently no backup files available for download.</p>
            </motion.div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show">
              {backups.map((file, index) => (
                <motion.div key={file.name} variants={item} transition={{ delay: 0.1 * index }}>
                  <Card className="mb-4 overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-violet-500/10">
                    <CardContent className="p-0">
                      <div className="flex flex-col border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ rotate: 15 }}
                              transition={{ duration: 0.2 }}
                              className="mr-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 p-1"
                            >
                              <FileText className="h-5 w-5 text-white" />
                            </motion.div>
                            <h3 className="text-lg font-medium">{file.tagName}</h3>
                            {file.isLatest && (
                              <Badge className="ml-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-black">
                                Latest
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-400">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{file.date}</span>
                            <span className="mx-2">•</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handleDownload(file)}
                                disabled={downloading === file.name}
                                className={`group relative overflow-hidden ${
                                  file.isLatest
                                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-black hover:from-violet-600 hover:to-cyan-600"
                                    : "border-white/20 bg-transparent text-white hover:bg-white/10"
                                }`}
                              >
                                {downloading === file.name ? (
                                  <span className="flex items-center">
                                    <motion.div
                                      className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    />
                                    Downloading...
                                  </span>
                                ) : downloadSuccess === file.name ? (
                                  <span className="flex items-center">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Downloaded!
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                                    Download
                                  </span>
                                )}
                                {file.isLatest && (
                                  <motion.span
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.5 }}
                                  />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download {file.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="bg-white/5 p-4">
                        <h4 className="mb-2 text-sm font-medium">Changelog:</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                          {file.changes.map((c, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                              viewport={{ once: true }}
                            >
                              {c}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="mt-12 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-center backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-xl font-bold">Need Help With Backups?</h3>
            <p className="mb-6 text-gray-400">
              Join our Telegram community for assistance with installing and using backup files.
            </p>
            <a href="https://t.me/instellacommunity" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-cyan-500 text-black hover:from-violet-600 hover:to-cyan-600">
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center">
                  Join Telegram Support
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </main>

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
            <Link className="group text-sm text-gray-400 transition-colors hover:text-white" href="/">
              <span className="relative">
                Home
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
