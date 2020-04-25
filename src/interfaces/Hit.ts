import HitType from "../enums/HitType";

interface Hit {
  id: number;
  createdAt: string;
  ipAddress: string;
  email: string;
  type: HitType;
  sourceId: number;
}

export default Hit;
