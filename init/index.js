const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listings.js");

//setting up the database
main()
    .then(() => {
        console.log("connection with database was successfull!!")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}


const initialize = async () => {
    //first deletingg the existing records from the database...
    await Listings.deleteMany({});
    let newDataWithOwner = initData.data.map((lis) => ({
        ...lis , owner : "6629341fd9763121c4a498db",
    }));


    const updateListingsWithImageInfo = newDataWithOwner.map((listing) => {
        // Extract a filename-like string from the title
        const filename = listing.title.replace(/\s+/g, "-").toLowerCase();
      
        return {
          ...listing,
          image: {
            url: listing.image,
            filename: filename,
          },
        };
      });
      console.log(updateListingsWithImageInfo);
    await Listings.insertMany(updateListingsWithImageInfo);
    const d = await Listings.find({});
    console.log("The data was inserted into the database....", d)
}

initialize();
