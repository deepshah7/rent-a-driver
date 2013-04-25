// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Brands.find().count() === 0) {
    var data = [
      {name: "Tata",
       contents: [
         "Indica ev2", "Indica Vista", "Indigo", "Manza"
       ]
      },
      {name: "Toyota",
       contents: [
         "Innova", "Corolla"
         ]
      }
    ];

    var timestamp = (new Date()).getTime();
    for (var i = 0; i < data.length; i++) {
      var brand_id = Brands.insert({name: data[i].name});
      for (var j = 0; j < data[i].contents.length; j++) {
        Models.insert({brand_id: brand_id,
                      name: data[i].contents[j]
                    });
      }
    }
  }
});
