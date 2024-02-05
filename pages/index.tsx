import React, { useEffect, useState } from 'react';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input, Button, Spinner } from '@nextui-org/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { SearchIcon } from '../components/icons/SearchIcon';
import Modal from '../components/modal';
import AddUserModal from '../components/registerModal';
import DeletePopover from '../components/DeletePopover';
import FilterButton from '../components/FilterButton';

export default function Products() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [items, setItems] = useState(warranties);
  const [registeredUsers, setRegisteredUsers] = useState(users);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/signin';
    },
  });

  useEffect(() => {
    if (!session) return;
    setUser(session.user);

    return () => {
      // Cleanup function
    };
  }, [session]);

  const fetchWarranties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/warranties');
      const data = await res.json();
      setWarranties(data);
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setRegisteredUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWarranties();
    fetchProducts();
    fetchUsers();
  }, []);

  const handleFilter = (owner: { username: string; _id: any }) => {
    setLoading(true);
    if (owner.username === 'admin') {
      setLoading(false);
      return setItems(warranties);
    }

    const ownerItems = warranties.filter((row: { owner: { id: any } }) => {
      return row.owner.id === owner._id;
    });
    setItems(ownerItems);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    // @ts-ignore
    if (user?.username === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.reload();
    // router.replace(router.asPath);
  };

  const handleSignOut = async () => {
    setLoading(true);
    // Sign out and redirect to login page
    await signOut({ callbackUrl: '/auth/signin' });
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      await fetch('/api/users', {
        method: 'DELETE',
        body: JSON.stringify({
          _id: userId,
        }),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });
      // You might want to refresh the list of users after deletion
      refreshData();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteWarranty = async (id: string) => {
    setLoading(true);
    try {
      await fetch('/api/warranties', {
        method: 'DELETE',
        body: JSON.stringify({
          _id: id,
        }),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      refreshData();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: 'Product Name',
      selector: (row: { Name: any }) => row.Name,
      // sortable: true,
      width: '40%',
    },
    {
      name: 'SKU',
      selector: (row: { SKU: any }) => row.SKU,
    },
    {
      name: 'Phone number',
      selector: (row: { phone: any }) => row.phone,
      sortable: true,
    },
    {
      name: 'Expiry Date',
      selector: (row: { expiryDate: any }) => moment(new Date(Number(row.expiryDate))).format('DD/MM/YYYY HH:mm:ss'),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: { expiryDate: number }) =>
        row.expiryDate < Date.now()
          ? 'Expired'
          : row.expiryDate - Date.now() < 2629746000
          ? 'Exipres in 1 month'
          : 'Active',
      sortable: true,
      // conditionalCellStyles: [
      //   {
      //     when: (row: { expiryDate: number }) => row.expiryDate < Date.now(),
      //     style: {
      //       backgroundColor: 'rgb(210 35 19 / 90%)',
      //       color: 'white',
      //       '&:hover': {
      //         cursor: 'not-allowed',
      //       },
      //     },
      //   },
      // ],
    },
    {
      name: 'Actions',
      selector: (row: { _id: string }) => <DeletePopover _id={row._id} handleDelete={handleDeleteWarranty} />,
    },
  ];

  const userColumns = [
    {
      name: 'Name',
      selector: (row: { name: string }) => row.name,
      // sortable: true,
      width: '40%',
    },
    {
      name: 'Username',
      selector: (row: { username: string }) => row.username,
    },
    {
      name: 'Actions',
      selector: (row: { _id: string; username: string }) => <FilterButton user={row} handleFilter={handleFilter} />,
    },
    {
      name: 'Remove',
      selector: (row: { username: string; _id: string }) => {
        if (row.username === 'admin') return;
        return <DeletePopover _id={row._id} handleDelete={handleDeleteUser} />;
      },
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
  };

  const handleSearch = (e: { target: { value: any } }) => {
    setLoading(true);
    const filteredItems = warranties.filter((row: { phone: string | any[] }) => {
      return row.phone.includes(e.target.value);
    });
    setItems(filteredItems);
    setLoading(false);
  };

  const handleSearchUser = (e: { target: { value: any } }) => {
    setLoading(true);
    const filteredUsers = users.filter((row: { username: string | any[] }) => {
      return row.username.includes(e.target.value);
    });
    setRegisteredUsers(filteredUsers);
    setLoading(false);
  };

  const conditionalRowStyles = [
    {
      when: (row: { expiryDate: number }) => row.expiryDate < Date.now(),
      style: {
        backgroundColor: 'rgb(210 35 19 / 90%)',
        color: 'white',
        '&:hover': {
          cursor: 'not-allowed',
        },
      },
    },
  ];

  return (
    <div className="container">
      <Head>
        <title>Yato.am - Warranties</title>
      </Head>
      {(!user || !warranties || !products || !users || loading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size="lg" color="default" />
        </div>
      )}
      {user &&
        warranties &&
        products &&
        !loading &&
        (isAdmin ? (
          <div className="">
            <div className="flex justify-between items-center gap-3 mt-6 mb-5">
              <div className="self-start w-[250px]">
                <Input
                  size="sm"
                  onChange={handleSearchUser}
                  placeholder="Type username to search..."
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <div className="self-end flex gap-10">
                <AddUserModal refreshData={refreshData} />
                <Modal products={products} refreshData={refreshData} currentUser={user} />
                <Button size="sm" onClick={handleSignOut}>
                  {user.name} / Sign Out
                </Button>
              </div>
            </div>

            <DataTable
              // @ts-ignore
              columns={userColumns}
              data={registeredUsers}
              pagination
              responsive
              fixedHeader
              striped
              highlightOnHover
              pointerOnHover
              paginationComponentOptions={paginationComponentOptions}></DataTable>
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
            <DataTable
              // @ts-ignore
              columns={columns}
              data={items}
              pagination
              responsive
              fixedHeader
              striped
              highlightOnHover
              pointerOnHover
              // @ts-ignore
              conditionalRowStyles={conditionalRowStyles}
              paginationComponentOptions={paginationComponentOptions}></DataTable>
          </div>
        ) : (
          <div className="">
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
                <Modal products={products} refreshData={refreshData} currentUser={user} />
                <Button size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
            <DataTable
              // @ts-ignore
              columns={columns}
              data={items}
              pagination
              responsive
              fixedHeader
              striped
              highlightOnHover
              pointerOnHover
              // @ts-ignore
              conditionalRowStyles={conditionalRowStyles}
              paginationComponentOptions={paginationComponentOptions}></DataTable>
          </div>
        ))}
    </div>
  );
}

// export async function getServerSideProps(
//   context: GetSessionParams | undefined
// ) {
//   try {
//     const client = await clientPromise;
//     const db = client.db("yatoam");
//     const session = await getSession(context);
//     let users: Document[] = [];
//     let warrantiesFilter = { "owner.id": session?.user.id };

//     if (!session?.user) {
//       // Redirect or handle the case when the user is not authenticated
//       return {
//         redirect: {
//           destination: "/auth/signin", // Redirect to your login page
//           permanent: false,
//         },
//       };
//     }

//     if (session?.user?.username === "admin") {
//       users = await db
//         .collection("users")
//         .find({})
//         .project({ hashedPassword: 0 })
//         .toArray();
//       // @ts-ignore
//       warrantiesFilter = {};
//     }

//     const products = await db.collection("products").find({}).toArray();
//     const warranties = await db
//       .collection("warranties")
//       .find(warrantiesFilter)
//       .toArray();

//     return {
//       props: {
//         user: JSON.parse(JSON.stringify(session?.user)),
//         users: JSON.parse(JSON.stringify(users)),
//         products: JSON.parse(JSON.stringify(products)),
//         warranties: JSON.parse(JSON.stringify(warranties)),
//       },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: { user: [], users: [], products: [], warranties: [] },
//     };
//   }
// }
