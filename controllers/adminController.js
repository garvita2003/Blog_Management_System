const BlogSetting = require("../models/blogSettingModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Setting = require("../models/settingModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}


const blogSetup =  async (req,res) => {
    try {
        var setting = await BlogSetting.find({});
        if(BlogSetting.length>0){
            res.redirect('/login');
        }
        else{
            res.render('blogSetup');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const blogSetupSave = async (req,res) => {
    try {
        const blog_title = req.body.blog_title;
        const blog_image = req.file.filename;
        const blog_description = req.body.description;
        const blog_email = req.body.email;
        const blog_name = req.body.name;
        const password = await securePassword(req.body.password);

        const blogSetting = new BlogSetting({
            blog_title:blog_title,
            blog_image:blog_image,
            blog_description:blog_description
        });

        await blogSetting.save();

        const user = new User({
            name:name,
            email:email,
            password:password,
            is_admin:1
        });

        const userData = await user.save();

        if(userData)
        {
            res.redirect('/login');
        }
        else
        {
            res.render('blogSetup',{message:'Blog not setup properly'});
        }   
        }
        catch (error) {
            console.log(error.message);
        }
}

const dashboard = async(req,res) => {
    try {
        const allPosts = await Post.find({});
        req.render('admin/dashboard',{post: allPosts});
    } catch (error) {
        console.log(error.message);        
    }
}


const loadPostDashboard = async(req,res) => {
    try{
        res.render('admin/postDashboard');
    }
    catch(error){
     console.log(error.message);   
    }
}


const addPost = async(req,res) => {
    try{

        var image = '';
        if(req.body.image!==undefined){
            image = req.body.image;
        }
        const post = new Post({
            title: req.body.title,
            content : req.body.content,
            image  : image
        }) ;

        const postData = await post.save();

        res.send({success:true, msg: 'Post Added Successfully!', _id:postData._id});
        // res.render('admin/postDashboard',{message:'Post Added Successfully!'});
    }
    catch(error){
        res.send({success:false, msg: error.message});

    }
}


const uploadPostImage = async(req,res) => {
    try {
        var imagePath = '/images';
        imagePath = imagePath + '/' + req.file.filename;
        res.send({success:true, msg: 'Image Uploaded', path:imagePath});
    } catch (error) {
        res.send({success:false, msg: error.message});
    }
}


const deletePost = async(req,res) => {
    try {
        await Post.deleteOne({_id:req.body.id});
        res.status(200).send({success:true, msg: 'Post Deleted Successfully!'});
    } catch (error){
        res.status(400).send({success:false, msg: error.message});
    }
}


const loadEditPost = async(req,res) => {
    try {
        const postData = await Post.findOne({_id:req.body.id});
        res.render('admin/editPost',{post:postData});
    } catch (error){
        // res.status(400).send({success:false, msg: error.message});
        console.log(error.message);
    }
}


const updatePost = async(req,res) => {
    try {
        await Post.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                title:req.body.title,
                content:req.body.content,
                image:req.body.image
            }
        });
        res.status(200).send({success:true, msg: 'Post Updated Successfully!'});
    } catch (error){
        res.status(400).send({success:false, msg: error.message});
    }
}

const loadSettings = async(req,res) => {
    try {
        const setting = await Setting.findOne({});
        var postLimit = 0;
        if(setting1=null){
            postLimit = setting.post_limit;
        }

        res.render('admin/setting',{limit:postLimit});
    } catch (error) {
        console.log(error.message);
    }
}


const saveSettings = async(req,res) => {
    try {
        await Setting.update({},{
            post_limit:req.body.limit
        },
        {upsert: true}
    );

        res.status(200).send({success:true, msg: 'Settings Updated Successfully!'});
    } catch (error) {
        res.status(400).send({success:false, msg: error.message});
    }
}



module.exports = {
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    addPost,
    securePassword,
    uploadPostImage,
    deletePost,
    loadEditPost,
    updatePost,
    loadSettings,
    saveSettings
}