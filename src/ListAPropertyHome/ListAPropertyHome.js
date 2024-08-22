import React from "react";
import ListAPropertyHero from "./ListAPropertyHero/en/ListAPropertyHero";
import Reasonstogetstarted from "./Reasonstogetstarted/en/Reasonstogetstarted";
import OneReview from "./oneReview/en/oneReview";
import HowToBegin from "./HowToBegin/en/HowToBegin";
import GetStarted from "./GetStarted/en/GetStarted";

const ListAPropertyHome = () => {
  return (
    <>
      <ListAPropertyHero />
      <Reasonstogetstarted />
      <OneReview />
      <HowToBegin />
      <GetStarted />
    </>
  );
};

export default ListAPropertyHome;
