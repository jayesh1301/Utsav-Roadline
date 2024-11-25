const db = require("../config/dbConfig");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const path = require("path");
const getallloadingshets = (req, res) => {
  const branch = req.params.branch;
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = page * pageSize;

  const query = "CALL getallloadingshets(?)";

  try {
    db.query(query, branch, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      const formattedResults = results[0].map((dc) => {
        const dc_no_key =
          'CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id=dm.branch),"-",dm.dc_no)';
        return {
          id: dc.id,
          dc_no: dc[dc_no_key],
          vehicle_number: dc.vehicle_number,
          bal_amt: dc.total,
          hire: dc.hire,
          from_loc: dc.from_loc,
          to_loc: dc.to_loc,
          dc_date: dc.dc_date,
        };
      });
      let dc = formattedResults;

      const total = dc.length;
      dc = dc.map((dc) => ({
        ...dc,
        dc_no: dc.dc_no ? dc.dc_no.toUpperCase() : null,
        vehicle_number: dc.vehicle_number
          ? dc.vehicle_number.toUpperCase()
          : null,
        bal_amt: dc.bal_amt ? dc.bal_amt.toUpperCase() : null,
        hire: dc.hire ? dc.hire.toUpperCase() : null,
        from_loc: dc.from_loc ? dc.from_loc.toUpperCase() : null,
        to_loc: dc.to_loc ? dc.to_loc.toUpperCase() : null,
        dc_date: dc.dc_date ? dc.dc_date.toUpperCase() : null,
      }));
      dc.sort((a, b) => b.id - a.id);
      const paginatedPlaces = dc.slice(offset, offset + pageSize);

      return res.json({
        dc: paginatedPlaces,
        total: total,
      });
    });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
const getallItssearch = (req, res) => {
  const branch = req.params.branch;
  const { in_memo_no, in_vehicle_id, start_index, counts } = req.query;

  const query = "CALL lts_search(?, ?, ?, ?, ?)";

  try {
    db.query(
      query,
      [
        in_memo_no,
        in_vehicle_id,
        branch,
        parseInt(start_index),
        parseInt(counts),
      ],
      (err, results) => {
        if (err) {
          return res.status(500).send("Server error");
        }
        if (results.length === 0 || results[0].length === 0) {
          return res.json([]);
        }

        const formattedResults = results[0].map((dc) => {
          const dc_no_key =
            'CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id=dm.branch),"-",dm.dc_no)';
          return {
            id: dc.id,
            dc_no: dc[dc_no_key],
            dc_date: dc.dc_date,
            vehicle_number: dc.vehicle_number,
            from_loc: dc.from_loc,
            to_loc: dc.to_loc,
            hire: dc.hire,
            bal_amt: dc.total,
            "@tot_counts": dc["@tot_counts"],
            "@totc": dc["@totc"],
          };
        });
        return res.json(formattedResults);
      }
    );
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
const getlrforloadingsheetedit = async (req, res) => {
  const id = req.params.id;
  const branch = req.params.branch;

  // Query to get lr_id values from dc_tarsection
  const lrIdQuery = "SELECT lr_id FROM dc_transactions WHERE dc_master_id = ?";

  try {
    // First, get the lr_id values for the given dc_master_id
    db.query(lrIdQuery, [id], async (err, lrResults) => {
      // Added async here
      if (err) {
        console.error("Error executing lrIdQuery:", err);
        res.status(500).send("Server error");
        return;
      }

      if (lrResults.length === 0) {
        res.status(404).send("No lr_id found for the given id");
        return;
      }

      // Extract lr_id values
      const lrIds = lrResults.map((row) => row.lr_id);

      let lrdata;
      if (lrIds.length > 0) {
        // Check if lrIds has elements
        lrdata = await fetchAndFormatLrNos(lrIds);
      }

      const query = "CALL lorrymasterlistfordc(?)";

      // Execute the query for lorrymasterlistfordc
      db.query(query, [branch], (err, results) => {
        if (err) {
          console.error("Error executing lorrymasterlistfordc query:", err);
          return res.status(500).send("Server error");
        }
        const formattedResults = results[0].map((dc) => {
          const dc_no_key =
            'CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id=lm.branch),"-",lm.lr_no)';
          return {
            id: dc.id,
            lr_no: dc[dc_no_key],
          };
        });
        lrdata.forEach((item) => {
          formattedResults.push({
            id: item.id,
            lr_no: item.lr_no,
          });
        });
        return res.json(formattedResults);
      });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};

const fetchAndFormatLrNos = (lrIds) => {
  return new Promise((resolve, reject) => {
    const lrNoQuery =
      'SELECT lm.id, CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id = lm.branch), "-", lm.lr_no) AS lr_no FROM lorry_reciept_master lm WHERE lm.id IN (?)';

    db.query(lrNoQuery, [lrIds], (err, lrNoResults) => {
      if (err) {
        console.error("Error executing lrNoQuery:", err);
        reject("Server error");
        return;
      }

      resolve(lrNoResults);
    });
  });
};
const getlrforloadingsheet = (req, res) => {
  const branch = req.params.branch;
  const query = "CALL lorrymasterlistfordc(?)";

  try {
    db.query(query, branch, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      // Format the results to include the desired concatenation
      const formattedResults = results[0].map((dc) => {
        const dc_no_key =
          'CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id=lm.branch),"-",lm.lr_no)';
        return {
          id: dc.id,
          lr_no: dc[dc_no_key],
        };
      });

      return res.json(formattedResults);
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};
const getloadingsheetFreightbyid = (req, res) => {
  const id = req.params.id;

  const query = `
        CALL get_loadingsheet_freight_by_id(?)
    `;

  try {
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      if (results[0].length === 0) {
        res.status(404).send("No record found");
        return;
      }

      // Extract the results from the stored procedure
      const masterData = results[0][0];
      const transectEntries = results[1];

      // Attach the transect results to the master data
      masterData.transectEntries = transectEntries;

      // Send the combined result
      return res.json(masterData);
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};

const getloadingsheetbyid = (req, res) => {
  const id = req.params.id;
  const query = "CALL getloadingsheetbyid(?)";

  try {
    db.query(query, id, (err, results) => {
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
const getlrdetailsforloadsheet = (req, res) => {
  console.log(req.params)
  const selectedIds = req.params.selectedIds
    .split(",")
    .map((id) => parseInt(id.trim()))
    .join(",");
    console.log(selectedIds)
  const query = "CALL getlrdetailsforloadsheet(?)";

  try {
    db.query(query, [selectedIds], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      return res.json(results[0]);
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};

const insertIntoLsPayDetails = (
  connection,
  insertedId,
  branchwisepaymentrows,
  callback
) => {
  // Check if branchwisepaymentrows is empty
  if (branchwisepaymentrows.length === 0) {
    // If empty, return early or handle as needed
    return callback(null, { message: "No payment details to insert." });
  }

  // Prepare values for insertion
  const payDetailsValues = branchwisepaymentrows.map((row) => [
    insertedId,
    row.lrid,
    row.branchid,
    row.amount,
  ]);

  // Query to insert into ls_pay_details
  const insertPayDetailsQuery = `
        INSERT INTO ls_pay_details (ls_master_id, lr_id, pay_branch_id, pay_amount)
        VALUES ?
    `;

  // Execute the insertion query
  connection.query(
    insertPayDetailsQuery,
    [payDetailsValues],
    (err, results) => {
      if (err) {
        return callback(err);
      }

      // Successful insertion
      callback(null, results);
    }
  );
};

const add_dc_master = (req, res) => {
  console.log(req.body)
  const {
    challanNo,
    date,
    truckNo,
    driverName,
    from,
    to,
    freightDetails,
    payableAt,
    totalPackages,
    remark,
    in_branch,
    in_user_id,
    in_lrtoshowamount,
    branchwisepaymentrows,
    branchId
  } = req.body;

  const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  const formattedDate = date ? date : currentTime;
  const in_dc_no = challanNo ? challanNo : null;
  const in_dc_date = formattedDate;
  const in_vehicle_id = truckNo;
  const in_driver_id = driverName;
  const in_from_loc = from;
  const in_to_loc = to;
  const in_hire = freightDetails.formState.totHireRs;
  const in_extra_wt_ch = freightDetails.formState.extraWtChar;
  const in_hamali = freightDetails.formState.hamali;
  const in_commission = freightDetails.formState.commission;
  const in_adv_amt = freightDetails.formState.advAmt;
  const in_diesel_ch = freightDetails.formState.dieselChar;
  const in_total = freightDetails.formState.total;
  const in_total_wt = freightDetails.formState.totalWeight;
  const in_payble_at = payableAt;
  const in_total_packages = freightDetails.formState.totalPackages;
  const in_remarks = remark;
  const in_fileloc = "NULL";
  const in_driver_charges = freightDetails.formState.driverChar;
  const in_total_pay_amount = "NULL"; // Adjust this value as needed

  const lrIds = freightDetails.rows.map((row) => row.id);
  const in_dc_data = lrIds.map((lr_id) => `(${lr_id},0,@@)`).join(", ");

  const in_lr_data = `(${lrIds.join(", ")})`;
  const in_lrtoshowamountStr = in_lrtoshowamount
    ? `(${in_lrtoshowamount.join(", ")})`
    : "()";

  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }

    const callProcedureQuery = `
            CALL add_dc_master(
                 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@message,@inserted_id, ?, ?, ?
            )
        `;

    connection.query(
      callProcedureQuery,
      [
        in_dc_no,
        in_dc_date,
        in_vehicle_id,
        in_driver_id,
        in_from_loc,
        in_to_loc,
        in_hire,
        in_extra_wt_ch,
        in_hamali,
        in_commission,
        in_adv_amt,
        in_diesel_ch,
        null,
        in_total,
        in_total_wt,
        "0",
        null,
        "Cash",
        "NULL",
        "NULL",
        "NULL",
        in_payble_at,
        in_total_packages,
        in_remarks,
        in_dc_data,
        in_lr_data,
        branchId,
        in_fileloc,
        in_user_id,
        in_lrtoshowamountStr,
        in_total_pay_amount,
        in_driver_charges,
      ],
      (err, results) => {
        if (err) {
          console.log(err);
          connection.release();
          return res.status(500).send("Server error");
        }

        const [response] = results[0];
        const message = response.message;
        const [{ inserted_id }] = results[1];

        if (message == "Already Exist") {
          connection.release();
          return res.status(400).send(message);
        }

        // Call the function to insert into ls_pay_details
        insertIntoLsPayDetails(
          connection,
          inserted_id,
          branchwisepaymentrows,
          (err) => {
            if (err) {
              connection.rollback(() => {
                console.log(err);
                connection.release();
                return res
                  .status(500)
                  .send("Error inserting into ls_pay_details");
              });
            }

            // Commit the transaction if everything is successful
            connection.commit((err) => {
              if (err) {
                console.log(err);
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).send("Commit error");
                });
              }

              connection.release();

              return res.json({ message, inserted_id: inserted_id });
            });
          }
        );
      }
    );
  });
};

const getlrdetailsbybranchwise = (req, res) => {
  const id = req.params.id;
  const query = "CALL getloadingsheetbybranchwise(?)";

  try {
    db.query(query, id, (err, results) => {
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

const Updatedcmaster = (req, res) => {
  const id = req.params.id;

  const {
    challanNo,
    date,
    truckNo,
    driverName,
    from,
    to,
    freightDetails,
    payableAt,
    totalPackages,
    remark,
    in_branch,
    in_user_id,
    in_lrtoshowamount,
    branchwisepaymentrows,
    branchId
  } = req.body;

  const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  const formattedDate = date ? `${date} ${currentTime}` : currentTime;

  const in_dc_no = challanNo ? challanNo : null;
  const in_dc_date = formattedDate;
  const in_vehicle_id = truckNo;
  const in_driver_id = driverName;
  const in_from_loc = from;
  const in_to_loc = to;
  const in_hire = freightDetails.formState.totHireRs;
  const in_extra_wt_ch = freightDetails.formState.extraWtChar;
  const in_hamali = freightDetails.formState.hamali;
  const in_commission = freightDetails.formState.commission;
  const in_adv_amt = freightDetails.formState.advAmt;
  const in_diesel_ch = freightDetails.formState.dieselChar;
  const in_total = freightDetails.formState.total;
  const in_total_wt = freightDetails.formState.totalWeight;
  const in_payble_at = payableAt;
  const in_total_packages = freightDetails.formState.totalPackages;
  const in_remarks = remark;
  const in_fileloc = "NULL";
  const in_driver_charges = freightDetails.formState.driverChar;
  const in_total_pay_amount = "NULL"; // Adjust this value as needed

  const lrIds = freightDetails.rows.map((row) => row.id);
  const in_dc_data = lrIds.map((lr_id) => `(${lr_id},0,@@)`).join(", ");
  const in_lr_data = `(${lrIds.join(", ")})`;
  const in_lrtoshowamountStr = in_lrtoshowamount
    ? `(${in_lrtoshowamount.join(", ")})`
    : "()";

  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.log(err);
        connection.release();
        return res.status(500).send("Server error");
      }

      const updateDcMasterQuery = `
                CALL update_dc_master( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@message,@inserted_id, ?, ?, ?
            )
            `;

      connection.query(
        updateDcMasterQuery,
        [
          id,

          in_dc_date,
          in_vehicle_id,
          in_driver_id,
          in_from_loc,
          in_to_loc,
          in_hire,
          in_extra_wt_ch,
          in_hamali,
          in_commission,
          in_adv_amt,
          in_diesel_ch,
          null,
          in_total,
          in_total_wt,
          "0",
          null,
          "Cash",
          "NULL",
          "NULL",
          "NULL",
          in_payble_at,
          in_total_packages,
          in_remarks,
          in_dc_data,
          in_lr_data,
          branchId,
          in_fileloc,
          in_user_id,
          in_lrtoshowamountStr,
          in_total_pay_amount,
          in_driver_charges,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).send("Server error");
            });
          }

          insertIntoLsPayDetails(
            connection,
            id,
            branchwisepaymentrows,
            (err, results) => {
              if (err) {
                console.log(err);
                return connection.rollback(() => {
                  connection.release();
                  return res
                    .status(500)
                    .send("Error inserting into ls_pay_details");
                });
              }

              connection.commit((err) => {
                if (err) {
                  console.log(err);
                  return connection.rollback(() => {
                    connection.release();
                    return res.status(500).send("Commit error");
                  });
                }

                connection.release();
                return res.json({
                  message: `LTS (${challanNo}) Updated Successfully`,
                  inserted_id: challanNo,
                });
              });
            }
          );
        }
      );
    });
  });
};

const getLoadingTripByIdPdfedit = async (req, res) => {
  try {
    const { id } = req.params;

    // Query to fetch DC details
    const query1 = "CALL getloadingsheetbyidforprint(?)";

    // Execute query1 to fetch DC details
    db.query(query1, id, async (err, results1) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server error");
      }

      if (results1[0].length === 0) {
        return res.status(404).send("DC not found");
      }

      const Data = results1[0];

      // Query to fetch LR IDs associated with the DC
      const query4 = `
                SELECT lr_id FROM dc_transactions WHERE dc_master_id = ?;
            `;

      // Execute query4 to fetch LR IDs
      db.query(query4, id, async (err, results4) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server error");
        }

        const lrIds = results4.map((item) => item.lr_id);

        if (lrIds.length === 0) {
          const finalResult = {
            Data: Data,
            lrData: [],
          };
          return sendPdf(finalResult, res); // Assuming sendPdf function is used for PDF generation
        }

        // Fetch LR details for each LR ID
        const lrData = [];
        for (const lrId of lrIds) {
          const query2 = `
                        SELECT 
                            lm.lr_no,
                            lm.pay_type,
                            CONCAT(branch.branch_abbreviation, '-', lm.lr_no) AS lrnumber,
                            branch.branch_abbreviation,
                            DATE_FORMAT(lm.lr_date, '%d-%m-%Y') AS lr_date,
                            cust1.customer_name AS consigner,
                            cust2.customer_name AS consignee,
                            fplace.place_name AS from_loc,
                            tplace.place_name AS to_loc,
                            SUM(lt.no_of_articles) AS noofarticles,
                            SUM(lt.char_wt) AS weight,
                            lm.total,
                            lm.id 
                        FROM 
                            lorry_reciept_master lm 
                        INNER JOIN 
                            transactions_lr lt ON lm.id = lt.lr_master_id 
                        LEFT JOIN 
                            customer cust1 ON cust1.customer_id = lm.consigner 
                        LEFT JOIN 
                            customer cust2 ON cust2.customer_id = lm.consignee 
                        LEFT JOIN 
                            place fplace ON fplace.place_id = lm.loc_from 
                        LEFT JOIN 
                            place tplace ON tplace.place_id = lm.loc_to
                        LEFT JOIN 
                            branch ON branch.branch_id = lm.branch 
                        WHERE 
                            lm.id = ?
                        GROUP BY 
                            lm.id;
                    `;

          // Execute query2 to fetch LR details
          db.query(query2, lrId, (err, lrResult) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Server error");
            }

            if (lrResult.length > 0) {
              lrData.push(lrResult[0]);
            }

            // If all LR details fetched, proceed to fetch payment details
            if (lrData.length === lrIds.length) {
              // Query to fetch payment details
              const query3 = `
                                SELECT 
                                    lpd.*, 
                                    b1.branch_name,
                                    CONCAT(b.branch_abbreviation, '-', lm.lr_no) AS lrnumber,
                                    DATE_FORMAT(lm.lr_date, '%d-%m-%Y') AS lr_date
                                FROM 
                                    ls_pay_details lpd
                                JOIN 
                                    lorry_reciept_master lm ON lpd.lr_id = lm.id
                                JOIN 
                                    branch b ON lm.branch = b.branch_id
                                JOIN 
                                    branch b1 ON lpd.pay_branch_id = b1.branch_id
                                WHERE 
                                    lpd.ls_master_id = ?;
                            `;

              // Execute query3 to fetch payment details
              db.query(query3, id, async (err, results3) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send("Server error");
                }

                const finalResult = {
                  Data: Data,
                  lrData: lrData,
                  paymentData: results3,
                };

                // Calculate total number of articles and total sum
                const totalNoOfArticles = lrData.reduce(
                  (sum, item) => sum + item.noofarticles,
                  0
                );
                const totalsum = lrData.reduce(
                  (sum, item) => sum + parseInt(item.total),
                  0
                );

                try {
                  // Read HTML template for PDF generation
                  const templatePath = path.join(
                    __dirname,
                    "../LoadingTrippdf/loadingtrip.html"
                  );
                  const templateContent = await fs.readFile(
                    templatePath,
                    "utf8"
                  );

                  // Replace placeholders in HTML template with fetched data
                  let renderedHTML = templateContent
                    .replace("{{totalNoOfArticles}}", totalNoOfArticles)
                    .replace("{{totalsum}}", totalsum)
                    .replace("{{Data.lts_no}}", Data.lts_no)
                    .replace("{{Data.vehicleno}}", Data.vehicleno)
                    .replace("{{Data.fromplace}}", Data.fromplace)
                    .replace("{{Data.toplace}}", Data.toplace)
                    .replace("{{Data.dc_date}}", Data.dc_date)
                    .replace(
                      "{{Data.vehical_owner_name}}",
                      Data.vehical_owner_name
                    )
                    .replace("{{Data.address}}", Data.address)
                    .replace("{{Data.telephoneno}}", Data.telephoneno)
                    .replace("{{Data.driver_name}}", Data.driver_name)
                    .replace("{{Data.licenseno}}", Data.licenseno || "")
                    .replace("{{Data.mobileno}}", Data.mobileno || "")
                    .replace("{{Data.hire}}", Data.hire || "")
                    .replace("{{Data.hamali}}", Data.hamali || "")
                    .replace("{{Data.commission}}", Data.commission || "")
                    .replace("{{Data.extra_wt_ch}}", Data.extra_wt_ch || "")
                    .replace("{{Data.diesel_ch}}", Data.diesel_ch || "")
                    .replace("{{Data.adv_amt}}", Data.adv_amt || "")
                    .replace(
                      "{{Data.driver_charges}}",
                      Data.driver_charges || ""
                    )
                    .replace("{{Data.total}}", Data.total);

                  // Prepare HTML for LR details
                  let itemSummariesHTML = "";
                  lrData.forEach((item) => {
                    const breakConsigner = (text, targetLength) => {
                      const currentLength = text.length;
                      if (currentLength >= targetLength) {
                        return text;
                      } else {
                        const spacesToAdd = targetLength - currentLength;
                        const spaces = " ".repeat(spacesToAdd);
                        return text + spaces;
                      }
                    };

                    let consignerBreak = breakConsigner(item.consigner, 41);

                    itemSummariesHTML += `
                                            <tr style="height:12pt">
                                                <td style="width:100pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <p class="s4">${item.lrnumber}</p>
                                                </td>
                                                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <p class="s4">${item.to_loc}</p>
                                                </td>
                                                <td style="width:100pt; max-width:100pt; border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <span class="s7">${consignerBreak}</span>
                                                </td>
                                                <td style="width:118pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <p class="s4">${item.consignee}</p>
                                                </td>
                                                <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <p class="s4">${item.noofarticles}</p>
                                                </td>
                                                <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <p class="s4">${item.pay_type}</p>
                                                </td>
                                                <td style="width:49pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                    <p class="s4">${item.total}</p>
                                                </td>
                                            </tr>
                                        `;
                  });

                  // Prepare HTML for payment details
                  let itemSummariesHTML2 = "";
                  results3.forEach((item) => {
                    itemSummariesHTML2 += `
                                            <tr style="height:18pt">
                                                <td style="width:157pt;border-style:solid;border-width:1pt">
                                                    <p class="s4">${item.lrnumber}</p>
                                                </td>
                                                <td style="width:118pt;border-style:solid;border-width:1pt">
                                                    <p class="s4">${item.branch_name}</p>
                                                </td>
                                                <td style="width:118pt;border-style:solid;border-width:1pt">
                                                    <p class="s4">${item.pay_amount}</p>
                                                </td>
                                                
                                            </tr>
                                        `;
                  });

                  // Placeholder HTML for empty row
                  const itemSummariesHTML1 = `
                                        <tr style="height:12pt">
                                            <td style="width:100pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <p class="s4"></p>
                                            </td>
                                            <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <p class="s4">&nbsp;</p>
                                            </td>
                                            <td style="width:100pt; max-width:100pt; border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <span class="s7">&nbsp;</span>
                                            </td>
                                            <td style="width:118pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <p class="s4">&nbsp;</p>
                                            </td>
                                            <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <p class="s4">&nbsp;</p>
                                            </td>
                                            <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <p class="s4">&nbsp;</p>
                                            </td>
                                            <td style="width:49pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                                                <p class="s4">&nbsp;</p>
                                            </td>
                                        </tr>
                                    `;

                  // Replace placeholders in HTML template with item summaries
                  renderedHTML = renderedHTML
                    .replace("{{itemSummaries}}", itemSummariesHTML)
                    .replace("{{itemSummariesHTML1}}", itemSummariesHTML1)
                    .replace("{{itemSummariesHTML2}}", itemSummariesHTML2);

                  // PDF generation options
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

                  // Final path and file name for PDF
                  const finalPath = path.join(__dirname, "../LoadingTrippdf/");
                  const fileName = Data.lts_no;
                  const returnpath = `LoadingTrippdf/${fileName}.pdf`;

                  // Generate PDF using rendered HTML
                  pdf
                    .create(renderedHTML, options)
                    .toFile(
                      path.join(finalPath, `${fileName}.pdf`),
                      (pdfErr, result) => {
                        if (pdfErr) {
                          console.log(pdfErr);
                          return res
                            .status(500)
                            .json({
                              error: true,
                              message: "Error creating PDF",
                            });
                        }

                        const fileToSend = result.filename;
                        return res.json({ returnpath });
                      }
                    );
                } catch (readFileErr) {
                  console.log(readFileErr);
                  return res
                    .status(500)
                    .json({
                      error: true,
                      message: "Error reading HTML template",
                    });
                }
              });
            }
          });
        }
      });
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getLoadingTripByIdPdfmail = async (req, res) => {
  try {
    const { id } = req.params;

    const query1 = `  SELECT 
    dc_master.*, 
    DATE_FORMAT(dc_master.dc_date, '%d-%m-%Y') AS dc_date,
    vehicle.vehicleno, 
    vehicle_owner_details.vehical_owner_name,
    vehicle_owner_details.telephoneno,
    vehicle_owner_details.address,
    place.place_name AS fromplace,
    place2.place_name AS toplace,
    driver.driver_name,
    CONCAT(branch.branch_abbreviation, '-', dc_master.dc_no) AS lts_no,
    driver.licenseno,
    driver.mobileno,
     GROUP_CONCAT(dc_transactions.lr_id) AS lr_ids
FROM 
    dc_master 
JOIN 
    vehicle 
ON 
    dc_master.vehicle_id = vehicle.vehicle_id 
JOIN 
    vehicle_owner_details 
ON 
    vehicle.vo_id = vehicle_owner_details.vod_id
JOIN 
    place 
ON 
    dc_master.from_loc = place.place_id
JOIN 
    place AS place2
ON 
    dc_master.to_loc = place2.place_id 
JOIN 
    driver 
ON 
    dc_master.driver_id = driver.driver_id 
JOIN 
    branch 
ON 
    dc_master.branch = branch.branch_id  
JOIN 
    dc_transactions 
ON 
    dc_master.id = dc_transactions.dc_master_id  
WHERE 
    dc_master.id = ?
GROUP BY
    dc_master.id;
  `;
    db.query(query1, id, async (err, results1) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server error");
      }
      const query4 = ` 
SELECT lr_id FROM dc_transactions WHERE dc_master_id=?;
  `;
      db.query(query4, id, async (err, results4) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server error");
        }
        const Data = results1[0];

        const ids = results4.map((item) => item.lr_id);

        let formattedSelectedIds = ids.join(",");

        const query2 = ` SELECT 
    lm.lr_no,
    lm.pay_type,
    CONCAT(branch.branch_abbreviation, '-', lm.lr_no) AS lrnumber,
    branch.branch_abbreviation,
    DATE_FORMAT(lm.lr_date, '%d-%m-%Y') AS lr_date,
    cust1.customer_name AS consigner,
    cust2.customer_name AS consignee,
    fplace.place_name AS from_loc,
    tplace.place_name AS to_loc,
    SUM(lt.no_of_articles) AS noofarticles,
    SUM(lt.char_wt) AS weight,
    lm.total,
    lm.id 
  FROM 
    lorry_reciept_master lm 
  INNER JOIN 
    transactions_lr lt 
  ON 
    lm.id = lt.lr_master_id 
  LEFT JOIN 
    customer cust1 
  ON 
    cust1.customer_id = lm.consigner 
  LEFT JOIN 
    customer cust2 
  ON 
    cust2.customer_id = lm.consignee 
  LEFT JOIN 
    place fplace 
  ON 
    fplace.place_id = lm.loc_from 
  LEFT JOIN 
    place tplace 
  ON 
    tplace.place_id = lm.loc_to
   LEFT JOIN 
    branch  
  ON 
    branch.branch_id = lm.branch 
  WHERE 
    lm.id IN (${formattedSelectedIds}) 
  GROUP BY 
    lm.id;
`;
        db.query(query2, async (err, results2) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Server error");
          }
          const query3 = "CALL getloadingsheetbybranchwise(?)";
          db.query(query3, id, async (err, results3) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Server error");
            }

            const finalResult = {
              Data: Data,
              lrData: results2,
            };
            const totalNoOfArticles = results2.reduce(
              (sum, item) => sum + item.noofarticles,
              0
            );
            const totalsum = results2.reduce(
              (sum, item) => sum + parseInt(item.total),
              0
            );
            const totalbranchwise = results3[0].reduce(
              (sum, item) => sum + parseInt(item.pay_amount),
              0
            );
            const totaltopay = results2
              .filter((item) => item.pay_type === "To Pay")
              .reduce((sum, item) => sum + parseInt(item.total), 0);

            const totalvasuli =
              totalbranchwise === 0 ? totaltopay : totaltopay - totalbranchwise;

            try {
              const templatePath = path.join(
                __dirname,
                "../LoadingTrippdf/loadingtrip.html"
              );
              const templateContent = await fs.readFile(templatePath, "utf8");
              const mobileno = Data.mobileno == null ? "" : Data.mobileno;
              const licenseno = Data.licenseno == null ? "" : Data.licenseno;
              const totaltopaysum = totaltopay == 0 ? 0.0 : totaltopay;
              const rupee= `₹`;
              const totalbranchwisesum =
                totalbranchwise == 0 ? 0.0 : totalbranchwise;
              let renderedHTML = templateContent
                .replace("{{totalvasuli}}", totalvasuli)
                .replace("{{totalbranchwisesum}}", totalbranchwisesum)
                .replace("{{totaltopaysum}}", totaltopaysum)
                .replace("{{totalNoOfArticles}}", totalNoOfArticles)
                .replace("{{totalsum}}", totalsum)
                .replace("{{Data.lts_no}}", Data.lts_no)
                .replace("{{Data.vehicleno}}", Data.vehicleno)
                .replace("{{Data.fromplace}}", Data.fromplace)
                .replace("{{Data.toplace}}", Data.toplace)
                .replace("{{Data.dc_date}}", Data.dc_date)
                .replace("{{Data.vehical_owner_name}}", Data.vehical_owner_name)
                .replace("{{Data.address}}", Data.address)
                .replace("{{Data.telephoneno}}", Data.telephoneno)
                .replace("{{Data.driver_name}}", Data.driver_name)
                .replace("{{licenseno}}", licenseno)
                .replace("{{mobileno}}", mobileno)
                .replace("{{Data.hire}}", Data.hire)
                .replace("{{Data.hamali}}", Data.hamali)
                .replace("{{Data.commission}}", Data.commission)
                .replace("{{Data.extra_wt_ch}}", Data.extra_wt_ch)
                .replace("{{Data.diesel_ch}}", Data.diesel_ch)
                .replace("{{Data.adv_amt}}", Data.adv_amt)
                .replace("{{Data.driver_charges}}", Data.driver_charges)
                .replace("{{Data.total}}", Data.total)
                .replace("{{Data.remarks}}", Data.remarks)
                .replace("{{Data.telephoneno}}", Data.telephoneno);

              let itemSummariesHTML = "";
              let itemSummariesHTML1 = "";
              let itemSummariesHTML2 = "";

              results2.forEach((item, index) => {
                const breakConsigner = (text, targetLength) => {
                  const currentLength = text.length;
                  if (currentLength >= targetLength) {
                    return text;
                  } else {
                    const spacesToAdd = targetLength - currentLength;
                    const spaces = " ".repeat(spacesToAdd);
                    return text + spaces;
                  }
                };

                let consignerBreak = breakConsigner(item.consigner, 41);
                // console.log(`Consigner Value: ${item.consigner}Consigner Length: ${item.consigner.length}`);

                itemSummariesHTML += `
                  <tr style="height:12pt">
                <td style="width:100pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s4" style="padding-top: 2pt;">${item.lrnumber}</p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;">${item.to_loc}</p>
                </td>
     <td style="width: 100pt; max-width: 100pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;">
    <span class="s7" style="width: 70pt;padding-top: 3pt; padding-left: 2pt; padding-right: 6pt; text-align: left; word-wrap: break-word; margin: 0;">${item.consigner}</span>

    </td>


                <td style="width:118pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${item.consignee}</p>
                </td>
                <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.noofarticles}</p>
                </td>
                <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.pay_type}</p>
                </td>
                <td style="width:49pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${rupee} ${item.total}</p>
                </td>
            </tr>
            `;
              });

              results3[0].forEach((item, index) => {
                itemSummariesHTML2 += `
                  <tr style="height:18pt">
        <td style="width:157pt;border-style:solid;border-width:1pt">
         <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: center;">${item.lr_no_with_abbr}</p>
         </td>
        <td style="width:118pt;border-style:solid;border-width:1pt">
        <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: center;">${item.branch_name}</p>
        </td>
        <td style="width:118pt;border-style:solid;border-width:1pt">
        <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: center;">${rupee} ${item.pay_amount}
        </p>
        </td>
        
    </tr>
            `;
              });
              itemSummariesHTML1 += `
              <tr style="height:12pt">
                <td style="width:100pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s4" >;</p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s4" style="padding-left: 2pt;text-indent: 0pt;">&nbsp;</p>
                </td>
                <td style="width: 100pt; max-width: 100pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;">
                  <span class="s7" style="width: 70pt; padding-left: 2pt; padding-right: 6pt; text-align: left; word-wrap: break-word; margin: 0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </td>
                <td style="width:118pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s4" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">&nbsp;</p>
                </td>
                <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s4" style="text-indent: 0pt;text-align: center;">&nbsp;</p>
                </td>
                <td style="width:59pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s4" style="text-indent: 0pt;text-align: center;">&nbsp;</p>
                </td>
                <td style="width:49pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s4" style="text-indent: 0pt;text-align: center;">&nbsp;</p>
                </td>
              </tr>
            `;
              renderedHTML = renderedHTML.replace(
                "{{itemSummaries}}",
                itemSummariesHTML
              );
              renderedHTML = renderedHTML.replace(
                "{{itemSummariesHTML1}}",
                itemSummariesHTML1
              );
              renderedHTML = renderedHTML.replace(
                "{{itemSummariesHTML2}}",
                itemSummariesHTML2
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

              const finalPath = path.join(__dirname, "../LoadingTrippdf/");
              const fileName = `RT_Challan_${Data.lts_no}`.toUpperCase();
             
              const returnpath = `LoadingTrippdf/${fileName}.pdf`;

              pdf
                .create(renderedHTML, options)
                .toFile(
                  path.join(finalPath, `${fileName}.pdf`),
                  (pdfErr, result) => {
                    if (pdfErr) {
                      return res
                        .status(500)
                        .json({ error: true, message: "Error creating PDF" });
                    }

                    const fileToSend = result.filename;

                    return res.json({ returnpath });
                  }
                );
            } catch (readFileErr) {
              console.log(readFileErr);
              return res
                .status(500)
                .json({ error: true, message: "Error reading HTML template" });
            }
          });
        });
      });
    });
  } catch (e) {
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
      subject: 'Regarding Challan',
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



const delete_dc_master = (req, res) => {
  const { id } = req.params;
 
  const query = `
            CALL delete_dc_master(?, @message);
            SELECT @message as message;
        `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send("Server error");
      console.log(err);
    }

    const message = results[2][0].message;
    
    return res.json({ message });
  });
};
const saveloadingtripprint = (req, res) => {
  const { id } = req.params;

  const query1 = `
          SELECT id, dc_no 
          FROM dc_master 
          WHERE dc_no = ?;
        `;

  db.query(query1, [id], (err, results1) => {
    if (err) {
      return res.status(500).send("Server error");
    }

    if (results1.length === 0) {
      return res.status(404).send("Record not found");
    }

    const record = results1[0];
    const recordId = record.id;

    const query2 = `
            SELECT MAX(id) as maxId 
            FROM dc_master;
          `;

    db.query(query2, (err, results2) => {
      if (err) {
        return res.status(500).send("Server error");
      }

      const maxId = results2[0].maxId;

      if (recordId === maxId) {
        return res.status(200).send({ id: recordId });
      } else {
        return res.status(400).send("Something went wrong");
      }
    });
  });
};
const getOweneremail = (req, res) => {
  
  const id = req.params.id; 
  const queryCustomer = 'CALL getvehicleownerbyid(?)';
  

  try {
    
      db.query(queryCustomer, id, (err, customerResults) => {
          if (err) {
              console.error('Error executing query findcustomerbyid:', err);
              res.status(500).send('Server error');
              return;
          }

         
          const customerData = customerResults[0];

          return  res.json(customerData);
      });
  } catch (err) {
      console.error('Error:', err);
     return res.status(500).send('Server error');
  }
};
const getdata=(req,res)=>{
  const query = 'CALL getdataforloadingtrip()';
  

  try {
    
      db.query(query, (err, customerResults) => {
          if (err) {
              console.error('Error executing query findcustomerbyid:', err);
              res.status(500).send('Server error');
              return;
          }

const vehicle = customerResults[0]; 
const driver = customerResults[1];  
const place = customerResults[2];   

const combinedData = {
    vehicle,
    driver,
    place
};

return res.json(combinedData);

      });
  } catch (err) {
      console.error('Error:', err);
     return res.status(500).send('Server error');
  }
}
module.exports = {
  getdata,
  saveloadingtripprint,
  delete_dc_master,
  sendMail,
  Updatedcmaster,
  getlrdetailsbybranchwise,
  getallloadingshets,
  add_dc_master,
  getloadingsheetbyid,
  getallItssearch,
  getlrforloadingsheet,
  getlrdetailsforloadsheet,
  getloadingsheetFreightbyid,
  getLoadingTripByIdPdfmail,
  getLoadingTripByIdPdfedit,
  getlrforloadingsheetedit,
  getOweneremail
};
