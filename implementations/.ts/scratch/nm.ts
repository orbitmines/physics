import { GEOMETRIES } from "../src/lib/Local.ts";
for (const k of ["fcc-12","icosahedral-12","cubic-26"]) {
  const g: any = (GEOMETRIES as any)[k];
  console.log(k, "-> .name =", JSON.stringify(g?.name));
}
