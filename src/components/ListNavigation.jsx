import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Button,
} from "@mui/material";

/**
 *
 * @param {object[]} listArray - Array of objects containing title, lastModifiedTime, and setSelectedItem handler
 * @param {string} emptyMessage - Message to display when the list is empty
 * @param {function} setSelectedItem - Function to set the selected item
 * @returns
 */
function ListNavigation({ listArray, emptyMessage, setSelectedItem }) {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          height: "100vh",
          overflow: "auto",
          bgcolor: "background.default",
          width: "350px",
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          variant="contained"
          sx={{ m: 2 }}
          onClick={() => {
            console.log("THis clla");
            setSelectedItem(null);
          }}
        >
          New chat
        </Button>
        <Divider />

        {listArray.length ? (
          <List sx={{ width: "100%", flex: 1 }}>
            {listArray.map((item) => (
              <>
                <ListItem
                  key={item.id}
                  button
                  onClick={() => {
                    setSelectedItem(item.id);
                  }}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                      cursor: "pointer",
                    },
                  }}
                >
                  <ListItemText
                    sx={{
                      pl: 1,
                    }}
                    primary={
                      <Typography variant="subtitle1" noWrap>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.lastModifiedTime)}
                      </Typography>
                    }
                  />
                </ListItem>

                <Divider
                  sx={{ width: "100%", bgcolor: "divider" }}
                  key={"divider-" + item.id}
                />
              </>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Typography variant="subtitle1">{emptyMessage}</Typography>
          </Box>
        )}
      </Paper>
    </>
  );
}

export default ListNavigation;
