const Commande = require('./model')
const { isAutomobiliste, authenticated } = require('../../services/acl')

exports.create =[
  isAutomobiliste,
  authenticated,
  (req, res) => {
    const body = req.body
    console.log(body.montant)
    let commande = new Commande({
        montant: body.montant,
        date: body.date,
        automobiliste: body.automobiliste,
        vehicule: body.vehicule
      }
    );
    commande.save((err, commande)=>{
      if (err) res.send("erreur lors de la création de la commande : " + err);
      res.send(commande);
    })
  }
] 



exports.show = (req, res) => {
  Commande.findById(req.params.id,(err, commande) => {
    if (err) res.send("erreur lors du show de la commande : " + err);
    res.send(commande);
  })
};

exports.update = function (req, res) {
  let updatedCommande = req.body;
  Commande.findOneAndUpdate(req.params.id, updatedCommande, { "new": true}, (err, commande) => {
        if (err) res.send("erreur lors du update de la commande : " + err);
        res.send(commande);
  });
};

exports.deleteOne = function (req, res) {
  Commande.findOneAndDelete(req.params.id,(err) => {
        if (err) res.send("erreur lors du delete de la commande : " + err);
        res.send("Commande supprimée avec succès");
  });
};


