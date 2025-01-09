import Jwt from "jsonwebtoken";
import { jwtExpiryToMilliseconds } from "./function.js";
import { createNewSession } from "../models/session/sessionModel.js";
import { updateUser } from "../models/user/userModel.js";

const createAccessJwt = async (email) => {
  const token = Jwt.sign({email}, process.env.ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}`,
  });

  const obj = {
    token,
    association: email,
    expire: new Date(
      Date.now() + jwtExpiryToMilliseconds(process.env.ACCESS_TOKEN_EXPIRY)
    ), //15min
  };

  const newSession = await createNewSession(obj);
  if (newSession?._id) {
    return token;
  }
  return null;
};

export const verifyAccessJwt = async (token)=>{
  if(!token){
    return "Token not provided."
  }
  console.log(token);
  console.log(process.env.ACCESS_TOKEN_JWT_SECRET);
  try {
    const result= await Jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
    console.log("Result: ", result);
    return result;
  } catch (error) {
    console.log(error.message);
  }
  
}
 const createRefreshJwt = async (email) => {
  const refreshJwt = Jwt.sign({email}, process.env.REFRESH_TOKEN_JWT_SECRET, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY}`,
  });
  const user = await updateUser({ email }, { refreshJwt });
  if (user?._id) {
    return refreshJwt;
  }
  return null;
};

export const verifyRefreshJwt = async (token)=>{
  try {
    return Jwt.verify(token, process.env.REFRESH_TOKEN_JWT_SECRET)
  } catch (error) {
    console.log(error);
    return error.message;
  }
  
}

export const getJwts =async (email) =>{
    return {
        accessJwt: await createAccessJwt(email),
        refreshJwt: await createRefreshJwt(email),
    }
}