import Honeypot from "./Honeypot";

interface Campaign {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  honeypots: Honeypot[];
}

export default Campaign;
