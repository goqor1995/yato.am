import React, { useState } from "react";
import { Key } from "@react-types/shared";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { PlusIcon } from "./icons/PlusIcon";
import SearchBar from "./searchbar";

export default function AddWarantyModal({
  products,
  refreshData,
  currentUser,
}: {
  products: any;
  refreshData: any;
  currentUser: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [sku, setSku] = useState();
  const [phone, setPhone] = useState("");
  const [owner, setOwner] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(
    new Set(["Երաշխիքի ժամկետ"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleSearch = (SKU: Key) => {
    if (!SKU) return;
    const filteredItem = products.filter((item: { SKU: string }) =>
      item.SKU.toLowerCase().includes(SKU?.toString().toLowerCase())
    );
    setName(filteredItem[0]?.Name);
    setSku(filteredItem[0].SKU);
  };

  const handlePhone = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPhone(e.target.value);
  };

  const handleOwner = () => {
    setOwner(currentUser);
  };

  const handleAdd = async (onClose: { (): void; (): void }) => {
    setLoading(true);
    handleOwner();
    try {
      await fetch("/api/warranties", {
        method: "POST",
        body: JSON.stringify({
          Name: name,
          SKU: sku,
          phone,
          owner,
          expiryDate:
            selectedValue === "6 Ամիս"
              ? Date.now() + 1000 * 60 * 60 * 24 * 183
              : Date.now() + 1000 * 60 * 60 * 24 * 385,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
      onClose();
      refreshData();
    } catch (errorMessage: any) {
      console.error(errorMessage);
    }
  };

  return (
    <>
      <Button size="sm" onPress={onOpen} endContent={<PlusIcon />}>
        Ավելացնել Երաշխիք
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Ավելացնել Երաշխիք
                </ModalHeader>
                <ModalBody>
                  <SearchBar items={products} handleSearch={handleSearch} />
                  <Input
                    required
                    isRequired
                    label="Հեռախոսահամար"
                    placeholder="055xxxxxx"
                    variant="bordered"
                    onChange={handlePhone}
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" className="capitalize">
                        {selectedValue}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Single selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={selectedKeys}
                      //@ts-ignore
                      onSelectionChange={setSelectedKeys}
                    >
                      <DropdownItem
                        className="w-[364px] text-center"
                        key="6 Ամիս"
                      >
                        6 Ամիս
                      </DropdownItem>
                      <DropdownItem
                        className="w-[364px] text-center"
                        key="12 Ամիս"
                      >
                        12 Ամիս
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setName("");
                      onClose();
                    }}
                  >
                    Փակել
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onPress={() => handleAdd(onClose)}
                  >
                    Ավելացնել
                  </Button>
                </ModalFooter>
              </>
            </form>
          )}
        </ModalContent>
      </Modal>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size="lg" color="default" />
        </div>
      )}
    </>
  );
}
