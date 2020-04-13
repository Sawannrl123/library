import React, { useState, useEffect } from "react";
import NetworkTest from "opentok-network-test-js";
const OT = require("@opentok/client");

const PreCallTest = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [testResult, setResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchOpenTokCred = async () => {
      const res = await fetch("http://localhost:4000/getOpentokConfig");
      const config = await res.json();
      setConfig(config);
    };
    fetchOpenTokCred();
  }, []);

  useEffect(() => {
    let otNetworkTest;
    if (config) {
      otNetworkTest = new NetworkTest(OT, config);
      otNetworkTest
        .testConnectivity()
        .then((results) => {
          console.log("OpenTok connectivity test results", results);
          otNetworkTest
            .testQuality(function updateCallback(stats) {
              console.log("intermediate testQuality stats", stats);
            })
            .then((results) => {
              // This function is called when the quality test is completed.
              console.log("OpenTok quality results", results);
              let publisherSettings = {};
              if (results.video.reason) {
                console.log("Video not supported:", results.video.reason);
                publisherSettings.videoSource = null; // audio-only
              } else {
                publisherSettings.frameRate =
                  results.video.recommendedFrameRate;
                publisherSettings.resolution =
                  results.video.recommendedResolution;
              }
              if (!results.audio.supported) {
                console.log("Audio not supported:", results.audio.reason);
                publisherSettings.audioSource = null;
                // video-only, but you probably don't want this -- notify the user?
              }
              if (
                !publisherSettings.videoSource &&
                !publisherSettings.audioSource
              ) {
                // Do not publish. Notify the user.
              } else {
                // Publish to the "real" session, using the publisherSettings object.
              }
              setResult(results);
              setLoading(false);
            })
            .catch((error) => {
              console.error("OpenTok quality test error", error);
              setLoading(false);
              setError(true);
            });
        })
        .catch(function (error) {
          console.error("OpenTok connectivity test error", error);
          setLoading(false);
          setError(true);
        });
    }
    if (otNetworkTest) {
      return () => {
        otNetworkTest.stop();
      };
    }
  }, [config]);

  const buildError = () => {
    if (!error) return null;
    return <p>Something went wrong!!! See console log for more details</p>;
  };

  const runTest = () => {
    if (loading) return <p>Test Running!!! Please Wait...</p>;
    else {
      if (error) return buildError();
      return (
        <div>
          {testResult && testResult.video ? (
            <p>Video Supported</p>
          ) : (
            <p>Video Not Supported</p>
          )}
          {testResult && testResult.audio ? (
            <p>Audio Supported</p>
          ) : (
            <p>Audio Not Supported</p>
          )}
        </div>
      );
    }
  };

  return runTest();
};

export default PreCallTest;
