import React, { useState } from "react";
import { Eye } from "../components/icons/Eye";
import { EyeSlash } from "../components/icons/EyeSlash";
import { Input } from "@nextui-org/react";

interface PasswordInputProps {
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ handlePassword }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center">
      <Input
        required
        label="Գաղտնաբառ"
        type={showPassword ? "text" : "password"}
        placeholder="Գաղտնաբառ"
        onChange={handlePassword}
      />
      <div
        className="-ml-[35px] mt-4 cursor-pointer z-10"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeSlash /> : <Eye />}
      </div>
    </div>
  );
};

export default PasswordInput;
