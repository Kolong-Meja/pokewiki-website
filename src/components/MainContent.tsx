import { useSearchParams } from "next/navigation";
import BerryContent from "./contents/BerryContent";
import PokemonContent from "./contents/PokemonContent";

export default function MainContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  switch (category) {
    case "pokemon":
      return <PokemonContent />;
    case "berry":
      return <BerryContent />;
    default:
      return <PokemonContent />;
  }
}
