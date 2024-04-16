import React, { useState, useEffect } from "react";
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
  const [sku, setSku] = useState("");
  const [phone, setPhone] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isSkuValid, setIsSkuValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isSerialNumberValid, setIsSerialNumberValid] = useState(true);
  const [owner, setOwner] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(
    new Set(["Երաշխիքի ժամկետ"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  useEffect(() => {
    if (!isOpen) {
      // Reset input fields
      setName("");
      setSku("");
      setPhone("");
      setSerialNumber("");

      // Reset validation states
      setIsNameValid(true);
      setIsSkuValid(true);
      setIsPhoneValid(true);
      setIsSerialNumberValid(true);

      // Reset owner to currentUser
      setOwner(currentUser);
    }
  }, [isOpen, currentUser]);

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

  const handleSerialNumber = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSerialNumber(e.target.value);
  };

  const handleOwner = () => {
    setOwner(currentUser);
  };

  const validateFields = () => {
    const validName = name.trim() !== "";
    const validSku = sku.trim() !== "";
    const validPhone = phone.trim() !== "";
    const validSerialNumber = serialNumber.trim() !== "";

    setIsNameValid(validName);
    setIsSkuValid(validSku);
    setIsPhoneValid(validPhone);
    setIsSerialNumberValid(validSerialNumber);

    return validName && validSku && validPhone && validSerialNumber;
  };

  const handleAdd = async (onClose: { (): void; (): void }) => {
    if (!validateFields()) {
      setLoading(false);
      return; // stop the submission process
    }
    setLoading(true);
    handleOwner();
    try {
      const currentDate = new Date();
      let expiryDate;

      if (selectedValue === "6 Ամիս") {
        expiryDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 6,
          currentDate.getDate()
        );
      } else {
        expiryDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 6,
          currentDate.getDate()
        );
      }

      expiryDate.setHours(23, 59, 59, 999);
      const expiryTime = expiryDate.getTime();

      await fetch("/api/warranties", {
        method: "POST",
        body: JSON.stringify({
          Name: name,
          SKU: sku,
          phone,
          owner,
          serialNumber,
          expiryDate: expiryTime,
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
      <Button size="sm" onClick={onOpen} endContent={<PlusIcon />}>
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
                  {(!isNameValid || !isSkuValid) && (
                    <p className="text-xs text-red-600">Այս դաշտը պարտադիր է</p>
                  )}
                  <Input
                    required
                    isRequired
                    label="Հեռախոսահամար"
                    placeholder="055xxxxxx"
                    variant="bordered"
                    onChange={handlePhone}
                  />
                  {!isPhoneValid && (
                    <p className="text-xs text-red-600">Այս դաշտը պարտադիր է</p>
                  )}
                  <Input
                    required
                    isRequired
                    label="Գործարանային համար"
                    variant="bordered"
                    onChange={handleSerialNumber}
                  />
                  {!isSerialNumberValid && (
                    <div className="text-xs text-red-600">
                      Այս դաշտը պարտադիր է
                    </div>
                  )}
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
