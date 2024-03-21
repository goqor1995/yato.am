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
import { ResetIcon } from "./icons/ResetIcon";

export default function ResetPasswordModal({
  _id,
  username,
  refreshData,
}: {
  _id: string;
  username: string;
  refreshData: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewPassword = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewPassword(e.target.value);
  };

  const handleReset = async (onClose: { (): void; (): void }) => {
    setLoading(true);
    try {
      await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({
          _id: _id,
          username: username,
          newPassword: newPassword,
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
      <Button
        onPress={onOpen}
        size="sm"
        isIconOnly
        variant="light"
        radius="none"
        startContent={<ResetIcon className="text-red/50" />}
      ></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Փոխել գաղտնաբառը
                </ModalHeader>
                <ModalBody>
                  <Input
                    required
                    isRequired
                    type="password"
                    label="Մուտքագրեք նոր գաղտնաբառ"
                    placeholder="Գաղտնաբառ"
                    variant="bordered"
                    onChange={handleNewPassword}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setNewPassword("");
                      onClose();
                    }}
                  >
                    Փակել
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onPress={() => handleReset(onClose)}
                  >
                    Հաստատել
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
