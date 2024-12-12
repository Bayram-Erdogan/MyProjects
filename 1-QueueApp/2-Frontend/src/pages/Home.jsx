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
    <div>
      <h1> Welcome to Queue App</h1>
      <h2>Join a Queue</h2>
      <div className="container">
        <div className="articles-container">
          {queues.map((queue) => (
            <Card
            key={queue.queue_id}
            cardType = "Queue"
            title = {queue.queue_name}
            attached_desk = {queue.attached_desk}
            max_of_customer = {queue.max_of_customer}
            image={queue.qr_code}
            />)
          )}
        </div>
      </div>

    </div>
  )
}
export default Home;