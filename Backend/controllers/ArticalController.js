const db = require("../config/dbConfig");

const getArtical = (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const offset = page * pageSize;
    const searchTerm = req.query.search; 
    const query = 'CALL getallarticles()';
    
    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }
            
            let articles = results[0];
            articles.reverse();
           
            
            // Filtering based on search term
            if (searchTerm) {
                articles = articles.filter(article =>
                    (article.articles_name && article.articles_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            
            const total = articles.length; 
            
            // Transform articles_name and description to uppercase
            articles = articles.map(article => ({
                ...article,
                articles_name: article.articles_name.toUpperCase(),
                description: article.description ? article.description.toUpperCase() : null
            }));
            
            const paginatedarticles = articles.slice(offset, offset + pageSize);
          return  res.json({
                articles: paginatedarticles,
                total: total
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};

const getArticals = (req, res) => {

    const query = 'CALL getallarticles()';
    
    try {
        db.query(query,  (err, results) => {
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


 const getArticalbyid = (req, res) => {
  
    const id = req.params.id; 

    const query = 'CALL getarticlebyid(?)';

    try {
        db.query(query, id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }
            console.log(results[0]);
            return   res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};

const AddArtical = (req, res) => {


    const {articles_name, description } = req.body;
    console.log("hiiiii",req.body)

    const query = 'CALL addarticle( ?, ?, @message)';
    
    try {
        db.query(query, [articles_name, description], (err, results) => {
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
                return   res.json({ message: result[0].message });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};
const UpadteArtical = (req, res) => {
    const { id } = req.params; 
    const { articles_name, description } = req.body; 

    const query = 'CALL updatearticles(?, ?, ?, @message)';
    
    try {
        db.query(query, [id, articles_name, description], (err, results) => {
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
                return  res.json({ message: result[0].message });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};


const deleteArtical = (req, res) => {
    const id = req.params.id.toString();
    console.log("iddd", id);
    const query = 'CALL deletearticles(?, @message)';

    db.query(query, [`(${id})`], (err, results) => {
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
            return  res.json({ message: result[0].message });
        });
    });
};

const AddEmail = (req, res) => {


    const {email } = req.body;
    console.log("hiiiii",req.body)

    const query = 'CALL addemail( ?, @message)';
    
    try {
        db.query(query, [email], (err, results) => {
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
                return   res.json({ message: result[0].message,status:200 });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};
const getEmail = (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const offset = page * pageSize;
    const searchTerm = req.query.search; 
    const query = 'CALL getallemails()';
    
    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }
            
            let email = results[0];
            email.reverse();
           
            
            // Filtering based on search term
            if (searchTerm) {
                email = email.filter(email =>
                    (email.emailid && email.emailid.toLowerCase().includes(searchTerm.toLowerCase())) 
                );
            }
            
            const total = email.length; 
            
            // Transform articles_name and description to uppercase
            email = email.map(email => ({
                ...email,
                emailid: email.emailid.toUpperCase()
            }));
            
            const paginatedarticles = email.slice(offset, offset + pageSize);
          return  res.json({
            email: paginatedarticles,
                total: total
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};
const getEmailbyid = (req, res) => {
  
    const id = req.params.id; 

    const query = 'CALL getemailbyid(?)';

    try {
        db.query(query, id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }
            console.log(results[0]);
            return   res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};
const UpadteEmail = (req, res) => {
    const { id } = req.params; 
    const { emailid } = req.body; 

    const query = 'CALL updateemailbyid(?, ?, @message)';
    
    try {
        db.query(query, [id, emailid], (err, results) => {
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
                return  res.json({ message: result[0].message });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};
const deleteEmail = (req, res) => {
    const id = req.params.id.toString();
    console.log("iddd", id);
    const query = 'CALL deleteemails(?, @message)';

    db.query(query, [`(${id})`], (err, results) => {
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
            return  res.json({ message: result[0].message });
        });
    });
};
  module.exports = {
    deleteEmail,
    UpadteEmail,
    getEmailbyid,
    getEmail,
    AddEmail,
    getArtical,
    getArticalbyid,
    UpadteArtical,
    deleteArtical,
    AddArtical,
    getArticals
  };