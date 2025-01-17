//All functions from ChatGPT
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const filterByDate = (data, range, startDate = null, endDate = null) => {
  const now = new Date();

  if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return data.filter((customer) => {
          const customerDate = new Date(customer.joining_time.date);
          return customerDate >= start && customerDate <= end;
      });
  }

  return data.filter((customer) => {
      const customerDate = new Date(customer.joining_time.date);

      if (range === 'daily') {
          return customerDate.toDateString() === now.toDateString();
      } else if (range === 'weekly') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay() + 1);
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          return customerDate >= startOfWeek && customerDate <= endOfWeek;
      } else if (range === 'monthly') {
          return (
              customerDate.getFullYear() === now.getFullYear() &&
              customerDate.getMonth() === now.getMonth()
          );
      }
      return false;
  });
};

export const prepareChartData = (customers, period, startDate = null, endDate = null) => {
  const filteredCustomers = filterByDate(customers, period, startDate, endDate);

  const totalCustomers = filteredCustomers.length;
  const waitingCustomers = filteredCustomers.filter(customer => customer.status === 'waiting').length;
  const processingCustomers = filteredCustomers.filter(customer => customer.status === 'process').length;
  const completedCustomers = filteredCustomers.filter(customer => customer.status === 'done').length;

  return {
      labels: ['Total Customers', 'Waiting Customers', 'Processing Customers', 'Completed Customers'],
      datasets: [
          {
              label: 'Customer Counts',
              data: [totalCustomers, waitingCustomers, processingCustomers, completedCustomers],
              backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
          },
      ],
  };
};

const addTextToPDF = (doc, text, yOffset) => {
    // text'in geçerli bir string olup olmadığını kontrol et
    if (typeof text === 'string' && text.trim() !== '') {
      doc.text(text, 10, yOffset);
      yOffset += 10; // Bir sonraki metin için yOffset'i artır
    }
    return yOffset; // Güncellenmiş yOffset'i geri döndürüyoruz
};

export const exportToPDF = (statistics, selectedStatistics, chartRef, content) => {
    if (!selectedStatistics) {
      alert('Please select a statistics type first.');
      return;
    }

    const doc = new jsPDF();
    let yOffset = 20;
    const averageWaitingTime = statistics.averageWaitingTime !== undefined ? statistics.averageWaitingTime : 0;

    if (statistics.date) {
      yOffset = addTextToPDF(doc, `Date: ${statistics.date}`, yOffset);
    } else if (statistics.weekNumber) {
      yOffset = addTextToPDF(doc, `Week Number: ${statistics.weekNumber}`, yOffset);
    } else if (statistics.monthName) {
      yOffset = addTextToPDF(doc, `Month: ${statistics.monthName}`, yOffset);
    } else if (statistics.dateRange) {
      yOffset = addTextToPDF(doc, `Date Range: ${statistics.dateRange}`, yOffset);
    }

    doc.text(`${selectedStatistics.charAt(0).toUpperCase() + selectedStatistics.slice(1)} Statistics`, 10, 10);
    yOffset = addTextToPDF(doc, `Waiting Customers: ${statistics.waiting || 0}`, yOffset);
    yOffset = addTextToPDF(doc, `Processing Customers: ${statistics.processing || 0}`, yOffset);
    yOffset = addTextToPDF(doc, `Completed Customers: ${statistics.completed || 0}`, yOffset);
    yOffset = addTextToPDF(doc, `Total Customers: ${statistics.total || 0}`, yOffset);
    yOffset = addTextToPDF(doc, `Average Waiting Time: ${averageWaitingTime.toFixed(2)} minutes`, yOffset);

    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, yOffset, 180, 100);
      doc.save(`${selectedStatistics}_statistics_with_chart.pdf`);
    });
  };
