import React, { useEffect, useState } from "react";
import moment from "moment";
import DataTable from "react-data-table-component";
import Head from "next/head";
import { useRouter } from "next/router";
import { Input, Button, Spinner } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { SearchIcon } from "../components/icons/SearchIcon";
import Modal from "../components/modal";
import AddUserModal from "../components/registerModal";
import DeletePopover from "../components/DeletePopover";
import FilterButton from "../components/FilterButton";

export default function Products() {
  const [isAdmin, setIsAdmin] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [users, setUsers] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any>([]);
  const [warranties, setWarranties] = useState<any>([]);
  const [items, setItems] = useState<any>(warranties);
  const [registeredUsers, setRegisteredUsers] = useState<any>(users);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/auth/signin";
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
      const res = await fetch("/api/warranties");
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
      const res = await fetch("/api/products");
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
      const res = await fetch("/api/users");
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
    if (owner.username === "admin") {
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
    if (user?.username === "admin") {
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
    await signOut({ callbackUrl: "/auth/signin" });
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      await fetch("/api/users", {
        method: "DELETE",
        body: JSON.stringify({
          _id: userId,
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Ապրանքի անուն",
      selector: (row: { Name: any }) => row.Name,
      // sortable: true,
      width: "40%",
    },
    {
      name: "Արտիկուլ",
      selector: (row: { SKU: any }) => row.SKU,
    },
    {
      name: "Հեռախոս",
      selector: (row: { phone: any }) => row.phone,
      sortable: true,
    },
    {
      name: "Մինչև",
      selector: (row: { expiryDate: any }) =>
        moment(new Date(Number(row.expiryDate))).format("DD/MM/YYYY HH:mm:ss"),
      sortable: true,
    },
    {
      name: "Կարգավիճակ",
      selector: (row: { expiryDate: number }) =>
        row.expiryDate < Date.now()
          ? "Ժամկետանց"
          : row.expiryDate - Date.now() < 2629746000
          ? "Լրանում է 1 ամսից"
          : "Ակտիվ",
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
      name: "Ջնջել",
      selector: (row: { _id: string }) => (
        <DeletePopover _id={row._id} handleDelete={handleDeleteWarranty} />
      ),
    },
  ];

  const userColumns = [
    {
      name: "Անուն",
      selector: (row: { name: string }) => row.name,
      // sortable: true,
      width: "40%",
    },
    {
      name: "Օգտանուն",
      selector: (row: { username: string }) => row.username,
    },
    {
      name: "Ֆիլտրել",
      selector: (row: { _id: string; username: string }) => (
        <FilterButton user={row} handleFilter={handleFilter} />
      ),
    },
    {
      name: "Ջնջել",
      selector: (row: { username: string; _id: string }) => {
        if (row.username === "admin") return;
        return <DeletePopover _id={row._id} handleDelete={handleDeleteUser} />;
      },
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Տողերի քանակն էջում",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
  };

  const handleSearch = (e: { target: { value: any } }) => {
    setLoading(true);
    const filteredItems = warranties.filter(
      (row: { phone: string | any[] }) => {
        return row.phone.includes(e.target.value);
      }
    );
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
        backgroundColor: "rgb(210 35 19 / 90%)",
        color: "white",
        "&:hover": {
          cursor: "not-allowed",
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
              <div className="self-start w-[400px]">
                <Input
                  size="sm"
                  onChange={handleSearchUser}
                  placeholder="Մուտքագրեք օգտանունը որոնման համար..."
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <div className="self-end flex gap-10">
                <AddUserModal refreshData={refreshData} />
                <Modal
                  products={products}
                  refreshData={refreshData}
                  currentUser={user}
                />
                <Button size="sm" onClick={handleSignOut}>
                  {user.name} / Ելք
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
              paginationComponentOptions={paginationComponentOptions}
            ></DataTable>
            <div className="self-start w-[400px]">
              <Input
                size="sm"
                onChange={handleSearch}
                placeholder="Մուտքագրեք հեռախոսը որոնման համար..."
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
              paginationComponentOptions={paginationComponentOptions}
            ></DataTable>
          </div>
        ) : (
          <div className="">
            <div className="flex justify-between items-center gap-3 mt-6 mb-5">
              <div className="self-start w-[400px]">
                <Input
                  size="sm"
                  onChange={handleSearch}
                  placeholder="Մուտքագրեք հեռախոսը որոնման համար..."
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <div className="self-end flex gap-10">
                <Modal
                  products={products}
                  refreshData={refreshData}
                  currentUser={user}
                />
                <Button size="sm" onClick={handleSignOut}>
                  {user.name} / Ելք
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
              paginationComponentOptions={paginationComponentOptions}
            ></DataTable>
          </div>
        ))}
    </div>
  );
}
