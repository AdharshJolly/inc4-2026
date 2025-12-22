import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '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', queries,  });
export default client;
  