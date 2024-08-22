import React, { useState } from "react";
import "../ListAPropertyHero.css";
import Images from "../../../images";
import GetStartedButton from "../../GetStartedButton/en/GetStartedButton";

const ListAPropertyHero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="text">
          <h1>Want to rent your Properties and get money ?</h1>
          <p>
            UniDorm is a company that makes the process of seeking student
            housing <br />
            more straightforward by facilitating students' discovery of
            acceptable housing <br />
            options.
          </p>
          <GetStartedButton />
        </div>
        <div className="image listImg">
          <img src={Images.ListAPropHero} draggable="false" alt="Photo" />
        </div>
      </div>
    </section>
  );
};

export default ListAPropertyHero;
