// import { z } from 'zod';
//
// const Auth0TokenSchema = z.object({
//   sub: z.string(),
//   email: z.string().email(),
//   // Define other expected properties based on your Auth0TokenPayload interface
//   iss: z.string(),
//   aud: z.string(),
//   // ... other properties
// });
//
// // Then validate:
// try {
//   const verified = Auth0TokenSchema.parse(verifiedToken);
//   // verified is now properly typed and validated
// } catch (error) {
//   throw new UnauthorizedException('Invalid token payload structure');
// }