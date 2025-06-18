import React from "react";
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';


interface MyMUIButtonProps {
  to?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset'; 
  sx?: SxProps<Theme>;

}

//my version of MUI button 

export const MyMUIButton = ({ to, children, sx , type = 'button' }: MyMUIButtonProps) => {
 
if (to) {
  return (
    <Button
      component={Link}
      to={to}
      variant="contained"
      sx={sx}
    >
      {children}
    </Button>
  );
}

  return (
    <Button
      type={type}
      variant="contained"
      sx={sx}
    >
      {children}
    </Button>
  );
};