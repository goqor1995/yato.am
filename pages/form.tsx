import React, { useState } from 'react';
import clientPromise from '../lib/mongodb';
import SearchBar from '../components/searchbar';
// import styles from './main.module.css';

export default function Products({ products }) {
  const [items, setItems] = useState(products);
  const [name, setName] = useState();
  const [sku, setSku] = useState();

  // const handleSearch = (e) => {
  //   const filteredItems = products.filter((row) => {
  //     return row.SKU.includes(e.target.value);
  //   });
  //   setItems(filteredItems);
  // };

  const handleSearch = (SKU: string) => {
    // setSearchQuery(SKU);
    // setShowResults(false);
    const filteredItems = products.filter((row) => {
      return row.SKU.includes(SKU);
    });
    setItems(filteredItems);
    console.log('Search query:', SKU);
    console.log('Filtered items:', filteredItems);
    setName(filteredItems[0]?.Name);
    setSku(filteredItems[0].SKU);
    // Implement further actions as needed
  };

  return (
    <div>
      <div>
        <div className="text-end">
          <SearchBar items={products} handleSearch={handleSearch} />
          <div className={styles.inputFormContainer}>
            <input className={styles.inputForm} placeholder="Name" defaultValue={name} />
            {/* <input className={styles.inputForm} placeholder="SKU" defaultValue={sku} /> */}
          </div>
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db('yatoam');

    const products = await db.collection('products').find({}).limit(5000).toArray();

    return {
      props: { products: JSON.parse(JSON.stringify(products)) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { products: [] }, // Return an empty array or handle the error accordingly
    };
  }
}
