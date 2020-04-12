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
  Grid,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { Link, Redirect } from "react-router-dom";

import Alert from "./Alert";
import Listener from "../interfaces/Listener";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(1),
    },
    titleButton: {
      marginLeft: theme.spacing(2),
    },
    tableButtons: {
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    tableButtonRight: {
      marginLeft: theme.spacing(1),
    },
  })
);

function ListenersView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedListener, setSelectedListener] = React.useState<Listener>({
    id: 0,
    name: "",
    updatedAt: "",
  });
  const [redirect, setRedirect] = React.useState("");
  const [listeners, setListeners] = React.useState(Array<Listener>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleRowClick = (
    event: any | undefined,
    rowData: Listener | undefined
  ) => {
    if (rowData) {
      setRedirect(`/listener/${rowData.id}`);
    }
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/listener/${id}`)
      .then(function (response) {
        setListeners(listeners.filter((listener) => listener.id !== id));
        handleToggleDialog();
      })
      .catch(function (error) {
        setErrorMessage(error.response.statusText);
        handleToggleDialog();
      });
  };

  React.useEffect(() => {
    setIsLoading(true);

    axios
      .get(`/api/v1/listener`)
      .then(function (response) {
        setListeners(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        setErrorMessage(error.response.statusText);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {redirect && <Redirect to={redirect} />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleCloseErrorMessage}
        open={errorMessage.length === 0 ? false : true}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>

      <Box display="flex" alignItems="center">
        <Typography variant="h4" display="inline">
          All Listeners
        </Typography>
        <Button
          className={classes.titleButton}
          variant="contained"
          color="primary"
          component={Link}
          to="/listener/create"
        >
          Create
        </Button>
      </Box>
      <Grid className={classes.grid} container spacing={3}>
        <Grid item xs={12}>
          <MaterialTable
            columns={[
              {
                title: "ID",
                field: "id",
                defaultSort: "desc",
              },
              { title: "Name", field: "name" },
              { title: "Updated At", field: "updatedAt" },
            ]}
            actions={[
              {
                icon: "edit",
                tooltip: "Edit Listener",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setRedirect(`/listener/${rowData.id}`);
                  }
                },
              },
              {
                icon: "delete",
                tooltip: "Delete Listener",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setSelectedListener(rowData);
                    handleToggleDialog();
                  }
                },
              },
            ]}
            data={listeners}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            options={{
              actionsColumnIndex: -1,
            }}
          />
          <Dialog open={isDialogOpen} onClose={handleToggleDialog}>
            <DialogTitle>Delete {selectedListener.name}?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The listener will be deleted from the database.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleToggleDialog} color="primary">
                No
              </Button>
              <Button
                onClick={() => {
                  handleDelete(selectedListener.id);
                }}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}

export default ListenersView;
