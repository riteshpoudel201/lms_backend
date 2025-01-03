import bcrypt from "bcrypt";

const SALT_ROUNDS = 15
export const hashPassword = (plainPassword) =>{
    return bcrypt.hashSync(plainPassword, SALT_ROUNDS)
}
