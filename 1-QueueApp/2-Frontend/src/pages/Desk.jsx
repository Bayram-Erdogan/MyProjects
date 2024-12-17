import { useParams } from "react-router-dom";

const Desk = ({ desks }) => {
  const { id } = useParams();
  const desk = desks.find((desk) => desk.desk_id === id);

  return (
    <div>
      <h1>Desk {desk.desk_number} Details</h1>
      <p><strong>Desk Number :</strong> {desk.desk_number}</p>
      <p><strong>Desk ID :</strong> {desk.desk_id}</p>
      <p><strong>Created time :</strong> {desk.createdTime.date} / {desk.createdTime.hour}</p>
      <p><strong>Created by:</strong> Buraya olusturan kisi gelecek</p>
      <p><strong>User:</strong> Buraya bagli oldugu user gelecek</p>
      <p><strong>Queue:</strong> Buraya bagli oldugu queue gelecek</p>
      <p><strong>Status:</strong> Buraya status durumu gelecek</p>
      <p><strong>Toplam Musteri sayisi:</strong> Buraya deskin islemini gerceklestirdigi toplam musteri gelecek</p>
    </div>
  );
};

export default Desk;
