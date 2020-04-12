import React from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import CampaignsTable from "./CampaignsTable";

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
  })
);

function CampaignsView() {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.title} display="flex" alignItems="center">
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
          <CampaignsTable />
        </Grid>
      </Grid>
    </div>
  );
}

export default CampaignsView;
