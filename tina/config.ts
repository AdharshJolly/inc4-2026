import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "development",
  clientId: process.env.VITE_TINA_CLIENT_ID || "",
  token: process.env.VITE_TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        label: "Important Dates",
        name: "importantDates",
        path: "src/data",
        format: "json",
        match: { include: "important-dates" },
        fields: [
          {
            type: "object",
            list: true,
            name: "root",
            label: "Events",
            ui: {
              itemProps: (item: any) => ({
                label: item?.event || "Untitled",
              }),
            },
            fields: [
              {
                type: "string",
                label: "Event Name",
                name: "event",
                required: true,
              },
              { type: "string", label: "Date", name: "date", required: true },
              {
                type: "string",
                label: "Status",
                name: "status",
                options: ["upcoming", "completed", "highlight"],
              },
            ],
          },
        ],
      },
      {
        label: "Speakers",
        name: "speakers",
        path: "src/data",
        format: "json",
        match: { include: "speakers" },
        fields: [
          {
            type: "object",
            list: true,
            name: "root",
            label: "Speakers",
            ui: {
              itemProps: (item: any) => ({
                label: item?.name || "New Speaker",
              }),
            },
            fields: [
              { type: "string", label: "Name", name: "name", required: true },
              {
                type: "string",
                label: "Role/Title",
                name: "role",
                required: false,
              },
              {
                type: "string",
                label: "Affiliation",
                name: "affiliation",
                required: false,
              },
              {
                type: "object",
                label: "Photo",
                name: "photo",
                fields: [
                  {
                    type: "string",
                    label: "Photo URL (link)",
                    name: "url",
                    description: "Enter a URL to an external photo",
                  },
                  {
                    type: "image",
                    label: "Upload Photo",
                    name: "file",
                    description: "Or upload a photo file",
                  },
                ],
                ui: {
                  defaultItem: {
                    url: "",
                    file: null,
                  },
                },
              },
              { type: "string", label: "Topic", name: "topic" },
              { type: "string", label: "LinkedIn", name: "linkedin" },
            ],
          },
        ],
      },
      {
        label: "Committee",
        name: "committee",
        path: "src/data",
        format: "json",
        match: { include: "committee" },
        fields: [
          {
            type: "object",
            list: true,
            name: "root",
            label: "Committees",
            ui: {
              itemProps: (item: any) => ({
                label: item?.label || "New Committee",
              }),
            },
            fields: [
              { type: "string", label: "ID", name: "id", required: true },
              { type: "string", label: "Label", name: "label", required: true },
              {
                type: "object",
                list: true,
                name: "members",
                label: "Members",
                ui: {
                  itemProps: (item: any) => ({
                    label: item?.name || "New Member",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    label: "Name",
                    name: "name",
                    required: true,
                  },
                  {
                    type: "string",
                    label: "Role",
                    name: "role",
                    required: false,
                  },
                  {
                    type: "string",
                    label: "Affiliation",
                    name: "affiliation",
                    required: false,
                  },
                  {
                    type: "object",
                    label: "Photo",
                    name: "photo",
                    fields: [
                      {
                        type: "string",
                        label: "Photo URL (link)",
                        name: "url",
                        description: "Enter a URL to an external photo",
                      },
                      {
                        type: "image",
                        label: "Upload Photo",
                        name: "file",
                        description: "Or upload a photo file",
                      },
                    ],
                    ui: {
                      defaultItem: {
                        url: "",
                        file: null,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
