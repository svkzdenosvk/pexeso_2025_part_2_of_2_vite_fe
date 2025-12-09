import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { Button, ButtonGroup, Box, Typography } from "@mui/material";
import { set_backend } from "@pexeso/lib/redux/store/reducers/backendSlice";
import type { My_Type_BE } from "@pexeso/_inc/my_types";

/**
 * BackendButtons Component
 *
 * Component that displays two backend-select buttons ("express", "nest").
 * On click it updates the active backend stored in Redux Toolkit.
 *
 * Highlights:
 * - Reads current backend from Redux.
 * - Dispatches set_backend() on button click.
 * - Highlights currently active backend.
 *
 * @component
 */

// ---------- Component

const BackendButtons = () => {
  const dispatch = useDispatch();

  // Currently active backend from Redux
  const currentBackend = useSelector(
    (state: RootState) => state.backend.active
  );

  const BACKEND: My_Type_BE[] = ["express", "nest"]; // backend servers

  return (
    <Box
      sx={{
        // mr: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",

        "@media (max-width: 550px)": {
          flexDirection: "column",
        },
      }}
    >
      <Typography variant="h6">Backend: </Typography>
      {/* Backend selection buttons */}
      <ButtonGroup
        variant="outlined"
        color="primary"
        sx={{
          boxShadow: 3, // medium shadow elevation
          borderRadius: "12px",
          overflow: "hidden", // ensures child buttons respect border radius
        }}
      >
        {BACKEND.map((be) => (
          <Button
            key={be}
            onClick={() => dispatch(set_backend(be))}
            // Highlight current language with filled variant
            variant={currentBackend === be ? "contained" : "outlined"}
            sx={{
              textTransform: "uppercase", // EN/SK/DE instead of En/Sk/De
              fontWeight: "bold",
              px: 2,
              py: 1,
              fontSize: "0.85rem", // slightly smaller text
              minWidth: 50,
            }}
            color="secondary"
          >
            {be}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default BackendButtons;
