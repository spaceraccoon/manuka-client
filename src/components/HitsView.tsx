import React from "react";
import axios from "axios";
import { Box, Snackbar, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";

import Alert from "./Alert";
import DataTable from "./DataTable";
import DataTableRowButtons from "./DataTableRowButtons";
import Campaign from "../interfaces/Campaign";
import Hit from "../interfaces/Hit";
import Honeypot from "../interfaces/Honeypot";
import HitType from "../enums/HitType";

function HitsView() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const [campaigns, setCampaigns] = React.useState(Array<Campaign>());
  const [hits, setHits] = React.useState(Array<Hit>());
  const [honeypots, setHoneypots] = React.useState(Array<Honeypot>());
  // const [hits, setHits] = React.useState(Array<Hit>());
  // const [hits, setHits] = React.useState(Array<Hit>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/hit/${id}`)
      .then(function (response) {
        setHits(hits.filter((hit) => hit.id !== id));
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
        return axios.get(`/api/v1/honeypot`);
      })
      .then(function (response) {
        setHoneypots(response.data);
        return axios.get(`/api/v1/hit`);
      })
      .then(function (response) {
        setHits(response.data);
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
          {
            title: "Type",
            name: "type",
            getCellValue: (row) => HitType[row.type],
          },
          {
            title: "Campaign",
            name: "campaign",
            getCellValue: (row) => {
              if (
                campaigns.filter((campaign) => campaign.id === row.campaignId)
                  .length !== 0
              ) {
                return campaigns.filter(
                  (campaign) => campaign.id === row.campaignId
                )[0].name;
              }
              return "DELETED";
            },
          },
          {
            title: "Honeypot",
            name: "honeypot",
            getCellValue: (row) => {
              if (
                honeypots.filter((honeypot) => honeypot.id === row.honeypotId)
                  .length !== 0
              ) {
                return honeypots.filter(
                  (honeypot) => honeypot.id === row.honeypotId
                )[0].name;
              }
              return "DELETED";
            },
          },
          { title: "IP Address", name: "ipAddress" },
          {
            title: "Actions",
            name: "actions",
            getCellValue: (row) => (
              <DataTableRowButtons
                dataType="hit"
                handleEdit={setRedirect}
                handleDelete={handleDelete}
                isDeleteOnly={true}
                key={row.id}
                rowId={row.id}
              />
            ),
          },
        ]}
        dataType="hit"
        rows={hits}
        handleRowClick={setRedirect}
      />
    </div>
  );
}

export default HitsView;
