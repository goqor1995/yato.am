import React, { useState } from "react";
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
} from "@nextui-org/react";
import { PlusIcon } from "./icons/PlusIcon";

export default function AddProductModal({ refreshData }: { refreshData: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [loading, setLoading] = useState(false);

  const handleName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(e.target.value);
  };

  const handleSku = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSku(e.target.value);
  };

  const handleAdd = async (onClose: { (): void; (): void }) => {
    setLoading(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          Name: name,
          SKU: sku,
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
        Ավելացնել Ապրանք
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
                  <Input
                    required
                    isRequired
                    label="Անուն"
                    placeholder="Անուն"
                    variant="bordered"
                    onChange={handleName}
                  />
                  <Input
                    required
                    isRequired
                    label="Արտիկուլ"
                    placeholder="Արտիկուլ"
                    variant="bordered"
                    onChange={handleSku}
                  />
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
