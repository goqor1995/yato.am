import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { Formik } from 'formik';
import { PlusIcon } from '../components/icons/PlusIcon';
import SearchBar from './searchbar';

export default function AddWarantyModal({ products, refreshData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState('');
  const [sku, setSku] = useState();
  const [phone, setPhone] = useState('');

  const handleSearch = (SKU: string) => {
    if (!SKU) return;
    const filteredItem = products.filter((item: { SKU: string }) =>
      item.SKU.toLowerCase().includes(SKU?.toLowerCase())
    );
    console.log('Search query:', SKU);
    console.log('Filtered items:', filteredItem);
    setName(filteredItem[0]?.Name);
    setSku(filteredItem[0].SKU);
    // Implement further actions as needed
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleAdd = async (onClose) => {
    try {
      await fetch('/api/warranties', {
        method: 'POST',
        body: JSON.stringify({
          Name: name,
          SKU: sku,
          phone,
          expiryDate: Date.now() + 1000 * 60 * 60 * 24 * 365,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });
      // response = await response.json();
      onClose();
      refreshData();
    } catch (errorMessage: any) {
      console.error(errorMessage);
    }
  };

  return (
    <>
      <Button size="sm" onPress={onOpen} endContent={<PlusIcon />}>
        Add
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <Formik>
              <>
                <ModalHeader className="flex flex-col gap-1">Add Warranty</ModalHeader>
                <ModalBody>
                  <SearchBar items={products} handleSearch={handleSearch} />
                  {/* <Input
                    required
                    isRequired
                    isReadOnly
                    label="Name"
                    placeholder="Product Name"
                    variant="bordered"
                    value={name}
                  /> */}
                  <Input
                    required
                    isRequired
                    label="Phone Number"
                    placeholder="055xxxxxx"
                    variant="bordered"
                    onChange={handlePhone}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setName('');
                      onClose();
                    }}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" onPress={() => handleAdd(onClose)}>
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
