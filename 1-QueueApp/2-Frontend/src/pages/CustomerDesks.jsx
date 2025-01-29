import { useState , useEffect } from "react"
import desksService from "../services/desksService";
import Card from "../components/Card"
import deskImage from "../assets/desk.jpg";


const CustomerDesks = () => {
  const [desks, setDesks] = useState([])
    useEffect(() => {
      desksService
        .getAll()
        .then(initialDesks => {
          setDesks(initialDesks)
        })
    }, []);
    return(
      <div id="desk">
        <div className="main-header">
          <div className="content">
            <span>All Desks</span>
          </div>
        </div>
        <div className="container">
          <div className="row card-container">
            {desks.map((desk) => (
              <Card
                key={desk.desk_id}
                cardType="CustomerDesk"
                desk={desk}
                image={deskImage}
              />
            ))}
          </div>
        </div>
      </div>
    )
}

export default CustomerDesks