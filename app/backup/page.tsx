"use client"

import Link from "next/link"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import { FaInstagram } from "react-icons/fa"

type BackupFile = {
  name: string
  date: string
  size: string
  changes: string[]
  isLatest?: boolean
  downloadUrl: string // Add this new property
}

export default function BackupPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const backupFiles: BackupFile[] = [
    {
      name: "instella_backup_v2.5.0.igbackup",
      date: "April 25, 2025",
      size: "12.8 MB",
      changes: ["Added support for new Instagram features", "Improved backup compression", "Fixed restore issues"],
      isLatest: true,
      downloadUrl: "https://example.com/backups/instella_backup_v2.5.0.igbackup",
    },
    {
      name: "instella_backup_v2.4.2.igbackup",
      date: "March 18, 2025",
      size: "12.5 MB",
      changes: ["Fixed backup corruption issues", "Added support for story highlights", "Improved metadata handling"],
      downloadUrl: "https://example.com/backups/instella_backup_v2.4.2.igbackup",
    },
    {
      name: "instella_backup_v2.4.0.igbackup",
      date: "February 5, 2025",
      size: "12.3 MB",
      changes: ["Added support for saved collections", "Improved backup speed", "Fixed compatibility issues"],
      downloadUrl: "https://example.com/backups/instella_backup_v2.4.0.igbackup",
    },
    {
      name: "instella_backup_v2.3.5.igbackup",
      date: "January 12, 2025",
      size: "12.1 MB",
      changes: ["Initial backup system release", "Basic support for posts and stories", "Profile data backup"],
      downloadUrl: "https://example.com/backups/instella_backup_v2.3.5.igbackup",
    },
  ]

  const handleDownload = (fileName: string) => {
    setDownloading(fileName)

    // Find the backup file that matches the requested file name
    const backupFile = backupFiles.find((file) => file.name === fileName)

    if (backupFile) {
      // Create an anchor element to trigger the download
      const link = document.createElement("a")
      link.href = backupFile.downloadUrl
      link.setAttribute("download", fileName)

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // Show downloading state for a short period
    setTimeout(() => {
      setDownloading(null)
    }, 2000)
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
            Library Backup Files
          </motion.h1>

          <motion.p
            className="mb-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Download backup files to restore your Instagram library data
          </motion.p>

          {backupFiles.map((file, index) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="mb-4 overflow-hidden border border-white/10 bg-black">
                <CardContent className="p-0">
                  <div className="flex flex-col border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-white" />
                        <h3 className="text-lg font-medium">{file.name}</h3>
                        {file.isLatest && <Badge className="ml-2 bg-white text-black hover:bg-gray-200">Latest</Badge>}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{file.date}</span>
                        <span className="mx-2">•</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file.name)}
                      disabled={downloading === file.name}
                      className={`${file.isLatest ? "bg-white text-black hover:bg-gray-200" : "border-white/20 bg-transparent text-white hover:bg-white/10"}`}
                    >
                      {downloading === file.name ? (
                        <span className="flex items-center">
                          <span
                            className={`mr-2 h-4 w-4 animate-spin rounded-full border-2 ${file.isLatest ? "border-black border-t-transparent" : "border-white border-t-transparent"}`}
                          ></span>
                          Downloading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ArrowDown className="mr-2 h-5 w-5" />
                          Download
                        </span>
                      )}
                    </Button>
                  </div>
                  <div className="bg-white/5 p-4">
                    <h4 className="mb-2 text-sm font-medium">Changelog:</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                      {file.changes.map((change, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * i + 0.2 * index }}
                        >
                          {change}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
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

