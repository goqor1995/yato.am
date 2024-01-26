import { FilterIcon } from "./icons/FilterIcon";
import React from "react";
import { Button } from "@nextui-org/react";

export default function FilterButton({ _id, handleFilter }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        size="sm"
        variant="light"
        radius="none"
        onClick={() => handleFilter(_id)}
        startContent={<FilterIcon className="text-red/50" />}
      ></Button>
    </div>
  );
}
