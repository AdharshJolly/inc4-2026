import { TinaEditProvider } from "tinacms/dist/edit-state";
import { TinaCMS } from "tinacms";

export function TinaWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TinaEditProvider
      editMode={
        import.meta.env.VITE_EDIT_MODE === "true" ? "preview" : undefined
      }
    >
      {children}
    </TinaEditProvider>
  );
}
