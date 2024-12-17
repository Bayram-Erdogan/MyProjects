const handlePrint = (image) => {  // This is from ChatGPT
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

export default handlePrint
