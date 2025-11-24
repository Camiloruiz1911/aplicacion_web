import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Solo navegar después de que el componente esté montado
    if (mounted) {
      router.replace("/peliculas");
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return null;
}
