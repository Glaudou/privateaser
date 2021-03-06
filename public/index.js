'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];



//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function calculatePrice() {
  var priceHour;
  var pricePerson;
  var ind;
  var event;
  for (event in events){
    for (ind in bars) {
      if (events[event].barId == bars[ind].id) {
        priceHour = bars[ind].pricePerHour;
        pricePerson = bars[ind].pricePerPerson;
      }
    }
    events[event].price = (events[event].time * priceHour + events[event].persons * pricePerson);
  }
}

function calculateDiscount() {
  var index = 0;
  var event;
  var priceHour;
  var pricePerson;
  for (event in events){
    for (index in bars) {
      if (events[event].barId == bars[index].id) {
        priceHour = bars[index].pricePerHour;
        pricePerson = bars[index].pricePerPerson;
      }
    }
     if (events[event].persons > 10 && events[event].persons <= 20) {
       events[event].price = (events[event].time * priceHour + 0.9 * events[event].persons * pricePerson);
     }
     if (events[event].persons > 20 && events[event].persons <= 60) {
       events[event].price = (events[event].time * priceHour + 0.7 * events[event].persons * pricePerson);
     }
     if (events[event].persons > 60) {
       events[event].price = (events[event].time * priceHour + 0.5 * events[event].persons * pricePerson);
     }
     index = 0;
  }
}

function commission() {
  for (event in events){
    events[event].commission.insurance = 0.15*events[event].price;
    events[event].commission.treasury = events[event].persons;
    events[event].commission.privateaser = 0.3 * events[event].price - (events[event].commission.insurance + events[event].commission.treasury);
  }
}

function deductible(){
  var event;
  for (event in events){
    if (events[event].options.deductibleReduction == true) {
      events[event].price += events[event].persons;
      events[event].commission.privateaser += events[event].persons;
    }
  }
}

function actorsDebitCredit() {
  var actor;
  var event;
  var index =0;
  for (actor in actors) {
    for (event in events) {
      if (actors[actor].eventId == events[event].id) {
        actors[actor].payment[0].amount = events[event].price;
        actors[actor].payment[1].amount = events[event].price - (events[event].commission.insurance + events[event].commission.treasury + events[event].commission.privateaser);
        actors[actor].payment[2].amount = events[event].commission.insurance;
        actors[actor].payment[3].amount = events[event].commission.treasury;
        actors[actor].payment[4].amount = events[event].commission.privateaser;
      }
    }
  }
}

calculatePrice();
calculateDiscount();
commission();
deductible();
actorsDebitCredit();


console.log(bars);
console.log(events);
console.log(actors);
