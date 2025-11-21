import { Link } from "@tanstack/react-router"
import { BubblesIcon, CloudHailIcon, ThermometerSunIcon } from "lucide-react"
import { ButtonGroup } from "./ui/button-group"
import { Button, buttonVariants } from "./ui/button"
import { cn } from "../lib/utils"

export const Header = () => {
  return (
    <header className="space-y-6">
      <h1 className="flex flex-col">
        <span className="text-xs">Wetterdaten</span>
        <span className="font-black text-2xl">Magdeburg</span>
      </h1>
    </header>
  )
}
