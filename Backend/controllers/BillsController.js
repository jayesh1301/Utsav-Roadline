const db = require("../config/dbConfig");
const fs = require("fs").promises;
const pdf = require("html-pdf");
const path = require("path");
const numberToWords = require("number-to-words");

// const transporter = require("./LRController");
const nodemailer = require("nodemailer");
const getbillsbybranch = (req, res) => {
  const branch = req.params.branch;
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const offset = page * pageSize;

  const query = "CALL getbillsbybranch(?)";

  try {
    db.query(query, branch, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      let billsbybranch = results[0];
   // Convert bill_no to uppercase
   billsbybranch = billsbybranch.map(bill => ({
    ...bill,
    bill_no: bill.bill_no.toUpperCase(),
    customer_name: bill.customer_name.toUpperCase()
  }));
      const total = billsbybranch.length;
      const paginatedbillsbybranch = billsbybranch.slice(
        offset,
        offset + pageSize
      );
      return res.json({
        billsbybranch: paginatedbillsbybranch,
        total: total,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};

const getbillbyid = (req, res) => {
  const id = req.params.id;
  const queryBill = "CALL getbillbyid(?)";
  const queryBillDetails = "CALL getbilldetailsbyid(?)";
  const getLocQuery = `
    SELECT loc_from, loc_to
    FROM lorry_reciept_master
    WHERE id = ?
  `;
  const getPlaceNameQuery = `
    SELECT place_id, place_name
    FROM place
    WHERE place_id = ?
  `;

  db.query(queryBill, [id], (err, billResults) => {
    if (err) {
      console.error("Error executing bill query:", err);
      res.status(500).send("Server error");
      return;
    }

    if (billResults.length === 0) {
      res.status(404).send("Bill not found");
      return;
    }

    const bill = billResults[0][0];

    db.query(queryBillDetails, [id], (err, billDetailsResults) => {
      if (err) {
        console.error("Error executing bill details query:", err);
        res.status(500).send("Server error");
        return;
      }

      if (billDetailsResults.length === 0) {
        res.status(404).send("Bill details not found");
        return;
      }

      const billDetails = billDetailsResults[0];
      const lr_id = billDetails[0].lr_id; // Assuming lr_id is a property of billDetails

      // Fetch loc_from and loc_to details from lorry_reciept_master
      db.query(getLocQuery, [lr_id], (err, locResults) => {
        if (err) {
          console.error("Error executing getLocQuery:", err);
          res.status(500).send("Server error");
          return;
        }

        if (locResults.length === 0) {
          res.status(404).send("Lorry receipt not found");
          return;
        }

        const loc_from = locResults[0].loc_from;
        const loc_to = locResults[0].loc_to;

        // Fetch place_name for loc_from and loc_to
        db.query(getPlaceNameQuery, [loc_from], (err, locFromResult) => {
          if (err) {
            console.error(
              "Error executing getPlaceNameQuery for loc_from:",
              err
            );
            res.status(500).send("Server error");
            return;
          }

          if (locFromResult.length === 0) {
            res.status(404).send("Location from not found");
            return;
          }

          const loc_from_name = locFromResult[0].place_name;

          db.query(getPlaceNameQuery, [loc_to], (err, locToResult) => {
            if (err) {
              console.error(
                "Error executing getPlaceNameQuery for loc_to:",
                err
              );
               res.status(500).send("Server error");
              return;
            }

            if (locToResult.length === 0) {
              res.status(404).send("Location to not found");
              return;
            }

            const loc_to_name = locToResult[0].place_name;

            // Add loc_from and loc_to fields to billDetails
            billDetails.loc_from = loc_from;
            billDetails.loc_to = loc_to;

            // Add location details to the bill object
            bill.details = {
              loc_from_name: loc_from_name,
              loc_to_name: loc_to_name,
            };

            // Include billDetailsResults along with other details in the response
            bill.billDetailsResults = billDetailsResults[0];

            return res.json(bill);
          });
        });
      });
    });
  });
};
const addbillmaster = (req, res) => {
  const {
    bill_no,
    in_bill_date,
    bill_type,
    customer_id,
    tot_freight,
    tot_hamali,
    service_ch,
    del_char,
    other_ch,
    demurage,
    tds,
    tot_tax,
    tot_amount,
    remarks,
    in_fileloc,
    branch,
    user_id,
    bill_details,
  } = req.body;

  const validTotTax = tot_tax ? tot_tax : "0";

  let query;
  if (!bill_no) {
    query = `
            SET @message = '';
            SET @inserted_id = 0;
            CALL add_bill_master_auto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @message, @inserted_id);
            SELECT @message as message, @inserted_id as inserted_id;
        `;
  } else {
    query = `
            SET @message = '';
            SET @inserted_id = 0;
            CALL add_bill_master(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @message, @inserted_id);
            SELECT @message as message, @inserted_id as inserted_id;
        `;
  }

  const parameters = [
    bill_no,
    in_bill_date,
    bill_type,
    customer_id,
    tot_freight  ,
    tot_hamali,
    service_ch,
    del_char,
    other_ch,
    demurage,
    tds,
    validTotTax,
    tot_amount,
    remarks,
    in_fileloc,
    branch,
    user_id,
  ];

  db.query(query, parameters, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Server error",message:err });
    }

    let message, inserted_id;

    if (results && results[2] && results[2][0]) {
      message = results[2][0].message;
    }

    if (results && results[3] && results[3][0]) {
      inserted_id = results[3][0].inserted_id;
    }

    if (bill_details && bill_details.length > 0) {
      const detailQuery = `
                CALL add_bill_details(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

      const promises = bill_details.map((detail) => {
        return new Promise((resolve, reject) => {
          db.query(
            detailQuery,
            [
              inserted_id,
              detail.table_lr_id,
              detail.table_lr_freight,
              detail.table_lr_hamali,
              detail.table_lr_collection,
              detail.table_lr_delivery,
              detail.table_lr_wtcharges,
              detail.table_lr_otherchar,
              detail.table_lr_statistical,
              detail.table_lr_total,
              "",
              detail.table_lr_gstpayby,
              detail.table_lr_gst_amount,
            ],
            (err) => {
              if (err) {
                console.error("Error executing detail query:", err);
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      });

      Promise.all(promises)
        .then(() => {
          return res.json({
            message: message,
            inserted_id,
          });
        })
        .catch((err) => {
          console.error("Error executing detail queries:", err);
          return res.status(500).json({ error: "Server error",message:err });
        });
    } else {
      return res.json({ message, inserted_id });
    }
  });
};

const deletebills = (req, res) => {
  const id = req.params.id;


  const query = `
        CALL deletebills(?, @message);
        SELECT @message as message;
    `;

  try {
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      // Extract the message from the results
      const message = results[2][0].message;
      return res.json({ message });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};
const searchBills = (req, res) => {
  const { bill_no, cust_id, branch } = req.query;

  const query = "CALL bills_search(?, ?, ?)";

  try {
    db.query(query, [bill_no, cust_id, branch], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      return res.json(results[0]);
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};
const getLorryMasterListForBill = (req, res) => {
  const { in_cust, in_billtype } = req.query;

  const query = "CALL lorrymasterlistforbill(?, ?)";

  try {
    db.query(query, [in_cust, in_billtype], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      const transformedResults = results[0].map((item) => ({
        id: item.id,
        lr_no: item.lr_number,
      }));


      return res.json(transformedResults);
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};

const getLorryMasterListForBillUpdate = (req, res) => {
  const { in_cust, in_billtype } = req.query;
  const query = `
    SELECT 
        lm.id,
        CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id = lm.branch), "-", lm.lr_no) AS lr_display
    FROM 
        lorry_reciept_master lm
    
    WHERE 
        (lm.consigner = ? OR lm.consignee = ?)
        AND lm.pay_type = ?
    ORDER BY 
        lm.id DESC;`;

  try {
    db.query(query, [in_cust, in_cust, in_billtype], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      // Transform the results to the desired format if needed
      const finalresult = results.map((item) => ({
        id: item.id,
        lr_no: item.lr_display
      }));

      return res.json(finalresult);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server error");
  }
};

const getlrdetailsbyid = (req, res) => {
  const { in_id, in_cust } = req.query;

  const getLRDetailsQuery = "CALL getlrdetailsbyid(?, ?)";

  try {
    db.query(getLRDetailsQuery, [in_id, in_cust], (err, lrResults) => {
      if (err) {
        console.error("Error executing getLRDetailsQuery:", err);
        return res.status(500).send("Server error");
      }

      if (lrResults && lrResults[0] && lrResults[0][0]) {
        const lrDetails = lrResults[0][0];
        const lrid = lrDetails.id;

        // Query to fetch consignor's name
        const getConsignorQuery = `
          SELECT c.customer_name AS consignor_name
          FROM lorry_reciept_master lr
          LEFT JOIN customer c ON lr.consigner = c.customer_id
          WHERE lr.id = ?
        `;

        db.query(getConsignorQuery, [lrid], (err, consignorResult) => {
          if (err) {
            console.error("Error executing getConsignorQuery:", err);
            return res.status(500).send("Server error");
          }

          if (consignorResult && consignorResult[0]) {
            lrDetails.consignor_name = consignorResult[0].consignor_name;

            const getLocQuery = `
              SELECT loc_from, loc_to
              FROM lorry_reciept_master
              WHERE id = ?
            `;

            db.query(getLocQuery, [lrid], (err, locResults) => {
              if (err) {
                console.error("Error executing getLocQuery:", err);
                return res.status(500).send("Server error");
              }

              if (locResults && locResults[0]) {
                const locFrom = locResults[0].loc_from;
                const locTo = locResults[0].loc_to;

                const getPlaceNameQuery = `
                  SELECT place_id, place_name
                  FROM place
                  WHERE place_id IN (?, ?)
                `;

                db.query(
                  getPlaceNameQuery,
                  [locFrom, locTo],
                  (err, placeResults) => {
                    if (err) {
                      console.error("Error executing getPlaceNameQuery:", err);
                      return res.status(500).send("Server error");
                    }

                    if (placeResults ) {
                      const placeFrom = placeResults.find(
                        (place) => place.place_id === locFrom
                      );
                      const placeTo = placeResults.find(
                        (place) => place.place_id === locTo
                      );
                      
                      if (placeFrom && placeTo) {
                        lrDetails.loc_from_name = placeFrom.place_name;
                        lrDetails.loc_to_name = placeTo.place_name;

                        return res.json(lrDetails);
                      } else {
                      
                        return  res
                          .status(404)
                          .send("Place names not found for loc_from or loc_to");
                      }
                    } else {
                      return res.status(404).send("Place names not found");
                    }
                  }
                );
              } else {
                return   res
                  .status(404)
                  .send("Locations not found in lorry_reciept_master");
              }
            });
          } else {
            return  res.status(404).send("Consignor details not found");
          }
        });
      } else {
        return  res.status(404).send("LR details not found");
      }
    });
  } catch (err) {
    console.error("Error:", err);
    return   res.status(500).send("Server error");
  }
};

const updateBill = (req, res) => {
  console.log(req.body)
  const id = req.params.id;
  const {
    billNo,
    billDate,
    billType,
    customer_id,
    tot_freight,
    tot_hamali,
    service_ch,
    delivery_ch,
    other_ch,
    demurage,
    tds,
    tot_tax,
    tot_amount,
    remarks,
    branchId,
    user_id,
    bill_details,
  } = req.body;

  const sqlUpdateBill = `
    CALL update_bill_master(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @message, @inserted_id, ?);
  `;

  const parameters = [
    billNo,
    billDate,
    billType,
    customer_id,
    tot_freight.toString(), // Ensure all numerical parameters are converted to strings if they are defined as VARCHAR in the stored procedure
    tot_hamali.toString(),
    service_ch.toString(),
    delivery_ch.toString(),
    other_ch.toString(),
    demurage.toString(),
    tds.toString(),
    tot_tax.toString(),
    tot_amount.toString(),
    remarks,
    "", // Placeholder for in_fileloc
    branchId,
    user_id,
    id,
  ];

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res.status(500).json({ error: "Server error" });
    }

    const rollback = (error) => {

      connection.rollback(() => {
        console.error("Transaction error:", error);
        connection.release();
        return res.status(500).json({ error: "Server error" });
      });
    };

    connection.beginTransaction((err) => {
      if (err) return rollback(err);

      connection.query(sqlUpdateBill, parameters, (err, results) => {
        if (err) return rollback(err);

        // Fetch the OUT parameters after executing the stored procedure
        connection.query(
          "SELECT @message AS message, @inserted_id AS inserted_id",
          (err, result) => {
            if (err) return rollback(err);

            const message = result[0].message;
            const inserted_id = result[0].inserted_id;

            const sqlAddBillDetails = `
            CALL add_bill_details(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `;

            const billDetailPromises = bill_details.map((detail) => {
              return new Promise((resolve, reject) => {
                connection.query(
                  sqlAddBillDetails,
                  [
                    inserted_id,
                    detail.table_lr_id,
                    detail.table_lr_freight,
                    detail.table_lr_hamali,
                    detail.table_lr_collection,
                    detail.table_lr_delivery,
                    detail.table_lr_wtcharges,
                    detail.table_lr_otherchar,
                    detail.table_lr_statistical,
                    detail.table_lr_total,
                   detail.table_gstn,
                    detail.table_lr_gstpayby,
                    detail.table_lr_gst_amount,
                  ],
                  (err) => {
                    if (err) {
           
                      console.error(
                        "Error executing add bill details query:",
                        err
                      );
                      reject(err);
                    } else {
                      resolve();
                    }
                  }
                );
              });
            });

            Promise.all(billDetailPromises)
              .then(() => {
                connection.commit((err) => {
                  if (err) return rollback(err);

                  connection.release();
                  return res.json({
                    message: "Bill and details updated successfully",
                    inserted_id,
                  });
                });
              })
              .catch((err) => rollback(err));
          }
        );
      });
    });
  });
};

const getBillForPrint = async (req, res) => {
  const { id } = req.params;
  try {
    const queryBill = "CALL getbillprintbyid(?)";
    const queryBillDetails = "CALL getbilldetailsprintbyid(?)";

    db.query(queryBill, [id], async (err, billResults) => {
      if (err) {
        console.error("Error executing getbillprintbyid query:", err);
        return res.status(500).send("Server error");
      }

      if (billResults.length === 0 || billResults[0].length === 0) {
        return res.status(404).send("Bill not found");
      }

      const bill = billResults[0][0];
      db.query(queryBillDetails, [id], async (err, billDetailsResults) => {
        if (err) {
          console.error("Error executing getbilldetailsprintbyid query:", err);
          return res.status(500).send("Server error");
        }

        if (
          billDetailsResults.length === 0 ||
          billDetailsResults[0].length === 0
        ) {
          return res.status(404).send("Bill details not found");
        }

        const billDetails = billDetailsResults[0];
        bill.details = billDetails;
console.log(billDetails)
        try {
          const templatePath = path.join(__dirname, "../Billpdf/bill.html");

          const templateContent = await fs.readFile(templatePath, "utf8");
          const rupee= `₹`;
          const totalAmountWords = numberToWords
            .toWords(parseFloat(bill["IFNULL(b.tot_amount,0)"]))
            .toUpperCase();

          let renderedHTML = templateContent
            .replace("{{bill.bill_no}}", bill.bill_no || "")
            .replace("{{bill.lrdate}}", bill.bill_date || "")
            .replace("{{bill.customer_name}}", bill.customer_name || "")
            .replace("{{bill.cust.address}}", bill["IFNULL(cust.address,'')"] || "")
            .replace(
              "{{bill.tot_freight}}",
              bill["IFNULL(b.tot_freight,0)"] || ""
            )
            .replace(
              "{{bill.delivery_ch}}",
              bill["IFNULL(b.delivery_ch,0)"] || ""
            )
            .replace(
              "{{bill.tot_hamali}}",
              bill["IFNULL(b.tot_hamali,0)"] || ""
            )
            .replace("{{bill.other_ch}}", bill["IFNULL(b.other_ch,0)"] || "")
            .replace(
              "{{bill.tot_amount}}",
              bill["IFNULL(b.tot_amount,0)"] || ""
            )
            .replace("{{bill.tot_amount_words}}", totalAmountWords || "")
            .replace("{{bill.cust.gstno}}", bill["IFNULL(cust.gstno,'')"] || "")
            .replace("{{bill.b.remarks}}", bill["IFNULL(b.remarks,'')"] || "");

          let itemHeaderHTML = `
            <style>
              tr {
                page-break-inside: avoid;
                    page-break-before: auto;
              }
            </style>
            
          `;

          // Function to insert line breaks after every 7 characters
          function formatConsignote(consignote) {
            if (!consignote) return "";
            const words = consignote.split("");
            let result = "";

            for (let i = 0; i < words.length; i++) {
              result += words[i];
              if ((i + 1) % 8 === 0 && i < words.length - 1) {
                result += "<br>";
              }
            }
            return result;
          }

          const itemSummariesHTML = bill.details
            .map((item) => {
              return `
                 
                <tr style="height:22px;" >
                 <td style="width: 5pt; border-left: 1px solid; border-bottom: 1pt ridge; font-size: 6pt; text-align: center;font-family: Arial, sans-serif;">
                    ${item.lrno}
                  </td>
                  <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge; font-family: Arial, sans-serif;">
                    ${item.lrdate}
                  </td>
                  <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                    ${item.place_name}
                  </td>
                  <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                    ${formatConsignote(item['IFNULL(lm.consignote,"")'])}
                  </td>
                  <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                    ${item.truck_tempo_number ? item.truck_tempo_number : ""}
                  </td>
                  <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 5pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                    ${item.customer_name}
                  </td>
                  <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                    ${item['SUM(IFNULL(tlr.no_of_articles,0))'] ?? 0}
                  </td>
                  <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                   ${item['SUM(IFNULL(tlr.char_wt,0))'] ?? 0}
                  </td>
                  <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                    ${item["IFNULL(bd.freight,0)"] ?? 0}
                  </td>
                  <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                   ${item["IFNULL(bd.hamali,0)"] ?? 0}
                  </td>
                  <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt; text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                   ${item["IFNULL(bd.statistics,0)"] ?? 0}
                  </td>
                  <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                  ${item["IFNULL(bd.total,0)"] ?? 0}
                  </td>
                </tr> 
                 `;
            })
            .join("");
            let finalHTML = `
            ${itemSummariesHTML}
            <tr style="height:22px;" >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>
            <tr style="height:22px;" >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>
            <tr style="height:22px;" >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>
            <tr style="height:22px;" >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>`;
            if(bill.details.length > 5){
              finalHTML=itemSummariesHTML
            }
          renderedHTML = renderedHTML.replace(
            "{{itemSummaries}}",
            finalHTML
          );
          renderedHTML = renderedHTML.replace(
            "{{itemHeaderHTML}}",
            itemHeaderHTML
          );

          const options = {
            format: "A4",
            orientation: "portrait",
            border: {
              top: "10mm",
              right: "10mm",
              bottom: "10mm",
              left: "10mm",
            },
          };

          const finalPath = path.join(__dirname, "../Billpdf/");
          const fileName = `RT_Bill_${bill.bill_no}`.toUpperCase();
          const returnPath = `Billpdf/${fileName}.pdf`;

          pdf
            .create(renderedHTML, options)
            .toFile(
              path.join(finalPath, `${fileName}.pdf`),
              (pdfErr, result) => {
                if (pdfErr) {
                  console.error("Error creating PDF:", pdfErr);
                  return res
                    .status(500)
                    .json({ error: true, message: "Error creating PDF" });
                }

                const fileToSend = result.filename;

                return res.json({ returnPath });
              }
            );
        } catch (readFileError) {
          console.error("Error reading HTML template:", readFileError);
          return res
            .status(500)
            .json({ error: true, message: "Error reading HTML template" });
        }
      });
    });
  } catch (e) {
    console.error("Error in getBillForPrint:", e);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const mailbill = async (req, res) => {
  const { id } = req.params;

  try {
    const queryBill = "CALL getbillprintbyid(?)";
    const queryBillDetails = "CALL getbilldetailsprintbyid(?)";

    db.query(queryBill, [id], async (err, billResults) => {
      if (err) {
        console.error("Error executing getbillprintbyid query:", err);
        return res.status(500).send("Server error");
      }

      if (billResults.length === 0 || billResults[0].length === 0) {
        return res.status(404).send("Bill not found");
      }

      const bill = billResults[0][0];

      db.query(queryBillDetails, [id], async (err, billDetailsResults) => {
        if (err) {
          console.error("Error executing getbilldetailsprintbyid query:", err);
          return res.status(500).send("Server error");
        }

        if (
          billDetailsResults.length === 0 ||
          billDetailsResults[0].length === 0
        ) {
          return res.status(404).send("Bill details not found");
        }

        const billDetails = billDetailsResults[0];
        bill.details = billDetails;

  

        try {
          const templatePath = path.join(
            __dirname,
            "../MailBill/mailBill.html"
          );

          const templateContent = await fs.readFile(templatePath, "utf8");
          const rupee= `₹`;
          const totalAmountWords = numberToWords
            .toWords(parseFloat(bill["IFNULL(b.tot_amount,0)"]))
            .toUpperCase();
          let renderedHTML = templateContent
            .replace("{{bill.bill_no}}", bill.bill_no || "")
            .replace("{{bill.lrdate}}", bill.bill_date || "")
            .replace("{{bill.customer_name}}", bill.customer_name || "")
            .replace("{{bill.cust.address}}", bill["IFNULL(cust.address,'')"] || "")
            .replace(
              "{{bill.tot_freight}}",
              bill["IFNULL(b.tot_freight,0)"] || ""
            )
            .replace(
              "{{bill.delivery_ch}}",
              bill["IFNULL(b.delivery_ch,0)"] || ""
            )
            .replace(
              "{{bill.tot_hamali}}",
              bill["IFNULL(b.tot_hamali,0)"] || ""
            )
            .replace("{{bill.other_ch}}", bill["IFNULL(b.other_ch,0)"] || "")
            .replace(
              "{{bill.tot_amount}}",
              bill["IFNULL(b.tot_amount,0)"] || ""
            )
            .replace("{{bill.tot_amount_words}}", totalAmountWords || "")
            .replace("{{bill.cust.gstno}}", bill["IFNULL(cust.gstno,'')"] || "")
            .replace("{{bill.b.remarks}}", bill["IFNULL(b.remarks,'')"] || "");

          // If you have any item summaries to include in the rendered HTML, you can add them here
          let itemHeaderHTML = `
          <style>
            tr {
              page-break-inside: avoid;
                  page-break-before: auto;
            }
          </style>
          
        `;

          function formatConsignote(consignote) {
            if (!consignote) return "";
            const words = consignote.split("");
            let result = "";

            for (let i = 0; i < words.length; i++) {
              result += words[i];
              if ((i + 1) % 19 === 0 && i < words.length - 1) {
                result += "<br>";
              }
            }
            return result;
          }

          const itemSummariesHTML = bill.details
            .map((item) => {
              return `
                
              <tr style="height:22px; " >
               <td style="width: 5pt; border-left: 1px solid; border-bottom: 1pt ridge; font-size: 6pt; text-align: center;font-family: Arial, sans-serif;">
                  ${item.lrno}
                </td>
                <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge; font-family: Arial, sans-serif;">
                  ${item.lrdate}
                </td>
                <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                  ${item.place_name}
                </td>
                <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                  ${formatConsignote(item['IFNULL(lm.consignote,"")'])}
                </td>
                <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                  ${item.truck_tempo_number ? item.truck_tempo_number : ""}
                </td>
                <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 5pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                  ${item.customer_name}
                </td>
                <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                  ${item['SUM(IFNULL(tlr.no_of_articles,0))'] ?? 0}
                </td>
                <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                 ${item['SUM(IFNULL(tlr.char_wt,0))'] ?? 0}
                </td>
                <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                ${item["IFNULL(bd.freight,0)"] ?? 0}
                </td>
                <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                 ${item["IFNULL(bd.hamali,0)"] ?? 0}
                </td>
                <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt; text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                ${item["IFNULL(bd.statistics,0)"] ?? 0}
                </td>
                <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid; font-size: 6pt;text-align: center; border-bottom: 1pt ridge;font-family: Arial, sans-serif;">
                ${item["IFNULL(bd.total,0)"] ?? 0}
                </td>
              </tr>   
               `;
            })
            .join("");
            let finalHTML = `
            ${itemSummariesHTML}
            <tr style="height:22px;" >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>
            <tr style="height:22px; " >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>
            <tr style="height:22px; " >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>
            <tr style="height:22px; " >
              <td style="width: 5pt; border-left: 1px solid;"></td>
              <td style="width: 3px; border-right: 1pt solid; border-left: 1pt solid; "></td>
              <td style="width: 18pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 40pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 50pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 20pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 38pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 37pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
              <td style="width: 42pt; border-right: 1pt solid; border-left: 1pt solid;"></td>
            </tr>`;
            if(bill.details.length > 5){
              finalHTML=itemSummariesHTML
            }
          renderedHTML = renderedHTML.replace(
            "{{itemSummaries}}",
            finalHTML
          );
          renderedHTML = renderedHTML.replace(
            "{{itemHeaderHTML}}",
            itemHeaderHTML
          );

          const options = {
            format: "A4",
            orientation: "portrait",
            border: {
              top: "10mm",
              right: "10mm",
              bottom: "10mm",
              left: "10mm",
            },
          };

          const finalPath = path.join(__dirname, "../Billpdf/");
          const fileName = `RT_Bill_${bill.bill_no}`.toUpperCase();
          const returnPath = `Billpdf/${fileName}.pdf`;

          pdf
            .create(renderedHTML, options)
            .toFile(
              path.join(finalPath, `${fileName}.pdf`),
              (pdfErr, result) => {
                if (pdfErr) {
                  console.error("Error creating PDF:", pdfErr);
                  return res
                    .status(500)
                    .json({ error: true, message: "Error creating PDF" });
                }

                const fileToSend = result.filename;

                return res.json({ returnPath });
              }
            );
        } catch (readFileError) {
          console.error("Error reading HTML template:", readFileError);
          return res
            .status(500)
            .json({ error: true, message: "Error reading HTML template" });
        }
      });
    });
  } catch (e) {
    console.error("Error in getBillForPrint:", e);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  host: "rajeshtransportservices.com",
  port: 587,
  secure: false,
  auth: {
    user: "support@rajeshtransportservices.com",
    pass: "support@4321",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const sendMail = (req, res) => {
  const { pdfpathfile, emailForm: { toEmail, message } } = req.body;
 console.log(req.body)
 
  if (!toEmail.trim()) {
    return res.status(400).send('Please enter an email address');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(toEmail)) {
    return res.status(400).send('Invalid email address format');
  }

  const querySettings = 'SELECT emailid FROM settings WHERE isbcc = 1 LIMIT 1';

  db.query(querySettings, (err, settingsResults) => {
    if (err) {
      console.error('Error executing settings query:', err);
      return res.status(500).send('Server error');
    }

    const bccEmail = settingsResults.length > 0 ? settingsResults[0].emailid : null;

    const fileName = path.basename(pdfpathfile);
    const mailOptions = {
      from: '"Rajesh Transport" <support@rajeshtransportservices.com>',
      to: toEmail,
      subject: 'Regarding Bill',
      text: message,
      attachments: [
        {
          filename: fileName,
          path: `./${pdfpathfile}`
        }
      ]
    };

    if (bccEmail) {
      mailOptions.bcc = bccEmail;
    }

    const queryCustomer = 'CALL getaddressbook(?)';
    const queryInsert = 'CALL insertaddressbook(?)';

    db.query(queryCustomer, [toEmail], (err, customerResults) => {
      if (err) {
        console.error('Error executing customer query:', err);
        return res.status(500).send('Server error');
      }

      if (customerResults[0].length === 0) {
        db.query(queryInsert, [toEmail], (err) => {
          if (err) {
            console.error('Error executing insert query:', err);
            return res.status(500).send('Server error');
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              return res.status(500).send('Error sending email: ' + error.message);
            }

            return res.status(200).send('Email sent successfully');
          });
        });
      } else {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email: ' + error.message);
          }

          return res.status(200).send('Email sent successfully');
        });
      }
    });
  });
};


const getBillForExcel = async (req, res) => {
  const { id } = req.params;

  try {
    const queryBill = "CALL getbillprintbyid(?)";
    const queryBillDetails = "CALL getbilldetailsprintbyid(?)";

    db.query(queryBill, [id], async (err, billResults) => {
      if (err) {
        console.error("Error executing getbillprintbyid query:", err);
        return res.status(500).send("Server error");
      }

      if (billResults.length === 0 || billResults[0].length === 0) {
        return res.status(404).send("Bill not found");
      }

      const bill = billResults[0][0];

      db.query(queryBillDetails, [id], (err, billDetailsResults) => {
        if (err) {
          console.error("Error executing getbilldetailsprintbyid query:", err);
          return res.status(500).send("Server error");
        }

        if (billDetailsResults.length === 0 || billDetailsResults[0].length === 0) {
          return res.status(404).send("Bill details not found");
        }

        const billDetails = billDetailsResults[0];
        bill.details = billDetails;

        // Format data
        const formattedBill = {
          id: bill.id,
          bill_no: bill.bill_no,
          total_freight: bill["IFNULL(b.tot_freight,0)"],
          delivery_charge: bill["IFNULL(b.delivery_ch,0)"],
          hamali: bill["IFNULL(b.tot_hamali,0)"],
          tax: bill["IFNULL(b.tot_tax,0)"],
          service_charge: bill["IFNULL(b.service_ch,0)"],
          other_charges: bill["IFNULL(b.other_ch,0)"],
          tds: bill["IFNULL(b.tds,0)"],
          demurage: bill["IFNULL(b.demurage,0)"],
          total_amount: bill["IFNULL(b.tot_amount,0)"],
          remarks: bill["IFNULL(b.remarks,'')"],
          bill_date: bill.bill_date,
          customer_name: bill.customer_name,
          customer_address: bill["IFNULL(cust.address,'')"],
          customer_phone: bill["IFNULL(cust.telephoneno,'')"],
          customer_gst_no: bill["IFNULL(cust.gstno,'')"],
          vendor_code: bill["IFNULL(cust.vendor_code,'')"],
          cc_charge: bill.cc_charge,
          insurance: bill.insurance,
          docket: bill.docket,
          total_amount_words: numberToWords.toWords(parseFloat(bill["IFNULL(b.tot_amount,0)"])).toUpperCase()
        };

        const formattedDetails = billDetails.map(detail => ({
          id: detail.id,
          bill_id: detail.bill_id,
          lr_id: detail.lr_id,
          freight: detail["IFNULL(bd.freight,0)"],
          hamali: detail["IFNULL(bd.hamali,0)"],
          collection: detail["IFNULL(bd.collection,0)"],
          door_delivery: detail["IFNULL(bd.door_delivery,0)"],
          weight_charges: detail["IFNULL(bd.wt_charges,0)"],
          other_charges: detail["IFNULL(bd.other_ch,0)"],
          statistics: detail["IFNULL(bd.statistics,0)"],
          total: detail["IFNULL(bd.total,0)"],
          gstn: detail.gstn,
          gst_pay_by: detail.gstpayby,
          place_name: detail.place_name,
          lr_no: detail.lrno,
          lr_date: detail.lrdate,
          no_of_articles: detail['SUM(IFNULL(tlr.no_of_articles,0))'],
          char_weight: detail['SUM(IFNULL(tlr.char_wt,0))'],
          gst_amount: detail["IFNULL(bd.gst_amount,0)"],
          consignote: detail['IFNULL(lm.consignote,"")'],
          customer_name: detail.customer_name,
          truck_tempo_number: detail.truck_tempo_number
        }));

        // Send formatted data as JSON response
        const responseData = {
          bill: formattedBill,
          details: formattedDetails
        };

        return res.json(responseData);
      });
    });
  } catch (e) {
    console.error("Error in getBillForExcel:", e);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};






module.exports = {
  getbillsbybranch,
  deletebills,
  addbillmaster,
  getbillbyid,
  searchBills,
  getLorryMasterListForBill,
  getlrdetailsbyid,
  updateBill,
  getBillForPrint,
  mailbill,
  sendMail,
  getLorryMasterListForBillUpdate,
  getBillForExcel
};
