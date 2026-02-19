// import './review.css';
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useLocation, useNavigate } from "react-router-dom";

// // download pdf code
// const handleDownloadPdf = () => {
//   const invoice = document.querySelector(".card");
//   const btn = document.querySelector(".btn.btn-success");

//      // hide button
//     if (btn) btn.style.display = "none";

//       html2canvas(invoice, { scale: 2, useCORS: true, scrollY: -window.scrollY })
//     .then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");

//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();

//       const imgProps = pdf.getImageProperties(imgData);
//       const imgWidth = pageWidth - 20; 
//       const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

     
//       let scale = 1;
//       if (imgHeight > pageHeight - 20) {
//         scale = (pageHeight - 20) / imgHeight;
//       }

//       const finalWidth = imgWidth * scale;
//       const finalHeight = imgHeight * scale;
//       const x = (pageWidth - finalWidth) / 2;
//       const y = 10; 

//       pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
//       pdf.save("Invoice.pdf");

     
//       if (btn) btn.style.display = "block";
//     });
// };

// // Convert number to words in Marathi (proper Marathi number system)
// const numberToWordsMarathi = (num) => {
//   if (num === 0) return 'शून्य';
  
//   // Marathi numbers 1-19 (exact words)
//   const ones = ['', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ', 'दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस'];
  
//   // Marathi numbers 20-99 (exact compound words, not additive)
//   const twentyToNinetyNine = [
//     '', '', 'वीस', 'एकवीस', 'बावीस', 'त्रेवीस', 'चौवीस', 'पच्चीस', 'छब्बीस', 'सत्तावीस', 'अठावीस', 'एकोणतीस',
//     'तीस', 'एकतीस', 'बत्तीस', 'त्रेतीस', 'चौतीस', 'पस्तीस', 'छत्तीस', 'सत्तीस', 'अष्टतीस', 'एकोणचाळीस',
//     'चाळीस', 'एकचाळीस', 'बेचाळीस', 'त्रेचाळीस', 'चौचाळीस', 'पचाळीस', 'छेचाळीस', 'सत्तेचाळीस', 'अठ्ठेचाळीस', 'एकोणपन्नास',
//     'पन्नास', 'एकावन्न', 'बावन्न', 'त्रेवन्न', 'चौवन्न', 'पचावन्न', 'छप्पन्न', 'सत्तावन्न', 'अठ्ठावन्न', 'एकोणसाठ',
//     'साठ', 'एकसष्ठ', 'बासष्ठ', 'त्रेसष्ठ', 'चौसष्ठ', 'पचासष्ठ', 'छयसष्ठ', 'सत्तासष्ठ', 'अठ्ठासष्ठ', 'एकोणसत्तर',
//     'सत्तर', 'एकसत्तर', 'बासत्तर', 'त्रेसत्तर', 'चौसत्तर', 'पचासत्तर', 'छयसत्तर', 'सत्तासत्तर', 'अठ्ठासत्तर', 'एकोणऐंशी',
//     'ऐंशी', 'एकऐंशी', 'बाऐंशी', 'त्रेऐंशी', 'चौऐंशी', 'पचाऐंशी', 'छयऐंशी', 'सत्ताऐंशी', 'अठ्ठाऐंशी', 'एकोणनव्वद',
//     'नव्वद', 'एकनव्वद', 'बानव्वद', 'त्रेनव्वद', 'चौनव्वद', 'पचानव्वद', 'छयनव्वद', 'सत्तानव्वद', 'अठ्ठानव्वद', 'नव्वद नऊ'
//   ];
  
//   const helper = (n) => {
//     let str = '';
//     if (n === 0) str = '';
//     else if (n < 20) str = ones[n];
//     else if (n < 100) str = twentyToNinetyNine[n];
//     else if (n < 1000) str = ones[Math.floor(n/100)] + ' शंभर' + (n % 100 ? ' ' + helper(n % 100) : '');
//     else if (n < 100000) str = helper(Math.floor(n/1000)) + ' हजार' + (n % 1000 ? ' ' + helper(n % 1000) : '');
//     else if (n < 10000000) str = helper(Math.floor(n/100000)) + ' लाख' + (n % 100000 ? ' ' + helper(n % 100000) : '');
//     else str = helper(Math.floor(n/10000000)) + ' करोड' + (n % 10000000 ? ' ' + helper(n % 10000000) : '');
//     return str;
//   };
  
//   return helper(Math.floor(num));
// };

// // Convert number to words (standard international English with million/billion)
// const numberToWords = (num) => {
//   if (num === 0) return 'Zero';
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

//   const helper = (n) => {
//     let str = '';
//     if (n < 20) str = ones[n];
//     else if (n < 100) str = tens[Math.floor(n/10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//     else if (n < 1000) str = ones[Math.floor(n/100)] + ' Hundred' + (n % 100 ? ' ' + helper(n % 100) : '');
//     else if (n < 1_000_000) str = helper(Math.floor(n/1000)) + ' Thousand' + (n % 1000 ? ' ' + helper(n % 1000) : '');
//     else if (n < 1_000_000_000) str = helper(Math.floor(n/1_000_000)) + ' Million' + (n % 1_000_000 ? ' ' + helper(n % 1_000_000) : '');
//     else str = helper(Math.floor(n/1_000_000_000)) + ' Billion' + (n % 1_000_000_000 ? ' ' + helper(n % 1_000_000_000) : '');
//     return str;
//   };

//   return helper(Math.floor(num));
// };

// const OderpreviewBill = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const order = location.state?.order;

//   if (!order) {
//     return (
//       <div className="table-text" style={{ padding: '20px', textAlign: 'center' }}>
//         <h2>No order data available</h2>
//         <button onClick={() => navigate("/details")} style={{ padding: '10px 20px', marginTop: '10px' }}>
//           Go Back to Orders
//         </button>
//       </div>
//     );
//   }

//   const billDate = new Date(order.orderDate).toLocaleDateString('en-IN');
//   const billAmount = order.subtotal;
//   const paidAmount = order.paidAmount;
//   const unpaidAmount = order.unpaidAmount;

//   return (
// <div className="table-text">

//      <div className="card" >
//      <div className="invoice-header" >
//           <p className="shree-text">॥ Shree ॥</p>

//      <button className="btn btn-success" onClick={handleDownloadPdf}> Download PDF </button>
//        <h2 className="name"> Jogeshwari Caterers </h2>
//           </div>

//         <div className="bill-info">
//           <div>
//             <p><b>Bill No:</b> INV_{order._id?.slice(-6).toUpperCase()}</p>
//            <p><b>To:</b> {order.customer?.name}</p>
//             <p><b>Mobile:</b> {order.customer?.contact || 'N/A'}</p>
//           </div>
//           <div className="date">
//             <p><b>Date:</b> {billDate}</p>
//           </div>
//         </div>

//           <table className="invoice-table">
//           <thead>
//             <tr>
//               <th>Sr.No</th>
//               <th>Particulars</th>
//               <th>Qty</th>
//               <th>Rate</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {order.items && order.items.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{idx + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.qty}</td>
//                 <td>₹ {item.price}</td>
//                 <td>₹ {item.total}</td>
//               </tr>
//             ))}
//            </tbody>
//         </table>
//           <div className="amount-box">
//           <p>Bill Amount: <span>₹ {billAmount}</span></p>
//           <p>Paid Amount: <span>₹ {paidAmount}</span></p>
//           <p className="Unpaid-Amount">Unpaid Amount: <span>₹ {unpaidAmount}</span></p>
//         </div>
//         <hr></hr>
//          <h6> <span  className="bill-text"> Bill Amount In Words (Marathi): </span><span className='Two-Thousand-text'>{numberToWordsMarathi(billAmount)}.</span></h6>
//          <h6> <span  className="bill-text"> Bill Amount In Words (English): </span><span className='Two-Thousand-text'>{numberToWords(billAmount)}.</span></h6>

//           <div className="signature">
//           <p>Customer Signature</p>
//           <p>Authorized Signatory</p>
//         </div>
//         </div>
//          </div>
//   );
// };

// export default OderpreviewBill;
import './review.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useNavigate } from "react-router-dom";


// ======================= PDF DOWNLOAD =======================
const handleDownloadPdf = () => {
  const invoice = document.querySelector(".card");
  const btn = document.querySelector(".btn.btn-success");

  if (btn) btn.style.display = "none";

  html2canvas(invoice, { scale: 2, useCORS: true, scrollY: -window.scrollY })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let scale = 1;
      if (imgHeight > pageHeight - 20) {
        scale = (pageHeight - 20) / imgHeight;
      }

      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      const x = (pageWidth - finalWidth) / 2;

      pdf.addImage(imgData, "PNG", x, 10, finalWidth, finalHeight);
      pdf.save("Invoice.pdf");

      if (btn) btn.style.display = "block";
    });
};


// ======================= MARATHI NUMBER TO WORDS =======================
const numberToWordsMarathi = (num) => {
  if (!num || num === 0) return "शून्य रुपये फक्त";

  const words = [
    "", "एक", "दोन", "तीन", "चार", "पाच", "सहा", "सात", "आठ", "नऊ",
    "दहा", "अकरा", "बारा", "तेरा", "चौदा", "पंधरा", "सोळा",
    "सतरा", "अठरा", "एकोणीस",
    "वीस", "एकवीस", "बावीस", "तेवीस", "चोवीस", "पंचवीस",
    "सव्वीस", "सत्तावीस", "अठ्ठावीस", "एकोणतीस",
    "तीस", "एकतीस", "बत्तीस", "तेहतीस", "चौतीस", "पस्तीस",
    "छत्तीस", "सदतीस", "अडतीस", "एकोणचाळीस",
    "चाळीस", "एकेचाळीस", "बेचाळीस", "त्रेचाळीस", "चव्वेचाळीस",
    "पंचेचाळीस", "सेहेचाळीस", "सत्तेचाळीस", "अठ्ठेचाळीस", "एकोणपन्नास",
    "पन्नास", "एकावन्न", "बावन्न", "त्रेपन्न", "चोपन्न",
    "पंचावन्न", "छप्पन्न", "सत्तावन्न", "अठ्ठावन्न", "एकोणसाठ",
    "साठ", "एकसष्ट", "बासष्ट", "त्रेसष्ट", "चौसष्ट",
    "पासष्ट", "सहासष्ट", "सत्तेसष्ट", "अडुसष्ट", "एकोणसत्तर",
    "सत्तर", "एकाहत्तर", "बहात्तर", "त्र्याहत्तर", "चौर्‍याहत्तर",
    "पंचाहत्तर", "शहात्तर", "सत्त्याहत्तर", "अठ्ठ्याहत्तर", "एकोणऐंशी",
    "ऐंशी", "एक्याऐंशी", "ब्याऐंशी", "त्र्याऐंशी", "चौर्‍याऐंशी",
    "पंच्याऐंशी", "शहाऐंशी", "सत्त्याऐंशी", "अठ्ठ्याऐंशी", "एकोणनव्वद",
    "नव्वद", "एक्याण्णव", "ब्याण्णव", "त्र्याण्णव", "चौर्‍याण्णव",
    "पंच्याण्णव", "शहाण्णव", "सत्त्याण्णव", "अठ्ठ्याण्णव", "नव्व्याण्णव"
  ];

  const helper = (n) => {
    let str = "";

    if (n < 100) {
      str = words[n];
    }
    else if (n < 1000) {
      str =
        words[Math.floor(n / 100)] +
        "शे" +
        (n % 100 !== 0 ? " " + helper(n % 100) : "");
    }
    else if (n < 100000) {
      str =
        helper(Math.floor(n / 1000)) +
        " हजार" +
        (n % 1000 !== 0 ? " " + helper(n % 1000) : "");
    }
    else if (n < 10000000) {
      str =
        helper(Math.floor(n / 100000)) +
        " लाख" +
        (n % 100000 !== 0 ? " " + helper(n % 100000) : "");
    }
    else {
      str =
        helper(Math.floor(n / 10000000)) +
        " कोटी" +
        (n % 10000000 !== 0 ? " " + helper(n % 10000000) : "");
    }

    return str.trim();
  };

  return helper(Math.floor(num)) + " रुपये फक्त";
};


// ======================= COMPONENT =======================
const OderpreviewBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No order data available</h2>
        <button onClick={() => navigate("/details")}>
          Go Back to Orders
        </button>
      </div>
    );
  }

  const billDate = new Date(order.orderDate).toLocaleDateString("en-IN");
  const billAmount = order.subtotal || 0;
  const paidAmount = order.paidAmount || 0;
  const unpaidAmount = order.unpaidAmount || 0;

  return (
    <div className="table-text">
      <div className="card">

        <div className="invoice-header">
          <p className="shree-text">॥ Shree ॥</p>

          <button className="btn btn-success" onClick={handleDownloadPdf}>
            Download PDF
          </button>

          <h2 className="name">Jogeshwari Caterers</h2>
        </div>

        <div className="bill-info">
          <div>
            <p><b>Bill No:</b> INV_{order._id?.slice(-6).toUpperCase()}</p>
            <p><b>To:</b> {order.customer?.name}</p>
            <p><b>Mobile:</b> {order.customer?.contact || "N/A"}</p>
          </div>
          <div>
            <p><b>Date:</b> {billDate}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Particulars</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹ {item.price}</td>
                <td>₹ {item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="amount-box">
          <p>Bill Amount: <span>₹ {billAmount}</span></p>
           <p>Paid Amount: <span>₹ {paidAmount}</span></p>
           <p className="Unpaid-Amount">Unpaid Amount: <span>₹ {unpaidAmount}</span></p>
         </div>
        <hr />

        <h6>
          <b>Bill Amount In Words (Marathi): </b>
          {numberToWordsMarathi(billAmount)}
        </h6>

        <div className="signature">
          <p>Customer Signature</p>
          <p>Authorized Signatory</p>
        </div>

      </div>
    </div>
  );
};

export default OderpreviewBill;
