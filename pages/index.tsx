import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import moment from "moment";
import { useRouter } from "next/router";
import { Input } from "@nextui-org/react";
import DataTable from "react-data-table-component";
import Head from "next/head";
import clientPromise from "../lib/mongodb";
import Modal from "../components/modal";
import SearchBar from "../components/searchbar";
import AddUserModal from "../components/registerModal";
import DeletePopover from "../components/DeletePopover";
import { SearchIcon } from "../components/icons/SearchIcon";

export default function Products({ products, warranties, users, user }) {
  const [items, setItems] = useState(warranties);
  const [registeredUsers, setRegisteredUsers] = useState(users);
  const [currentUser, setCurrentUser] = useState(user);

  // Next.js has a bug where it tries to render the component before the window object is available.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;
  // End of bug fix

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.reload();
  };

  const handleDelete = async (id) => {
    try {
      await fetch("/api/warranties", {
        method: "DELETE",
        body: JSON.stringify({
          _id: id,
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
      refreshData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.Name,
      // sortable: true,
      width: "40%",
    },
    {
      name: "SKU",
      selector: (row) => row.SKU,
    },
    {
      name: "Phone number",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Expiry Date",
      selector: (row) =>
        moment(new Date(Number(row.expiryDate))).format("DD/MM/YYYY HH:mm:ss"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.expiryDate < Date.now()
          ? "Expired"
          : row.expiryDate - Date.now() < 2629746000
          ? "Exipres in 1 month"
          : "Active",
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <DeletePopover _id={row._id} handleDelete={handleDelete} />
      ),
    },
  ];

  const userColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      // sortable: true,
      width: "40%",
    },
    {
      name: "Username",
      selector: (row) => row.username,
    },
    {
      name: "Actions",
      selector: (row) => (
        <DeletePopover _id={row._id} handleDelete={handleDelete} />
      ),
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
  };

  const handleSearch = (e) => {
    const filteredItems = warranties.filter((row) => {
      return row.phone.includes(e.target.value);
    });
    setItems(filteredItems);
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.expiryDate < Date.now(),
      style: {
        backgroundColor: "rgb(210 35 19 / 90%)",
        color: "white",
        "&:hover": {
          cursor: "not-allowed",
        },
      },
    },
    {
      when: (row) => row.expiryDate > Date.now(),
      style: {
        backgroundColor: "rgb(12 155 82 / 90%)",
        color: "white",
        "&:hover": {
          cursor: "cursor",
        },
      },
    },
    {
      when: (row) =>
        row.expiryDate - Date.now() > 0 &&
        row.expiryDate - Date.now() < 2629746000,
      style: {
        backgroundColor: "rgb(236 139 0 / 90%)",
        color: "white",
        "&:hover": {
          cursor: "cursor",
        },
      },
    },
  ];

  return (
    <div className="container">
      <Head>
        <title>Yato.am - Warranties</title>
      </Head>
      <div className="">
        {/* <h3>Warranties</h3> */}
        <div className="flex justify-between items-center gap-3 mt-6 mb-5">
          <div className="self-start w-[250px]">
            <Input
              size="sm"
              onChange={handleSearch}
              placeholder="Type phone number to search..."
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
          <div className="self-end flex gap-10">
            {/* <SearchBar /> */}
            <AddUserModal refreshData={refreshData} />
            <Modal products={products} refreshData={refreshData} />
          </div>
        </div>
        {/* {username === "admin" ? ( */}
        <DataTable
          columns={userColumns}
          data={registeredUsers}
          pagination
          responsive
          fixedHeader
          striped
          highlightOnHover
          pointerOnHover
          conditionalRowStyles={conditionalRowStyles}
          paginationComponentOptions={paginationComponentOptions}
        ></DataTable>
        {/* ) : (
          <></>
        )} */}
        <DataTable
          columns={columns}
          data={items}
          pagination
          responsive
          fixedHeader
          striped
          highlightOnHover
          pointerOnHover
          conditionalRowStyles={conditionalRowStyles}
          paginationComponentOptions={paginationComponentOptions}
        ></DataTable>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = await clientPromise;
    const db = client.db("yatoam");
    const session = await getSession(context);
    if (!session?.user) {
      // Redirect or handle the case when the user is not authenticated
      return {
        redirect: {
          destination: "/auth/signin", // Redirect to your login page
          permanent: false,
        },
      };
    }

    console.log(session, session.user);
    const users = await db.collection("users").find({}).limit(5000).toArray();

    const products = await db
      .collection("products")
      .find({})
      .limit(5000)
      .toArray();
    const warranties = await db
      .collection("warranties")
      .find({})
      .limit(5000)
      .toArray();

    return {
      props: {
        // user: {
        //   id: session.user.id,
        //   name: session.user,name,
        //   username: session.user.username,
        // },
        user: session.user,
        users: JSON.parse(JSON.stringify(users)),
        products: JSON.parse(JSON.stringify(products)),
        warranties: JSON.parse(JSON.stringify(warranties)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { users: [], products: [], warranties: [] },
    };
  }
}
