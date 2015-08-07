var express = require('express');
var router = express.Router();

/*
 * GET locations.
 */
router.get('/locations', function(req, res) {
    var db = req.db;
    var collection = db.get('locations');
    console.log(collection);
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to location.
 */
router.post('/addlocation', function(req, res) {
    var db = req.db;
    var collection = db.get('locations');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteLocation.
 */
router.delete('/deletelocation/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('locations');
    console.log(collection);
    var locationToDelete = req.params.id;
    collection.remove({ '_id' : locationToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;