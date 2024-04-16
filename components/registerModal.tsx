import React, { useState, useEffect } from "react";
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
  const [isNameValid, setIsNameValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset input fields
      setName("");
      setUsername("");

      // Reset validation states
      setIsNameValid(true);
      setIsUsernameValid(true);
      setIsPasswordValid(true);
    }
  }, [isOpen]);

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

  const validateFields = () => {
    const validName = name.trim() !== "";
    const validUsername = username.trim() !== "";
    const validPassword = password.trim() !== "";

    setIsNameValid(validName);
    setIsUsernameValid(validUsername);
    setIsPasswordValid(validPassword);

    return validName && validUsername && validPassword;
  };

  const handleAdd = async (onClose: { (): void; (): void }) => {
    if (!validateFields()) {
      setLoading(false);
      return; // stop the submission process
    }
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
                  {!isNameValid && (
                    <p className="text-xs text-red-600">Այս դաշտը պարտադիր է</p>
                  )}
                  <Input
                    required
                    isRequired
                    label="Օգտանուն"
                    placeholder="Օգտանուն"
                    variant="bordered"
                    onChange={handleUsername}
                  />
                  {!isUsernameValid && (
                    <p className="text-xs text-red-600">Այս դաշտը պարտադիր է</p>
                  )}
                  <PasswordInput handlePassword={handlePassword} />
                  {!isPasswordValid && (
                    <p className="text-xs text-red-600">Այս դաշտը պարտադիր է</p>
                  )}
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
