import { cva, VariantProps } from 'class-variance-authority';
import { SearchIcon, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

type UseSearchResult = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

type SearchProps = VariantProps<typeof searchVariants> & {
  useContextHook: () => UseSearchResult
}

const searchVariants = cva(
  'relative flex gap-2 items-center rounded transition-shadow focus-within:ring [&>.search-button]:disabled:opacity-100',
  {
    variants: {
      color: {
        temperature: 'focus-within:ring-(--color-temperature) [&>#search-button]:disabled:text-temperature [&>#search-button]:hover:text-temperature',
        precipitation: 'focus-within:ring-(--color-precipitation) [&>#search-button]:disabled:text-precipitation [&>#search-button]:hover:text-precipitation',
        humidity: 'focus-within:ring-(--color-humidity) [&>#search-button]:disabled:text-humidity [&>#search-button]:hover:text-humidity',
      }
    },
    defaultVariants: {
      color: 'temperature',
    }
  }
)

export function Search({ useContextHook, color }: SearchProps) {
  const { searchTerm, setSearchTerm } = useContextHook();
  const [isActive, setIsActive] = useState(searchTerm.length > 0);
  const [localValue, setLocalValue] = useState(searchTerm);

  // Debounce updates to global searchTerm to avoid heavy recomputations each keystroke
  useEffect(() => {
    const id = setTimeout(() => {
      if (localValue !== searchTerm) {
        setSearchTerm(localValue);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [localValue, searchTerm, setSearchTerm]);

  return (
    <div
      className={cn(searchVariants({ color }),
        searchTerm && 'ring ring-(--color-temperature)'
      )}
    >
      <Button id="search-button" variant="ghost" onClick={() => setIsActive(true)} disabled={isActive}>
        <SearchIcon />
      </Button>
      {isActive &&
        <>
          <input
            data-testid="search-input"
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            autoFocus
            placeholder='Suchen'
            className={cn(
              'shrink bg-background/20 backdrop-blur-xs focus:outline-none'
            )}
            onBlur={() => setIsActive(searchTerm.length > 0)}
          />
          <Button
            aria-label='Eingabe löschen'
            onClick={() => { setLocalValue(''); setSearchTerm(''); setIsActive(false) }}
            variant="ghost"
            size="icon-sm"

          >
            <X className='w-4 h-4 text-foreground' />
          </Button>
        </>
      }
    </div>
  )
}
