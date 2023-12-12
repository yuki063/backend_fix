import { sign, verify } from "jsonwebtoken";

const KEY = process.env.JWT_KEY!;
export function createNewOTP(phone) {
  let otp: any = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  // let otp = "1122";
  const hash = sign({ phone, otp }, KEY, { expiresIn: "5m" });
  return { hash, otp };
}

export async function verifyOTP(phone, otp, hash) {
  return new Promise(async (resolve, reject) => {
    try {
      const { phone: phoneFromHash, otp: otpFromHash }: any = verify(hash, KEY);
      resolve(phone === phoneFromHash && otp === otpFromHash);
    } catch (error) {
      reject(error);
    }
  });
}
