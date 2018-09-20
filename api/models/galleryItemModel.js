const mongoose = require("mongoose")

const galleryItemSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    branch_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch", 
        required: true,
    },
    caption: {
        type: String, 
        required: true, 
    },
    description : {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras sed dui id odio tincidunt luctus.Curabitur non commodo neque, ac fringilla felis.Praesent et lorem nisi.Integer posuere sapien non aliquam efficitur.Donec ac augue est.Etiam tincidunt est ac mauris dictum posuere.Vivamus viverra blandit ligula, eget dignissim elit venenatis ut.Ut imperdiet tortor et urna molestie semper.Vestibulum convallis mollis ipsum nec viverra.Vivamus ex ligula, tristique at nunc vitae, efficitur posuere dui.Phasellus viverra, mi vel lobortis sagittis, mauris mi molestie metus, in tempor ante ligula eget dui.Nunc luctus libero ut libero porttitor, at suscipit ante tincidunt.Integer euismod eu urna ac pulvinar.Cras rutrum diam et est malesuada, ut ultrices velit condimentum.Sed congue lectus at porta malesuada.\nFusce eu nisl sit amet nisi tincidunt fringilla nec eu libero.Aenean sit amet mattis augue.Quisque a sapien vel tellus sollicitudin euismod in et arcu.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.Curabitur ac vehicula leo.Mauris sollicitudin hendrerit urna vitae pharetra.Vestibulum dictum imperdiet sem, vel feugiat eros dignissim sit amet.Curabitur luctus malesuada risus in mollis.Maecenas aliquam placerat dui nec pellentesque.Duis id cursus arcu.Ut ultricies orci blandit justo cursus euismod.Quisque dictum tempor interdum.Nullam at diam quis enim condimentum lacinia.\nSed fermentum viverra facilisis.Praesent id tellus molestie, maximus metus quis, volutpat felis.Mauris eget diam sit amet nisl commodo fringilla.Sed tempus dapibus lacus non faucibus.Nunc augue arcu, blandit in erat in , laoreet blandit eros.Vivamus lacinia mollis tortor, a bibendum eros fringilla et.Proin a nisi justo.Cras nec enim vel nulla laoreet semper sed eget lacus.Fusce commodo iaculis risus sed consectetur.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Sed pretium in sem porta efficitur.Aliquam interdum nec ex ut lacinia.Praesent lobortis, ligula eu dapibus scelerisque, sem libero auctor diam, sit amet mattis enim augue at est.Aliquam in odio lacus."
    },
    date: {
        type: Date,
        default: Date.now()
    },
    imageUrl: {
        type: mongoose.Schema.Types.Mixed, 
        required: true, 
    }

})

module.exports = mongoose.model("GalleryItem", galleryItemSchema);