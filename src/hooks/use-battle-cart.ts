import { useQuery } from "@tanstack/react-query";

import { authAxios } from "@/lib/auth-axios";
import { BattleCartResponse } from "@/types/battle-cart-response";

const useBattleCart = () => {
  const query = useQuery<BattleCartResponse>({
    queryKey: ["battle-cart"],
    queryFn: async () => {
      const response = await authAxios.get("/battle-cart");
      return response.data;
    },
  });
  return query;
};

export default useBattleCart;
