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
} from "@nextui-org/react";
import { Formik } from "formik";
import { PlusIcon } from "../components/icons/PlusIcon";

export default function AddUserModal({ refreshData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleAdd = async (onClose) => {
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
      // response = await response.json();
      console.log(
        "new user is created",
        "password:",
        password,
        "username:",
        username
      );
      onClose();
      refreshData();
    } catch (errorMessage: any) {
      console.error(errorMessage);
    }
    onClose();
  };

  return (
    <>
      <Button size="sm" onPress={onOpen} endContent={<PlusIcon />}>
        Add User
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <Formik>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add User
                </ModalHeader>
                <ModalBody>
                  <Input
                    required
                    isRequired
                    label="Name"
                    placeholder="Name"
                    variant="bordered"
                    onChange={handleName}
                  />
                  <Input
                    required
                    isRequired
                    label="Username"
                    placeholder="Username"
                    variant="bordered"
                    onChange={handleUsername}
                  />
                  <Input
                    required
                    isRequired
                    type="password"
                    label="Password"
                    placeholder="Password"
                    variant="bordered"
                    onChange={handlePassword}
                  />
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
                    Close
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onPress={() => handleAdd(onClose)}
                  >
                    Add
                  </Button>
                </ModalFooter>
              </>
            </Formik>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
