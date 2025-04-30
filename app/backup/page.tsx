"use client"

import { useEffect, useState } from "react"
import { Calendar, FileText, Download, CheckCircle, AlertCircle, Info, ExternalLink, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { FaInstagram } from "react-icons/fa"

type BackupFile = {
  name: string
  tagName: string
  date: string
  size: string
  changes: string[]
  isLatest?: boolean
  downloadUrl: string
  creator?: string
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null)

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
                date: new Date(release.created_at).toLocaleDateString(),
                size: (asset.size / 1024).toFixed(2) + " kB",
                changes: release.body?.split("\n").filter(Boolean) || ["No changelog provided"],
                isLatest: releases[0].id === release.id,
                downloadUrl: asset.browser_download_url,
                creator: release.author?.login || "Instella Team"
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
          className="absolute top-1/4 -left-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <motion.div
          className="absolute top-3/4 -right-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          style={{
            transform: `translateY(${scrollY * -0.05}px)`,
          }}
        />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatePresence mode="wait">
          {selectedBackup ? (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-3xl"
            >
              <motion.div className="mb-8 flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-4 text-white hover:bg-white/10"
                  onClick={() => setSelectedBackup(null)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold">{selectedBackup.name}</h1>
              </motion.div>
              
              <Card className="mb-6 border border-white/10 bg-black/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-gray-400">Version</h3>
                      <p>{selectedBackup.tagName}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-gray-400">Size</h3>
                      <p>{selectedBackup.size}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-gray-400">Date</h3>
                      <p>{selectedBackup.date}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-gray-400">Creator</h3>
                      <p>{selectedBackup.creator}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-medium text-gray-400">Changelog</h3>
                    <div className="rounded-lg bg-white/5 p-4">
                      <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
                        {selectedBackup.changes.map((change, i) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDownload(selectedBackup)}
                    disabled={downloading === selectedBackup.name}
                    className="w-full bg-white text-black hover:bg-gray-200"
                  >
                    {downloading === selectedBackup.name ? (
                      <span className="flex items-center">
                        <motion.div
                          className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-black"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Downloading...
                      </span>
                    ) : downloadSuccess === selectedBackup.name ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Downloaded!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download Backup
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border border-white/10 bg-black/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <Info className="mr-2 h-4 w-4" />
                    <p>Need help with this backup? Join our Telegram community for assistance.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-3xl"
            >
              <motion.h1
                className="mb-8 text-center text-3xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Library Backup Files
              </motion.h1>

              {loading ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-4 h-12 w-12">
                    <motion.div
                      className="h-full w-full rounded-full border-4 border-t-white border-r-transparent border-b-white border-l-transparent"
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
                    className="mt-4 bg-white text-black hover:bg-gray-200"
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
                      <Card 
                        className="mb-4 overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                        onClick={() => setSelectedBackup(file)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <motion.div
                                whileHover={{ rotate: 15 }}
                                transition={{ duration: 0.2 }}
                                className="mr-3"
                              >
                                <FileText className="h-5 w-5 text-white" />
                              </motion.div>
                              <div>
                                <h3 className="text-lg font-medium">{file.name}</h3>
                                <div className="flex items-center text-sm text-gray-400">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  <span>{file.date}</span>
                                  <span className="mx-2">•</span>
                                  <span>{file.size}</span>
                                </div>
                              </div>
                            </div>
                            {file.isLatest && (
                              <Badge className="bg-white text-black">Latest</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <FaInstagram className="h-6 w-6 text-white" />
              </motion.div>
            </Link>
            <span className="font-bold">Instella</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Instella All rights reserved.</p>
          <div className="flex space-x-6">
            <Link className="text-sm text-gray-400 hover:text-white" href="/download">
              Download
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
