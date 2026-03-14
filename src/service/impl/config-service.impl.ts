import type { ConfigService } from "../config-service.interface";
import { injectable } from "inversify";
import dotenv from "dotenv";

dotenv.config();

@injectable()
export class ConfigServiceImpl implements ConfigService {
  get(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Config ${key} not found`);
    return value;
  }
}
