import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'b95ecae45b41243ea37bdedbeeb47510acf266a5', queries,  });
export default client;
  