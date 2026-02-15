import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sendEmail } from "../functions/send-email/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Booking: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string().required(),
      startDate: a.string().required(),
      endDate: a.string().required(),
      numberOfPeople: a.integer().required(),
      status: a.enum(["CREATED", "CANCELLED", "REJECTED", "CONFIRMED"]),
    })
    .authorization((allow) => [allow.guest()]),

  sendEmail: a
    .mutation()
    .arguments({
      to: a.string().required(),
      subject: a.string().required(),
      message: a.string(), // Optional message body
      firstName: a.string().required(),
      lastName: a.string().required(),
      listingTitle: a.string().required(),
      listingDescription: a.string(),
      listingPrice: a.float(),
      startDate: a.string().required(),
      endDate: a.string().required(),
      numberOfPeople: a.integer().required(),
      hostName: a.string(),
      listingUrl: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.guest()])
    .handler(a.handler.function(sendEmail)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
