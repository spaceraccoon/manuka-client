import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Redirect, useParams } from "react-router-dom";

import Alert from "./Alert";
import Hit from "../interfaces/Hit";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(3),
    },
    titleButtons: {
      marginLeft: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    formControl: {
      marginTop: theme.spacing(2),
    },
  })
);

function HitForm() {
  const classes = useStyles();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [redirect, setRedirect] = React.useState("");
  const [hit, setHit] = React.useState<Hit>({
    id: Number(id),
    createdAt: "",
    ipAddress: "",
  });

  React.useEffect(() => {
    hit.id &&
      axios
        .get(`/api/v1/hit/${hit.id}`)
        .then(function (response) {
          setHit(response.data);
        })
        .catch(function (error) {
          setErrorMessage(
            error.response.data.error || error.response.statusText
          );
        });
  }, [hit.id]);

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = () => {
    axios
      .delete(`/api/v1/hit/${hit.id}`)
      .then(function (response) {
        setRedirect("/hit");
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error || error.response.statusText);
      });
  };

  return (
    <div>
      {redirect && <Redirect to={redirect} />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleCloseErrorMessage}
        open={!errorMessage || errorMessage.length === 0 ? false : true}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" display="inline">
          View Hit {hit.id}
        </Typography>
        <span className={classes.titleButtons}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleToggleDialog}
          >
            Delete
          </Button>
          <Dialog open={isDialogOpen} onClose={handleToggleDialog}>
            <DialogTitle>Delete hit?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The hit will be deleted from the database.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleToggleDialog} color="primary">
                No
              </Button>
              <Button onClick={handleDelete} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </span>
      </Box>
      <Grid item xs={12} lg={6}>
        <Paper className={classes.paper}>
          <FormControl fullWidth>
            <TextField
              label="Created At"
              value={hit.createdAt}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl} fullWidth>
            <TextField
              label="IP Address"
              value={hit.ipAddress}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </Paper>
      </Grid>
    </div>
  );
}

export default HitForm;
