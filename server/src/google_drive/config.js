import dotenv from "dotenv";
dotenv.config()

export const config = {
  private_key: process.env.private_key,
  client_email: process.env.client_email,
}
