import React, { useState } from "react";
import clientPromise from "../lib/mongodb";
import SearchBar from "../components/searchbar";
import styles from "./main.module.css";

export default function Products({ products }) {
  const [items, setItems] = useState(products);

  const handleSearch = (e) => {
    const filteredItems = products.filter((row) => {
      return row.SKU.includes(e.target.value);
    });
    setItems(filteredItems);
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="text-end">
          <SearchBar items={products} />
          <div className={styles.inputFormContainer}>
            <input className={styles.inputForm} />
            <input className={styles.inputForm} />
            <input className={styles.inputForm} />
          </div>
          <button type="submit">Submit</button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("yatoam");

    const products = await db
      .collection("products")
      .find({})
      .limit(5000)
      .toArray();

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
