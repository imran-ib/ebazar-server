import { intArg, mutationType, stringArg } from '@nexus/schema'
import { ObjectDefinitionBlock } from '@nexus/schema/dist/core'
import { validateEmail } from '../../Utils/Mails/ValidateEmail'
import { Hash, ComparePassword } from '../../Utils/bcryptJs/HashPassword'
import { GenerateToken } from '../../Utils/JWT/GenerateJwt'
import { Context } from '../../context'
import { uid } from 'rand-token'
import { Mails } from '../../Utils/Mails/SendMail'

export const UserMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
  t.field('CreateUser', {
    type: 'AuthPayload',
    args: {
      email: stringArg({ required: true }),
      password: stringArg({ required: true }),
      avatar: stringArg({ required: false }),
      name: stringArg({ required: true }),
    },
    description: 'Create New User',

    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      try {
        // Validate Email
        let email: string = args.email.toLowerCase()
        const ValidEmail: Boolean = validateEmail(email)
        if (!ValidEmail) {
          throw new Error(`The Email Address You Provided is Invalid.`)
        }
        // find the User
        const userExists = await ctx.prisma.user.findOne({
          where: {
            email: args.email,
          },
        })
        // if User Exists Throw Error
        if (userExists) {
          throw new Error(`User With Email: ${email}  Already Exists.?`)
        }
        //if Password is short throw Error
        if (args.password.length < 4) {
          throw new Error(`Password is Too Short`)
        }
        // hash password
        let password: string = args.password
        const hashedPassword: string = await Hash(password)
        // create User with Valid Email And hashed Password
        const USER = await ctx.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            permissions: 'NONE',
            name: args.name,
            avatar: args.avatar,
            role: args.email === 'iib.webdevs@gmail.com' ? 'ADMIN' : 'USER',
          },
        })
        // login User
        // User can Login After creating Account But Seller must be Verified Before Login
        const token: string = GenerateToken(USER.id, null, ctx.response)
        return {
          token,
          user: USER,
          seller: null,
        }
      } catch (error) {
        throw new Error(`${error.message}`)
      }
    },
  })
  t.field('UserLogin', {
    type: 'AuthPayload',
    args: {
      email: stringArg({
        required: true,
        description: 'User Email',
      }),
      password: stringArg({ required: true, description: 'User Password' }),
    },
    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        // if user or seller is already logged log them out
        // ctx.response.clearCookie('token')

        let email: string = args.email.toLowerCase()
        const userExists = await ctx.prisma.user.findOne({
          where: { email },
        })

        if (!userExists)
          throw new Error(
            `Looks Like There is no user register with ${args.email}.`,
          )

        const correctPassword = await ComparePassword(
          args.password,
          userExists.password,
        )
        if (!correctPassword)
          throw new Error(
            `Your Password Is Not Correct. Did You Forget Your Password.?`,
          )
        const token = GenerateToken(userExists.id, null, ctx.response)

        return {
          token,
          user: userExists,
          seller: null,
        }
      } catch (error) {
        throw new Error(`${error.message}`)
      }
    },
  })
  t.field('UserLogout', {
    type: 'String',
    description: 'Log User Out',
    resolve: (__, args, ctx: any, _) => {
      ctx.response.clearCookie('token')
      return 'Goodbye!'
    },
  })
  t.field('UserForgotPasswordRequest', {
    type: 'String',
    args: {
      email: stringArg({ required: true }),
    },
    description: 'User Request A Password Reset',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      try {
        ctx.response.clearCookie('token')

        const User = await ctx.prisma.user.findOne({
          where: {
            email: args.email,
          },
        })
        if (!User) throw new Error(`No User Found With ${args.email}`)

        const ResetToken = uid(40)
        const resetTokenExpiry = Date.now() + 1800000 // half an hour
        await ctx.prisma.user.update({
          where: { email: args.email },
          data: {
            PasswordResetToken: ResetToken,
            PasswordResetTokenExpiry: resetTokenExpiry,
          },
        })
        Mails.ForgotPasswordUser(User, ResetToken)
        return `Success! Password Reset Token Has Been Generated and Sent To Your Email Address`
      } catch (error) {
        throw new Error(error.message)
      }
    },
  })
  t.field('ResetUserPassword', {
    type: 'String',
    args: {
      token: stringArg({ required: true }),
      password: stringArg({ required: true }),
      confirmPassword: stringArg({ required: true }),
    },
    description: 'User Reset Password',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        // check if there is any token clear it
        ctx.response.clearCookie('token')
        // check if token is valid
        // 1. check if the passwords match
        if (args.password.length < 5) {
          throw new Error(
            `Password is Too Short. It Should Not Be Less then 4 characters`,
          )
        }
        if (args.password !== args.confirmPassword)
          throw new Error('Your Password Don not Match')
        // 2. check if its a legit reset token
        const [User] = await ctx.prisma.user.findMany({
          where: {
            AND: [
              {
                PasswordResetToken: {
                  equals: args.token,
                },
              },
              {
                PasswordResetTokenExpiry: {
                  gte: Date.now() - 1800000,
                },
              },
            ],
          },
        })
        if (!User) throw new Error(`Your Token is Either invalid or expired`)
        const hashedPassword = await Hash(args.password)

        const UpdatedUser = await ctx.prisma.user.update({
          where: {
            id: User.id,
          },
          data: {
            password: hashedPassword,
            PasswordResetToken: null,
            PasswordResetTokenExpiry: null,
          },
        })
        // Log User in
        const token: string = GenerateToken(UpdatedUser.id, null, ctx.response)

        return `Success! Password is update You Can Now Login`
      } catch (error) {
        throw new Error(`${error.message}`)
      }
    },
  })
  // User Auth
  t.field('ResetUsersPasswordFromProfile', {
    type: 'String',
    args: {
      OldPassword: stringArg({ required: true }),
      password: stringArg({ required: true }),
      confirmPassword: stringArg({ required: true }),
    },
    description: 'User Reset Password',
    //@ts-ignore
    resolve: async (
      parent: any,
      args: {
        OldPassword: string
        password: string
        confirmPassword: string
      },
      ctx: Context,
      info: any,
    ) => {
      try {
        // check if Old Password is Correct
        const user = ctx.request.user
        const IsCorrectPassword = await ComparePassword(
          args.OldPassword,
          user.password,
        )
        if (!IsCorrectPassword) throw new Error(`Your Old Password is wrong`)
        const isSame = await ComparePassword(args.password, user.password)
        if (isSame)
          throw new Error(`New Password should be different from old Password`)

        if (args.password.length < 5) {
          throw new Error(
            `Password is Too Short. It Should Not Be Less then 4 characters`,
          )
        }
        if (args.password !== args.confirmPassword)
          throw new Error('Your Password Don not Match')

        // hash password
        let password: string = args.password
        const hashedPassword: string = await Hash(password)

        const UpdatedUser = await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashedPassword,
          },
        })
        return `Your password has been changed`
      } catch (error) {
        throw new Error(`${error.message}`)
      }
    },
  })
  // User Auth
  t.field('DeleteUserAccount', {
    type: 'String',
    args: { userId: stringArg({ required: true }) },
    //@ts-ignore
    resolve: async (
      parent: any,
      args: { userId: string },
      ctx: any,
      info: any,
    ) => {
      try {
        const { userId } = args
        await ctx.prisma.cartItem.deleteMany({ where: { userId } })
        await ctx.prisma.order.deleteMany({ where: { userId } })
        await ctx.prisma.like.deleteMany({ where: { userId } })
        await ctx.prisma.address.deleteMany({ where: { userId } })
        await ctx.prisma.review.deleteMany({ where: { authorId: userId } })
        await ctx.prisma.user.delete({ where: { id: userId } })
        return `Success! User Deleted`
      } catch (error) {
        throw new Error(error.message)
      }
    },
  })
}
