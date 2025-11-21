import { Link } from "@tanstack/react-router"
import { BubblesIcon, CloudHailIcon, ThermometerSunIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { buttonVariants } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"

export function MainNav() {
  return (
    <nav>
      <ButtonGroup aria-label="Datenauswahl">
        <Link
          to="/temperature"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "w-14 h-12")}
          activeProps={{
            className: "text-temperature bg-muted-foreground pointer-events-none",
          }}
        >
          <ThermometerSunIcon className="size-6" />
        </Link>

        <Link
          to="/precipitation"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "w-14 h-12")}
          activeProps={{
            className: "text-precipitation bg-muted-foreground pointer-events-none",
          }}
        >
          <CloudHailIcon className="size-6" />
        </Link>

        <Link
          to="/humidity"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "w-14 h-12")}
          activeProps={{
            className: "text-humidity bg-muted-foreground pointer-events-none",
          }}
        >
          <BubblesIcon className="size-6" />
        </Link>
      </ButtonGroup>
    </nav>
  )
}
