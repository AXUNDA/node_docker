const protect = (req,res,next)=>{

      const {user} = req.session
      if(!user){
            return res.status(400).send({
                  status:"failed",
                  message:"unauthorized"
            })
      }
      req.user = user
      next()
}

module .exports = protect