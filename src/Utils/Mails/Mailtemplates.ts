function ContactFormMail(email: string, message: string) {
  return `
  <div 
  style ="text-align: center;
  padding: 70px 0;"
  >
  <div>
  <h1 style="text-align:center;
  padding: 20px;
  ">A New Contact Message from ${email}</h1>
  <p 
  style="text-align:center;
  width: 70%;
  padding: 40px;
  margin: 0 auto;
  font-size:22px;
  word-spacing: 4px;
  ">
  ${message} </p>

  </div>
  
  </div> 
  `;
}
function ForgotPasswordUser(user:any, token: string) {
  return `
  <div 
  style ="text-align: center;
  padding: 70px 0;"
  >
    <h1>Hello ${user.name}</h1>
    <h2>Welcome in ebazar.</h2>
    <div>
      <h1>Click On The Link To Reset Your Password 
      <a className="btn btn-info btn-block" 
      href='${
        process.env.FRONTEND_URL
      }/user/reset-password?token=${token}'>Click Here</a> </h1>
      </div>
  
  </div> 
  `;
}
function ForgotPasswordSeller(seller: any, token: string) {
  return `
  <div 
  style ="text-align: center;
  padding: 70px 0;"
  >
    <h1>Hello ${seller.name}</h1>
    <h2>Welcome in ebazar.</h2>

    <div>
   <h1>Click On The Link To Reset Your Password 
   <a className="btn btn-info btn-block" 
   href='${
     process.env.FRONTEND_URL
   }/seller/password-reset?token=${token}'>Click Here</a> </h1>
   </div>
  </div> 
  `;
}
function SellerVerification(seller: any, token: string) {
  return `
  <div 
  style ="text-align: center;
  padding: 70px 0;"
  >
    <h1>Hello ${seller.name}</h1>
    <h2>Welcome in ebazar.</h2>
    <div>
      <h1>Click On The Link To Verify Your Account <a href='${
        process.env.FRONTEND_URL
      }/seller/verification?token=${token}'>Click Here</a> </h1>
      </div>
  
  </div> 
  `;
}

export {
  ContactFormMail,
  SellerVerification,
  ForgotPasswordUser,
  ForgotPasswordSeller,
};
