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
import Campaign from "../interfaces/Campaign";

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

function CampaignsView() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign>({
    id: 0,
    name: "",
    updatedAt: "",
    honeypots: [],
  });
  const [redirect, setRedirect] = React.useState("");
  const [campaigns, setCampaigns] = React.useState(Array<Campaign>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleRowClick = (
    event: any | undefined,
    rowData: Campaign | undefined
  ) => {
    if (rowData) {
      setRedirect(`/campaign/${rowData.id}`);
    }
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/campaign/${id}`)
      .then(function (response) {
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
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
      .get(`/api/v1/campaign`)
      .then(function (response) {
        setCampaigns(response.data);
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
              { title: "Updated At", field: "updatedAt" },
              { title: "Honeypots", field: "honeypots.length" },
            ]}
            actions={[
              {
                icon: "edit",
                tooltip: "Edit Campaign",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setRedirect(`/campaign/${rowData.id}`);
                  }
                },
              },
              {
                icon: "delete",
                tooltip: "Delete Campaign",
                onClick: (event, rowData) => {
                  if (!Array.isArray(rowData)) {
                    setSelectedCampaign(rowData);
                    handleToggleDialog();
                  }
                },
              },
            ]}
            data={campaigns}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            options={{
              actionsColumnIndex: -1,
            }}
          />
          <Dialog open={isDialogOpen} onClose={handleToggleDialog}>
            <DialogTitle>Delete {selectedCampaign.name}?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The campaign will be deleted from the database.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleToggleDialog} color="primary">
                No
              </Button>
              <Button
                onClick={() => {
                  handleDelete(selectedCampaign.id);
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

export default CampaignsView;
