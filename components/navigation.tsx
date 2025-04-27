"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaInstagram } from "react-icons/fa"
import { motion } from "framer-motion"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { path: "/backup", label: "Backup" },
    { path: "/download", label: "Download" },
    { path: "/about", label: "About" },
  ]

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link className="flex items-center space-x-2 font-bold" href="/">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <FaInstagram className="h-6 w-6 text-white" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Instella
          </motion.span>
        </Link>
        <div className="flex items-center space-x-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <Link
                className={`text-sm transition-colors hover:text-gray-300 ${
                  pathname === item.path ? "text-white font-medium" : "text-gray-400"
                }`}
                href={item.path}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.header>
  )
}
