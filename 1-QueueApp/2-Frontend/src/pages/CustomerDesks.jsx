import { useState, useEffect } from "react";
import desksService from "../services/desksService";
import Card from "../components/Card";
import deskImage from "../assets/desk.jpg";

const CustomerDesks = () => {
  const [desks, setDesks] = useState([]);

  useEffect(() => {
    desksService
      .getAll()
      .then(initialDesks => {
        setDesks(initialDesks);
      })
      .catch(error => {
        console.error("Error fetching desks:", error);
      });
  }, []);

  return (
    <div id="desk">
      <div className="showcase">
        <div className="content">
          <div className="box">
            <header className="section-header">
              <h2>All Desks</h2>
            </header>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row cards-row">
          {desks.length === 0 ? (
            <p>No desks available</p>
          ) : (
            desks.map((desk) => (
              <Card
                key={desk.desk_id}
                cardType="CustomerDesk"
                desk={desk}
                image={deskImage}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDesks;
