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
import { PlusIcon } from "../components/icons/PlusIcon";
import PasswordInput from "./PasswordInput";

export default function AddUserModal({
  refreshData,
}: {
  refreshData: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUsername = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUsername(e.target.value);
  };

  const handleName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(e.target.value);
  };

  const handlePassword = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPassword(e.target.value);
  };

  const handleAdd = async (onClose: { (): void; (): void }) => {
    setLoading(true);
    try {
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          username: username,
          password: password,
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
    onClose();
  };

  return (
    <>
      <Button size="sm" onClick={onOpen} endContent={<PlusIcon />}>
        Ավելացնել Օգտատեր
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Ավելացնել Օգտատեր
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
                    label="Օգտանուն"
                    placeholder="Օգտանուն"
                    variant="bordered"
                    onChange={handleUsername}
                  />
                  <PasswordInput handlePassword={handlePassword} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setUsername("");
                      setName("");
                      setPassword("");
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
