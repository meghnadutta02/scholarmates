import React from "react";

const format = (date) => {
  const now = new Date();
  const inputDate = new Date(date);

  if (
    inputDate.getDate() === now.getDate() &&
    inputDate.getMonth() === now.getMonth() &&
    inputDate.getFullYear() === now.getFullYear()
  ) {
    return inputDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Check if the date is yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  return inputDate.toLocaleDateString();
};

const FormatDate = ({ lastMessageTime }) => {
  return <span>{format(lastMessageTime)}</span>;
};

export default FormatDate;
