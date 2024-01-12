// import React, { useState } from "react";
// import clientPromise from "../lib/mongodb";
// import DataTable from "react-data-table-component";

// export default function products({ products }) {
//   const [items, setItems] = useState(products);
//   const columns = [
//     {
//       name: "Product Name",
//       selector: (row) => row.Name,
//       sortable: true,
//     },
//     {
//       name: "SKU",
//       selector: (row) => row.SKU,
//     },
//   ];

//   const paginationComponentOptions = {
//     rowsPerPageText: "Rows per page",
//     rangeSeparatorText: "of",
//     selectAllRowsItem: true,
//   };

//   const handleSearch = (e) => {
//     const filteredItems = products.filter((row) => {
//       return row.SKU.includes(e.target.value);
//     });
//     setItems(filteredItems);
//   };

//   return (
//     <div>
//       <h1>Warranties</h1>
//       <div className="container mt-5">
//         <div className="text-end">
//           <input type="text" onChange={handleSearch} />
//         </div>
//         <DataTable
//           columns={columns}
//           data={items}
//           pagination
//           paginationComponentOptions={paginationComponentOptions}
//         ></DataTable>
//       </div>
//     </div>
//   );
// }

// export async function getServerSideProps() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("yatoam");

//     const products = await db
//       .collection("products")
//       .find({})
//       .limit(5000)
//       .toArray();

//     return {
//       props: { products: JSON.parse(JSON.stringify(products)) },
//     };
//   } catch (e) {
//     console.error(e);
//   }
// }

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import clientPromise from '../lib/mongodb';
import DataTable from 'react-data-table-component';

export default function Products({ products }) {
  const [items, setItems] = useState(products);
  // Next.js has a bug where it tries to render the component before the window object is available.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;
  // End of bug fix

  const columns = [
    {
      name: 'Product Name',
      selector: (row) => row.Name,
      // sortable: true,
    },
    {
      name: 'SKU',
      selector: (row) => row.SKU,
    },
    {
      name: 'Expiry Date',
      selector: (row) => moment(new Date(Number(row.expiryDate))).format('DD/MM/YYYY HH:mm:ss'),
      sortable: true,
    },
    {
      name: 'Expired',
      selector: (row) => (row.expiryDate < Date.now() ? 'Yes' : 'No'),
      sortable: true,
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
  };

  const handleSearch = (e) => {
    const filteredItems = products.filter((row) => {
      return row.SKU.includes(e.target.value);
    });
    setItems(filteredItems);
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.expiryDate < Date.now(),
      style: {
        backgroundColor: 'rgba(242, 38, 19, 0.9)',
        color: 'white',
        '&:hover': {
          cursor: 'not-allowed',
        },
      },
    },
  ];

  return (
    <div>
      <h1>Warranties</h1>
      <div className="container mt-5">
        <div className="text-end">
          <input type="text" onChange={handleSearch} />
        </div>
        <DataTable
          columns={columns}
          data={items}
          pagination
          responsive
          conditionalRowStyles={conditionalRowStyles}
          paginationComponentOptions={paginationComponentOptions}></DataTable>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db('yatoam');

    const products = await db.collection('warranties').find({}).limit(5000).toArray();

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
