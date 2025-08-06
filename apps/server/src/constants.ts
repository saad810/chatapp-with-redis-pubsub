import { config } from "dotenv"
config()
const REDIS_URL = process.env.REDIS_URL
export default REDIS_URL