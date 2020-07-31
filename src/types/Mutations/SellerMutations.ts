import { stringArg } from '@nexus/schema'
import { ObjectDefinitionBlock } from '@nexus/schema/dist/core'
import { validateEmail } from '../../Utils/Mails/ValidateEmail'
import { Hash, ComparePassword } from '../../Utils/bcryptJs/HashPassword'
import { GenerateToken } from '../../Utils/JWT/GenerateJwt'
import { Context } from '../../context'
import { uid } from 'rand-token'
import { Mails } from '../../Utils/Mails/SendMail'

export const SellerMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
  t.field('CreateSeller', {
    type: 'String',
    args: {
      name: stringArg({ required: true }),
      email: stringArg({ required: true }),
      password: stringArg({ required: true }),
      confirmPassword: stringArg({ required: true }),
      storeName: stringArg({ required: true }),
      sellerNationality: stringArg({ required: true }),
      sellerIdentification: stringArg({ required: true }),
      Brand: stringArg({ list: true, nullable: true }),
      AddressName: stringArg({ required: true }),
      AddressAddress: stringArg({ required: true }),
      AddressCountry: stringArg({ nullable: true }),
      AddressState: stringArg({ nullable: true }),
      AddressCity: stringArg({ nullable: true }),
      AddressZipCode: stringArg({ nullable: true }),
      AddressMaincontactNubmer: stringArg({ required: true }),
      AddressStreetAddress1: stringArg({ nullable: true }),
      AddressStreetAddress2: stringArg({ nullable: true }),
      AddressCompany: stringArg({ nullable: true }),
    },
    description: 'Create New Seller Account',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        // Validate Email
        let email: string = args.email.toLowerCase()
        const ValidEmail: Boolean = validateEmail(email)
        if (!ValidEmail) {
          throw new Error(`The Email Address You Provided is Invalid.`)
        }

        const [SellerExists] = await ctx.prisma.seller.findMany({
          where: {
            OR: [
              { email: args.email },
              { sellerIdentification: args.sellerIdentification },
            ],
          },
        })
        if (SellerExists)
          throw new Error(`Account With That Email Already Exists`)

        if (args.password.length < 4) {
          throw new Error(
            `Password is Too Short. It Should Not Be Less then 4 characters`,
          )
        }
        if (args.password !== args.confirmPassword) {
          throw new Error(`Your Password Don't Match`)
        }
        const SellerVerificationToken = uid(40)
        let password = args.password
        const hashedPassword = await Hash(password)
        const Seller = await ctx.prisma.seller.create({
          data: {
            name: args.name,
            email: email,
            password: hashedPassword,
            storeName: args.storeName,
            sellerNationality: args.sellerNationality,
            sellerIdentification: args.sellerIdentification,
            EmailVarificationHash: SellerVerificationToken,
            Brand: {
              set: args.Brand,
            },
            PickupLocations: {
              //@ts-ignore

              create: {
                name: args.AddressName,
                address: args.AddressAddress,
                country: args.AddressCountry,
                state: args.AddressState,
                city: args.AddressCity,
                zipCode: args.AddressZipCode,
                MaincontactNubmer: args.AddressMaincontactNubmer,
                streetAddress1: args.AddressStreetAddress1,
                streetAddress2: args.AddressStreetAddress2,
              },
            },
            role: args.email === 'iib.webdevs@gmail.com' ? 'ADMIN' : 'SELLER',
          },
        })
        Mails.SellerVerificationToken(Seller, SellerVerificationToken)

        return `A Verification Email Has Been Sent To ${args.email}. Please Activate Your Account`
      } catch (error) {
        console.log('Seller -> CreateSeller -> error', error)
        throw new Error(`"Seller ->  CreateSeller -> error", ${error.message}`)
      }
    },
  })
  t.field('VerifySeller', {
    type: 'String',
    args: { SellerVerificationToken: stringArg({ required: true }) },
    description: 'Verify Seller Account',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      try {
        ctx.response.clearCookie('token')
        const [Seller] = await ctx.prisma.seller.findMany({
          where: {
            EmailVarificationHash: args.SellerVerificationToken,
          },
        })
        if (!Seller) {
          throw new Error(
            'Your Verification token is either invalid or expired',
          )
        }
        await ctx.prisma.seller.update({
          where: {
            id: Seller.id,
          },
          data: {
            EmailIsVerified: true,
            EmailVarificationHash: null,
          },
        })
        return `Success! Your Email is Verified, Thank You For Verifying Your Email Address`
      } catch (error) {
        console.log('Seller -> error', error.message)
        throw new Error(`"Seller -> error", ${error.message}`)
      }
    },
  })
  t.field('RequestEmailVerificationToken', {
    type: 'String',
    args: {
      email: stringArg({ required: true }),
    },
    description: 'Seller Request Email verification',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      try {
        // Validate Email
        let email: string = args.email
        const ValidEmail: Boolean = validateEmail(email)
        if (!ValidEmail) {
          throw new Error(`The Email Address You Provided is Invalid.`)
        }

        const SellerExists = await ctx.prisma.seller.findOne({
          where: {
            email: args.email,
          },
        })
        if (!SellerExists)
          throw new Error(`There is No Account Registered With This Email`)

        const SellerVerificationToken = uid(40)
        const Seller = await ctx.prisma.seller.update({
          where: {
            email: args.email,
          },
          data: {
            EmailVarificationHash: SellerVerificationToken,
          },
        })

        Mails.SellerVerificationToken(Seller, SellerVerificationToken)
        return `New Token Has Been Generated and Send To Your Email Address`
      } catch (error) {
        console.log(
          'Seller -> RequestEmailVerificationToken-> error',
          error.message,
        )
        throw new Error(
          `"Seller -> RequestEmailVerificationToken-> error", ${error.message}`,
        )
      }
    },
  })
  t.field('SellerLogin', {
    type: 'String',
    args: {
      email: stringArg({ required: true }),
      password: stringArg({ required: true }),
    },
    description: 'Seller Login',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      ctx.response.clearCookie('token')
      try {
        const SellerExists = await ctx.prisma.seller.findOne({
          where: {
            email: args.email.toLowerCase(),
          },
        })

        if (!SellerExists)
          throw new Error(`No Seller is registered with ${args.email}`)
        if (!SellerExists.EmailIsVerified) {
          throw new Error(`Please Activate Your Account First. `)
        }
        const ValidPassword = await ComparePassword(
          args.password,
          SellerExists.password,
        )

        if (!ValidPassword) throw new Error('Your Password is not Correct')
        const token = GenerateToken(null, SellerExists.id, ctx.response)
        return token
      } catch (error) {
        console.log('Seller -> SellerLogin -> error', error.message)
        throw new Error(`"Seller -> SellerLogin -> error", ${error.message}`)
      }
    },
  })
  t.field('SellerForgotPasswordRequest', {
    type: 'String',
    args: {
      email: stringArg({ required: true }),
    },
    description: 'Request A Password Reset',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      try {
        ctx.response.clearCookie('token')

        const Seller = await ctx.prisma.seller.findOne({
          where: {
            email: args.email,
          },
        })
        if (!Seller) throw new Error(`No User Found With ${args.email}`)

        const ResetToken = uid(40)
        const resetTokenExpiry = Date.now() + 1800000 // half an hour
        const UpdatedSeller = await ctx.prisma.seller.update({
          where: { email: args.email },
          data: {
            PasswordResetToken: ResetToken,
            PasswordResetTokenExpiry: resetTokenExpiry,
          },
        })

        Mails.ForgotPasswordSeller(UpdatedSeller, ResetToken)
        return `Success! Password Reset Token Has Been Generated and Sent To Your Email Address`
      } catch (error) {
        console.log(
          'Seller -> SellerForgotPasswordRequest -> error',
          error.message,
        )
        throw new Error(
          `Seller -> SellerForgotPasswordRequest -> error", ${error.message}`,
        )
      }
    },
  })
  t.field('ResetSellerPassword', {
    type: 'String',
    args: {
      token: stringArg({ required: true }),
      password: stringArg({ required: true }),
      confirmPassword: stringArg({ required: true }),
    },
    description: 'Reset Password',
    //@ts-ignore
    resolve: async (parent: any, args, ctx: any, info: any) => {
      try {
        // check if there is any token clear it
        ctx.response.clearCookie('token')
        // check if token is valid
        // 1. check if the passwords match
        if (args.password.length < 4) {
          throw new Error(
            `Password is Too Short. It Should Not Be Less then 4 characters`,
          )
        }
        if (args.password !== args.confirmPassword)
          throw new Error('Your Password Don not Match')
        // 2. check if its a legit reset token
        const [Seller] = await ctx.prisma.seller.findMany({
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
        if (!Seller) throw new Error(`Your Token is Either invalid or expired`)
        const hashedPassword = await Hash(args.password)
        await ctx.prisma.seller.update({
          where: {
            id: Seller.id,
          },
          data: {
            password: hashedPassword,
            PasswordResetToken: null,
            PasswordResetTokenExpiry: null,
          },
        })

        // after resetting the password. Seller should not directly login because they might have unverified email. They Must Login manually
        return `Success! Password is update You Can Now Login`
      } catch (error) {
        console.log('Seller -> ResetSellerPassword-> error', error.message)
        throw new Error(
          `"Seller -> ResetSellerPassword-> error", ${error.message}`,
        )
      }
    },
  })
  t.field('DeleteSellersAccount', {
    type: 'String',
    args: { sellerId: stringArg({ required: true }) },
    //@ts-ignore
    resolve: async (__: any, args: { sellerId: string }, ctx: any, _: any) => {
      try {
        const { sellerId } = args

        await ctx.prisma.catagory.deleteMany({
          where: { item: { sellerId: sellerId } },
        })
        await ctx.prisma.tag.deleteMany({
          where: { item: { sellerId: sellerId } },
        })
        await ctx.prisma.color.deleteMany({
          where: { item: { sellerId: sellerId } },
        })

        await ctx.prisma.item.deleteMany({ where: { sellerId } })
        await ctx.prisma.address.deleteMany({ where: { sellerId } })
        await ctx.prisma.seller.delete({ where: { id: sellerId } })
        return `Success! Seller Account Deleted`
      } catch (error) {
        console.log('Seller -> DeleteSellerAccount ->error', error.message)
        throw new Error(
          `Seller -> DeleteSellerAccount ->error, ${error.message}`,
        )
      }
    },
  })
}
