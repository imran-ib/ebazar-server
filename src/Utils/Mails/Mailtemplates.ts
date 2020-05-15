import { User } from "@prisma/client";

import { ElevenDigitKey } from "../TokenORKey/GenCustomKey";

function LoginSecret(user: User, key: string) {
  return `
  <div 
  style ="text-align: center;
  padding: 70px 0;"
  >
    <h1>Hello ${user.email}</h1>
    <h2>Welcome in Prismagram.</h2>
    <h3> Your Code is : <a><b style="color:red" >${key}</b></a> </h3>
  
  </div> 
  `;
}
// function WelcomeMessage(user, ctx: Context, VerificationKey) {
//   return `
//   <div>Hello Mr.${user.fullName}</div>
//   <div>Welcome in My Portfolio App.</div>
//   <p> Your Code is ${VerificationKey}</p>
//     <div>Please find link to validate your email.
//        ${process.env.FRONTEND_URL}/validateEmail?validateEmailToken=${VerificationKey}
//     </div>
//   `;
// }

// function PasswordResetLink(token, user: User, ctx: Context) {
//   return `
//     <div>hello</div>
//     <div>Please find link to reset your password.
//     <a href="${process.env.FRONTEND_URL}/user-reset-password?token=${token}">Click Here </a>
//     </div>
//   `;
// }

// export { WelcomeMessage, PasswordResetLink, LoginSecret };
export { LoginSecret };
