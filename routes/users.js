var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/info/:name')
.get(function(req, res,){
  res.send("Get "+req.params.name);
})
.post(function(req,res){
  res.send("Post "+req.params.name);
});

module.exports = router;
