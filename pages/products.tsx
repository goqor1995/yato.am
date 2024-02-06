import React, { useEffect, useState } from "react";
import moment from "moment";
import DataTable from "react-data-table-component";
import Head from "next/head";
import { useRouter } from "next/router";
import { Input, Button, Spinner } from "@nextui-org/react";
import { SearchIcon } from "../components/icons/SearchIcon";
import Modal from "../components/modal";
import AddProductModal from "../components/productModal";
import DeletePopover from "../components/DeletePopover";
import { PlusIcon } from "../components/icons/PlusIcon";

export default function Products() {
  const [loading, setLoading] = useState<any>(false);
  const [products, setProducts] = useState<any>([]);
  const [items, setItems] = useState<any>(products);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.reload();
    // router.replace(router.asPath);
  };

  const handleRedirect = async () => {
    setLoading(true);
    // Sign out and redirect to login page
    await router.push("/");
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await fetch("/api/products", {
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
      name: "Ջնջել",
      selector: (row: { _id: string }) => (
        <DeletePopover _id={row._id} handleDelete={handleDeleteProduct} />
      ),
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Տողերի քանակն էջում",
    rangeSeparatorText: "|",
    selectAllRowsItem: true,
  };

  const handleSearch = (e: { target: { value: any } }) => {
    setLoading(true);
    const filteredItems = products.filter((row: { SKU: string | any[] }) => {
      return row.SKU.includes(e.target.value);
    });
    setItems(filteredItems);
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
        <title>Yato.am - Products</title>
      </Head>
      {(!products || loading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size="lg" color="default" />
        </div>
      )}
      {products && !loading && (
        <div className="">
          <div className="flex justify-between items-center gap-3 mt-6 mb-5">
            <div className="self-start w-[400px]">
              <Input
                size="sm"
                onChange={handleSearch}
                placeholder="Մուտքագրեք արտիկուլը որոնման համար..."
                startContent={
                  <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <div className="self-end flex gap-10">
              <AddProductModal refreshData={refreshData} />
              <Button size="sm" onClick={handleRedirect}>
                Գլխավոր Էջ
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
      )}
    </div>
  );
}