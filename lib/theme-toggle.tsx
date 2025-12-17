"use client"

import { useTheme } from "next-themes"
import { Palette } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Palette className="h-5 w-5" />
    </button>
  )
}
