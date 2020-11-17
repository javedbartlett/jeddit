import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username must be at least 2 characters",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Cannot include an @",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "Password must be at least 4 characters",
      },
    ];
  }

  return null;
};
