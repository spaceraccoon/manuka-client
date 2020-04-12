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
import Source from "../interfaces/Source";
import SourceType from "../enums/SourceType";

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

function SourcesView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedSource, setSelectedSource] = React.useState<Source>({
    id: 0,
    name: "",
    type: SourceType.Pastebin,
    apiKey: "",
  });
  const [redirect, setRedirect] = React.useState("");
  const [sources, setSources] = React.useState(Array<Source>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleRowClick = (
    event: any | undefined,
    rowData: Source | undefined
  ) => {
    if (rowData) {
      setRedirect(`/source/${rowData.id}`);
    }
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/source/${id}`)
      .then(function (response) {
        setSources(sources.filter((source) => source.id !== id));
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
      .get(`/api/v1/source`)
      .then(function (response) {
        setSources(response.data);
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
          All Sources
        </Typography>
        <Button
          className={classes.titleButton}
          variant="contained"
          color="primary"
          component={Link}
          to="/source/create"
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
              {
                title: "Type",
                field: "type",
                lookup: SourceType,
              },
              { title: "API Key", field: "apiKey" },
            ]}
            actions={[
              {
                icon: "edit",
                tooltip: "Edit Source",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setRedirect(`/source/${rowData.id}`);
                  }
                },
              },
              {
                icon: "delete",
                tooltip: "Delete Source",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setSelectedSource(rowData);
                    handleToggleDialog();
                  }
                },
              },
            ]}
            data={sources}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            options={{
              actionsColumnIndex: -1,
            }}
          />
          <Dialog open={isDialogOpen} onClose={handleToggleDialog}>
            <DialogTitle>Delete {selectedSource.name}?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The source will be deleted from the database.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleToggleDialog} color="primary">
                No
              </Button>
              <Button
                onClick={() => {
                  handleDelete(selectedSource.id);
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

export default SourcesView;
