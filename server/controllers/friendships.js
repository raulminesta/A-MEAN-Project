var mongoose      = require('mongoose');
var Friendship    = mongoose.model('Friendship');
var User          = mongoose.model('User');

module.exports ={
  request: function(req, res){
    var friendReq = new Friendship();
    friendReq.his.username = req.body.him;
    friendReq.her.username = req.body.her;
    friendReq.save(function(err, success){
      if (err) {
        res.json(err);
      } else {
        res.json(success);
      }
    })
  },

  pending: function(req, res){
    var pending = Friendship.find({'his.username': req.params.id,
                                    confirmed: false})
    .populate('his.username')
    .populate('her.username')
    .exec(function(err, success){
      if (err){
        console.log("PENDING ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          asked.push(success[i]);
        };
        res.json(asked);
      }
    });
  },

  requested: function(req, res){
    var requested = Friendship.find({'her.username': req.params.id,
                                    confirmed: false})
    .populate('his.username')
    .populate('her.username')
    .exec(function(err, success){
      if (err){
        console.log("REQUEST ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          asked.push(success[i]);
        };
        res.json(asked);
      }
    });
  },

  confirm: function(req, res){
    var pending = Friendship.find({'his.username': req.params.id,
                                    confirmed: true})
    .populate('her.username')
    .exec(function(err, success){
      if (err){
        console.log("CONFIRMED ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          asked.push(success[i].her.username);
        };
        res.json(asked);
      }
    });
  },

  delete: function(req, res){
   Friendship.remove({_id:req.params.id}, function(err){
    res.json();
   });
  }
};


