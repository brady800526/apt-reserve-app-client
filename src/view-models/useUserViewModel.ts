import { useState } from "react";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export const useUserViewModel = () => {
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const validateUser = (): string | null => {
    if (!user.firstName || !user.lastName) {
      return "Please enter first and last name";
    }

    if (user.firstName.includes(" ") || user.lastName.includes(" ")) {
      return "First and last name cannot contain spaces";
    }

    if (!user.email) {
      return "Please enter email address";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const clearUser = () => {
    setUser({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  return {
    user,
    setUser,
    validateUser,
    clearUser,
  };
};
