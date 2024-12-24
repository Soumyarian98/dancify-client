import useBattleCart from "@/hooks/use-battle-cart";
import { Badge, CircularProgress, IconButton } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BattleCartIcon = () => {
  const navigate = useNavigate();
  const query = useBattleCart();
  return (
    <Badge badgeContent={query.data ? query.data.length : 0} color="secondary">
      <IconButton
        onClick={() => navigate("/battle-cart")}
        disabled={query.isLoading}
      >
        {query.isLoading && <CircularProgress size={20} />}
        {query.data && <FiShoppingCart />}
      </IconButton>
    </Badge>
  );
};

export default BattleCartIcon;
