import ListenerType from "../enums/ListenerType";

interface Listener {
  id: number;
  name: string;
  updatedAt?: string;
  type: ListenerType;
  email?: string;
  url?: string;
}

export default Listener;
