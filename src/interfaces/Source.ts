import SourceType from "../enums/SourceType";

interface Source {
  id: number;
  name: string;
  type: SourceType;
  apiKey?: string;
  email?: string;
}

export default Source;
