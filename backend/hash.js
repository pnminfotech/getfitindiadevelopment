import bcrypt from "bcrypt";

const password = "admin@getfitindia.in"; // use a strong password

bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
