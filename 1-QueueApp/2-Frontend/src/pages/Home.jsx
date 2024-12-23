import { useState , useEffect } from "react"
import queuesServices from "../services/queuesServices"
import Card from "../components/Card"

const Home = () =>{
  const [queues, setQueues] = useState([])

  useEffect(() => {
    queuesServices
      .getAll()
      .then(initialQueues => {
          setQueues(initialQueues)
      })
  }, []);

  return (
    <div id="home">
      <div className="main-header">
        <div className="content">
          <span className="border">Welcome to Queue App</span>
        </div>
      </div>

      <div className="box">

        <header className="section-header">
          <h2>Join a Queue</h2>
        </header>

        <div className="container">
          <div className="articles-container">
            {queues.map((queue) => (
              <Card
              key={queue.queue_id}
              cardType = "Queue__home"
              queue={queue}
              image={queue.qr_code}
              />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home;