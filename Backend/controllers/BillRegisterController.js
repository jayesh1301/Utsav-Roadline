const db = require("../config/dbConfig");


const getbilllistforreportbydate = (req, res) => {
    const branch = req.params.branch;
    const formattedFromDate = req.query.formattedFromDate;
    let formattedToDate = req.query.formattedToDate;
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
    const consignorSearchTerm = req.query.consignor ? req.query.consignor.toLowerCase() : '';
    const lrnoSearchTerm = req.query.lrNo ? req.query.lrNo.toString() : '';
    const offset = page * pageSize;
 
    let toDate = new Date(formattedToDate);
toDate.setDate(toDate.getDate() + 1);
formattedToDate = toDate.toISOString().split('T')[0];

    const query = 'CALL getbilllistforreportbydate(?,?)';

    try {
        db.query(query, [ formattedFromDate, formattedToDate], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }
         

            let BillRegister = results[0].map(result => ({
                id: result.id,
                bill_no: result.bill_no_full,
                bill_date: result.bill_date,
                customer_name: result.customer_name,
                lr_no: result.lr_numbers, // comma-separated string
                total_amount: parseFloat(result.total_amount)
            }));

            if (consignorSearchTerm) {
                BillRegister = BillRegister.filter(item =>
                    item.customer_name && item.customer_name.toLowerCase().includes(consignorSearchTerm)
                );
            }
            if (lrnoSearchTerm) {
                BillRegister = BillRegister.filter(item =>
                    item.lr_no && item.lr_no.split(',').some(lr => lr.trim().includes(lrnoSearchTerm))
                );
            }
            if (searchTerm) {
                BillRegister = BillRegister.filter(item =>
                    (item.bill_no && item.bill_no.toString().toLowerCase().includes(searchTerm)) ||
                    (item.bill_date && item.bill_date.toLowerCase().includes(searchTerm)) ||
                    (item.customer_name && item.customer_name.toLowerCase().includes(searchTerm)) ||
                    (item.total_amount && item.total_amount.toString().toLowerCase().includes(searchTerm))
                );
            }

            const total = BillRegister.length;
            const paginatedBillRegister = BillRegister.slice(offset, offset + pageSize);

            // Calculate total amount of filtered bills
            const totalAmount = BillRegister.reduce((sum, item) => sum + item.total_amount, 0);

            return res.json({
                BillRegisters: paginatedBillRegister,
                total: total,
                totalAmount: totalAmount.toFixed(2) // Ensure the total amount is formatted to 2 decimal places
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};






  module.exports = {
    getbilllistforreportbydate,
  };


  