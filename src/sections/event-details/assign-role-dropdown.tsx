import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";

interface Props {
  onRoleSelect: (val: string) => void;
}

export default function AssignRoleDropdown({ onRoleSelect }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (val: string) => {
    onRoleSelect(val);
    handleClose();
  };

  return (
    <div>
      <Button
        startIcon={<FiUserPlus size={16} />}
        sx={{ textTransform: "capitalize" }}
        onClick={handleClick}
      >
        Assign Roles
      </Button>
      <Menu
        sx={{ width: "100%" }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleSelect("Add Judge")}>Judge</MenuItem>
        <MenuItem onClick={() => handleSelect("Add Dj")}>Dj</MenuItem>
        <MenuItem onClick={() => handleSelect("Add Mc")}>Mc</MenuItem>
      </Menu>
    </div>
  );
}
