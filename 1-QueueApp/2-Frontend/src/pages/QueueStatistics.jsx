import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import customersService from "../services/customersService";
import { filterByDate, prepareChartData } from "../utils/statisticsHelper";
import { Bar } from 'react-chartjs-2';

const QueueStatistics = ({ queues, customers, setCustomers }) => {
  const { id } = useParams();
  const [statistics, setStatistics] = useState({});
  const [chart, setChart] = useState(null);
  const [content, setContent] = useState('');
  const [selectedStatistics, setSelectedStatistics] = useState('daily');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const queue = queues.find((queue) => queue.queue_id === id);

  useEffect(() => {
    customersService
      .getAll()
      .then((customers) => setCustomers(customers));
  }, [setCustomers]);

  useEffect(() => {
    if (queue && customers?.length > 0) {
      const filtered = customers.filter(
        (customer) => customer.attached_queue?.queue_id === id
      );
      setFilteredCustomers(filtered);
    }
  }, [queue, customers, id]);

  useEffect(() => {
    if (filteredCustomers.length > 0) {
      handleDailyStatistics();
    }
  }, [filteredCustomers]);

  const handleDailyStatistics = () => {
    const dailyCustomers = filterByDate(filteredCustomers, 'daily');
    const waitingCount = dailyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = dailyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = dailyCustomers.filter((customer) => customer.status === 'done').length;

    setStatistics({
      total: dailyCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('daily');
    setContent(
      <div>
        <h2>{queue.queue_name} Daily Statistics</h2>
        <p>Total Customers: {dailyCustomers.length}</p>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
      </div>
    );
    setChart(prepareChartData(dailyCustomers, 'daily'));
  };

  const handleWeeklyStatistics = () => {
    const weeklyCustomers = filterByDate(filteredCustomers, 'weekly');
    const waitingCount = weeklyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = weeklyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = weeklyCustomers.filter((customer) => customer.status === 'done').length;

    setStatistics({
      total: weeklyCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('weekly');
    setContent(
      <div>
        <h2>{queue.queue_name} Weekly Statistics</h2>
        <p>Total Customers: {weeklyCustomers.length}</p>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
      </div>
    );
    setChart(prepareChartData(weeklyCustomers, 'weekly'));
  };

  const handleMonthlyStatistics = () => { // From GhatGPT
    const monthlyCustomers = filterByDate(filteredCustomers, 'monthly');
    const waitingCount = monthlyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = monthlyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = monthlyCustomers.filter((customer) => customer.status === 'done').length;

    setStatistics({
      total: monthlyCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('monthly');
    setContent(
      <div>
        <h2>{queue.queue_name} Monthly Statistics</h2>
        <p>Total Customers: {monthlyCustomers.length}</p>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
      </div>
    );
    setChart(prepareChartData(monthlyCustomers, 'monthly'));
  };

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">{content}</div>
        <div className="list-container">
          <h3>Queues</h3>
          <ul className="list">
            {queues.map((queue) => (
              <li key={queue.queue_id}>
                <Link to={`/admin/queues/${queue.queue_id}/statistics`}>
                  <h4>{queue.queue_name}</h4>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="right">
        <div className="container box">
          <h1>{queue.queue_name} Statistics</h1>
          <div className="btn-container">
            <Button text="Daily (Today)" onClick={handleDailyStatistics} />
            <Button text="Weekly" onClick={handleWeeklyStatistics} />
            <Button text="Monthly" onClick={handleMonthlyStatistics} />
          </div>
          {chart && (
            <div className="chart-container">
              <Bar data={chart} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueStatistics;
