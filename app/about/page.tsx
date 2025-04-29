"use client"

import { motion } from "framer-motion"
import { ArrowRight, Heart, Users, Code, Shield, Zap, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import { FaInstagram } from "react-icons/fa"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: <Download className="h-10 w-10 text-white" />,
      title: "Clone Support",
      description: "Use Instella alongside your original Instagram app without conflicts.",
    },
    {
      icon: <Shield className="h-10 w-10 text-white" />,
      title: "Ad Free Experience",
      description: "Enjoy Instagram without any annoying advertisements.",
    },
    {
      icon: <Zap className="h-10 w-10 text-white" />,
      title: "Faster Updates",
      description: "Get the latest features and improvements before anyone else.",
    },
    {
      icon: <Code className="h-10 w-10 text-white" />,
      title: "Open Source",
      description: "Transparent development with community contributions welcome.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="mb-4 text-4xl font-bold sm:text-5xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              About Instella
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Instella is a powerful Instagram mod designed to enhance your social media experience with additional
              features and improvements.
            </motion.p>
          </motion.div>

          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Instella Mission</h2>
            <Card className="border border-white/10 bg-black">
              <CardContent className="p-6 sm:p-8">
                <p className="mb-4 text-center text-lg">
                  We believe in creating a better social media experience that puts users first.
                </p>
                <p className="text-center text-gray-400">
                  Instella was created to provide Instagram users with more control over their experience, removing
                  limitations and adding features that enhance how you connect with others. Our team is dedicated to
                  continuous improvement and responding to community feedback.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Key Features</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border border-white/10 bg-black">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-center"
          >
            <Card className="border border-white/10 bg-black">
              <CardContent className="p-6 sm:p-8">
                <Heart className="mx-auto mb-4 h-12 w-12 text-white" />
                <h2 className="mb-4 text-2xl font-bold">Join Our Community</h2>
                <p className="mb-6 text-gray-400">
                  Connect with other Instella users, get support, and stay updated on the latest developments.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link href="https://t.me/instellacommunity" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 sm:w-auto">
                      <Users className="mr-2 h-5 w-5" />
                      Join Telegram Group
                    </Button>
                  </Link>
                  <Link href="/download">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 sm:w-auto">
                      Download Latest Version
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.section>
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
