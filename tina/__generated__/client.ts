import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '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', queries,  });
export default client;
  