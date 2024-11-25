const db = require("../config/dbConfig");

const getAllPlace = (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const offset = page * pageSize;
    const searchTerm = req.query.search; 
    const query = 'CALL getallplaces()';

    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            let places = results[0];

            if (searchTerm) {
                places = places.filter(place => 
                    (place.place_name && place.place_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (place.place_abbreviation && place.place_abbreviation.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            places.reverse(); 

            const total = places.length;
            places = places.map(places => ({
                ...places,
                place_name: places.place_name.toUpperCase(),
                place_abbreviation: places.place_abbreviation ? places.place_abbreviation.toUpperCase() : null
            }));
            const paginatedPlaces = places.slice(offset, offset + pageSize);

            return   res.json({
                places: paginatedPlaces,
                total: total
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};

const getAllPlaces = (req, res) => {
    const query = 'CALL getallplaces()';
    
    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            // Assuming results[0] contains the place data
            const places = results[0];

            // Mapping the data to extract necessary fields
            const mappedPlaces = places
                .filter(place => place.place_id != null && place.place_name != null)
                .map(place => ({
                    place_id: place.place_id,
                    place_name: place.place_name,
                }));

                return  res.json(mappedPlaces); // Send the mapped data as response
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};

 const getPlacebyid = (req, res) => {
   
     const id = req.params.id; 

    const query = 'CALL getplacebyid(?)';

    try {
        db.query(query, id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }
            
            return  res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};

// const AddPlace = (req, res) => {
    
//      const {  place_name, place_abbreviation,contact } = req.body;

//     const query = 'CALL addplace( ?, ?,?, @message)';
    
//     try {
//         db.query(query, [ place_name, place_abbreviation,contact], (err, results) => {
//             if (err) {
//                 console.error('Error executing query:', err);
//                 res.status(500).send('Server error');
//                 return;
//             }

//             db.query('SELECT @message as message', (err, result) => {
//                 if (err) {
//                     console.error('Error retrieving message:', err);
//                     res.status(500).send('Server error');
//                     return;
//                 }

//                 console.log(result[0].message)
//                 return res.json({ message: result[0].message });
//             });
//         });
//     } catch (err) {
//         console.error('Error:', err);
//         return  res.status(500).send('Server error');
//     }
// };
const AddPlace = (req, res) => {
    let { place_name, place_abbreviation, contact } = req.body;
    place_abbreviation = place_abbreviation.trim();
    const checkQuery = 'SELECT COUNT(*) AS count FROM place WHERE place_abbreviation = ?';

    try {
        db.query(checkQuery, [place_abbreviation], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            if (results[0].count > 0) {

                return res.status(400).json({ message: 'Place abbreviation already exists' });
            }

            const query = 'CALL addplace(?, ?, ?, @message)';
            db.query(query, [place_name, place_abbreviation, contact], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).send('Server error');
                    return;
                }

                db.query('SELECT @message as message', (err, result) => {
                    if (err) {
                        console.error('Error retrieving message:', err);
                        res.status(500).send('Server error');
                        return;
                    }

                    console.log(result[0].message);
                    return res.json({ message: result[0].message });
                });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};

// const UpadtePlace = (req, res) => {
  
    
//      const {  place_name, place_abbreviation,contact } = req.body; 
//  const id= req.params.id
//     const query = 'CALL updateplace(?, ?, ?,?, @message)';
    
//     try {
//         db.query(query, [id, place_name, place_abbreviation,contact], (err, results) => {
//             if (err) {
//                 console.error('Error executing query:', err);
//                 res.status(500).send('Server error');
//                 return;
//             }

//             db.query('SELECT @message as message', (err, result) => {
//                 if (err) {
//                     console.error('Error retrieving message:', err);
//                     res.status(500).send('Server error');
//                     return;
//                 }

        
//                 return  res.json({ message: result[0].message });
//             });
//         });
//     } catch (err) {
//         console.error('Error:', err);
//         return  res.status(500).send('Server error');
//     }
// };
const UpadtePlace = (req, res) => {
    const { place_name, place_abbreviation, contact } = req.body;
    const id = req.params.id;

    // Trim the place_abbreviation before checking and calling the stored procedure
    const trimmedAbbreviation = place_abbreviation.trim();

    // Query to check if the abbreviation already exists for another place
    const checkQuery = 'SELECT COUNT(*) AS count FROM place WHERE place_abbreviation = ? AND place_id != ?';

    try {
        db.query(checkQuery, [trimmedAbbreviation, id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            if (results[0].count > 0) {
                // If the abbreviation already exists for another place, send an error message
                return res.status(400).json({ message: 'Place abbreviation already exists for another place' });
            }

            // If abbreviation does not exist for another place, proceed to call the stored procedure
            const query = 'CALL updateplace(?, ?, ?, ?, @message)';
            db.query(query, [id, place_name, trimmedAbbreviation, contact], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).send('Server error');
                    return;
                }

                // Retrieve the message from the stored procedure
                db.query('SELECT @message as message', (err, result) => {
                    if (err) {
                        console.error('Error retrieving message:', err);
                        res.status(500).send('Server error');
                        return;
                    }

                    return res.json({ message: result[0].message });
                });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};


const deletePlace = (req, res) => {
    
    
     const id = req.params.id.toString();
     
    const query = 'CALL deleteplace(?, @message)';

    try {
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            db.query('SELECT @message as message', (err, result) => {
                if (err) {
                    console.error('Error retrieving message:', err);
                    res.status(500).send('Server error');
                    return;
                }
                
                return res.json({ message: result });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};

  module.exports = {
    getAllPlace,
    getPlacebyid,
    UpadtePlace,
    deletePlace,
    AddPlace,
    getAllPlaces
  };