import { useState , useEffect } from "react"
import desksService from "../services/desksService";
import Card from "../components/Card"


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
            <div className="box">
              <header className="section-header">
                <h2>All Desks</h2>
              </header>
            </div>
          </div>

        </div>
        <div className="container">
          <div className="articles-container">
            {desks.map((desk) => (
              <Card
                key={desk.desk_id}
                cardType="CustomerDesk"
                desk={desk}
              />
            ))}
          </div>
        </div>
      </div>
    )
}

export default CustomerDesks