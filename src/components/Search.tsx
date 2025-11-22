import { SearchIcon, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

type UseSearchResult = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

type SearchProps = {
  useContextHook: () => UseSearchResult
}

export function Search({ useContextHook }: SearchProps) {
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
      className={cn(
        'relative flex gap-2 items-center rounded transition-shadow',
        'focus-within:ring focus-within:ring-(--color-temperature)',
        searchTerm && 'ring ring-(--color-temperature)'
      )}
    >
      <Button variant="ghost" onClick={() => setIsActive(true)} disabled={isActive} className='disabled:text-temperature disabled:opacity-100 hover:text-temperature'>
        <SearchIcon />
      </Button>
      {isActive &&
        <>
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            autoFocus
            placeholder='Suchen'
            className={cn(
              'shrinkbg-background/20 backdrop-blur-xs focus:outline-none'
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
