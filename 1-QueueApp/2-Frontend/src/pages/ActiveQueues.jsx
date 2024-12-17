import { useState , useEffect } from "react"
import queuesServices from "../services/queuesServices"
import Card from "../components/Card"

const ActiveQueues = () => {
    const [queues, setQueues] = useState([])

        useEffect(() => {
          queuesServices
            .getActive()
            .then(initialQueues => {
                setQueues(initialQueues)
            })
        }, []);
    return (
        <div>
            <h1>Active Queues</h1>
            <div className="container">
                <div className="articles-container">
                    {queues.map((queue) => (
                        <Card
                            key={queue.queue_id}
                            cardType = "Active_Queue"
                            queue={queue}
                            image={queue.qr_code}
                        />)
                    )}
                </div>

            </div>
        </div>
    )
}

export default ActiveQueues