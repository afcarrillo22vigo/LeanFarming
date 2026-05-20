import { API } from "../config/api";
import { animales as mockAnimales } from "../mock/mock";

export async function getAnimales() {
  if (!API.leanfarming) return mockAnimales;
  const res = await fetch(`${API.zootecnico}/animales`);
  return res.json();
}
