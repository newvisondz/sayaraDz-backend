const Commande = require('./model')

exports.create = function (body, req, res) {
  let commande = new Commande(
      {
        date: body.date,
        montant: body.montant,
        automobiliste: body.automobiliste,
        vehicule: body.vehicule
      }
  );

  commande.save(function (err) {
      if (err) {
        return next(err);
      }
      res.send('Commande créée avec succès')
  })
};


exports.get = function (req, res){
  res.send('Greetings from the Test controller!');
}