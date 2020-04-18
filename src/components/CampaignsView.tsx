import React from "react";
import axios from "axios";
import { Box, Button, Snackbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link, Redirect } from "react-router-dom";

import Alert from "./Alert";
import DataTable from "./DataTable";
import DataTableRowButtons from "./DataTableRowButtons";
import Campaign from "../interfaces/Campaign";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleButton: {
      marginLeft: theme.spacing(2),
    },
  })
);

function CampaignsView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const [campaigns, setCampaigns] = React.useState(Array<Campaign>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/campaign/${id}`)
      .then(function (response) {
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error || error.response.statusText);
      });
  };

  React.useEffect(() => {
    axios
      .get(`/api/v1/campaign`)
      .then(function (response) {
        setCampaigns(response.data);
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
          All Campaigns
        </Typography>
        <Button
          className={classes.titleButton}
          variant="contained"
          color="primary"
          component={Link}
          to="/campaign/create"
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
            title: "Honeypots",
            name: "honeypots",
            getCellValue: (row) => row.honeypots.length,
          },
          {
            title: "Hits",
            name: "hits",
            getCellValue: (row) => row.hits.length,
          },
          {
            title: "Actions",
            name: "actions",
            getCellValue: (row) => (
              <DataTableRowButtons
                dataType="campaign"
                handleEdit={setRedirect}
                handleDelete={handleDelete}
                isDeleteOnly={false}
                key={row.id}
                rowId={row.id}
              />
            ),
          },
        ]}
        dataType="campaign"
        rows={campaigns}
        handleRowClick={setRedirect}
      />
    </div>
  );
}

export default CampaignsView;
