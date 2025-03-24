import { Button, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

/**
 * A button component that shows either a send icon or loading spinner
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.disabled - Whether the button is disabled
 * @returns {JSX.Element} A button with either a send icon or loading spinner
 */
function SendButton({ isLoading, disabled }) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disabled || isLoading}
      sx={{
        height: "50px",
        minWidth: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <SendIcon />
      )}
    </Button>
  );
}

export default SendButton;
