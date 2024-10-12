import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { sortFields } from "../db/models/Contact.js";  
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

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
    const {_id: userId} = req.user;
    const photo = req.file;


    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }
    const contact = await contactServices.createContact({
        ...req.body, 
        userId,
        photo: photoUrl,
    });

    
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

   const result = await contactServices.updateContact(contactId, userId,req.body, {
        upsert: true,
        });
    
    if(!result){
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a contact!`,
        data: result.contact,
    });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const {_id: userId} = req.user; 
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }  
    }

    const result = await contactServices.updateContact( contactId, userId, {
        ...req.body,
        photo: photoUrl,
    });

    if(!result){
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.json({
    status:200,
    message: `Successfully upserted a student!`,
    data: result.contact,
    });
};
export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const {contactId} = req.params;
  const data = await contactServices.deleteContact({_id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.status(204).send();
};
