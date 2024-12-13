import Button from './Button'
const Card = ({
    cardType,
    title,
    user,
    attached_desk,
    max_of_customer,
    image,
    waiting_customer
    }) => {

    const handlePrint = (image) => { // This from ChatGpt
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code</title>
                </head>
                <body>
                    <img src="${image}" alt="QR Code" style="width: 200px; height: 200px;"/>
                </body>
            </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };

    switch(cardType){
        case 'User':
            return(
                <article className="card bg-dark">
                    <img src={image} alt="" />
                    <div>
                        <h3> {title} </h3>
                        {/* <p><strong>Attached desk:</strong> {user.name}</p>
                        <p><strong>Attached queue:</strong> {user.email}</p> */}
                    </div>
                </article>
            )
        case 'Desk':
            return(
                <article className="card bg-secondary">
                    <img src={image} alt="" />
                    <div>
                        <h3> {title} </h3>
                        {/* <p><strong>Attached queue:</strong> </p>
                        <p><strong>Attached user:</strong> </p> */}
                    </div>
                </article>
            )
        case 'Queue':
            return(
                <article className="card bg-primary">
                    <img src={image} alt="qr_code" />
                    <div>
                        <h3> {title} </h3>
                        <p><strong>Attached desk :</strong> {attached_desk}</p>
                        <p><strong>Max of customer:</strong> {max_of_customer}</p>
                        <p>{user}</p>
                        <Button style={"btn btn-dark"} text= {"Print"} onClick={() => handlePrint(image)}/>
                    </div>
                </article>
            )
            case 'Active_Queue':
                return(
                    <article className="card bg-primary">
                        <img src={image} alt="qr_code" />
                        <div>
                            <h3> {title} </h3>
                            <p><strong>Number of Waiting Customers :</strong> {waiting_customer}</p>
                            <p><strong>Average Waiting Time :</strong> {max_of_customer}</p>
                            <p>{user}</p>
                            <Button style={"btn btn-dark"} text= {"Print"} onClick={() => handlePrint(image)}/>
                        </div>
                    </article>
                )
    }
}

export default Card