import { useState , useEffect } from "react"
import queuesService from "../services/queuesService";
import Card from "../components/Card"


const CustomerQueues = () => {
  const [queues, setQueues] = useState([])
    useEffect(() => {
      queuesService
        .getAll()
        .then(initialQueues => {
          setQueues(initialQueues)
        })
    }, []);
    return(
      <div id="queue">
        <div className="showcase">
          <div className="content">
            <div className="box">
              <header className="section-header">
                <h2>All Queues</h2>
              </header>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row cards-row">
            {queues.length === 0 ? (
              <p>No queues available</p>
            ) : (
              queues.map((queue) => (
                <Card
                  key={queue.queue_id}
                  cardType="CustomerQueue"
                  queue={queue}
                  image={queue.qr_code}
                />
              ))
            )}
          </div>
        </div>
      </div>
    )
}

export default CustomerQueues