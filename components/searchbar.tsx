import React from 'react';
import { Key } from '@react-types/shared';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { SearchIcon } from '../components/icons/SearchIcon';

interface Item {
  Name: string;
  SKU: string;
}

interface SearchBarProps {
  items: Item[];
  handleSearch: (SKU: Key) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ items, handleSearch }) => {
  return (
    <Autocomplete
      required
      isRequired
      isClearable={false}
      variant="bordered"
      label="Փնտրել բոլոր ապրանքների մեջ"
      placeholder="Գրեք արտիկուլը որոնման համար..."
      defaultItems={items}
      // @ts-ignore
      onKeyDown={(e) => e.continuePropagation()}
      onSelectionChange={handleSearch}
      startContent={
        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      }>
      {(item) => <AutocompleteItem key={item.SKU}>{`${item.SKU} - ${item.Name}`}</AutocompleteItem>}
    </Autocomplete>
  );
};

export default SearchBar;
