import express from "express";
import cors from "cors";
import pino from "pino-http";
import { env } from "./utils/env.js";
import * as contactServices from "./services/contacts.js";



export const setupServer = () => {
    const app = express();
    

    const logger = pino({
        transport: {
            target: "pino-pretty"
        }
    });

    app.use(logger);
    app.use(cors());
    app.use(express.json());
    // routes
    app.get("/contacts", async (req, res) => {
        const data = await contactServices.getAllContacts();
        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
    });
    app.get("/contacts/:ContactId", async (req, res) => {
        const { ContactId } = req.params;
        const data = await contactServices.getContactById(ContactId);
        
        if (!data) {
            return res.status(404).json({
                message: `Contact with id=${ContactId} not found`
            });
        }
        res.json({
                status: 200,
                message: `Successfully found contact with id ${ContactId}!`,
                data,
        });
});

    app.use((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });

    app.use((error, req, res, next) => {
        res.status(500).json({
            message: error.message,
        });
        next();
    });
    
    const port = Number(env("PORT", 3001));

    app.listen(port, () => console.log("Server is running on port 3001"));
}