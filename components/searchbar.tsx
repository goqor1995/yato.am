import React, { useState, ChangeEvent, Key } from 'react';
import { Input } from '@nextui-org/react';
import { Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import { SearchIcon } from '../components/icons/SearchIcon';
interface Item {
  Name: string;
  SKU: string;
}

interface SearchBarProps {
  items: Item[];
  handleSearch: (key: Key) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ items, handleSearch }) => {
  return (
    <Autocomplete
      required
      isRequired
      isClearable={false}
      variant="bordered"
      label="Search in All Products"
      placeholder="Type SKU to search..."
      defaultItems={items}
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
