import React from "react";
import axios from "axios";
import { Box, Button, Snackbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link, Redirect } from "react-router-dom";

import Alert from "./Alert";
import DataTable from "./DataTable";
import DataTableRowButtons from "./DataTableRowButtons";
import Listener from "../interfaces/Listener";
import ListenerType from "../enums/ListenerType";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleButton: {
      marginLeft: theme.spacing(2),
    },
  })
);

function ListenersView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const [listeners, setListeners] = React.useState(Array<Listener>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/listener/${id}`)
      .then(function (response) {
        setListeners(listeners.filter((listener) => listener.id !== id));
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error || error.response.statusText);
      });
  };

  React.useEffect(() => {
    axios
      .get(`/api/v1/listener`)
      .then(function (response) {
        setListeners(response.data);
      })
      .catch(function (error) {
        setErrorMessage(error.response.statusText);
      });
  }, []);

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
      <DataTable
        columns={[
          {
            title: "ID",
            name: "id",
          },
          { title: "Name", name: "name" },
          { title: "Updated At", name: "updatedAt" },
          {
            title: "Type",
            name: "type",
            getCellValue: (row) => ListenerType[row.type],
          },
          { title: "URL", name: "url" },
          { title: "Email", name: "email" },
          {
            title: "Actions",
            name: "actions",
            getCellValue: (row) => (
              <DataTableRowButtons
                dataType="listener"
                handleEdit={setRedirect}
                handleDelete={handleDelete}
                isDeleteOnly={false}
                key={row.id}
                rowId={row.id}
              />
            ),
          },
        ]}
        dataType="listener"
        rows={listeners}
        handleRowClick={setRedirect}
      />
    </div>
  );
}

export default ListenersView;
