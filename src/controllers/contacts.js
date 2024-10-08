import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { sortFields } from "../db/models/Contact.js";  
import { parseFilterParams } from "../utils/parseFilterParams.js";

export const getAllContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({...req.query, sortFields});
   const filter = parseFilterParams(req.query);
  const { _id: userId } = req.user;

  const data = await contactServices.getAllContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });
        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
}
export const getContactByIdController = async (req, res) => {
        const { _id: userId } = req.user;
        const { contactId } = req.params;
        const data = await contactServices.getContact({_id:contactId, userId});
        
        if (!data) {
            throw createHttpError(404, `Contact with id=${contactId} not found`);
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data,
        });
};
    
export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await contactServices.createContact({ ...req.body, userId });
    res.status(201).json({
        status: 201,
        message: " Contact add successfully",
        data,
    });
}

export const upsertContactController = async(req, res)=> {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const {isNew, data} = await contactServices.updateContact({_id: contactId, userId}, req.body, {upsert: true});

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: "Contact upsert successfully",
    data,
  });
};

export const patchContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const {contactId} = req.params;
    const result = await contactServices.updateContact({_id: contactId,userId }, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
}
export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const {contactId} = req.params;
  const data = await contactServices.deleteContact({_id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.status(204).send();
};
