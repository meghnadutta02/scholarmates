import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const comparePasswords = (inputPass, hashedPass) => {
  return bcrypt.compareSync(inputPass, hashedPass);
};

export { hashPassword, comparePasswords };
