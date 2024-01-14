import React from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Input } from '@nextui-org/react';
import { DeleteIcon } from './icons/DeleteIcon';

export default function DeletePopover({ _id, handleDelete }) {
  const content = (
    <PopoverContent className="w-[240px]">
      {(titleProps) => (
        <div className="px-1 py-2 w-full">
          <Button size="sm" color="danger" variant="ghost" className="w-full" onClick={() => handleDelete(_id)}>
            Delete
          </Button>
        </div>
      )}
    </PopoverContent>
  );

  return (
    <div className="flex flex-wrap gap-4">
      <Popover key={'blur'} showArrow offset={10} backdrop={'blur'}>
        <PopoverTrigger>
          <Button
            size="sm"
            isIconOnly
            variant="light"
            radius="none"
            startContent={<DeleteIcon className="text-red/50" />}></Button>
        </PopoverTrigger>
        {content}
      </Popover>
    </div>
  );
}
