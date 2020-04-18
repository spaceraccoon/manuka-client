import React from "react";
import axios from "axios";
import { Box, Button, Snackbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link, Redirect } from "react-router-dom";

import Alert from "./Alert";
import DataTable from "./DataTable";
import DataTableRowButtons from "./DataTableRowButtons";
import Source from "../interfaces/Source";
import SourceType from "../enums/SourceType";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleButton: {
      marginLeft: theme.spacing(2),
    },
  })
);

function SourcesView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const [sources, setSources] = React.useState(Array<Source>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/source/${id}`)
      .then(function (response) {
        setSources(sources.filter((source) => source.id !== id));
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error || error.response.statusText);
      });
  };

  React.useEffect(() => {
    axios
      .get(`/api/v1/source`)
      .then(function (response) {
        setSources(response.data);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error || error.response.statusText);
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
      <DataTable
        columns={[
          {
            title: "ID",
            name: "id",
          },
          { title: "Name", name: "name" },
          {
            title: "Type",
            name: "type",
            getCellValue: (row) => SourceType[row.type],
          },
          { title: "API Key", name: "apiKey" },
          { title: "Email", name: "email" },
          {
            title: "Pastes",
            name: "pastes",
            getCellValue: (row) => row.pastebinUrls && row.pastebinUrls.length,
          },
          {
            title: "Actions",
            name: "actions",
            getCellValue: (row) => (
              <DataTableRowButtons
                dataType="source"
                handleEdit={setRedirect}
                handleDelete={handleDelete}
                isDeleteOnly={false}
                key={row.id}
                rowId={row.id}
              />
            ),
          },
        ]}
        dataType="source"
        rows={sources}
        handleRowClick={setRedirect}
      />
    </div>
  );
}

export default SourcesView;
