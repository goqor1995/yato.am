import React from 'react';
import { Button } from '@nextui-org/react';
import { FilterIcon } from './icons/FilterIcon';

export default function FilterButton({ user, handleFilter }: { user: any; handleFilter: Function }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        size="sm"
        variant="light"
        radius="none"
        onClick={() => handleFilter(user)}
        startContent={<FilterIcon className="text-red/50" />}></Button>
    </div>
  );
}
