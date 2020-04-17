import React from "react";
import axios from "axios";
import { Box, Snackbar, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";

import Alert from "./Alert";
import DataTable from "./DataTable";
import Hit from "../interfaces/Hit";

function HitsView() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const [hits, setHits] = React.useState(Array<Hit>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  React.useEffect(() => {
    axios
      .get(`/api/v1/hit`)
      .then(function (response) {
        setHits(response.data);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
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
          All Hits
        </Typography>
      </Box>
      <DataTable
        columns={[
          {
            title: "ID",
            name: "id",
          },
          { title: "Created At", name: "createdAt" },
          { title: "IP Address", name: "ipAddress" },
        ]}
        dataType="hit"
        rows={hits}
        handleRowClick={setRedirect}
      />
    </div>
  );
}

export default HitsView;
