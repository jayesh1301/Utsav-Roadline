const db = require("../config/dbConfig");
const fs = require('fs').promises;
const pdf = require("html-pdf");
const path = require("path");
const nodemailer = require('nodemailer');
const   pool  = require("../config/dbConfig");
const getallLr = (req, res) => {
    const branch = req.params.branch;
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = page * pageSize;

    const query = 'CALL getalllorryreceipts(?)';

    try {
        db.query(query, [branch], (err, results) => {
            if (err) {
              
                return res.status(500).send('Server error');
                ;
            }
            
            const formattedResults = results[0].map((lr) => {
              const lr_no_key = 'CONCAT((SELECT branch_abbreviation FROM branch WHERE branch_id=lm.branch),"-",lm.lr_no)';
              return {
                  id: lr.id,
                  lr_no: lr[lr_no_key],
                    statu: lr.STATUS,
                    consignee: lr.consignee,
                    consigner: lr.consigner,
                    fileloc: lr.fileloc,
                    loc_from: lr.loc_from,
                    loc_to: lr.loc_to,
                    lr_date: lr.lr_date,
                    pay_type: lr.pay_type,
                    total: lr.total,
                
                };
            });
            let lr = formattedResults;

            const total = lr.length;
            lr = lr.map(lr => ({
                ...lr,
                lr_no: lr.lr_no ? lr.lr_no.toUpperCase() : null,
                consignee: lr.consignee ? lr.consignee.toUpperCase() : null,
                consigner: lr.consigner ? lr.consigner.toUpperCase() : null,
                loc_from: lr.loc_from ? lr.loc_from.toUpperCase() : null,
                loc_to: lr.loc_to ? lr.loc_to.toUpperCase() : null,
                lr_date: lr.lr_date ? lr.lr_date.toUpperCase() : null,
                pay_type: lr.pay_type ? lr.pay_type.toUpperCase() : null,
                total: lr.total ? lr.total.toUpperCase() : null,
                //statu: lr.statu ? lr.statu.toUpperCase() : null,
                
            }));

            const paginatedPlaces = lr.slice(offset, offset + pageSize);

          return  res.json({
                lr: paginatedPlaces,
                total: total
            });
        });
    } catch (err) {
       
       return res.status(500).send('Server error');
    }
};


const getallLrsearch = (req, res) => {
    const branch = req.params.branch;
    const { in_lr_no, in_cust_id, start_index, counts } = req.query;

    const query = 'CALL lr_search_test(?, ?, ?, ?, ?)';

    try {
        db.query(query, [in_lr_no, branch, in_cust_id, parseInt(start_index), parseInt(counts)], (err, results) => {
            if (err) {
              return res.status(500).send('Server error');    
            }
            if (results.length === 0 || results[0].length === 0) {
               return res.json([])
            }
            const formattedResults = results[0].map((lr) => ({
                id: lr.id,
                lr_no: lr.lr_no,
                statu: lr.status,
                consignee: lr.consignee,
                consigner: lr.consigner,
                fileloc: lr.fileloc,
                loc_from: lr.loc_from,
                loc_to: lr.loc_to,
                lr_date: lr.lr_date,
                pay_type: lr.pay_type,
                total: lr.total,
                '@tot_counts': lr['@tot_counts'], 
                '@totc': lr['@totc'], 
            }));
console.log(formattedResults)
         return   res.json(formattedResults);
        });
    } catch (err) {
       return  res.status(500).send('Server error');
    }
};
const getlrbyid = (req, res) => {
    const id = req.params.id;
    const query1 = 'CALL getlrbyid(?)';
    const query2 = 'SELECT * FROM transactions_lr WHERE lr_master_id = ?';

    try {
        db.query(query1, id, (err, results1) => {
            if (err) {
               
               return res.status(500).send('Server error');
            }

            if (results1[0].length > 0) {
                db.query(query2, id, (err, results2) => {
                    if (err) {
                       
                       return res.status(500).send('Server error');
                
                    }

                    const finalResult = {
                        ... results1[0],
                        transactionData: results2,
                        transactionDataLength: results2.length
                    };

                return    res.json(finalResult);
                });
            } else {
                return res.status(404).send('No data found');
            }
        });
    } catch (err) {
      
      return  res.status(500).send('Server error');
    }
};


const checklrforupdate = (req, res) => { 
    const id= req.params.id
  
    const query = 'CALL checklrforupdate(?, @message); SELECT @message as message;';
    
    try {
        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).send('Server error');
            }

            const message = results[2][0].message;
          return  res.json({ message });
        });
    } catch (err) {
        
        return res.status(500).send('Server error');
    }
};
const addlrmaster = (req, res) => {
 
  const {
    lrNo,
    date,
    consignmentNoteNo,
    truckNo,
    consignor,
    consignorGst,
    consignorAddress,
    from,
    consignee,
    consigneeGst,
    consigneeAddress,
    to,
    toPlaceContact,
    materialCost,
    deliveryType,
    deliveryDays,
    payType,
    collectAt,
    gstPayBy,
    customerCopy,
    toBilled,
    remark,
    rows,
    transactionData,
    in_user_id,
    in_branch,
    thirdPartyCust
  } = req.body;
   //const branch=in_branch.branch_id ? in_branch.branch_id : 10;
   const branch=in_branch.branch_id
   //console.log(branch) 
   const status=1
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const {
    nextfreight,
    collection,
    varaiHamali,
    doorDelChar,
    otherChar,
    weightCharge,
    statistical,
    total,
    ratePer
  } = transactionData;
// if(branch == null || branch == '' || branch == undefined){
//   return res.status(500).send('Branch cannot be empty');
// }
  const formattedDate = date ? new Date(date).toISOString().slice(0, 19).replace('T', ' ') : currentTime;
  const in_lr_no = lrNo ? lrNo : null;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).send('Server error');
    }
    connection.beginTransaction(err => {
      if (err) {
        console.error('Error beginning transaction:', err);
        connection.release();
        return res.status(500).send('Server error');
      }
      const addLrMasterSp = `
        CALL insert_lr_master(
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
        )
      `;

      connection.query(addLrMasterSp, [
        in_lr_no, formattedDate, consignmentNoteNo, truckNo, consignor, consignorGst, consignorAddress,
        from, consignee, consigneeGst, consigneeAddress, to, toPlaceContact, materialCost || null, deliveryType || null,
        deliveryDays || null, payType || null, collectAt || null, gstPayBy || null, customerCopy || null, toBilled || null, remark || null, nextfreight, collection,
        varaiHamali, doorDelChar, otherChar, weightCharge, statistical, total, ratePer, in_user_id, branch, thirdPartyCust,status
      ], (err, results) => {
        if (err) {
          console.error('Error executing stored procedure:', err);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).send('Server error');
          });
        }
        const { message, inserted_id } = results[0][0];
        const lrdata = rows.map(row => [
          row.id, row.Article, row.Company, row['Invoice No'], row['No of article'], row.Weight,
          row.fPlace, row.fPayment, row.Remark, inserted_id
        ]);

        const insertTransactionsQuery = `
          INSERT INTO transactions_lr (sr_no, description, articles, no_of_articles, actual_wt, char_wt,
            rate_per, rate, inv_amt, lr_master_id)
          VALUES ?
        `;

        connection.query(insertTransactionsQuery, [lrdata], (err, results) => {
          if (err) {
            console.error('Error inserting LR transactions:', err);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).send('Server error');
            });
          }
          connection.commit(err => {
            if (err) {
              console.error('Error committing transaction:', err);
              return connection.rollback(() => {
                connection.release();
                return res.status(500).send('Server error');
              });
            }

            connection.release();
         
            return res.json({ message, inserted_id });
          });
        });
      });
    });
  });
};


const upadtelrmaster = (req, res) => {
  const id = req.params.id;
  const {
    lrNo,
    date,
    consignmentNoteNo,
    truckNo,
    consignor,
    consignorGst,
    consignorAddress,
    from,
    consignee,
    consigneeGst,
    consigneeAddress,
    to,
    toPlaceContact,
    materialCost,
    deliveryType,
    deliveryDays,
    payType,
    collectAt,
    gstPayBy,
    customerCopy,
    toBilled,
    remark,
    rows,
    transactionData,
    in_user_id,
    in_branch,
    thirdPartyCust
  } = req.body;

  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const {
    nextfreight,
    collection,
    varaiHamali,
    doorDelChar,
    otherChar,
    weightCharge,
    statistical,
    total,
    ratePer
  } = transactionData;
  const formattedDate = date ? new Date(date).toISOString().slice(0, 19).replace('T', ' ') : currentTime;
  const truckNoValue = truckNo && truckNo !== '' ? truckNo : null;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).send('Server error');
    }
    connection.beginTransaction(err => {
      if (err) {
        console.error('Error beginning transaction:', err);
        connection.release();
        return res.status(500).send('Server error');
      }
      if (truckNo === '') {
        const getTruckNoQuery = 'SELECT truck_tempo_number FROM lorry_reciept_master WHERE id = ?';

        connection.query(getTruckNoQuery, [id], (err, truckNoResult) => {
          if (err) {
            console.error('Error fetching truckNo from lorry_master_receipt:', err);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).send('Server error');
            });
          }

          if (truckNoResult.length > 0) {
            const retrievedTruckNo = truckNoResult[0].truckNo;
            const updateLrMasterSp = `CALL update_lr_master(?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,?)`;
      connection.query(updateLrMasterSp, [
        id,lrNo,consignmentNoteNo, formattedDate,  truckNoValue, consignor, consignorGst, consignorAddress,
         consignee, consigneeGst, consigneeAddress,from, to, toPlaceContact,nextfreight,collection,varaiHamali,
         doorDelChar, otherChar,weightCharge,statistical,materialCost, total, deliveryType,
        deliveryDays,gstPayBy, payType, ratePer, toBilled,collectAt, remark,  customerCopy,  
        thirdPartyCust
            ], (err, results) => {
              if (err) {
                console.error('Error executing stored procedure:', err);
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).send('Server error');
                });
              }

              const message = results[0][0].message;
              const lrdata = rows.map(row => [
                row.id, row.Article, row.Company, row['Invoice No'], row['No of article'], row.Weight,
                row.fPlace, row.fPayment, row.Remark, id
              ]);

              const insertTransactionsQuery = 'INSERT INTO transactions_lr (sr_no, description, articles, no_of_articles, actual_wt, char_wt, rate_per, rate, inv_amt, lr_master_id) VALUES ?';

              connection.query(insertTransactionsQuery, [lrdata], (err, results) => {
                if (err) {
                  console.error('Error inserting LR transactions:', err);
                  return connection.rollback(() => {
                    connection.release();
                    return res.status(500).send('Server error');
                  });
                }

                connection.commit(err => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    return connection.rollback(() => {
                      connection.release();
                      return res.status(500).send('Server error');
                    });
                  }

                  connection.release();
                  return res.json({ message });
                });
              });
            });
          } else {
            console.error('No truckNo found for id:', id);
            connection.release();
            return res.status(404).send('TruckNo not found for the given id');
          }
        });
      } else {
        const updateLrMasterSp = `CALL update_lr_master(?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,?)`;
      connection.query(updateLrMasterSp, [
        id,lrNo,consignmentNoteNo, formattedDate,  truckNoValue, consignor, consignorGst, consignorAddress,
         consignee, consigneeGst, consigneeAddress,from, to, toPlaceContact,nextfreight,collection,varaiHamali,
         doorDelChar, otherChar,weightCharge,statistical,materialCost, total, deliveryType,
        deliveryDays,gstPayBy, payType, ratePer, toBilled,collectAt, remark,  customerCopy,  
        thirdPartyCust
        ], (err, results) => {
          if (err) {
            console.error('Error executing stored procedure:', err);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).send('Server error');
            });
          }

          const message = results[0][0].message;
          const lrdata = rows.map(row => [
            row.id, row.Article, row.Company, row['Invoice No'], row['No of article'], row.Weight,
            row.fPlace, row.fPayment, row.Remark, id
          ]);

          const insertTransactionsQuery = 'INSERT INTO transactions_lr (sr_no, description, articles, no_of_articles, actual_wt, char_wt, rate_per, rate, inv_amt, lr_master_id) VALUES ?';

          connection.query(insertTransactionsQuery, [lrdata], (err, results) => {
            if (err) {
              console.error('Error inserting LR transactions:', err);
              return connection.rollback(() => {
                connection.release();
                return res.status(500).send('Server error');
              });
            }

            connection.commit(err => {
              if (err) {
                console.error('Error committing transaction:', err);
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).send('Server error');
                });
              }

              connection.release();
              return res.json({ message });
            });
          });
        });
      }
    });
  });
};
      


const delete_lr_master = async (req, res) => {
  const { id } = req.params; 
  const ids = id.split(','); 
  let messages = [];

  for (const singleId of ids) {
    const query = `
        CALL delete_lr_master(?, @message);
        SELECT @message as message;
    `;

    try {
      const [results] = await db.promise().query(query, [singleId.trim()]);
      const message = results[2][0].message;
      messages.push({ id: singleId, message });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }

  return res.json({ messages });
};



const getLRByIdPdfForPrint = async (req, res) => {
  try {
    const { id } = req.params;

    const query1 = 'CALL getlorryreceiptforprint(?)'
    db.query(query1, id, async (err, results1) => {
      if (err) {
        return res.status(500).send('Server error');
      }

      const lrData = results1[0][0];
      
      const query2 = 'SELECT * FROM transactions_lr WHERE lr_master_id = ?';
      db.query(query2, id, async (err, results2) => {
        if (err) {
          
          return res.status(500).send('Server error');
        }

        const finalResult = {
          lrData: lrData, 
          transactionData: results2
        };

        try {
      
          const templatePath = path.join(__dirname, '../LrPDF/lrprintvalue.html');
          const templateContent = await fs.readFile(templatePath, 'utf8');
          const freight = lrData.pay_type == 'TBB' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TBB' : lrData.freight;
          const rupee= lrData.pay_type == 'TBB' ? '' : `₹`;
          const statatical = lrData.pay_type == 'TBB' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TBB' : lrData.statatical;
          const hamali = lrData.pay_type == 'TBB' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TBB' : lrData.hamali;
          const delivery = lrData.pay_type == 'TBB' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TBB' : lrData.delivery;
          const collection = lrData.pay_type == 'TBB' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TBB' : lrData.collection;
          const total = lrData.pay_type == 'TBB' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : lrData.total;
         const s=lrData.consigner.length >= 30 ?'CONSIGNOR:' :''
         const e= lrData.consigner.length <= 30 ?'CONSIGNOR:' :''

          let renderedHTML = templateContent
          .replace('{{s}}', s)
          .replace('{{s2}}', s)
          .replace('{{s3}}', s)
          .replace('{{e}}', e)
          .replace('{{e2}}', e)
          .replace('{{e3}}', e)
           .replace('{{lrData.lr_number}}', lrData.lr_number)
           .replace('{{lrData.lr_number2}}', lrData.lr_number)
           .replace('{{lrData.lr_numbers}}', lrData.lr_number)
           .replace('{{lrData.consigner}}', lrData.consigner)
           .replace('{{lrData.consigner2}}', lrData.consigner)
           .replace('{{lrData.consigner3}}', lrData.consigner)
           .replace('{{lrData.loc_from}}', lrData.loc_from)
           .replace('{{lrData.loc_from2}}', lrData.loc_from)
           .replace('{{lrData.loc_from3}}', lrData.loc_from)
           .replace('{{lrData.lrdate}}', lrData.lrdate)
           .replace('{{lrData.lrdate2}}', lrData.lrdate)
           .replace('{{lrData.lrdate3}}', lrData.lrdate)
           .replace('{{lrData.truck_tempo_number}}', lrData.truck_tempo_number || '')
           .replace('{{lrData.truck_tempo_number2}}', lrData.truck_tempo_number || '')
           .replace('{{lrData.truck_tempo_number3}}', lrData.truck_tempo_number || '')
           .replace('{{lrData.consignee}}', lrData.consignee)
           .replace('{{lrData.consignee2}}', lrData.consignee)
           .replace('{{lrData.consignee3}}', lrData.consignee)
           .replace('{{lrData.loc_to}}', lrData.loc_to)
           .replace('{{lrData.loc_to2}}', lrData.loc_to)
           .replace('{{lrData.loc_to3}}', lrData.loc_to)
           .replace('{{lrData.pay_type}}', lrData.pay_type)
           .replace('{{lrData.pay_type2}}', lrData.pay_type)
           .replace('{{lrData.pay_type3}}', lrData.pay_type)
           .replace('{{lrData.total}}', total)
           .replace('{{lrData.total2}}', total)
           .replace('{{lrData.total3}}', total)
           .replace('{{lrData.material_cost}}', lrData.material_cost || 0)
           .replace('{{lrData.material_cost2}}', lrData.material_cost || 0)
           .replace('{{lrData.material_cost3}}', lrData.material_cost || 0)
           .replace('{{lrData.freight}}', freight)
           .replace('{{lrData.freight2}}', freight)
           .replace('{{lrData.freight3}}', freight)
           .replace('{{lrData.statatical}}', statatical)
           .replace('{{lrData.statatical2}}', statatical)
           .replace('{{lrData.statatical3}}', statatical)
           .replace('{{lrData.hamali}}', hamali)
           .replace('{{lrData.hamali2}}', hamali)
           .replace('{{lrData.hamali3}}', hamali)
           .replace('{{lrData.delivery}}', delivery)
           .replace('{{lrData.delivery2}}', delivery)
           .replace('{{lrData.delivery3}}', delivery)
           .replace('{{lrData.collection}}', collection)
           .replace('{{lrData.collection2}}', collection)
           .replace('{{lrData.collection3}}', collection)
           .replace('{{lrData.consignote}}', lrData.consignote)
           .replace('{{lrData.consignote2}}', lrData.consignote)
           .replace('{{lrData.consignote3}}', lrData.consignote)
           .replace('{{rupee}}', rupee)
           .replace('{{rupee1}}', rupee)
           .replace('{{rupee2}}', rupee)
           .replace('{{rupee02}}', rupee)
           .replace('{{rupee3}}', rupee)
           .replace('{{rupee03}}', rupee)
           
           
           let itemSummariesHTML = '';
           let itemSummariesHTML2 = '';
           let itemSummariesHTML3 = '';
           results2.forEach((item, index) => {
              itemSummariesHTML += `
                <tr style="height:10pt;">
                  <td style="width:62pt;border-left:1pt solid;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.no_of_articles}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.actual_wt}</p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.char_wt}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.articles}</p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.description}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.rate}</p>
                  </td>`;
              
              // Add Freight row only for the first item
             
              if (index === 0) {
                itemSummariesHTML += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Freight</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${freight}</p>
                  </td>
                `;
              }
            
              // Add Statistical row only for the second item
              if (index === 1) {
                itemSummariesHTML += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                `;
              }else{
                  ``
              }
              if (index === 2) {
                  itemSummariesHTML += `
                      <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
              </td>
                  `;
                }
                if (index === 3) {
                  itemSummariesHTML += `
                   <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
              </td>
                  `;
                }
              itemSummariesHTML += '</tr>';
            });
            if (results2.length === 1) {
              itemSummariesHTML += `
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 2) {
              itemSummariesHTML += `
                <tr style="height:10pt">
                
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 3) {
              itemSummariesHTML += `
                
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            results2.forEach((item, index) => {
              itemSummariesHTML2 += `
               <tr style="height:10pt;">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.no_of_articles}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.actual_wt}</p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.char_wt}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.articles}</p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.description}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="text-align: center;">${item.rate}</p>
                  </td>`;
               
              // Add Freight row only for the first item
              
              if (index === 0) {
                itemSummariesHTML2 += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Freight</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${freight}</p>
                  </td>
                `;
              }
            
              // Add Statistical row only for the second item
              if (index === 1) {
                itemSummariesHTML2 += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                `;
              }else{
                  ``
              }
              if (index === 2) {
                  itemSummariesHTML2 += `
                      <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${hamali}</p>
              </td>
                  `;
                }
                if (index === 3) {
                  itemSummariesHTML2 += `
                   <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
              </td>
                  `;
                }
              itemSummariesHTML2 += '</tr>';
            });
            if (results2.length === 1) {
              itemSummariesHTML2 += `
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 2) {
              itemSummariesHTML2 += `
                <tr style="height:10pt">
                
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 3) {
              itemSummariesHTML2 += `
                
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            results2.forEach((item, index) => {
              itemSummariesHTML3 += `
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.no_of_articles}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.actual_wt}</p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.char_wt}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.articles}</p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.description}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.rate}</p>
                  </td>`;
              
              // Add Freight row only for the first item
              if (index > 3) {
                  itemSummariesHTML3 += `
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;"></p>
                    </td>
                    <td style="width:62pt;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;"></p>
                    </td>`;
                }
              if (index === 0) {
                itemSummariesHTML3 += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Freight</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${freight}</p>
                  </td>
                `;
              }
            
              // Add Statistical row only for the second item
              if (index === 1) {
                itemSummariesHTML3 += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                `;
              }else{
                  ``
              }
              if (index === 2) {
                  itemSummariesHTML3 += `
                      <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
              </td>
                  `;
                }
                if (index === 3) {
                  itemSummariesHTML3 += `
                   <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
              </td>
                  `;
                }
              itemSummariesHTML3 += '</tr>';
            });
            if (results2.length === 1) {
              itemSummariesHTML3 += `
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 2) {
              itemSummariesHTML3 += `
                <tr style="height:10pt">
                
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 3) {
              itemSummariesHTML3 += `
                
                <tr style="height:10pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
          renderedHTML = renderedHTML.replace('{{itemSummaries}}', itemSummariesHTML);
          renderedHTML = renderedHTML.replace('{{itemSummaries2}}', itemSummariesHTML2); 
          renderedHTML = renderedHTML.replace('{{itemSummaries3}}', itemSummariesHTML3); 
          const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '10mm',
              right: '10mm',
              bottom: '10mm',
              left: '10mm'
            },
          };

          const finalPath = path.join(__dirname, '../LrPDF/');
          const fileName =`RT_LR_${lrData.lr_number}`.toUpperCase();
          const returnpath = `LrPDF/${fileName}.pdf`;

          pdf.create(renderedHTML, options).toFile(
            path.join(finalPath, `${fileName}.pdf`),
            (pdfErr, result) => {
              if (pdfErr) {
            
                return res.status(500).json({ error: true, message: 'Error creating PDF' });
              }

              const fileToSend = result.filename;
          
              return res.json({ returnpath });
            }
          );
        } catch (readFileErr) {
        
          return res.status(500).json({ error: true, message: 'Error reading HTML template' });
        }
      });
    });
  } catch (e) {
    
    return res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
}

const getLRByIdPdf = async (req, res) => {
    try {
      const { id } = req.params;
      const query1 = 'CALL getlorryreceiptforprint(?)'
      db.query(query1, id, async (err, results1) => {
        if (err) {
    
          return res.status(500).send('Server error');
        }
  
        const lrData = results1[0][0];
 
        const query2 = 'SELECT * FROM transactions_lr WHERE lr_master_id = ?';
        db.query(query2, id, async (err, results2) => {
          if (err) {
        
            return res.status(500).send('Server error');
          }
  
          const finalResult = {
            lrData: lrData, 
            transactionData: results2
          };
  
          try {
            const templatePath = path.join(__dirname, '../Lrprint/lrprint.html');
        // let templatePath
        //     if(lrData.pay_type == 'TBB'){
        //       templatePath = path.join(__dirname, '../Lrprint/lrprint.html');
        //    }else{
        //       templatePath = path.join(__dirname, '../Lrprint/lrprintwithoutvalue.html');
        //    }
            const templateContent = await fs.readFile(templatePath, 'utf8');
            const freight = lrData.pay_type == 'TBB' ? 'TBB' : lrData.freight;
            const statatical = lrData.pay_type == 'TBB' ? 'TBB' : lrData.statatical;
            const rupee= lrData.pay_type == 'TBB' ? '' : `₹`;
            const hamali = lrData.pay_type == 'TBB' ? 'TBB' : lrData.hamali;
            const delivery = lrData.pay_type == 'TBB' ? 'TBB' : lrData.delivery;
            const collection = lrData.pay_type == 'TBB' ? 'TBB' : lrData.collection;
            const total = lrData.pay_type == 'TBB' ? '' : lrData.total;
            let renderedHTML = templateContent
             .replace('{{lrData.lr_number}}', lrData.lr_number)
             .replace('{{lrData.consigner}}', lrData.consigner)
             .replace('{{lrData.loc_from}}', lrData.loc_from)
             .replace('{{lrData.lrdate}}', lrData.lrdate)
             .replace('{{lrData.truck_tempo_number}}', lrData.truck_tempo_number || '')
             .replace('{{lrData.consignee}}', lrData.consignee)
             .replace('{{lrData.loc_to}}', lrData.loc_to)
             .replace('{{lrData.pay_type}}', lrData.pay_type)
             .replace('{{lrData.total}}', total)
             .replace('{{lrData.material_cost}}', lrData.material_cost || 0)
             .replace('{{lrData.freight}}', freight)
             .replace('{{lrData.statatical}}', statatical)
             .replace('{{lrData.hamali}}', hamali)
             .replace('{{lrData.delivery}}', delivery)
             .replace('{{lrData.collection}}', collection)
             .replace('{{lrData.consignote}}', lrData.consignote)
             .replace('{{rupee1}}',rupee)
             .replace('{{rupee2}}',rupee)
             //rupee
             let itemSummariesHTML = '';
             results2.forEach((item, index) => {
                itemSummariesHTML += `
                  <tr style="height:16pt">
                    <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.no_of_articles}</p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.actual_wt}</p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.char_wt}</p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.articles}</p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.description}</p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.rate}</p>
                    </td>`;
                
                // Add Freight row only for the first item
                if (index > 3) {
                    itemSummariesHTML += `
                      <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                        <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;"></p>
                      </td>
                      <td style="width:62pt;border-right:1pt solid;">
                        <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;"></p>
                      </td>`;
                  }
                if (index === 0) {
                  itemSummariesHTML += `
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Freight</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${freight}</p>
                    </td>
                  `;
                }
              
                // Add Statistical row only for the second item
                if (index === 1) {
                  itemSummariesHTML += `
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                    </td>
                  `;
                }else{
                    ``
                }
                if (index === 2) {
                    itemSummariesHTML += `
                        <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                </td>
                <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                </td>
                    `;
                  }
                  if (index === 3) {
                    itemSummariesHTML += `
                     <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                </td>
                <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                </td>
                    `;
                  }
                itemSummariesHTML += '</tr>';
              });
              if (results2.length === 1) {
                itemSummariesHTML += `
                  <tr style="height:16pt">
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                    </td>
                  </tr>
                  <tr style="height:16pt">
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                    </td>
                  </tr>
                  <tr style="height:16pt">
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                    </td>
                  </tr>
                `;
              }
              if (results2.length === 2) {
                itemSummariesHTML += `
                  <tr style="height:16pt">
                  
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                    </td>
                  </tr>
                  <tr style="height:16pt">
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                    </td>
                  </tr>
                `;
              }
              if (results2.length === 3) {
                itemSummariesHTML += `
                  
                  <tr style="height:16pt">
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:124pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:62pt;border-left:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                    </td>
                    <td style="width:63pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                    </td>
                    <td style="width:62pt;border:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                    </td>
                  </tr>
                `;
              }
            renderedHTML = renderedHTML.replace('{{itemSummaries}}', itemSummariesHTML);
             
            const options = {
              format: 'A4',
              orientation: 'portrait',
              border: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
              },
            };
  
            const finalPath = path.join(__dirname, '../Lrprint/');
            const fileName = `RT_LR_${lrData.lr_number}`.toUpperCase();
            const returnpath = `Lrprint/${fileName}.pdf`;
  
            pdf.create(renderedHTML, options).toFile(
              path.join(finalPath, `${fileName}.pdf`),
              (pdfErr, result) => {
                if (pdfErr) {
    
                  return res.status(500).json({ error: true, message: 'Error creating PDF' });
                }
  
                const fileToSend = result.filename;
        
                return res.json({ returnpath });
              }
            );
          } catch (readFileErr) {
          
            return res.status(500).json({ error: true, message: 'Error reading HTML template' });
          }
        });
      });
    } catch (e) {
      
      return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  }
  const generatelrno = (req, res) => {
    
    const branch = req.params.branch;

    
    const query = 'CALL generatelrno(?, @message); SELECT @message AS lr_number;';

    try {
        db.query(query, [branch], (err, results) => {
            if (err) {
        
                res.status(500).send('Server error');
                return;
            }

            const lrNumber = results;

            return res.json({ lr_number: lrNumber });
        });
    } catch (err) {
  
       return res.status(500).send('Server error');
    }
};

const getLRByIdPdfmail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query1 = 'CALL getlorryreceiptforprint(?)'
    db.query(query1, id, async (err, results1) => {
      if (err) {
      
        return res.status(500).send('Server error');
      }

      const lrData = results1[0][0];

      const query2 = 'SELECT * FROM transactions_lr WHERE lr_master_id = ?';
      db.query(query2, id, async (err, results2) => {
        if (err) {
          
          return res.status(500).send('Server error');
        }

        const finalResult = {
          lrData: lrData, 
          transactionData: results2
        };

        try {
          let templatePath
      if(lrData.pay_type == 'TBB'){
         templatePath = path.join(__dirname, '../Lrprint/lrprint.html');
      }else{
         templatePath = path.join(__dirname, '../Lrprint/lrprintwithoutvalue.html');
      }
        
          const templateContent = await fs.readFile(templatePath, 'utf8');
          const freight = lrData.pay_type == 'TBB' ? 'TBB' : lrData.freight;
          const statatical = lrData.pay_type == 'TBB' ? 'TBB' : lrData.statatical;
          const hamali = lrData.pay_type == 'TBB' ? 'TBB' : lrData.hamali;
          const rupee= lrData.pay_type == 'TBB' ? '' : `₹`;
          const delivery = lrData.pay_type == 'TBB' ? 'TBB' : lrData.delivery;
          const collection = lrData.pay_type == 'TBB' ? 'TBB' : lrData.collection;
          const total = lrData.pay_type == 'TBB' ? '' : lrData.total;
          let renderedHTML = templateContent
           .replace('{{lrData.lr_number}}', lrData.lr_number)
           .replace('{{lrData.consigner}}', lrData.consigner)
           .replace('{{lrData.loc_from}}', lrData.loc_from)
           .replace('{{lrData.lrdate}}', lrData.lrdate)
           .replace('{{lrData.truck_tempo_number}}', lrData.truck_tempo_number || '')
           .replace('{{lrData.consignee}}', lrData.consignee)
           .replace('{{lrData.loc_to}}', lrData.loc_to)
           .replace('{{lrData.pay_type}}', lrData.pay_type)
           .replace('{{lrData.total}}', total)
           .replace('{{lrData.material_cost}}', lrData.material_cost || 0)
           .replace('{{lrData.freight}}', freight)
           .replace('{{lrData.statatical}}', statatical)
           .replace('{{lrData.hamali}}', hamali)
           .replace('{{lrData.delivery}}', delivery)
           .replace('{{lrData.collection}}', collection)
           .replace('{{lrData.consignote}}', lrData.consignote)
           .replace('{{rupee1}}',rupee)
            .replace('{{rupee2}}',rupee)
           let itemSummariesHTML = '';
           results2.forEach((item, index) => {
              itemSummariesHTML += `
                <tr style="height:16pt">
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.no_of_articles}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.actual_wt}</p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.char_wt}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.articles}</p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.description}</p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;border-right:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${item.rate}</p>
                  </td>`;
              
              // Add Freight row only for the first item
              if (index > 3) {
                  itemSummariesHTML += `
                    <td style="width:63pt;border-left:1pt solid;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;"></p>
                    </td>
                    <td style="width:62pt;border-right:1pt solid;">
                      <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;"></p>
                    </td>`;
                }
              if (index === 0) {
                itemSummariesHTML += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Freight</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${freight}</p>
                  </td>
                `;
              }
            
              // Add Statistical row only for the second item
              if (index === 1) {
                itemSummariesHTML += `
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                `;
              }else{
                  ``
              }
              if (index === 2) {
                  itemSummariesHTML += `
                      <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
              </td>
                  `;
                }
                if (index === 3) {
                  itemSummariesHTML += `
                   <td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
              </td>
              <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
              </td>
                  `;
                }
              itemSummariesHTML += '</tr>';
            });
            if (results2.length === 1) {
              itemSummariesHTML += `
                <tr style="height:16pt">
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Statistical</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${statatical}</p>
                  </td>
                </tr>
                <tr style="height:16pt">
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:16pt">
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 2) {
              itemSummariesHTML += `
                <tr style="height:16pt">
                
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Hamali</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${hamali}</p>
                  </td>
                </tr>
                <tr style="height:16pt">
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
            if (results2.length === 3) {
              itemSummariesHTML += `
                
                <tr style="height:16pt">
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:124pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:62pt;border-left:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;"></p>
                  </td>
                  <td style="width:63pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Door/Delivery</p>
                  </td>
                  <td style="width:62pt;border:1pt solid;">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${rupee} ${delivery}</p>
                  </td>
                </tr>
              `;
            }
          renderedHTML = renderedHTML.replace('{{itemSummaries}}', itemSummariesHTML);
           
          const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '10mm',
              right: '10mm',
              bottom: '10mm',
              left: '10mm'
            },
          };

          const finalPath = path.join(__dirname, '../Lrprint/');
          const fileName = `RT_LR_${lrData.lr_number}`.toUpperCase();
          const returnpath = `Lrprint/${fileName}.pdf`;

          pdf.create(renderedHTML, options).toFile(
            path.join(finalPath, `${fileName}.pdf`),
            (pdfErr, result) => {
              if (pdfErr) {
          
                return res.status(500).json({ error: true, message: 'Error creating PDF' });
              }

              const fileToSend = result.filename;
        
              return res.json({ returnpath });
            }
          );
        } catch (readFileErr) {
  
          return res.status(500).json({ error: true, message: 'Error reading HTML template' });
        }
      });
    });
  } catch (e) {
    
    return res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
}
const transporter = nodemailer.createTransport({
  host: 'rajeshtransportservices.com',
  port: 587,
  secure: false, 
  auth: {
    user: 'support@rajeshtransportservices.com', 
    pass: 'support@4321' 
  },
  tls: {
    rejectUnauthorized: false 
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

  pool.query(querySettings, (err, settingsResults) => {
    if (err) {
      console.error('Error executing settings query:', err);
      return res.status(500).send('Server error');
    }

    const bccEmail = settingsResults.length > 0 ? settingsResults[0].emailid : null;

    const fileName = path.basename(pdfpathfile);
    const mailOptions = {
      from: '"Rajesh Transport" <support@rajeshtransportservices.com>',
      to: toEmail,
      subject: 'Regarding LRs',
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

    pool.query(queryCustomer, [toEmail], (err, customerResults) => {
      if (err) {
        console.error('Error executing customer query:', err);
        return res.status(500).send('Server error');
      }

      if (customerResults[0].length === 0) {
        pool.query(queryInsert, [toEmail], (err) => {
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



  const getConsignor = (req, res) => {
  
    const id = req.params.id; 
    
    const queryCustomer = 'CALL findcustomerbyid(?)';
    

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
const getemail = (req, res) => {

  const queryCustomer = 'CALL getallemails()';
  

  try {
    
      db.query(queryCustomer, (err, customerResults) => {
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


  module.exports = {
    getemail,
    getConsignor,
    generatelrno,
    getallLr,
    delete_lr_master,
    addlrmaster,
    getlrbyid,
    checklrforupdate,
    getallLrsearch,
    upadtelrmaster,
    getLRByIdPdf,
    getLRByIdPdfForPrint,
    sendMail,
    getLRByIdPdfmail,
    transporter
  };