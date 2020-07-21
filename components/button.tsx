import React from "react";

export const Button = ({ buttonType = "button", ...props }) =>
  React.createElement(buttonType, {
    className:
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    ...props,
  });
