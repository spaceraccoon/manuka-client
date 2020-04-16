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
  FormControl,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Redirect, useLocation, useParams } from "react-router-dom";

import Alert from "./Alert";
import Source from "../interfaces/Source";
import SourceType from "../enums/SourceType";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(1),
    },
    titleButtons: {
      marginLeft: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    formControl: {
      marginTop: theme.spacing(2),
    },
  })
);

function SourceForm() {
  const classes = useStyles();
  const { id } = useParams();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(
    ["create", "edit"].indexOf(location.pathname.split("/").slice(-1)[0]) > -1
  );
  const [redirect, setRedirect] = React.useState("");
  const [source, setSource] = React.useState<Source>({
    id: Number(id),
    name: "",
    type: SourceType.Facebook,
    email: "",
    apiKey: "",
  });

  React.useEffect(() => {
    source.id &&
      axios
        .get(`/api/v1/source/${source.id}`)
        .then(function (response) {
          setSource(response.data);
        })
        .catch(function (error) {
          setErrorMessage(error.response.data.error);
        });
  }, [source.id]);

  const handleChange = (prop: keyof Source) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (prop === "type") {
      if (Number(event.target.value) === SourceType.Pastebin) {
        setSource({
          ...source,
          [prop]: Number(event.target.value),
          email: "",
        });
      } else if (
        Number(event.target.value) === SourceType.Facebook ||
        Number(event.target.value) === SourceType.LinkedIn
      ) {
        setSource({
          ...source,
          [prop]: Number(event.target.value),
          apiKey: "",
        });
      }
    } else {
      setSource({
        ...source,
        [prop]: event.target.value,
      });
    }
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = () => {
    axios
      .delete(`/api/v1/source/${source.id}`)
      .then(function (response) {
        setRedirect("/source");
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
      });
  };

  const handleSave = () => {
    if (source.id) {
      axios
        .put(`/api/v1/source/${source.id}`, source)
        .then(function (response) {
          setSource(response.data);
          setIsEdit(false);
          setRedirect(`/source/${response.data.id}`);
        })
        .catch(function (error) {
          setErrorMessage(error.response.data.error);
        });
    } else {
      axios
        .post("/api/v1/source", source)
        .then(function (response) {
          setSource(response.data);
          setIsEdit(false);
          setRedirect(`/source/${response.data.id}`);
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
          {source.id ? (isEdit ? "Edit" : "View") : "Create"} Source
          {!isNaN(source.id) && ` ${source.id}`}
        </Typography>
        <span className={classes.titleButtons}>
          {!isEdit ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setRedirect(`/source/${source.id}/edit`);
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
                <DialogTitle>Delete {source.name}?</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    The source will be deleted from the database.
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
          <FormControl fullWidth>
            <TextField
              label="Name"
              value={source.name}
              onChange={handleChange("name")}
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
              label="Type"
              value={source.type}
              onChange={handleChange("type")}
            >
              {Object.keys(SourceType)
                .filter((x) => isNaN(Number(x)) === false)
                .map((key: string) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {SourceType[Number(key)]}
                    </MenuItem>
                  );
                })}
            </TextField>
          </FormControl>
          {source.type === SourceType.Pastebin && (
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                label="API Key"
                value={source.apiKey}
                onChange={handleChange("apiKey")}
                InputProps={{
                  readOnly: !isEdit,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          )}
          {(source.type === SourceType.Facebook ||
            source.type === SourceType.LinkedIn) && (
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                label="Email"
                value={source.email}
                onChange={handleChange("email")}
                InputProps={{
                  readOnly: !isEdit,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default SourceForm;
