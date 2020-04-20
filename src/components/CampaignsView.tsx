import React from "react";
import axios from "axios";
import { Box, Button, Snackbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import PauseIcon from "@material-ui/icons/Pause";
import PlayIcon from "@material-ui/icons/PlayArrow";
import { Link, Redirect } from "react-router-dom";

import Alert from "./Alert";
import DataTable from "./DataTable";
import DataTableRowButtons from "./DataTableRowButtons";
import Campaign from "../interfaces/Campaign";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleButtons: {
      marginLeft: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    progressText: {
      marginLeft: theme.spacing(1),
    },
  })
);

function CampaignsView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState("");
  const [campaigns, setCampaigns] = React.useState(Array<Campaign>());
  const [isReloading, setIsReloading] = React.useState(true);

  const reloadInterval = React.useRef(0);

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

  const handleToggleReload = () => {
    if (reloadInterval.current !== 0) {
      window.clearInterval(reloadInterval.current);
      reloadInterval.current = 0;
      setIsReloading(false);
    } else {
      reloadInterval.current = window.setInterval(fetchCampaigns, 3000);
      setIsReloading(true);
    }
  };

  const fetchCampaigns = () => {
    axios
      .get(`/api/v1/campaign`)
      .then(function (response) {
        setCampaigns(response.data);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error || error.response.statusText);
      });
  };

  React.useEffect(() => {
    fetchCampaigns();
    if (reloadInterval.current !== 0) {
      window.clearInterval(reloadInterval.current);
    }
    reloadInterval.current = window.setInterval(fetchCampaigns, 3000);
    return () => window.clearInterval(reloadInterval.current);
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
        <span className={classes.titleButtons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/campaign/create"
          >
            Create
          </Button>
          <Button
            variant="contained"
            onClick={handleToggleReload}
            startIcon={isReloading ? <PauseIcon /> : <PlayIcon />}
          >
            {isReloading ? "Pause" : "Start"} Reload
          </Button>
        </span>
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
