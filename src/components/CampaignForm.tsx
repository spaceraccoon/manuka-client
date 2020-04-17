import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
  FormGroup,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Redirect, useLocation, useParams } from "react-router-dom";

import Alert from "./Alert";
import Campaign from "../interfaces/Campaign";
import Honeypot from "../interfaces/Honeypot";
import Listener from "../interfaces/Listener";
import Source from "../interfaces/Source";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    titleButtons: {
      marginLeft: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    formControl: {
      marginTop: theme.spacing(2),
    },
  })
);

function CampaignForm() {
  const classes = useStyles();
  const { id } = useParams();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(
    ["create", "edit"].indexOf(location.pathname.split("/").slice(-1)[0]) > -1
  );
  const [redirect, setRedirect] = React.useState("");
  const [campaign, setCampaign] = React.useState<Campaign>({
    id: Number(id),
    name: "",
    honeypots: Array<Honeypot>(),
    updatedAt: isEdit ? undefined : "",
  });
  const [listeners, setListeners] = React.useState(Array<Listener>());
  const [sources, setSources] = React.useState(Array<Source>());

  React.useEffect(() => {
    axios
      .get("/api/v1/source")
      .then(function (response) {
        setSources(response.data);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
      });
    axios
      .get("/api/v1/listener")
      .then(function (response) {
        setListeners(response.data);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
      });
    campaign.id &&
      axios
        .get(`/api/v1/campaign/${campaign.id}`)
        .then(function (response) {
          setCampaign(response.data);
        })
        .catch(function (error) {
          setErrorMessage(error.response.data.error);
        });
  }, [campaign.id]);

  const handleAddHoneypot = () => {
    setCampaign({
      ...campaign,
      honeypots: [
        ...campaign.honeypots,
        {
          name: "",
          listenerId: listeners[0].id,
          sourceId: sources[0].id,
        },
      ],
    });
  };

  const handleRemoveHoneypot = (index: number) => {
    let newHoneypots = [...campaign.honeypots];
    newHoneypots.splice(index, 1);
    setCampaign({
      ...campaign,
      honeypots: newHoneypots,
    });
  };

  const handleChange = (prop: keyof Campaign) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCampaign({
      ...campaign,
      [prop]: event.target.value,
    });
  };

  const handleHoneypotChange = (index: number, prop: keyof Honeypot) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newHoneypots = campaign.honeypots;
    newHoneypots[index] = {
      ...newHoneypots[index],
      [prop]: event.target.value,
    };
    setCampaign({
      ...campaign,
      honeypots: newHoneypots,
    });
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = () => {
    axios
      .delete(`/api/v1/campaign/${campaign.id}`)
      .then(function (response) {
        setRedirect("/campaign");
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
      });
  };

  const handleSave = () => {
    if (campaign.id) {
      axios
        .put(`/api/v1/campaign/${campaign.id}`, campaign)
        .then(function (response) {
          setCampaign(response.data);
          setIsEdit(false);
          setRedirect(`/campaign/${response.data.id}`);
        })
        .catch(function (error) {
          setErrorMessage(error.response.data.error);
        });
    } else {
      axios
        .post("/api/v1/campaign", campaign)
        .then(function (response) {
          setCampaign(response.data);
          setIsEdit(false);
          setRedirect(`/campaign/${response.data.id}`);
        })
        .catch(function (error) {
          setErrorMessage(error.response.data.error);
        });
    }
  };

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
          {campaign.id ? (isEdit ? "Edit" : "View") : "Create"} Campaign
          {!isNaN(campaign.id) && ` ${campaign.id}`}
        </Typography>
        <span className={classes.titleButtons}>
          {!isEdit ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setRedirect(`/campaign/${campaign.id}/edit`);
                  setIsEdit(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleToggleDialog}
              >
                Delete
              </Button>
              <Dialog open={isDialogOpen} onClose={handleToggleDialog}>
                <DialogTitle>Delete {campaign.name}?</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    The campaign will be deleted from the database.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleToggleDialog} color="primary">
                    No
                  </Button>
                  <Button onClick={handleDelete} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </span>
      </Box>
      <Grid className={classes.grid} container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.formControl} fullWidth>
            <TextField
              label="Name"
              value={campaign.name}
              onChange={handleChange("name")}
              InputProps={{
                readOnly: !isEdit,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          {!isEdit && (
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                label="Updated At"
                value={campaign.updatedAt}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          )}
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.formControl}
          >
            Honeypots
          </Typography>
          {campaign.honeypots &&
            campaign.honeypots.map((honeypot, index) => (
              <Card className={classes.grid} key={index}>
                <CardContent>
                  <FormGroup>
                    <FormControl fullWidth>
                      <TextField
                        label="Name"
                        value={honeypot.name}
                        onChange={handleHoneypotChange(index, "name")}
                        InputProps={{
                          readOnly: !isEdit,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                      <TextField
                        InputProps={{
                          readOnly: !isEdit,
                        }}
                        select
                        label="Listener"
                        value={honeypot.listenerId}
                        onChange={handleHoneypotChange(index, "listenerId")}
                      >
                        {listeners.map((listener: Listener) => {
                          return (
                            <MenuItem key={listener.id} value={listener.id}>
                              {listener.name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                      <TextField
                        InputProps={{
                          readOnly: !isEdit,
                        }}
                        select
                        label="Source"
                        value={honeypot.sourceId}
                        onChange={handleHoneypotChange(index, "sourceId")}
                      >
                        {sources.map((source: Source) => {
                          return (
                            <MenuItem key={source.id} value={source.id}>
                              {source.name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                  </FormGroup>
                </CardContent>
                {isEdit && (
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleRemoveHoneypot(index)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                )}
              </Card>
            ))}
          {isEdit && (
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              className={classes.margin}
              onClick={handleAddHoneypot}
            >
              <AddIcon className={classes.extendedIcon} />
              Add Honeypot
            </Fab>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default CampaignForm;
