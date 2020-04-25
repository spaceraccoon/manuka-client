import React from "react";
import axios from "axios";
import { Box, Grid, Paper, Snackbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Chart,
  Legend,
  PieSeries,
  Title,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";

import Alert from "./Alert";
import Campaign from "../interfaces/Campaign";
import Hit from "../interfaces/Hit";
import HitType from "../enums/HitType";
import Source from "../interfaces/Source";
import Honeypot from "../interfaces/Honeypot";

interface HitsByType {
  type: string;
  count: number;
}

interface HitsByIP {
  ipAddress: string;
  count: number;
}

interface HitsBySource {
  sourceName: string;
  count: number;
}

interface HoneypotsByCampaign {
  campaignName: string;
  count: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(2),
    },
  })
);

const getHitsByType = (hits: Array<Hit>) => {
  let hitsByType = Array<HitsByType>();
  for (let hitType in HitType) {
    if (isNaN(Number(hitType)))
      hitsByType.push({
        type: hitType,
        count: 0,
      });
  }
  hits.forEach((hit) => {
    hitsByType[hit.type - 1].count++;
  });
  return hitsByType;
};

const getTopFiveIPs = (hits: Array<Hit>) => {
  let hitsByIP = Array<HitsByIP>();
  hitsByIP = hits.reduce((accumulator: Array<HitsByIP>, hit: Hit) => {
    if (hit.ipAddress) {
      let index = accumulator.findIndex((value: HitsByIP) => {
        return value.ipAddress === hit.ipAddress;
      });
      if (index === -1) {
        index =
          accumulator.push({
            ipAddress: hit.ipAddress,
            count: 0,
          }) - 1;
      }
      accumulator[index].count++;
    }
    return accumulator;
  }, hitsByIP);
  return hitsByIP.sort((a, b) => b.count - a.count).slice(0, 5);
};

const getTopFiveSources = (hits: Array<Hit>, sources: Array<Source>) => {
  let hitsBySource = Array<HitsBySource>();
  hitsBySource = hits.reduce((accumulator: Array<HitsBySource>, hit: Hit) => {
    let source = sources.find((source) => source.id === hit.sourceId);
    if (source !== undefined) {
      let index = accumulator.findIndex((value: HitsBySource) => {
        if (source !== undefined) {
          return value.sourceName === source.name;
        }
        return false;
      });
      if (index === -1) {
        index =
          accumulator.push({
            sourceName: source.name,
            count: 0,
          }) - 1;
      }
      accumulator[index].count++;
    }
    return accumulator;
  }, hitsBySource);
  return hitsBySource.sort((a, b) => b.count - a.count).slice(0, 5);
};

const getTopFiveCampaigns = (
  honeypots: Array<Honeypot>,
  campaigns: Array<Campaign>
) => {
  let honeypotsByCampaign = Array<HoneypotsByCampaign>();
  honeypotsByCampaign = honeypots.reduce(
    (accumulator: Array<HoneypotsByCampaign>, honeypot: Honeypot) => {
      let campaign = campaigns.find(
        (campaign) => campaign.id === honeypot.campaignId
      );
      if (campaign !== undefined) {
        let index = accumulator.findIndex((value: HoneypotsByCampaign) => {
          if (campaign !== undefined) {
            return value.campaignName === campaign.name;
          }
          return false;
        });
        if (index === -1) {
          index =
            accumulator.push({
              campaignName: campaign.name,
              count: 0,
            }) - 1;
        }
        accumulator[index].count++;
      }
      return accumulator;
    },
    honeypotsByCampaign
  );
  return honeypotsByCampaign.sort((a, b) => b.count - a.count).slice(0, 5);
};

function Dashboard() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hits, setHits] = React.useState(Array<Hit>());
  const [sources, setSources] = React.useState(Array<Source>());
  const [campaigns, setCampaigns] = React.useState(Array<Campaign>());
  const [honeypots, setHoneypots] = React.useState(Array<Honeypot>());

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  React.useEffect(() => {
    axios
      .get(`/api/v1/source`)
      .then(function (response) {
        setSources(response.data);
        return axios.get(`/api/v1/honeypot`);
      })
      .then(function (response) {
        setHoneypots(response.data);
        return axios.get(`/api/v1/campaign`);
      })
      .then(function (response) {
        setCampaigns(response.data);
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
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Chart data={getHitsByType(hits)}>
              <PieSeries valueField="count" argumentField="type" />
              <Animation />
              <Title text="Hits by Type" />
              <Legend />
            </Chart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Chart data={getTopFiveIPs(hits)}>
              <ArgumentAxis />
              <ValueAxis />
              <Title text="Top 5 Login Hits by IP" />
              <BarSeries valueField="count" argumentField="ipAddress" />
              <Animation />
            </Chart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Chart data={getTopFiveSources(hits, sources)}>
              <ArgumentAxis />
              <ValueAxis />
              <Title text="Top 5 Sources" />
              <BarSeries valueField="count" argumentField="sourceName" />
              <Animation />
            </Chart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Chart data={getTopFiveCampaigns(honeypots, campaigns)}>
              <PieSeries
                valueField="count"
                argumentField="campaignName"
                innerRadius={0.6}
              />
              <Title text="Honeypots by Campaign" />
              <Legend />
              <Animation />
            </Chart>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
