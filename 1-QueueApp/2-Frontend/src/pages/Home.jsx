import { useState, useEffect } from "react";
import queuesServices from "../services/queuesService";
import Card from "../components/Card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faListUl, faChair } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    queuesServices
      .getAll()
      .then(initialQueues => {
        setQueues(initialQueues);
      })
      .catch(error => {
        console.error("Error fetching queues:", error);
      });
  }, []);

  return (
    <div>
      <section id="home" className="showcase">
        <div className="content">
            <header className="section-header">
              <h2>Welcome to Queue App</h2>
            </header>
        </div>
      </section>

      <section id="how-it-works">
        <div className="container">
          <div className="row">
            <h2 className="section-title">How it Works?</h2>
            <p>We will show you step by step how to join a queue seamlessly and save your precious time!</p>
          </div>

          <div className="row">
            <div className="icon-box col-3">
              <FontAwesomeIcon icon={faQrcode} size="3x" />
              <h3>Scan the QR Code</h3>
              <p>Find the QR code at the service location and scan it using your smartphone to get started. No need for physical tickets or standing in line!</p>
            </div>
            <div className="icon-box col-3">
              <FontAwesomeIcon icon={faListUl} size="3x" />
              <h3>Join the Queue</h3>
              <p>Once scanned, you’re automatically added to the queue. Instantly view your position and estimated waiting time. Move freely or take a seat while staying informed about your turn.</p>
            </div>
            <div className="icon-box col-3">
              <FontAwesomeIcon icon={faChair} size="3x" />
              <h3>Wait Comfortably</h3>
              <p>Enjoy peace of mind as you wait. Our system provides real-time updates, so you know exactly when it’s your turn—no stress, no surprises, just smooth and efficient service!</p>
            </div>
          </div>
        </div>
      </section>

      <section id="queues">
        <div className="page-container">
          <div className="row">
            <h2 className="section-title">Join a Queue</h2>
          </div>

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
      </section>
    </div>
  );
};

export default Home;
