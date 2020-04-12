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
import Hit from "../interfaces/Hit";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(1),
    },
    title: {
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

function HitsView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedHit, setSelectedHit] = React.useState<Hit>({
    id: 0,
    createdAt: "",
    ipAddress: "",
  });
  const [redirect, setRedirect] = React.useState("");
  const [hits, setHits] = React.useState(Array<Hit>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleRowClick = (event: any | undefined, rowData: Hit | undefined) => {
    if (rowData) {
      setRedirect(`/hit/${rowData.id}`);
    }
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/hit/${id}`)
      .then(function (response) {
        setHits(hits.filter((hit) => hit.id !== id));
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
      .get(`/api/v1/hit`)
      .then(function (response) {
        setHits(response.data);
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

      <Box className={classes.title} display="flex" alignItems="center">
        <Typography variant="h4" display="inline">
          All Hits
        </Typography>
        <Button
          className={classes.titleButton}
          variant="contained"
          color="primary"
          component={Link}
          to="/hit/create"
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
              { title: "Created At", field: "createdAt" },
              { title: "IP Address", field: "ipAddress" },
            ]}
            actions={[
              {
                icon: "edit",
                tooltip: "Edit Hit",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setRedirect(`/hit/${rowData.id}`);
                  }
                },
              },
              {
                icon: "delete",
                tooltip: "Delete Hit",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setSelectedHit(rowData);
                    handleToggleDialog();
                  }
                },
              },
            ]}
            data={hits}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            options={{
              actionsColumnIndex: -1,
            }}
          />
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
              <Button
                onClick={() => {
                  handleDelete(selectedHit.id);
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

export default HitsView;
