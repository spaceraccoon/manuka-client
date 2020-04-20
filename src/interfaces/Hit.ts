import HitType from "../enums/HitType";

interface Hit {
  id: number;
  createdAt: string;
  ipAddress: string;
  email: string;
  type: HitType;
}

export default Hit;
