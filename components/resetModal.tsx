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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePassword = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPassword(e.target.value);
  };

  const handleReset = async (onClose: { (): void; (): void }) => {
    setLoading(true);
    try {
      await fetch("/api/passwordUpdate", {
        method: "POST",
        body: JSON.stringify({
          userId: _id,
          newPassword: password,
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
                    onChange={handlePassword}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setPassword("");
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
