const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.score) {
    return res.status(400).json({ error: 'RAWR! Name, age, and score are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    score: req.body.score,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

const bestDomos = (request, response) => {
  const res = response;

  return Domo.DomoModel.find().select('name age score').then((docs) => {
    const domoArray = docs.map((domo) => ({
      id: domo.id, name: domo.name, age: domo.age, score: domo.score,
    })).sort((a, b) => b.score - a.score).slice(0, 5);

    return res.json({ domos: domoArray });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.bestDomos = bestDomos;
module.exports.make = makeDomo;
