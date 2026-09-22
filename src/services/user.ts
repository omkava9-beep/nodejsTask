import { product, userRepo } from "../controllers";
import { Status } from "../entities/Product";
import { Role } from "../entities/User";

export async function createManager(managerData: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = managerData;

  const user = userRepo.create({
    name: name,
    email: email,
    password: password,
    role: Role.MANAGER,
  });

  const newUser = await userRepo.save(user);

  return {
    message: "Manager created Successfully.",
    success: true,
    manager: newUser,
  };
}

