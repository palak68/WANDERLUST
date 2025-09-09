const Listing = require("../MODELS/listing");
const { validateListing } = require("../middleware.js"); 
const axios = require("axios");
module.exports.index = async (req,res)=>{
    const allListings= await  Listing.find({})
     res.render("listings/index",{allListings}) 
 
 };

 module.exports.renderNewForm = (req,res)=>{
     res.render("listings/new")
 };
 module.exports.showListing = async(req,res)=>{
 let {id}= req.params;
  const listing =await  Listing.findById(id)
  .populate({path:"reviews",
    populate:{
        path:"author"
    },

  })
  .populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exits!");
   return res.redirect("/listings")
  }
  

  res.render("listings/show",{listing});
 };

  module.exports.createListing = async(req,res)=>{
       validateListing;
       
    

        const newListing= new Listing(req.body.listing);
        newListing.owner = req.user._id;
        
        if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    }

       await newListing.save();
       req.flash("success", "New Listing Created");
       res.redirect("/listings")   
       };

       module.exports.editListing = async(req,res)=>{
            let {id}= req.params;
         const listing =await  Listing.findById(id);
         if(!listing){
           req.flash("error", "Listing you requested for does not exits!");
          return  res.redirect("/listings")
         }

         let orignalImageUrl = listing.image.url;
  orignalImageUrl.replace("/upload","/upload/h_300,w_250");


         res.render("listings/edit",{listing, orignalImageUrl});
        };

        module.exports.updateListing =async(req,res)=>{
             validateListing;
              if(!req.body.listing){
                 throw new ExpressError(400,"send valid request for listing")
             };
             console.log(req.body)
             let {id}= req.params;
              let listing = await Listing.findById(id);
             let updatedData = req.body.listing;
             if(!updatedData.image||!updatedData.image.url){
                 updatedData.image = listing.image
         
             };
         if(!updatedData.description||!updatedData.description.trim() ===""){
                 updatedData.description = listing.description
         
             };
        
              await Listing.findByIdAndUpdate(id,{...req.body.listing});
               
if (updatedData.location) {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: updatedData.location, format: "json", limit: 1 }
        });

        
}
    
              if ( req.file ) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    };
    await listing.save();
              req.flash("success", " Listing Updated");
              res.redirect(`/listings/${id}`);
              console.log(req.file)
         };

         module.exports.deleteListing = async(req,res)=>{
            let {id}= req.params;
               let deletedListing= await Listing.findByIdAndDelete(id);
               console.log(deletedListing)
               req.flash("success", " Listing Deleted");
               res.redirect("/listings");  
          };