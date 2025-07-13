import clsx from "clsx";

import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CustomButton = ({ className, ...rest }: CustomButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        "p-2 bg-[#332E42] rounded-[6px] hover:bg-[#444] cursor-pointer mr-2 text-[12px]"
      )}
      {...rest}
    />
  );
};

export default CustomButton;
