"use client"

import { useEffect, useState } from "react"
import { Calendar, FileText } from "lucide-react"
import { motion } from "framer-motion"
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
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReleases() {
      const res = await fetch("https://api.github.com/repos/OnlyAbhii/instella_app/releases")
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
    }

    fetchReleases()
  }, [])

  const handleDownload = (file: BackupFile) => {
    setDownloading(file.name)
    const a = document.createElement("a")
    a.href = file.downloadUrl
    a.setAttribute("download", file.name)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => setDownloading(null), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
          <motion.h1 className="mb-8 text-center text-3xl font-bold">Library Backup Files</motion.h1>

          {backups.map((file, index) => (
            <motion.div key={file.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
              <Card className="mb-4 overflow-hidden border border-white/10 bg-black">
                <CardContent className="p-0">
                  <div className="flex flex-col border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-white" />
                        <h3 className="text-lg font-medium">{file.tagName}</h3>
                        {file.isLatest && <Badge className="ml-2 bg-white text-black">Latest</Badge>}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{file.date}</span>
                        <span className="mx-2">•</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file)}
                      disabled={downloading === file.name}
                      className={`${file.isLatest ? "bg-white text-black" : "border-white/20 bg-transparent text-white"}`}
                    >
                      {downloading === file.name ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                  <div className="bg-white/5 p-4">
                    <h4 className="mb-2 text-sm font-medium">Changelog:</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                      {file.changes.map((c, i) => (
                        <li key={i}>{c}</li>
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
              <FaInstagram className="h-6 w-6 text-white" />
            </Link>
            <span className="font-bold">Instella</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Instella All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
