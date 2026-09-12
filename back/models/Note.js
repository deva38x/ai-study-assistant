const mongoose = require ("mongoose")

const NoteSchema = new mongoose.Schema(
    {
        title:
        {
            type : String,
            required : true,
        },
        subject :{
            type : String,
            required : true,
        },
        pdfUrl :{
            type :String,
            required : true,
        },
        user :{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.models.note || mongoose.model("Note",NoteSchema);