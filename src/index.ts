import * as dotenv from "dotenv";
dotenv.config();
import { Server } from "./infra/server/Server";

Server.getInstance().listen()