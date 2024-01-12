import React, { useState, ChangeEvent } from "react";
import styles from "./searchbar.module.css";

interface Item {
  Name: string;
  SKU: string;
}

interface SearchBarProps {
  items: Item[];
}

const SearchBar: React.FC<SearchBarProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = items.filter((item) =>
      item.SKU.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
    setShowResults(true);
  };

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
    console.log("Filtered items:", filteredItems);
    // Implement further actions as needed
  };

  const handleItemClick = (SKU: string) => {
    setSearchQuery(SKU);
    setShowResults(false);
    // Implement further actions as needed
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchInputContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Enter SKU to search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
        {showResults && (
          <ul className={styles.dropdownList}>
            {filteredItems.map((item, index) => (
              <li
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleItemClick(item.SKU)}
              >
                Name: {item.Name} {"\n"}
                SKU: {item.SKU}
                <br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
