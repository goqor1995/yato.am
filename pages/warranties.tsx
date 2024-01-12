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

import React, { useState } from "react";
import clientPromise from "../lib/mongodb";
import DataTable from "react-data-table-component";

export default function Products({ products }) {
  const [items, setItems] = useState(products);

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "SKU",
      selector: (row) => row.SKU,
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
  };

  const handleSearch = (e) => {
    const filteredItems = products.filter((row) => {
      return row.SKU.includes(e.target.value);
    });
    setItems(filteredItems);
  };

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
          paginationComponentOptions={paginationComponentOptions}
        ></DataTable>
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
