
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

exports.StyleSchema = new Schema({
    name : String,
    permalink : String,
    meta : JSON,
    updated_at : { type : Date, default : Date.now },
    created_at : { type : Date, default : Date.now }
});

exports.ToolsLinksSchema = new Schema({
    title : String,
    descr : String,
    link : String
});

exports.ToolsCategorySchema = new Schema({
    title : String,
    descr : String,
    links : [this.ToolsLinksSchema]
});

exports.PlainSchema = new Schema({
    name : String,
    permalink : String,
    crunchbase_url : String,
    homepage_url : String,
    blog_url : String,
    twitter_username : String,
    category_code : String,
    number_of_employees: Number,
    founded_year: Number,
    founded_month: Number,
    founded_day: Number,
    deadpooled_year: Number,
    deadpooled_month: Number,
    deadpooled_day: Number,
    deadpooled_url: Number,
    tag_list: String,
    alias_list: String,
    email_address: String,
    phone_number: String,
    description: String,
    created_at: String,
    updated_at: String,
    image : {},
    products : [],
    relationships : [],
    competitions : [],
    providerships : [],
    total_money_raised : String,
    funding_rounds : [],
    investments : [],
    acquisitions : [],
    offices : [],
    milestones : [],
    ipo : String,
    screenshoots : [{
	attribution : String,
	available_sizes : []
    }],
    external_links : []    
});


