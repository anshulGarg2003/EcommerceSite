const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  desc: { type: String, required: true },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
