import { Link } from "@tanstack/react-router"
import { BubblesIcon, CloudHailIcon, ThermometerSunIcon } from "lucide-react"

export const Header = () => {
  return (
    <header className="space-y-6">
      <h1 className="flex flex-col">
        <span className="text-xs">Wetterdaten</span>
        <span className="font-black text-2xl">Magdeburg</span>
      </h1>
      <nav>
        <ul className="flex gap-0.5">
          <li>
            <Link
              to="/temperature"
              className="block p-4 hover:bg-muted-foreground/40"
              activeProps={{
                className: "text-temperature border-temperature border-b-2 bg-muted-foreground pointer-events-none",
              }}
            >
              <ThermometerSunIcon />
            </Link>
          </li>
          <li>
            <Link
              to="/precipitation"
              className="block p-4 hover:bg-muted-foreground/40"
              activeProps={{
                className: "text-precipitation border-precipitation border-b-2 bg-muted-foreground pointer-events-none",
              }}
            >
              <CloudHailIcon className="w-8" />
            </Link>
          </li>
          <li>
            <Link
              to="/humidity"
              className="block p-4 hover:bg-muted-foreground/40"
              activeProps={{
                className: "text-humidity border-b-2 border-humidity bg-muted-foreground pointer-events-none",
              }}
            >
              <BubblesIcon className="w-8" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
