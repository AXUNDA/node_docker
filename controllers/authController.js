const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req,res)=>{
      try {
            const {username,password} = req.body
            const hashedPassword = await bcrypt.hash(password,12)
            const newUser = await User.create({
                  username,
                  password: hashedPassword
            })
            req.session.user = newUser
            res.status(201).send({
                  status:"success",
                  data:{
                        user:newUser
                  }
            })
            
      } catch (error) {
            res.status(404).send({
                  status:"failed",
                  error

            })
            
      }

}

exports.login = async (req,res)=>{

      try {
            const {username,password} = req.body
            const user = await User.findOne({username})
            if(!user){
                 return  res.status(404).send({
                        error:"user error, user not found"
                  })
            }else{
                  const status = bcrypt.compareSync(password,user.password)
                  if(status){
                        req.session.user = user
                       return  res.status(200).json({
                              status:"logged in",
                              message:"you are logged in "
                        })
                  }else{
                     return   res.status(500).send({
                              error:"incorrect password"
                        })
                  }
            }
            
      } catch (error) {
            res.status(504).send({
                  error

            })
            
      }
}