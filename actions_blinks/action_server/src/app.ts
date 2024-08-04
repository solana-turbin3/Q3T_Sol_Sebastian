import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, MEMO_PROGRAM_ID } from '@solana/actions';
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port = 3000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.set(ACTIONS_CORS_HEADERS);
  next();
});

app.get('/actions.json', (req: Request, res: Response) => {
  res.set({
    ...ACTIONS_CORS_HEADERS,
    'Content-Type': 'application/json'
  });
  res.sendFile(path.join(__dirname, '..', 'public', 'actions.json'));
});

app.get("/api/memo", (req: Request, res: Response) => {

  const protocol = req.protocol;
  const host = req.get('host');
  const iconUrl = new URL("/solana_devs.jpg", `${protocol}://${host}`).toString();
  console.log(iconUrl);  console.log(iconUrl);

  const payload: ActionGetResponse = {
    icon: iconUrl,
    label: "Send Memo",
    description: "Testing action!",
    title: "Memo Demo"
  }

  res.set({
    ...ACTIONS_CORS_HEADERS
  });

  return res.json(payload);
});

app.post("/api/memo", async (req: Request, res: Response) => {
  try {

    const body: ActionPostRequest = req.body;

    let account: PublicKey;

    try {
      account = new PublicKey(body.account);
    } catch(error) {
      return res.status(400).set({
        ...ACTIONS_CORS_HEADERS
      })
    }

    const transaction = new Transaction();

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from("this is a simple memo message", "utf8"),
        keys: []
      }),
    );

    transaction.feePayer = account;

    const connection = new Connection(clusterApiUrl("devnet"));

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
       fields: {
        transaction
       },
    });

    res.set({
      ...ACTIONS_CORS_HEADERS
    });

    return res.json(payload);

  } catch(error) {
    console.error(error);
    return res.status(400).json({
      message: "Error ocurred"
    })
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});