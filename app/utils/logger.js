import { toast } from "react-toastify";

const isDevelopment = process.env.NODE_ENV === "development";
const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (message, ...args) => {
    if (isDevelopment) {
      console.error(message, ...args);
    } else {
      toast.error(message, {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  },
  info: (message) => {
    if (isDevelopment) {
      console.info(message);
    } else {
      toast.info(message, {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  },
};

export default logger;
